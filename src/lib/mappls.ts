/**
 * MapmyIndia (Mappls) Location Integration
 * Built specifically for hyper-accurate Indian addresses, societies, colonies, and house numbers.
 * Supports both Mappls Static Keys (REST API Keys) and OAuth 2.0 (Client ID + Client Secret).
 */

interface CachedMapplsToken {
  token: string;
  tokenType: string;
  expiresAt: number;
}

let cachedToken: CachedMapplsToken | null = null;

/**
 * Returns either a direct Static API Key or a freshly minted OAuth 2.0 Bearer Token.
 */
export async function getMapplsAccessToken(): Promise<string | null> {
  const auth = await getMapplsKey();
  return auth ? auth.key : null;
}

export async function getMapplsKey(): Promise<{ key: string; isStatic: boolean } | null> {
  // 1. Direct Static Key / REST API Key from Mappls Console
  const staticKey =
    process.env.MAPPLS_STATIC_KEY ||
    process.env.MAPPLS_API_KEY ||
    process.env.MAPPLS_REST_KEY ||
    process.env.NEXT_PUBLIC_MAPPLS_STATIC_KEY ||
    process.env.NEXT_PUBLIC_MAPPLS_API_KEY ||
    "";

  if (staticKey.trim()) {
    return { key: staticKey.trim(), isStatic: true };
  }

  // 2. OAuth 2.0 Client Credentials (Client ID + Client Secret)
  const clientId =
    process.env.MAPPLS_CLIENT_ID ||
    process.env.MAPMYINDIA_CLIENT_ID ||
    process.env.NEXT_PUBLIC_MAPPLS_CLIENT_ID ||
    "";
  const clientSecret =
    process.env.MAPPLS_CLIENT_SECRET ||
    process.env.MAPMYINDIA_CLIENT_SECRET ||
    process.env.NEXT_PUBLIC_MAPPLS_CLIENT_SECRET ||
    "";

  if (!clientId || !clientSecret) {
    return null;
  }

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60000) {
    return { key: cachedToken.token, isStatic: false };
  }

  try {
    const res = await fetch("https://outpost.mappls.com/api/security/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accept: "application/json",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId.trim(),
        client_secret: clientSecret.trim(),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[Mappls OAuth Token Error ${res.status}]:`, errText);
      return null;
    }

    const data = await res.json();
    const token = data.access_token;
    const tokenType = data.token_type || "bearer";
    const expiresIn = Number(data.expires_in) || 86400;

    if (token) {
      cachedToken = {
        token,
        tokenType,
        expiresAt: now + expiresIn * 1000,
      };
      return { key: token, isStatic: false };
    }
  } catch (err) {
    console.warn("[Mappls OAuth Network Exception]:", err);
  }

  return null;
}

export interface MapplsSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  fullText: string;
  types?: string[];
  eLoc?: string;
}

export async function fetchMapplsAutosuggest(
  query: string
): Promise<MapplsSuggestion[]> {
  const auth = await getMapplsKey();
  if (!auth) return [];

  const headers: Record<string, string> = {
    accept: "application/json",
    Origin: "https://thehypeco.in",
    Referer: "https://thehypeco.in/",
  };

  if (!auth.isStatic) {
    headers["Authorization"] = `Bearer ${auth.key}`;
  }

  // 1. Primary endpoint: search.mappls.com/search/places/autosuggest/json
  const searchUrl = `https://search.mappls.com/search/places/autosuggest/json?access_token=${encodeURIComponent(
    auth.key
  )}&query=${encodeURIComponent(query)}&tokenizeAddress=true`;

  try {
    let res = await fetch(searchUrl, { headers });

    // 2. Fallback endpoint if needed
    if (!res.ok) {
      const fallbackUrl = `https://apis.mappls.com/advancedmaps/v1/${encodeURIComponent(
        auth.key
      )}/auto_suggest?query=${encodeURIComponent(query)}`;
      res = await fetch(fallbackUrl, { headers });
    }

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[Mappls Autosuggest Error ${res.status}]:`, errText);
      return [];
    }

    const data = await res.json();
    const list = data.suggestedLocations || [];

    return list.map((loc: any, idx: number) => {
      const eLoc = loc.eLoc || `mmi_${idx}`;
      const mainText = loc.placeName || loc.placeAddress?.split(",")[0]?.trim() || "";
      const secondaryText = loc.placeAddress || "";
      const fullText = loc.placeName
        ? `${loc.placeName}, ${loc.placeAddress || ""}`.trim()
        : loc.placeAddress || mainText;

      // Encode address payload in placeId for zero-latency instant details retrieval
      const payload = Buffer.from(
        JSON.stringify({
          address: loc.placeAddress || "",
          name: loc.placeName || "",
          type: loc.type || "",
        })
      ).toString("base64url");

      return {
        placeId: `mmi_${eLoc}__${payload}`,
        mainText,
        secondaryText,
        fullText,
        types: [loc.type || "place"],
        eLoc,
      };
    });
  } catch (err) {
    console.warn("[Mappls Autosuggest Exception]:", err);
    return [];
  }
}

export function parseIndianAddress(addressText: string, placeName?: string) {
  const parts = addressText.split(",").map((s) => s.trim()).filter(Boolean);

  let pincode = "";
  const pinMatch = addressText.match(/\b([1-9][0-9]{5})\b/);
  if (pinMatch) {
    pincode = pinMatch[1];
  }

  const cleanParts = parts.filter((p) => !/^\d{6}$/.test(p));

  let state = "";
  let city = "";
  let landmarkArea = "";
  let streetAddress = "";

  if (cleanParts.length >= 2) {
    state = cleanParts[cleanParts.length - 1];
    city = cleanParts[cleanParts.length - 2];
    const remaining = cleanParts.slice(0, cleanParts.length - 2);

    if (placeName && placeName !== cleanParts[0] && !cleanParts[0].startsWith(placeName)) {
      streetAddress = `${placeName}, ${remaining[0] || ""}`.replace(/,\s*$/, "").trim();
      landmarkArea = remaining.slice(1).join(", ");
    } else {
      streetAddress = remaining[0] || placeName || "";
      landmarkArea = remaining.slice(1).join(", ");
    }
  } else if (cleanParts.length === 1) {
    city = cleanParts[0];
    streetAddress = placeName || cleanParts[0];
  } else {
    streetAddress = placeName || addressText;
  }

  return {
    streetAddress: streetAddress || placeName || "Main Road",
    landmarkArea,
    city,
    state,
    pincode,
  };
}

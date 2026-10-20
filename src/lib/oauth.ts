import { cookies } from "next/headers";

export interface OAuthStatePayload {
  state: string;
  provider: "google" | "apple" | "github";
  redirect: string;
  createdAt: number;
}

const OAUTH_STATE_COOKIE = "hypeco_oauth_state";

/**
 * Generate a random state token and store it in an HTTP-only cookie.
 */
export async function createOAuthState(
  provider: "google" | "apple" | "github",
  redirectUrl: string = "/account"
): Promise<string> {
  const state = crypto.randomUUID();
  const payload: OAuthStatePayload = {
    state,
    provider,
    redirect: redirectUrl.startsWith("/") ? redirectUrl : "/account",
    createdAt: Date.now(),
  };

  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE, JSON.stringify(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });

  return state;
}

/**
 * Read and verify the stored OAuth state from the cookie.
 */
export async function verifyOAuthState(returnedState: string): Promise<OAuthStatePayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(OAUTH_STATE_COOKIE);
  if (!cookie?.value) return null;

  try {
    const payload = JSON.parse(cookie.value) as OAuthStatePayload;
    // Check if expired (over 10 minutes)
    if (Date.now() - payload.createdAt > 10 * 60 * 1000) {
      return null;
    }
    if (payload.state !== returnedState) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Clear the OAuth state cookie.
 */
export async function clearOAuthState() {
  const cookieStore = await cookies();
  cookieStore.delete(OAUTH_STATE_COOKIE);
}

/**
 * Build the base URL / origin from request headers.
 */
export function getAppBaseUrl(req: Request): string {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Exchange Google authorization code for user profile info.
 */
export async function exchangeGoogleCode(
  code: string,
  redirectUri: string
): Promise<{ email: string; name: string; picture?: string; id: string } | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not configured");
  }

  // 1. Exchange authorization code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const errorText = await tokenRes.text();
    console.error("[Google Token Exchange Error]:", errorText);
    return null;
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  if (!accessToken) return null;

  // 2. Fetch user profile from Google UserInfo endpoint
  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userRes.ok) {
    console.error("[Google UserInfo Error]:", await userRes.text());
    return null;
  }

  const userData = await userRes.json();
  if (!userData.email) return null;

  return {
    id: userData.sub,
    email: userData.email,
    name: userData.name || userData.email.split("@")[0],
    picture: userData.picture,
  };
}

/**
 * Exchange GitHub authorization code for user profile info.
 */
export async function exchangeGithubCode(
  code: string,
  redirectUri: string
): Promise<{ email: string; name: string; picture?: string; id: string } | null> {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET not configured");
  }

  // 1. Exchange code for access token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    return null;
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  if (!accessToken) return null;

  // 2. Fetch user profile
  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "TheHypeCo-Streetwear-App",
    },
  });

  if (!userRes.ok) return null;
  const userData = await userRes.json();

  let email = userData.email;
  // If email is private in GitHub profile, fetch user/emails
  if (!email) {
    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "TheHypeCo-Streetwear-App",
      },
    });
    if (emailsRes.ok) {
      const emails = await emailsRes.json();
      if (Array.isArray(emails)) {
        const primary = emails.find((e: any) => e.primary && e.verified) || emails[0];
        if (primary) email = primary.email;
      }
    }
  }

  if (!email) {
    email = `${userData.login}@users.noreply.github.com`;
  }

  return {
    id: String(userData.id),
    email,
    name: userData.name || userData.login || email.split("@")[0],
    picture: userData.avatar_url,
  };
}

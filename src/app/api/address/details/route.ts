import { NextResponse } from "next/server";
import { getMapplsKey, parseIndianAddress } from "@/lib/mappls";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get("placeId");

    if (!placeId) {
      return NextResponse.json(
        { error: "placeId parameter is required" },
        { status: 400 }
      );
    }

    // 1. Decode instant zero-latency address payload from MapmyIndia placeId
    if (placeId.startsWith("mmi_")) {
      const parts = placeId.replace("mmi_", "").split("__");
      const eLoc = parts[0];
      const encodedPayload = parts[1];

      if (encodedPayload) {
        try {
          const decoded = JSON.parse(
            Buffer.from(encodedPayload, "base64url").toString("utf-8")
          );
          const fullAddress = decoded.address || "";
          const placeName = decoded.name || "";
          const parsed = parseIndianAddress(fullAddress, placeName);

          return NextResponse.json({
            placeId,
            displayName: placeName || parsed.streetAddress,
            formattedAddress: fullAddress,
            streetAddress: parsed.streetAddress,
            landmarkArea: parsed.landmarkArea,
            city: parsed.city,
            state: parsed.state,
            pincode: parsed.pincode,
            coordinates: null,
          });
        } catch (payloadErr) {
          console.warn("[Mappls Payload Decode Warning]:", payloadErr);
        }
      }

      // 2. Fallback to Mappls eLoc API if no embedded payload
      const auth = await getMapplsKey();
      if (auth && eLoc && !eLoc.startsWith("mmi_")) {
        try {
          const mmiUrl = `https://explore.mappls.com/apis/O2O/entity/${encodeURIComponent(
            eLoc
          )}`;
          const headers: Record<string, string> = {
            accept: "application/json",
            Origin: "https://thehypeco.in",
            Referer: "https://thehypeco.in/",
          };
          if (!auth.isStatic) {
            headers["Authorization"] = `Bearer ${auth.key}`;
          }

          const res = await fetch(
            auth.isStatic
              ? `${mmiUrl}?access_token=${encodeURIComponent(auth.key)}`
              : mmiUrl,
            { headers }
          );

          if (res.ok) {
            const data = await res.json();
            const place = data.data || data;
            const fullAddress =
              place.address || place.formatted_address || place.placeAddress || "";
            const parsed = parseIndianAddress(fullAddress, place.placeName || place.name);

            return NextResponse.json({
              placeId,
              displayName: place.placeName || place.name || parsed.streetAddress,
              formattedAddress: fullAddress,
              streetAddress: parsed.streetAddress,
              landmarkArea: parsed.landmarkArea,
              city: place.city || parsed.city,
              state: place.state || parsed.state,
              pincode: place.pincode || parsed.pincode,
              coordinates:
                place.latitude && place.longitude
                  ? {
                      lat: parseFloat(place.latitude),
                      lng: parseFloat(place.longitude),
                    }
                  : null,
            });
          }
        } catch (mmiErr) {
          console.warn("[Mappls Entity Details Warning]:", mmiErr);
        }
      }
    }

    // Default Fallback response
    return NextResponse.json({
      placeId,
      displayName: placeId,
      formattedAddress: "",
      streetAddress: "",
      landmarkArea: "",
      city: "",
      state: "",
      pincode: "",
      coordinates: null,
    });
  } catch (error: any) {
    console.error("[Place Details API Route Error]:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

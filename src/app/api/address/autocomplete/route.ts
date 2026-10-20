import { NextResponse } from "next/server";
import { fetchMapplsAutosuggest } from "@/lib/mappls";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || searchParams.get("input") || "";

    if (!query.trim()) {
      return NextResponse.json({ suggestions: [] });
    }

    // MapmyIndia (Mappls) Autosuggest API
    const suggestions = await fetchMapplsAutosuggest(query.trim());

    return NextResponse.json({
      provider: "mapmyindia",
      suggestions,
    });
  } catch (error: any) {
    console.error("[MapmyIndia Autocomplete Error]:", error);
    return NextResponse.json(
      { error: error.message || "Autocomplete failed", suggestions: [] },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { clearCustomerSession } from "@/lib/session";

export async function POST() {
  try {
    await clearCustomerSession();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Logout Route Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to logout" },
      { status: 500 }
    );
  }
}

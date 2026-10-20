import { NextResponse } from "next/server";
import { generateAndStoreOtp } from "@/lib/otp-store";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const code = generateAndStoreOtp(normalizedEmail);

    console.log(`[THE HYPE CO. AUTH] Generated OTP for ${normalizedEmail}: ${code}`);

    // Attempt real email dispatch via Resend or SMTP
    const emailResult = await sendOtpEmail(normalizedEmail, code);

    return NextResponse.json({
      success: true,
      delivered: emailResult.delivered,
      provider: emailResult.provider,
      // If email was not delivered or in dev mode, provide the code so user is never stuck
      devOtp: !emailResult.delivered || process.env.NODE_ENV !== "production" ? code : undefined,
      message: emailResult.delivered
        ? `Verification code dispatched to ${normalizedEmail}`
        : `Email provider not configured or delivery unavailable. Use passcode below.`,
      dispatchError: emailResult.error,
    });
  } catch (error: any) {
    console.error("[Send OTP Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate or dispatch OTP" },
      { status: 500 }
    );
  }
}

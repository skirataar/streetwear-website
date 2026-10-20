import nodemailer from "nodemailer";

interface SendOtpResult {
  success: boolean;
  delivered: boolean;
  provider?: "resend" | "smtp" | "dev_mode";
  error?: string;
}

/**
 * Generate luxury streetwear branded HTML email for OTP passcode
 */
function generateOtpHtml(email: string, code: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your One-Time Passcode - THE HYPE CO.</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0b0b; font-family: 'Courier New', Courier, monospace, -apple-system, sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0b0b; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #121212; border: 3px solid #c5fe02; border-collapse: collapse; box-shadow: 8px 8px 0px #c5fe02;">
          
          <!-- Header Bar -->
          <tr>
            <td style="background-color: #c5fe02; padding: 18px 24px; border-bottom: 3px solid #000000;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left">
                    <span style="color: #000000; font-weight: 900; font-size: 20px; letter-spacing: 2px; text-transform: uppercase;">THE HYPE CO.</span>
                  </td>
                  <td align="right">
                    <span style="color: #000000; font-weight: 700; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">AUTH PROTOCOL</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 36px 28px; text-align: left;">
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #c5fe02; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                // ONE-TIME PASSCODE DISPATCH
              </p>
              <h1 style="margin: 0 0 20px 0; font-size: 26px; color: #ffffff; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px;">
                VERIFICATION PASSCODE
              </h1>
              
              <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 1.6; color: #cccccc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                You requested account verification for <strong style="color: #ffffff;">${email}</strong>. Use the 6-digit one-time passcode below to authenticate:
              </p>

              <!-- Passcode Display Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center" style="background-color: #000000; border: 2px dashed #c5fe02; padding: 24px 16px;">
                    <span style="font-size: 38px; font-weight: 900; letter-spacing: 12px; color: #c5fe02; font-family: 'Courier New', Courier, monospace; display: inline-block;">
                      ${code}
                    </span>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0 0; font-size: 11px; color: #888888; line-height: 1.5;">
                ⏳ <strong>EXPIRATION:</strong> This passcode is valid for <strong>10 minutes</strong>. Do NOT disclose this code to anyone.<br/>
                🔒 If you did not initiate this sign-in request, please ignore this transmission.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #080808; padding: 20px 28px; border-top: 1px solid #222222; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 10px; color: #666666; letter-spacing: 1.5px; text-transform: uppercase;">
                THE HYPE CO. ARCHIVE // RUNWAY &amp; APPAREL
              </p>
              <p style="margin: 0; font-size: 10px; color: #444444;">
                Hostinger WooCommerce Sync • All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send OTP using Resend API (HTTP POST)
 */
async function sendViaResend(apiKey: string, email: string, code: string): Promise<SendOtpResult> {
  const fromAddress = process.env.EMAIL_FROM || process.env.RESEND_FROM || "The Hype Co. <onboarding@resend.dev>";
  
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [email],
        subject: `Your Passcode: ${code} - THE HYPE CO.`,
        html: generateOtpHtml(email, code),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[Resend API Error]:", data);
      return {
        success: false,
        delivered: false,
        provider: "resend",
        error: data.message || "Failed to deliver email via Resend",
      };
    }

    console.log(`[Resend Success] Sent OTP email to ${email}, id:`, data.id);
    return { success: true, delivered: true, provider: "resend" };
  } catch (err: any) {
    console.error("[Resend Fetch Error]:", err);
    return {
      success: false,
      delivered: false,
      provider: "resend",
      error: err.message || "Network error connecting to Resend",
    };
  }
}

/**
 * Send OTP using SMTP (Hostinger, Gmail, Zoho, AWS SES, etc.) via Nodemailer
 */
async function sendViaSmtp(email: string, code: string): Promise<SendOtpResult> {
  const host = process.env.SMTP_HOST || "smtp.hostinger.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || user || "no-reply@thehypeco.in";

  if (!user || !pass) {
    return {
      success: false,
      delivered: false,
      provider: "smtp",
      error: "SMTP credentials (SMTP_USER, SMTP_PASS) are incomplete",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 10000,
    });

    const cleanFrom = from.includes("<") && from.includes(">") ? from : `The Hype Co. <${from}>`;

    await transporter.sendMail({
      from: cleanFrom,
      to: email,
      subject: `Your Passcode: ${code} - THE HYPE CO.`,
      html: generateOtpHtml(email, code),
      text: `Your THE HYPE CO. verification passcode is: ${code}. Valid for 10 minutes.`,
    });

    console.log(`[SMTP Success] Sent OTP email to ${email} via ${host}`);
    return { success: true, delivered: true, provider: "smtp" };
  } catch (err: any) {
    console.error("[SMTP Send Error]:", err);
    return {
      success: false,
      delivered: false,
      provider: "smtp",
      error: err.message || "Failed to dispatch email via SMTP",
    };
  }
}

/**
 * Main dispatcher to send OTP email
 */
export async function sendOtpEmail(email: string, code: string): Promise<SendOtpResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpUser = process.env.SMTP_USER;
  let lastError = "";

  // 1. Try Resend if configured
  if (resendApiKey) {
    const result = await sendViaResend(resendApiKey, email, code);
    if (result.delivered) return result;
    lastError = result.error || "Resend dispatch failed";
    console.warn("[Email Dispatch] Resend delivery failed, checking SMTP fallback...");
  }

  // 2. Try SMTP if configured
  if (smtpUser && process.env.SMTP_PASS) {
    const result = await sendViaSmtp(email, code);
    if (result.delivered) return result;
    lastError = result.error || "Hostinger SMTP authentication failed";
    console.warn("[Email Dispatch] SMTP delivery failed:", lastError);
    return {
      success: true,
      delivered: false,
      provider: "smtp",
      error: lastError,
    };
  }

  // 3. If neither provider is configured, or both failed:
  console.log(`[THE HYPE CO. AUTH] No active email delivery keys found (RESEND_API_KEY / SMTP_*). Dev OTP: ${code}`);
  return {
    success: true,
    delivered: false,
    provider: "dev_mode",
    error: lastError || "No email service configured (requires RESEND_API_KEY or valid SMTP credentials in .env.local)",
  };
}

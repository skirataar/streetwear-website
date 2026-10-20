import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "hypeco_customer_session";
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.WOOCOMMERCE_CONSUMER_SECRET ||
  "thehypeco_secret_session_key_2026_ind";

export interface SessionData {
  customerId: number;
  email: string;
  name: string;
  phone: string;
  createdAt: number;
}

/**
 * Sign session data with HMAC-SHA256
 */
async function sign(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const b64 = Buffer.from(signature).toString("base64url");
  return `${Buffer.from(data).toString("base64url")}.${b64}`;
}

/**
 * Verify and decode session data
 */
async function verify(token: string, secret: string): Promise<string | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [dataB64, sigB64] = parts;

  try {
    const enc = new TextEncoder();
    const data = Buffer.from(dataB64, "base64url").toString();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sig = Buffer.from(sigB64, "base64url");
    const valid = await crypto.subtle.verify("HMAC", key, sig, enc.encode(data));
    return valid ? data : null;
  } catch {
    return null;
  }
}

/**
 * Create and set customer session cookie
 */
export async function setCustomerSession(sessionData: Omit<SessionData, "createdAt">) {
  const payload: SessionData = {
    ...sessionData,
    createdAt: Date.now(),
  };

  const token = await sign(JSON.stringify(payload), SESSION_SECRET);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

/**
 * Get customer session from cookie
 */
export async function getCustomerSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!cookie?.value) return null;

  const raw = await verify(cookie.value, SESSION_SECRET);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

/**
 * Clear customer session cookie
 */
export async function clearCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

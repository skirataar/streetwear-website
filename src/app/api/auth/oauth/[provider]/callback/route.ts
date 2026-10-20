import { NextResponse } from "next/server";
import {
  verifyOAuthState,
  clearOAuthState,
  getAppBaseUrl,
  exchangeGoogleCode,
  exchangeGithubCode,
} from "@/lib/oauth";
import {
  findCustomerByEmail,
  createWooCustomer,
} from "@/lib/woocommerce-customer";
import { setCustomerSession } from "@/lib/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params;
    const { searchParams } = new URL(req.url);

    const errorParam = searchParams.get("error");
    if (errorParam) {
      const errorDesc = searchParams.get("error_description") || errorParam;
      console.error(`[OAuth Callback Error from ${provider}]:`, errorDesc);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(errorDesc)}`, req.url)
      );
    }

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/login?error=missing_oauth_code_or_state", req.url)
      );
    }

    // Verify CSRF state token
    const statePayload = await verifyOAuthState(state);
    if (!statePayload || statePayload.provider !== provider) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_oauth_state", req.url)
      );
    }

    const callbackUrl = `${getAppBaseUrl(req)}/api/auth/oauth/${provider}/callback`;
    let userInfo: { email: string; name: string; picture?: string; id: string } | null = null;

    if (provider === "google") {
      userInfo = await exchangeGoogleCode(code, callbackUrl);
    } else if (provider === "github") {
      userInfo = await exchangeGithubCode(code, callbackUrl);
    }

    if (!userInfo || !userInfo.email) {
      return NextResponse.redirect(
        new URL(`/login?error=oauth_profile_fetch_failed`, req.url)
      );
    }

    const email = userInfo.email.trim().toLowerCase();
    const name = userInfo.name || email.split("@")[0];

    // Find or create customer in WooCommerce backend
    let customer = await findCustomerByEmail(email);

    if (!customer) {
      customer = await createWooCustomer({
        email,
        name,
      });
    }

    if (!customer) {
      // Virtual customer fallback profile if WooCommerce is offline
      customer = {
        id: Math.floor(Date.now() / 1000),
        email,
        name,
        phone: "",
        username: email.split("@")[0],
        billing: {
          first_name: name,
          last_name: "",
          company: "",
          address_1: "",
          address_2: "",
          city: "",
          state: "",
          postcode: "",
          country: "IN",
          email,
          phone: "",
        },
        shipping: {
          first_name: name,
          last_name: "",
          company: "",
          address_1: "",
          address_2: "",
          city: "",
          state: "",
          postcode: "",
          country: "IN",
          phone: "",
        },
      };
    }

    // Set signed HTTP-only customer session cookie
    await setCustomerSession({
      customerId: customer.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
    });

    await clearOAuthState();

    const redirectTarget = statePayload.redirect.startsWith("/")
      ? statePayload.redirect
      : "/account";

    return NextResponse.redirect(new URL(redirectTarget, req.url));
  } catch (err: any) {
    console.error("[OAuth Callback Exception]:", err);
    return NextResponse.redirect(
      new URL("/login?error=oauth_processing_error", req.url)
    );
  }
}

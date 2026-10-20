import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { findCustomerByEmail, createWooCustomer } from "@/lib/woocommerce-customer";
import { setCustomerSession } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") || "/account";

    if (code) {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.user?.email) {
        const email = data.user.email.toLowerCase().trim();
        const name =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          email.split("@")[0];

        let customer = await findCustomerByEmail(email);
        if (!customer) {
          customer = await createWooCustomer({ email, name });
        }

        const customerId = customer?.id || Math.floor(Date.now() / 1000);
        await setCustomerSession({
          customerId,
          email,
          name: customer?.name || name,
          phone: customer?.phone || "",
        });

        const redirectUrl = next.startsWith("/") ? next : "/account";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
    }

    return NextResponse.redirect(new URL("/login?error=supabase_auth_failed", req.url));
  } catch (err: any) {
    console.error("[Supabase Auth Callback Error]:", err);
    return NextResponse.redirect(new URL("/login?error=auth_callback_error", req.url));
  }
}

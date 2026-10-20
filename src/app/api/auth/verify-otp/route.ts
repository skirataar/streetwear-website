import { NextResponse } from "next/server";
import { verifyOtpCode } from "@/lib/otp-store";
import {
  findCustomerByEmail,
  createWooCustomer,
} from "@/lib/woocommerce-customer";
import { setCustomerSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { email, code, name } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and OTP code are required" },
        { status: 400 }
      );
    }

    const isValid = verifyOtpCode(email, code);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired verification code. Use '1998' or '2026' for testing." },
        { status: 400 }
      );
    }

    // Check if customer exists in WooCommerce
    let customer = await findCustomerByEmail(email);

    // If not, auto-create customer in WooCommerce
    if (!customer) {
      customer = await createWooCustomer({
        email,
        name: name || email.split("@")[0],
      });
    }

    if (!customer) {
      // Fallback virtual customer profile if WooCommerce creation fails
      customer = {
        id: Math.floor(Date.now() / 1000),
        email: email.toLowerCase(),
        name: name || email.split("@")[0],
        phone: "",
        username: email.split("@")[0],
        billing: {
          first_name: name || "",
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
          first_name: name || "",
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

    // Set signed HTTP-only session cookie
    await setCustomerSession({
      customerId: customer.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
    });

    return NextResponse.json({
      success: true,
      customer,
    });
  } catch (error: any) {
    console.error("[Verify OTP Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}

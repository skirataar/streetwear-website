import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/session";
import {
  getCustomerById,
  findCustomerByEmail,
} from "@/lib/woocommerce-customer";

export async function GET() {
  try {
    const session = await getCustomerSession();

    if (!session) {
      return NextResponse.json({ authenticated: false, customer: null });
    }

    // Fetch latest customer details from WooCommerce
    let customer = await getCustomerById(session.customerId);
    if (!customer) {
      customer = await findCustomerByEmail(session.email);
    }

    if (!customer) {
      // Fallback to session details
      customer = {
        id: session.customerId,
        email: session.email,
        name: session.name,
        phone: session.phone,
        username: session.email.split("@")[0],
        billing: {
          first_name: session.name || "",
          last_name: "",
          company: "",
          address_1: "",
          address_2: "",
          city: "",
          state: "",
          postcode: "",
          country: "IN",
          email: session.email,
          phone: session.phone || "",
        },
        shipping: {
          first_name: session.name || "",
          last_name: "",
          company: "",
          address_1: "",
          address_2: "",
          city: "",
          state: "",
          postcode: "",
          country: "IN",
          phone: session.phone || "",
        },
      };
    }

    return NextResponse.json({
      authenticated: true,
      customer,
    });
  } catch (error: any) {
    console.error("[Auth ME Route Error]:", error);
    return NextResponse.json(
      { authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}

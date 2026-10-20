import { NextResponse } from "next/server";
import { getCustomerSession, setCustomerSession } from "@/lib/session";
import { updateWooCustomer } from "@/lib/woocommerce-customer";

export async function POST(req: Request) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, billing, shipping } = body;

    const updated = await updateWooCustomer(session.customerId, {
      name,
      phone,
      billing,
      shipping,
    });

    if (updated) {
      // Update session cookie with updated name/phone
      await setCustomerSession({
        customerId: session.customerId,
        email: session.email,
        name: updated.name || session.name,
        phone: updated.phone || session.phone,
      });

      return NextResponse.json({ success: true, customer: updated });
    }

    return NextResponse.json(
      { error: "Failed to update profile in WooCommerce" },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("[Update Profile Route Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}

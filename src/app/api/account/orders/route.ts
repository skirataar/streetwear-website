import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/session";
import { getCustomerOrders } from "@/lib/woocommerce-customer";

export async function GET() {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await getCustomerOrders(session.email, session.customerId);

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("[Account Orders Route Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

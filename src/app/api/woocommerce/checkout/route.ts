import { NextResponse } from "next/server";
import { isWooCommerceConfigured } from "@/lib/woocommerce";

export async function POST(req: Request) {
  try {
    if (!isWooCommerceConfigured()) {
      return NextResponse.json(
        { message: "WooCommerce API is not configured on server" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { items, customer } = body;

    const WORDPRESS_URL = (process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WOOCOMMERCE_URL || "").replace(/\/$/, "");
    const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
    const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

    const lineItems = (items || []).map((item: any) => ({
      product_id: parseInt(item.productId, 10) || 0,
      quantity: item.quantity || 1,
    }));

    const orderData = {
      set_paid: false,
      billing: {
        first_name: customer?.fullName || customer?.name || "Customer",
        email: customer?.email || "customer@example.com",
        phone: customer?.phone || "",
        address_1: customer?.addressLine1 || customer?.address || "",
        address_2: customer?.addressLine2 || "",
        city: customer?.city || "",
        state: customer?.state || "",
        postcode: customer?.pincode || "",
      },
      shipping: {
        first_name: customer?.fullName || customer?.name || "Customer",
        address_1: customer?.addressLine1 || customer?.address || "",
        address_2: customer?.addressLine2 || "",
        city: customer?.city || "",
        state: customer?.state || "",
        postcode: customer?.pincode || "",
      },
      line_items: lineItems,
    };

    const url = new URL(`${WORDPRESS_URL}/wp-json/wc/v3/orders`);
    url.searchParams.set("consumer_key", CONSUMER_KEY);
    url.searchParams.set("consumer_secret", CONSUMER_SECRET);

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[WooCommerce API] Order Creation Error:", err);
      return NextResponse.json({ success: false, error: err }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      wooOrderId: data.id,
      checkoutUrl: data.payment_url || `${WORDPRESS_URL}/checkout/order-pay/${data.id}/?pay_for_order=true&key=${data.order_key}`,
    });
  } catch (error: any) {
    console.error("[WooCommerce Order Route Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

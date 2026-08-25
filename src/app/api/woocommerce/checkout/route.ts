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
    const { items, customer, razorpayPaymentId, razorpayOrderId } = body;

    const WORDPRESS_URL = (process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WOOCOMMERCE_URL || "").replace(/\/$/, "");
    const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
    const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

    const lineItems = (items || []).map((item: any) => ({
      product_id: parseInt(item.productId, 10) || 0,
      quantity: item.quantity || 1,
    }));

    const orderData = {
      payment_method: "razorpay",
      payment_method_title: "Razorpay",
      set_paid: true,
      transaction_id: razorpayPaymentId || "",
      billing: {
        first_name: customer?.name || "Customer",
        email: customer?.email || "customer@example.com",
        phone: customer?.phone || "",
      },
      shipping: {
        first_name: customer?.name || "Customer",
        address_1: customer?.address || "",
        city: customer?.city || "",
        state: customer?.state || "",
        postcode: customer?.pincode || "",
      },
      line_items: lineItems,
      meta_data: [
        {
          key: "razorpay_order_id",
          value: razorpayOrderId || "",
        },
      ],
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
      console.error("[WooCommerce API] Order Sync Error:", err);
      return NextResponse.json({ success: false, error: err }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, wooOrderId: data.id });
  } catch (error: any) {
    console.error("[WooCommerce Sync Route Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature header" }, { status: 400 });
    }

    const isMock =
      !process.env.RAZORPAY_WEBHOOK_SECRET ||
      process.env.RAZORPAY_WEBHOOK_SECRET.includes("mock");

    if (!isMock) {
      const isValid = verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === "payment.captured" || event === "order.paid") {
      const payment = payload.payload.payment?.entity;
      const rzpOrderId = payment?.order_id || payload.payload.order?.entity?.id;
      const paymentId = payment?.id;

      if (rzpOrderId) {
        try {
          const { prisma } = await import("@/lib/prisma");
          const order = await prisma.order.findUnique({
            where: { razorpayOrderId: rzpOrderId },
            include: { items: true },
          });

          if (order && order.status !== "PAID") {
            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: "PAID",
                razorpayPaymentId: paymentId || order.razorpayPaymentId,
              },
            });

            // Decrement variant stock
            for (const item of order.items) {
              await prisma.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { decrement: item.quantity } },
              }).catch((e) => console.warn("Stock decrement error:", e));
            }
          }
        } catch (dbErr) {
          console.warn("Database update bypassed in webhook:", dbErr);
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook processing failure:", error);
    return NextResponse.json({ error: "Webhook handling error" }, { status: 500 });
  }
}

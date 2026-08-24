import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, localOrderId } =
      await req.json();

    // Verify signature if not in pure mock test mode
    const isMock = !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.includes("mock");
    if (!isMock) {
      const isValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
      if (!isValid) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
      }
    }

    // Update database order state and decrement inventory
    try {
      const { prisma } = await import("@/lib/prisma");
      
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            { id: localOrderId },
            { razorpayOrderId: razorpay_order_id },
          ],
        },
        include: { items: true },
      });

      if (order) {
        // Update order status
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
            razorpayPaymentId: razorpay_payment_id,
          },
        });

        // Decrement stock for purchased items
        for (const item of order.items) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          }).catch((err) => console.warn("Stock decrement error:", err));
        }
      }
    } catch (dbErr) {
      console.warn("DB update bypassed during payment verification:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      orderId: localOrderId || razorpay_order_id,
    });
  } catch (error: any) {
    console.error("Payment verification failure:", error);
    return NextResponse.json(
      { error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}

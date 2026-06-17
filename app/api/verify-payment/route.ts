import { NextResponse } from "next/server";
import { confirmPaidBooking, markPaymentFailed } from "@/lib/firestore";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  let bookingId = "";

  try {
    const body = await request.json();
    bookingId = String(body.bookingId ?? "");
    const orderId = String(body.razorpay_order_id ?? "");
    const paymentId = String(body.razorpay_payment_id ?? "");
    const signature = String(body.razorpay_signature ?? "");

    if (!bookingId || !orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing payment verification details." }, { status: 400 });
    }

    const verified = verifyRazorpaySignature({ orderId, paymentId, signature });

    if (!verified) {
      await markPaymentFailed(bookingId);
      return NextResponse.json({ error: "Payment signature verification failed." }, { status: 400 });
    }

    const booking = await confirmPaidBooking({ bookingId, orderId, paymentId });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error(error);

    if (bookingId) {
      await markPaymentFailed(bookingId).catch(() => undefined);
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to verify payment." },
      { status: 500 },
    );
  }
}

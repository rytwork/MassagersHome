import { NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import {
  createPendingBooking,
  getCompletedFreeSessionCount,
  hasUnratedCompletedBooking,
} from "@/lib/firestore";
import { createRazorpayOrder } from "@/lib/razorpay";
import { getService } from "@/lib/services";
import { validateBookingPayload } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await requireAuthUser(request);
    const body = await request.json();
    const result = validateBookingPayload(body);

    if (!result.valid) {
      return NextResponse.json({ error: "Invalid booking details.", errors: result.errors }, { status: 400 });
    }

    if (await hasUnratedCompletedBooking(user.uid)) {
      return NextResponse.json(
        { error: "Please rate your completed massage before booking the next service." },
        { status: 409 },
      );
    }

    const service = getService(result.data.serviceId);
    if (!service) {
      return NextResponse.json({ error: "Invalid service." }, { status: 400 });
    }

    const completedFreeSessions = await getCompletedFreeSessionCount(user.uid);
    const payableAmount = completedFreeSessions < 2 ? service.visitFee : service.price;
    const receipt = `mh_${Date.now()}`;
    const order = await createRazorpayOrder({ amount: payableAmount, receipt });
    const booking = await createPendingBooking(result.data, order.id, user, payableAmount);

    return NextResponse.json({
      bookingId: booking.id,
      orderId: order.id,
      amount: order.amount,
      payableAmount,
      freeSessionNumber: booking.freeSessionNumber,
      currency: order.currency,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unable to create payment order.";
    const status = message === "Sign in is required." ? 401 : 500;

    return NextResponse.json(
      { error: message },
      { status },
    );
  }
}

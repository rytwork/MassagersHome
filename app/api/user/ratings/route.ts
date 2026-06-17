import { NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { submitBookingRating } from "@/lib/firestore";

export async function POST(request: Request) {
  try {
    const user = await requireAuthUser(request);
    const body = (await request.json()) as {
      bookingId?: string;
      rating?: number;
      review?: string;
    };

    if (!body.bookingId) {
      return NextResponse.json({ error: "Booking is required." }, { status: 400 });
    }

    await submitBookingRating({
      bookingId: body.bookingId,
      user,
      rating: Number(body.rating),
      review: body.review ?? "",
    });

    return NextResponse.json({ message: "Thanks for your rating." });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unable to submit rating.";
    const status = message === "Sign in is required." ? 401 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}

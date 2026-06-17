import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/auth";
import { listBookings, updateBookingStatus } from "@/lib/firestore";
import type { BookingStatus } from "@/lib/types";

const statuses: BookingStatus[] = ["pending", "confirmed", "completed", "failed"];

export async function GET(request: Request) {
  try {
    await requireAdminUser(request);
    const bookings = await listBookings();
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unable to load bookings.";
    const status = message.includes("required") ? 401 : 500;

    return NextResponse.json(
      { error: message },
      { status },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdminUser(request);
    const body = await request.json();
    const bookingId = String(body.bookingId ?? "");
    const status = String(body.status ?? "") as BookingStatus;

    if (!bookingId || !statuses.includes(status)) {
      return NextResponse.json({ error: "Invalid booking status update." }, { status: 400 });
    }

    await updateBookingStatus(bookingId, status);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unable to update booking.";
    const status = message.includes("required") ? 401 : 500;

    return NextResponse.json(
      { error: message },
      { status },
    );
  }
}

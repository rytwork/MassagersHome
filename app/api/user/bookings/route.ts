import { NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { listUserBookings } from "@/lib/firestore";

export async function GET(request: Request) {
  try {
    const user = await requireAuthUser(request);
    const bookings = await listUserBookings(user.uid);

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load your bookings." },
      { status: 401 },
    );
  }
}

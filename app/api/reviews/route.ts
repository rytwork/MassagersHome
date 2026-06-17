import { NextResponse } from "next/server";
import { listPublicRatings } from "@/lib/firestore";

export async function GET() {
  try {
    const ratings = await listPublicRatings();
    return NextResponse.json({ ratings });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ratings: [] });
  }
}

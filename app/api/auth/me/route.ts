import { NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await requireAuthUser(request);
    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load user." },
      { status: 401 },
    );
  }
}

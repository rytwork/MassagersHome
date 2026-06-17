import { NextResponse } from "next/server";
import { sendLoginOtp } from "@/lib/msg91";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = await sendLoginOtp(body.email ?? "");

    return NextResponse.json({ email, message: "OTP sent." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to send OTP." },
      { status: 400 },
    );
  }
}

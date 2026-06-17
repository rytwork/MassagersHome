import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getAdminAuth } from "@/lib/firebase-admin";
import { verifyLoginOtp } from "@/lib/msg91";

function isAdminEmail(email: string) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email);
}

async function ensureEmailUser(email: string) {
  const auth = getAdminAuth();

  try {
    const user = await auth.getUserByEmail(email);
    if (!user.emailVerified) {
      await auth.updateUser(user.uid, { emailVerified: true });
    }
    return user.uid;
  } catch {
    const uid = `email_${createHash("sha256").update(email).digest("hex")}`;
    await auth.createUser({ uid, email, emailVerified: true });
    return uid;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; otp?: string };
    const email = await verifyLoginOtp(body.email ?? "", body.otp ?? "");
    const uid = await ensureEmailUser(email);
    const token = await getAdminAuth().createCustomToken(uid, {
      admin: isAdminEmail(email),
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to verify OTP." },
      { status: 400 },
    );
  }
}

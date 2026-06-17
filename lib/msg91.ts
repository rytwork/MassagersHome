import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "./firebase-admin";

type Msg91Response = {
  type?: string;
  message?: string;
  request_id?: string;
};

const otpTtlMs = 10 * 60 * 1000;
const maxOtpAttempts = 5;

function getMsg91Config() {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_EMAIL_TEMPLATE_ID;
  const fromEmail = process.env.MSG91_EMAIL_FROM;
  const fromName = process.env.MSG91_EMAIL_FROM_NAME ?? "MassagersHome";
  const domain = process.env.MSG91_EMAIL_DOMAIN;

  if (!authKey || !templateId) {
    throw new Error("MSG91 email OTP environment variables are not configured.");
  }

  return { authKey, templateId, fromEmail, fromName, domain };
}

export function normalizeLoginEmail(input: string) {
  const email = input.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }

  return email;
}

async function parseMsg91Response(response: Response) {
  const data = (await response.json().catch(() => ({}))) as Msg91Response;

  if (!response.ok || data.type === "error") {
    throw new Error(data.message ?? "MSG91 email request failed.");
  }

  return data;
}

function getOtpDocId(email: string) {
  return createHash("sha256").update(email).digest("hex");
}

function hashOtp(email: string, otp: string) {
  const secret = process.env.OTP_HASH_SECRET ?? process.env.MSG91_AUTH_KEY ?? "";
  return createHash("sha256").update(`${email}:${otp}:${secret}`).digest("hex");
}

function isSameHash(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

async function storeEmailOtp(email: string, otp: string) {
  await getAdminDb()
    .collection("emailOtps")
    .doc(getOtpDocId(email))
    .set({
      email,
      otpHash: hashOtp(email, otp),
      attempts: 0,
      expiresAt: Timestamp.fromDate(new Date(Date.now() + otpTtlMs)),
      createdAt: FieldValue.serverTimestamp(),
    });
}

async function sendMsg91EmailOtp(email: string, otp: string) {
  const { authKey, templateId, fromEmail, fromName, domain } = getMsg91Config();
  const payload: Record<string, unknown> = {
    template_id: templateId,
    recipients: [
      {
        to: [{ email }],
        variables: {
          otp,
          OTP: otp,
          code: otp,
        },
      },
    ],
  };

  if (fromEmail) {
    payload.from = { email: fromEmail, name: fromName };
  }

  if (domain) {
    payload.domain = domain;
  }

  const response = await fetch("https://control.msg91.com/api/v5/email/send", {
    method: "POST",
    cache: "no-store",
    headers: {
      accept: "application/json",
      authkey: authKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  await parseMsg91Response(response);
}

export async function sendLoginOtp(input: string) {
  const email = normalizeLoginEmail(input);
  const otp = String(randomInt(100000, 1000000));

  await storeEmailOtp(email, otp);

  try {
    await sendMsg91EmailOtp(email, otp);
  } catch (error) {
    await getAdminDb().collection("emailOtps").doc(getOtpDocId(email)).delete();
    throw error;
  }

  return email;
}

export async function verifyLoginOtp(input: string, otp: string) {
  const email = normalizeLoginEmail(input);
  const cleanOtp = otp.replace(/\D/g, "");

  if (cleanOtp.length < 4 || cleanOtp.length > 8) {
    throw new Error("Enter the OTP sent to your email.");
  }

  const otpRef = getAdminDb().collection("emailOtps").doc(getOtpDocId(email));
  const otpSnap = await otpRef.get();

  if (!otpSnap.exists) {
    throw new Error("Request a fresh OTP before continuing.");
  }

  const data = otpSnap.data();
  const expiresAt = data?.expiresAt as Timestamp | undefined;
  const attempts = Number(data?.attempts ?? 0);

  if (!expiresAt || expiresAt.toMillis() < Date.now()) {
    await otpRef.delete();
    throw new Error("Your OTP has expired. Request a fresh OTP.");
  }

  if (attempts >= maxOtpAttempts) {
    await otpRef.delete();
    throw new Error("Too many incorrect attempts. Request a fresh OTP.");
  }

  await otpRef.update({
    attempts: FieldValue.increment(1),
    updatedAt: FieldValue.serverTimestamp(),
  });

  if (!data?.otpHash || !isSameHash(String(data.otpHash), hashOtp(email, cleanOtp))) {
    throw new Error("Invalid OTP. Please try again.");
  }

  await otpRef.delete();

  return email;
}

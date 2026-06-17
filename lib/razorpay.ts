import crypto from "crypto";

type RazorpayOrderResponse = {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
};

export async function createRazorpayOrder({
  amount,
  receipt,
}: {
  amount: number;
  receipt: string;
}) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay environment variables are not configured.");
  }

  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amount * 100,
      currency: "INR",
      receipt,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Unable to create Razorpay order: ${error}`);
  }

  return (await response.json()) as RazorpayOrderResponse;
}

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    throw new Error("Razorpay secret is not configured.");
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  return (
    expectedBuffer.length === signatureBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
  );
}

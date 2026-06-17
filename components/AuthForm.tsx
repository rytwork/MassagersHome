"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithCustomToken } from "firebase/auth";
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase-client";

type Step = "email" | "otp";

export function AuthForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("Log in or sign up with a one-time password.");
  const [loading, setLoading] = useState(false);

  async function routeForSignedInUser() {
    const currentUser = getFirebaseAuth().currentUser;
    if (!currentUser) return;

    const token = await currentUser.getIdToken(true);
    const response = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = (await response.json()) as { user?: { isAdmin: boolean }; error?: string };

    if (!response.ok) {
      throw new Error(data.error ?? "Unable to verify your account.");
    }

    router.push(data.user?.isAdmin ? "/admin" : "/account");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(step === "email" ? "Sending OTP..." : "Verifying OTP...");

    try {
      if (step === "email") {
        const response = await fetch("/api/auth/otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = (await response.json()) as { email?: string; error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to send OTP.");
        }

        setEmail(data.email ?? email);
        setStep("otp");
        setMessage("OTP sent. Enter it below to continue.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = (await response.json()) as { token?: string; error?: string };

      if (!response.ok || !data.token) {
        throw new Error(data.error ?? "Unable to verify OTP.");
      }

      await signInWithCustomToken(getFirebaseAuth(), data.token);
      await routeForSignedInUser();
    } catch (error) {
      setLoading(false);
      setMessage(error instanceof Error ? error.message : "Authentication failed.");
    }
  }

  return (
    <div className="mx-auto grid max-w-md gap-5 rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
          Login with OTP
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Enter your email address. New customers are signed up automatically after OTP verification.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-md border border-emerald-900/10 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-950">
        <ShieldCheck size={18} />
        <span>{step === "email" ? "Step 1 of 2: verify your email address." : "Step 2 of 2: enter the OTP."}</span>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="grid gap-2">
          <span className="flex items-center gap-2 text-sm font-semibold text-stone-800">
            <Mail size={17} />
            Email address
          </span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="field-input"
            type="email"
            inputMode="email"
            placeholder="name@gmail.com"
            disabled={step === "otp" || loading}
            required
          />
        </label>

        {step === "otp" ? (
          <label className="grid gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-stone-800">
              <Lock size={17} />
              OTP
            </span>
            <input
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              className="field-input"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter OTP"
              required
            />
          </label>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-900 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={17} /> : <Lock size={17} />}
          {step === "email" ? "Send OTP" : "Verify and continue"}
        </button>

        {step === "otp" ? (
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setOtp("");
              setMessage("Edit your email address and request a fresh OTP.");
            }}
            className="text-sm font-semibold text-emerald-800"
          >
            Change email address
          </button>
        ) : null}
      </form>

      <p className="text-sm font-medium text-stone-600">{message}</p>
    </div>
  );
}

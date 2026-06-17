"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { CalendarCheck, Loader2, LockKeyhole, LogOut, RefreshCw, Star } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { getFirebaseAuth } from "@/lib/firebase-client";
import type { Booking } from "@/lib/types";

export function AccountDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [message, setMessage] = useState("Loading your account...");

  const upcomingCount = useMemo(
    () => bookings.filter((booking) => booking.status !== "completed").length,
    [bookings],
  );
  const pendingRatingBooking = useMemo(
    () => bookings.find((booking) => booking.status === "completed" && !booking.rating) ?? null,
    [bookings],
  );

  const loadBookings = useCallback(async (currentUser: User) => {
    setLoadingBookings(true);
    setMessage("Loading your bookings...");

    const token = await currentUser.getIdToken();
    const response = await fetch("/api/user/bookings", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = (await response.json()) as { bookings?: Booking[]; error?: string };

    setLoadingBookings(false);

    if (!response.ok) {
      setMessage(data.error ?? "Unable to load your bookings.");
      return;
    }

    setBookings(data.bookings ?? []);
    setMessage(`${data.bookings?.length ?? 0} bookings loaded.`);
  }, []);

  useEffect(() => {
    return onAuthStateChanged(getFirebaseAuth(), async (currentUser) => {
      setLoadingUser(false);

      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);
      const token = await currentUser.getIdToken(true);
      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await response.json()) as { user?: { isAdmin: boolean }; error?: string };

      if (response.ok && data.user?.isAdmin) {
        router.push("/admin");
        return;
      }

      await loadBookings(currentUser);
    });
  }, [loadBookings, router]);

  async function handleSignOut() {
    await signOut(getFirebaseAuth());
    router.push("/login");
  }

  if (loadingUser) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
        <Loader2 className="mx-auto animate-spin text-emerald-800" size={28} />
        <p className="mt-3 text-sm font-medium text-stone-600">Checking your account...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
              User account
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
              {user?.displayName || user?.email || user?.phoneNumber || "My account"}
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              {upcomingCount} active booking{upcomingCount === 1 ? "" : "s"} in your account.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (user) void loadBookings(user);
              }}
              disabled={loadingBookings}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-800 hover:border-emerald-700 hover:text-emerald-900 disabled:opacity-60"
            >
              {loadingBookings ? <Loader2 className="animate-spin" size={17} /> : <RefreshCw size={17} />}
              Refresh
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white hover:bg-stone-800"
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-2">
          <CalendarCheck className="text-emerald-800" size={22} />
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Book a session</h2>
        </div>
        {pendingRatingBooking ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                <LockKeyhole size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-950">Rating required</h3>
                <p className="mt-2 text-sm leading-6 text-stone-700">
                  Please rate your completed {pendingRatingBooking.serviceName} session before
                  booking another service.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <BookingForm />
        )}
      </section>

      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-stone-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">Your bookings</h2>
            <p className="mt-1 text-sm font-medium text-stone-600">{message}</p>
          </div>
          <Link href="/services" className="text-sm font-semibold text-emerald-800">
            View services
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-stone-100 text-xs uppercase tracking-[0.14em] text-stone-600">
              <tr>
                <th className="px-4 py-4">Service</th>
                <th className="px-4 py-4">District</th>
                <th className="px-4 py-4">Therapist</th>
                <th className="px-4 py-4">Slot</th>
                <th className="px-4 py-4">Payment</th>
                <th className="px-4 py-4">Offer</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 py-4 align-top">
                    <p className="font-semibold text-stone-950">{booking.serviceName}</p>
                    <p className="text-stone-600">
                      Paid: Rs. {booking.payableAmount ?? booking.visitFee}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top text-stone-700">
                    {formatServiceDistrict(booking.serviceDistrict)}
                  </td>
                  <td className="px-4 py-4 align-top text-stone-700">
                    {formatTherapistPreference(booking.therapistGenderPreference)}
                  </td>
                  <td className="px-4 py-4 align-top text-stone-700">
                    {new Date(booking.dateTime).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-4 align-top capitalize text-stone-700">
                    {booking.paymentStatus}
                  </td>
                  <td className="px-4 py-4 align-top text-stone-700">
                    {booking.freeSessionNumber
                      ? `Free session ${booking.freeSessionNumber}/2`
                      : "Normal pricing"}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className="inline-flex rounded-md bg-stone-100 px-3 py-1 text-xs font-semibold capitalize text-stone-800">
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!bookings.length ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center font-medium text-stone-500">
                    No bookings yet. Your first confirmed booking will appear here.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
      {user && pendingRatingBooking ? (
        <RatingPopup
          booking={pendingRatingBooking}
          user={user}
          onRated={() => loadBookings(user)}
        />
      ) : null}
    </div>
  );
}

function RatingPopup({
  booking,
  user,
  onRated,
}: {
  booking: Booking;
  user: User;
  onRated: () => Promise<void>;
}) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submitRating() {
    setSubmitting(true);
    setError("");

    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/user/ratings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId: booking.id, rating, review }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to submit rating.");
      }

      await onRated();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to submit rating.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-stone-950/45 px-4 pb-5 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
          Session completed
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Rate your {booking.serviceName}
        </h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Your feedback helps other customers choose confidently. You can book your next service
          after submitting this rating.
        </p>

        <div className="mt-5 flex gap-2" aria-label="Choose rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-stone-200 text-[#b98f2f] hover:bg-[#f7efd9]"
              aria-label={`${value} star rating`}
            >
              <Star className={value <= rating ? "fill-current" : ""} size={22} />
            </button>
          ))}
        </div>

        <label className="mt-5 grid gap-2">
          <span className="text-sm font-semibold text-stone-800">Review</span>
          <textarea
            value={review}
            onChange={(event) => setReview(event.target.value)}
            className="field-input min-h-28 resize-none"
            placeholder="Tell us about your therapist, comfort, hygiene, or overall experience"
            maxLength={400}
          />
        </label>

        {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}

        <button
          type="button"
          onClick={submitRating}
          disabled={submitting}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-900 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? <Loader2 className="animate-spin" size={18} /> : <Star size={18} />}
          Submit rating
        </button>
      </div>
    </div>
  );
}

function formatTherapistPreference(preference: Booking["therapistGenderPreference"]) {
  if (preference === "male") return "Male therapist";
  if (preference === "female") return "Female therapist";
  return "No preference";
}

function formatServiceDistrict(district: Booking["serviceDistrict"]) {
  if (district === "saharanpur") return "Saharanpur";
  if (district === "meerut") return "Meerut";
  if (district === "shamli") return "Shamli";
  return "Muzaffarnagar";
}

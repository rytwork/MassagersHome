"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { CalendarCheck, Loader2, LogOut, RefreshCw } from "lucide-react";
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
        <BookingForm />
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

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { Loader2, LogOut, RefreshCw } from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase-client";
import type { Booking, BookingStatus } from "@/lib/types";

type AdminResponse = {
  bookings: Booking[];
};

const statuses: BookingStatus[] = ["pending", "confirmed", "completed", "failed"];
const filters: Array<BookingStatus | "all"> = ["all", "pending", "confirmed", "completed", "failed"];

export function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [message, setMessage] = useState("Checking admin access...");
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const revenue = useMemo(
    () =>
      bookings
        .filter((booking) => booking.paymentStatus === "paid")
        .reduce((total, booking) => total + Number(booking.payableAmount ?? booking.visitFee ?? 0), 0),
    [bookings],
  );
  const filteredBookings = useMemo(
    () => (filter === "all" ? bookings : bookings.filter((booking) => booking.status === filter)),
    [bookings, filter],
  );

  const loadBookings = useCallback(async (currentUser: User) => {
    setLoading(true);
    setMessage("Loading bookings...");

    const token = await currentUser.getIdToken();
    const response = await fetch("/api/admin/bookings", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = (await response.json()) as AdminResponse & { error?: string };

    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "Unable to load admin dashboard.");
      return;
    }

    setBookings(data.bookings);
    setMessage(`${data.bookings.length} bookings loaded.`);
  }, []);

  useEffect(() => {
    return onAuthStateChanged(getFirebaseAuth(), async (currentUser) => {
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

      if (!response.ok || !data.user?.isAdmin) {
        setAuthorized(false);
        setMessage("This account does not have admin access.");
        return;
      }

      setAuthorized(true);
      await loadBookings(currentUser);
    });
  }, [loadBookings, router]);

  async function changeStatus(bookingId: string, status: BookingStatus) {
    if (!user) return;

    const token = await user.getIdToken();
    const response = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookingId, status }),
    });

    if (!response.ok) {
      setMessage("Status update failed.");
      return;
    }

    setBookings((current) =>
      current.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)),
    );
    setMessage("Booking status updated.");
  }

  async function handleSignOut() {
    await signOut(getFirebaseAuth());
    router.push("/login");
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a5b48]">
              Admin account
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
              {user?.email ?? user?.phoneNumber ?? "Admin dashboard"}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                if (user) void loadBookings(user);
              }}
              disabled={loading || !authorized}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#101816] px-5 text-sm font-semibold text-white transition hover:bg-[#6f3d35] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={17} /> : <RefreshCw size={17} />}
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
        <p className="mt-4 text-sm font-medium text-stone-600">{message}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-4">
        <Metric label="Bookings" value={bookings.length.toString()} />
        <Metric label="Paid revenue" value={`Rs. ${revenue}`} />
        <Metric
          label="Pending"
          value={bookings.filter((booking) => booking.status === "pending").length.toString()}
        />
        <Metric
          label="Completed"
          value={bookings.filter((booking) => booking.status === "completed").length.toString()}
        />
      </section>

      <section className="flex flex-wrap gap-2">
        {filters.map((statusFilter) => (
          <button
            key={statusFilter}
            type="button"
            onClick={() => setFilter(statusFilter)}
            className={
              filter === statusFilter
                ? "rounded-md bg-[#101816] px-4 py-2 text-sm font-semibold capitalize text-white"
                : "rounded-md border border-stone-200 bg-white px-4 py-2 text-sm font-semibold capitalize text-stone-700 hover:border-[#9a5b48] hover:text-[#101816]"
            }
          >
            {statusFilter}
          </button>
        ))}
      </section>

      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-stone-100 text-xs uppercase tracking-[0.14em] text-stone-600">
              <tr>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Service</th>
                <th className="px-4 py-4">Therapist</th>
                <th className="px-4 py-4">Slot</th>
                <th className="px-4 py-4">Payment</th>
                <th className="px-4 py-4">Offer</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 py-4 align-top">
                    <p className="font-semibold text-stone-950">{booking.name}</p>
                    <p className="text-stone-600">{booking.phone}</p>
                    <p className="text-stone-500">{booking.userEmail}</p>
                    <p className="text-stone-500">{formatServiceDistrict(booking.serviceDistrict)}</p>
                    <p className="mt-1 max-w-xs text-stone-500">{booking.address}</p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="font-semibold text-stone-950">{booking.serviceName}</p>
                    <p className="text-stone-600">Paid: Rs. {booking.payableAmount ?? booking.visitFee}</p>
                    <p className="text-stone-500">Regular: Rs. {booking.servicePrice}</p>
                  </td>
                  <td className="px-4 py-4 align-top text-stone-700">
                    {formatTherapistPreference(booking.therapistGenderPreference)}
                  </td>
                  <td className="px-4 py-4 align-top text-stone-700">
                    {new Date(booking.dateTime).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <Badge tone={booking.paymentStatus === "paid" ? "green" : "amber"}>
                      {booking.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 align-top text-stone-700">
                    {booking.freeSessionNumber
                      ? `Free session ${booking.freeSessionNumber}/2`
                      : "Normal pricing"}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <select
                      value={booking.status}
                      onChange={(event) =>
                        changeStatus(booking.id, event.target.value as BookingStatus)
                      }
                      className="rounded-md border border-stone-200 bg-white px-3 py-2 font-medium text-stone-800"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    {booking.status !== "completed" ? (
                      <button
                        type="button"
                        onClick={() => changeStatus(booking.id, "completed")}
                        className="mt-2 block rounded-md bg-[#101816] px-3 py-2 text-xs font-semibold text-white hover:bg-[#6f3d35]"
                      >
                        Complete
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
              {!filteredBookings.length ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center font-medium text-stone-500">
                    No bookings match this view.
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-stone-600">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">{value}</p>
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "green" | "amber" }) {
  return (
    <span
      className={
        tone === "green"
          ? "inline-flex rounded-md bg-[#f3e0d4] px-3 py-1 text-xs font-semibold text-[#101816]"
          : "inline-flex rounded-md bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900"
      }
    >
      {children}
    </span>
  );
}

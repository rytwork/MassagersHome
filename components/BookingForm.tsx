"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, CreditCard, Loader2, MapPin, Phone, User, Users } from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase-client";
import { services } from "@/lib/services";
import { validateBookingPayload } from "@/lib/validation";
import type { BookingPayload, ServiceDistrict, TherapistGenderPreference } from "@/lib/types";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; contact: string };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal: { ondismiss: () => void };
};

type CreateOrderResponse = {
  bookingId: string;
  orderId: string;
  amount: number;
  payableAmount: number;
  freeSessionNumber: number | null;
  currency: string;
  razorpayKeyId: string;
};

const therapistGenderOptions: Array<{ label: string; value: TherapistGenderPreference }> = [
  { label: "No preference", value: "no-preference" },
  { label: "Male therapist", value: "male" },
  { label: "Female therapist", value: "female" },
];

const serviceDistrictOptions: Array<{ label: string; value: ServiceDistrict }> = [
  { label: "Muzaffarnagar", value: "muzaffarnagar" },
  { label: "Saharanpur", value: "saharanpur" },
  { label: "Meerut", value: "meerut" },
  { label: "Shamli", value: "shamli" },
];

const initialForm: BookingPayload = {
  name: "",
  phone: "",
  address: "",
  serviceDistrict: "muzaffarnagar",
  serviceId: services[0].id,
  therapistGenderPreference: "no-preference",
  dateTime: "",
};

export function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedService = searchParams.get("service");
  const initialServiceId =
    requestedService && services.some((item) => item.id === requestedService)
      ? requestedService
      : initialForm.serviceId;
  const [form, setForm] = useState<BookingPayload>({
    ...initialForm,
    serviceId: initialServiceId,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const selectedService = useMemo(
    () => services.find((service) => service.id === form.serviceId) ?? services[0],
    [form.serviceId],
  );

  async function loadRazorpay() {
    if (window.Razorpay) return true;

    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateBookingPayload(form);
    setErrors(result.errors);

    if (!result.valid) return;

    setLoading(true);
    setStatus("Creating your secure payment order...");

    try {
      const currentUser = getFirebaseAuth().currentUser;
      if (!currentUser) {
        router.push("/login");
        return;
      }

      const token = await currentUser.getIdToken();
      const razorpayReady = await loadRazorpay();
      if (!razorpayReady || !window.Razorpay) {
        throw new Error("Razorpay checkout could not be loaded.");
      }

      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const order = (await orderResponse.json()) as CreateOrderResponse & { error?: string };

      if (!orderResponse.ok) {
        throw new Error(order.error ?? "Unable to create order.");
      }

      const checkout = new window.Razorpay({
        key: order.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: "MassagersHome",
        description: `${selectedService.name} booking payment`,
        order_id: order.orderId,
        prefill: { name: result.data.name, contact: result.data.phone },
        handler: async (paymentResponse) => {
          setStatus("Verifying payment...");
          const verifyResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId: order.bookingId, ...paymentResponse }),
          });

          if (!verifyResponse.ok) {
            router.push(`/payment/failed?booking=${order.bookingId}`);
            return;
          }

          router.push(`/payment/success?booking=${order.bookingId}`);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setStatus("Payment was closed. You can retry when ready.");
          },
        },
      });

      checkout.open();
    } catch (error) {
      setLoading(false);
      setStatus(error instanceof Error ? error.message : "Something went wrong. Please retry.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={handleSubmit} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="grid gap-5">
          <Field label="Name" error={errors.name} icon={<User size={18} />}>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="field-input"
              placeholder="Your full name"
            />
          </Field>
          <Field label="Phone" error={errors.phone} icon={<Phone size={18} />}>
            <input
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              className="field-input"
              inputMode="tel"
              placeholder="10-digit mobile number"
            />
          </Field>
          <Field label="Address" error={errors.address} icon={<MapPin size={18} />}>
            <textarea
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
              className="field-input min-h-28 resize-none"
              placeholder="Flat, street, landmark, city"
            />
          </Field>
          <Field label="District" error={errors.serviceDistrict} icon={<MapPin size={18} />}>
            <select
              value={form.serviceDistrict}
              onChange={(event) =>
                setForm({ ...form, serviceDistrict: event.target.value as ServiceDistrict })
              }
              className="field-input"
            >
              {serviceDistrictOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Service" error={errors.serviceId} icon={<CreditCard size={18} />}>
              <select
                value={form.serviceId}
                onChange={(event) => setForm({ ...form, serviceId: event.target.value })}
                className="field-input"
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Therapist preference"
              error={errors.therapistGenderPreference}
              icon={<Users size={18} />}
            >
              <select
                value={form.therapistGenderPreference}
                onChange={(event) =>
                  setForm({
                    ...form,
                    therapistGenderPreference: event.target.value as TherapistGenderPreference,
                  })
                }
                className="field-input"
              >
                {therapistGenderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Date & Time" error={errors.dateTime} icon={<CalendarDays size={18} />}>
              <input
                value={form.dateTime}
                onChange={(event) => setForm({ ...form, dateTime: event.target.value })}
                className="field-input"
                type="datetime-local"
              />
            </Field>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-900 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-950/15 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
          Continue to secure payment
        </button>
        {status ? <p className="mt-4 text-sm font-medium text-stone-600">{status}</p> : null}
      </form>

      <aside className="h-fit rounded-lg bg-stone-950 p-6 text-white shadow-xl shadow-stone-900/15">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
          Smart offer applied
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">{selectedService.name}</h2>
        <p className="mt-3 text-stone-300">{selectedService.description}</p>
        <div className="mt-6 grid gap-3 text-sm">
          <Summary label="Duration" value={selectedService.duration} />
          <Summary label="Regular price" value={`Rs. ${selectedService.price}`} />
          <Summary label="First 2 completed bookings" value={`Rs. ${selectedService.visitFee}`} />
          <Summary label="After 2 completed bookings" value={`Rs. ${selectedService.price}`} strong />
        </div>
        <div className="mt-6 rounded-md border border-white/10 bg-white/5 p-4 text-sm leading-6 text-stone-200">
          Your final payable amount is calculated at checkout. The first 2 completed free-session
          bookings only charge the visit fee; later bookings use the full service price.
        </div>
        <div className="mt-3 rounded-md border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-50">
          Service is currently available only in Muzaffarnagar, Saharanpur, Meerut, and Shamli
          districts of Uttar Pradesh.
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  error,
  icon,
  children,
}: {
  label: string;
  error?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center gap-2 text-sm font-semibold text-stone-800">
        {icon}
        {label}
      </span>
      {children}
      {error ? <span className="text-sm font-medium text-red-600">{error}</span> : null}
    </label>
  );
}

function Summary({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md bg-white/5 px-4 py-3">
      <span className="text-stone-300">{label}</span>
      <span className={strong ? "text-lg font-semibold text-emerald-200" : "font-semibold"}>
        {value}
      </span>
    </div>
  );
}

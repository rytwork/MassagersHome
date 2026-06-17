import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-stone-50 px-4 py-16 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
            Terms & Conditions
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">
            Clear offer conditions
          </h1>
          <div className="mt-8 grid gap-6 text-sm leading-7 text-stone-700">
            <p>
              The introductory offer is available to new users only and is tracked by customer
              account. Eligible users receive 2 free massage sessions and pay only the applicable
              home visit charge.
            </p>
            <p>
              The offer is one-time, non-transferable, subject to slot availability, and may vary by
              location. After 2 free sessions, normal service pricing applies.
            </p>
            <p>
              Service is currently available only in Muzaffarnagar, Saharanpur, Meerut, and Shamli
              districts of Uttar Pradesh.
            </p>
            <p>
              A booking is confirmed only after Razorpay payment verification succeeds on the
              backend. MassagersHome may cancel or reschedule bookings if details are incomplete,
              outside the serviceable area, or violate platform policy.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

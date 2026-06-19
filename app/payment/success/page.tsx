import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function PaymentSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="grid min-h-[60vh] place-items-center bg-[#f6f1ec] px-4 py-16">
        <section className="max-w-xl rounded-lg bg-[#ffffff] p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto text-[#6f3d35]" size={56} />
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#101816]">
            Booking confirmed
          </h1>
          <p className="mt-3 text-stone-600">
            Your payment has been verified. Our team will contact you shortly with therapist
            confirmation and arrival details.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/account"
              className="inline-flex items-center justify-center rounded-md bg-[#101816] px-5 py-3 text-sm font-semibold text-white"
            >
              View my bookings
            </Link>
            <a
              href="https://wa.me/919457037015"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-800"
            >
              <MessageCircle size={17} />
              WhatsApp support
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

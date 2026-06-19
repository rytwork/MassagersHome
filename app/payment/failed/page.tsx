import Link from "next/link";
import { RotateCcw, XCircle } from "lucide-react";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function PaymentFailedPage() {
  return (
    <>
      <Navbar />
      <main className="grid min-h-[60vh] place-items-center bg-[#f6f1ec] px-4 py-16">
        <section className="max-w-xl rounded-lg bg-[#ffffff] p-8 text-center shadow-sm">
          <XCircle className="mx-auto text-red-600" size={56} />
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#101816]">
            Payment not confirmed
          </h1>
          <p className="mt-3 text-stone-600">
            We could not verify the payment. No booking is confirmed until Razorpay verification
            succeeds.
          </p>
          <Link
            href="/account"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-[#101816] px-5 py-3 text-sm font-semibold text-white"
          >
            <RotateCcw size={17} />
            Retry booking
          </Link>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

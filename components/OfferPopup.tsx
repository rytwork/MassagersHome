"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export function OfferPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = window.sessionStorage.getItem("mh-offer-seen");
    const timer = window.setTimeout(() => setOpen(!seen), 900);
    return () => window.clearTimeout(timer);
  }, []);

  function close() {
    window.sessionStorage.setItem("mh-offer-seen", "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-stone-950/35 px-4 pb-5 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
        <button
          aria-label="Close offer"
          onClick={close}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
        >
          <X size={18} />
        </button>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
          Limited availability
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
          Claim 2 FREE massages
        </h2>
        <p className="mt-3 text-stone-600">
          New users pay only home visit charges for the first 2 sessions. Secure your slot before
          today&apos;s home visits fill up in Muzaffarnagar, Saharanpur, Meerut, and Shamli.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/booking"
            onClick={close}
            className="inline-flex flex-1 items-center justify-center rounded-md bg-emerald-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Claim Offer
          </Link>
          <button
            onClick={close}
            className="inline-flex items-center justify-center rounded-md border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}

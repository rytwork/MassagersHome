import Link from "next/link";
import { Clock, IndianRupee } from "lucide-react";
import type { Service } from "@/lib/types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="rounded-lg border border-[#9a5b48]/24 bg-[#ffffff] p-6 shadow-sm shadow-[#101816]/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#101816]/10">
      <h3 className="professional-heading text-2xl text-stone-950">{service.name}</h3>
      <p className="mt-3 min-h-20 text-sm leading-6 text-stone-600">{service.description}</p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium text-stone-700">
        <span className="inline-flex items-center gap-2 rounded-md border border-[#9a5b48]/25 bg-white/70 px-3 py-2">
          <Clock size={16} />
          {service.duration}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-[#f3e0d4] px-3 py-2 text-[#101816]">
          <IndianRupee size={15} />
          {service.price}
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold text-[#9a5b48]">
        Offer: only pay visit charge of Rs. {service.visitFee}
      </p>
      <Link
        href={`/booking?service=${service.id}`}
        className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-[#101816] px-4 py-3 text-sm font-semibold text-[#fff3ea] transition hover:bg-[#6f3d35] hover:text-white"
      >
        Book this service
      </Link>
    </article>
  );
}

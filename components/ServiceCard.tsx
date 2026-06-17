import Link from "next/link";
import { Clock, IndianRupee } from "lucide-react";
import type { Service } from "@/lib/types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/10">
      <h3 className="text-xl font-semibold text-stone-950">{service.name}</h3>
      <p className="mt-3 min-h-20 text-sm leading-6 text-stone-600">{service.description}</p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium text-stone-700">
        <span className="inline-flex items-center gap-2 rounded-md bg-stone-100 px-3 py-2">
          <Clock size={16} />
          {service.duration}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-3 py-2 text-emerald-900">
          <IndianRupee size={15} />
          {service.price}
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold text-emerald-800">
        Offer: only pay visit charge of Rs. {service.visitFee}
      </p>
      <Link
        href={`/booking?service=${service.id}`}
        className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
      >
        Book this service
      </Link>
    </article>
  );
}

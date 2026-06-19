import Image from "next/image";
import Link from "next/link";
import { AtSign, Camera, Mail, MapPin, Phone, Share2 } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-[#9a5b48]/20 bg-[#101816] text-white dark:border-white/10 dark:bg-stone-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.25fr_0.7fr_0.9fr] md:py-14 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#9a5b48]/30 bg-white shadow-sm">
              <Image
                src="/massagershome-logo.png"
                alt="MassagersHome logo"
                width={96}
                height={96}
                className="h-full w-full object-contain p-1"
              />
            </span>
            <div>
              <p className="professional-heading text-2xl text-white">MassagersHome</p>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#fff3ea]">
                Premium Home Massage
              </p>
            </div>
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-stone-300">
            Certified home massage professionals, transparent visit fees, secure online payment,
            and a simple booking experience built for busy households.
          </p>
          <div className="mt-5 flex gap-2">
            {[Camera, AtSign, Share2].map((Icon, index) => (
              <a
                key={index}
                href="#contact"
                aria-label="Social media"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#9a5b48]/25 text-[#fff3ea] transition hover:border-[#fff3ea] hover:bg-white/8 dark:border-white/10 dark:text-stone-300 dark:hover:text-[#fff3ea]"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-white dark:text-white">Quick links</p>
          <div className="mt-3 grid gap-2 text-sm text-stone-300 dark:text-stone-300">
            <Link href="/#home">Home</Link>
            <Link href="/services">Services</Link>
            <Link href="/#pricing">Pricing</Link>
            <Link href="/booking">Book a session</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-white dark:text-white">Contact</p>
          <div className="mt-3 grid gap-3 text-sm text-stone-300 dark:text-stone-300">
            <p className="flex gap-2">
              <Phone className="mt-0.5 shrink-0 text-[#fff3ea]" size={16} />
              +91 94570 37015
            </p>
            <p className="flex gap-2">
              <Mail className="mt-0.5 shrink-0 text-[#fff3ea]" size={16} />
              care@massagershome.com
            </p>
            <p className="flex gap-2">
              <MapPin className="mt-0.5 shrink-0 text-[#fff3ea]" size={16} />
              Muzaffarnagar, Saharanpur, Meerut, and Shamli
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

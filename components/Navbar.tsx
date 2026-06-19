import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Sparkles } from "lucide-react";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#9a5b48]/25 bg-[#fffaf5]/90 shadow-sm shadow-stone-950/5 backdrop-blur-xl dark:border-[#9a5b48]/20 dark:bg-[#101816]/90">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-3 py-2 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold text-stone-950 sm:gap-3 dark:text-white">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#9a5b48]/30 bg-white shadow-sm shadow-[#101816]/10 sm:h-12 sm:w-12">
            <Image
              src="/massagershome-logo.png"
              alt="MassagersHome logo"
              width={96}
              height={96}
              className="h-full w-full object-contain p-1"
              priority
            />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="professional-heading block truncate text-base sm:text-lg">MassagersHome</span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#9a5b48] sm:text-xs dark:text-[#fff3ea]">
              <Sparkles size={12} />
              Premium Home Massage
            </span>
          </span>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-semibold text-stone-700 lg:flex dark:text-stone-200">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-[#9a5b48] dark:hover:text-[#fff3ea]">
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/booking"
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-[#101816] px-3 text-xs font-bold text-[#fff3ea] shadow-lg shadow-[#101816]/20 transition hover:-translate-y-0.5 hover:bg-[#6f3d35] hover:text-white sm:h-11 sm:gap-2 sm:px-4 sm:text-sm"
        >
          <CalendarCheck size={17} />
          <span className="hidden min-[360px]:inline">Book Now</span>
          <span className="min-[360px]:hidden">Book</span>
        </Link>
      </nav>
      <div className="border-t border-stone-200/70 px-3 py-2 lg:hidden dark:border-white/10">
        <div className="flex gap-4 overflow-x-auto whitespace-nowrap text-xs font-semibold text-stone-700 [scrollbar-width:none] dark:text-stone-200">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="shrink-0 hover:text-[#9a5b48] dark:hover:text-[#fff3ea]">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

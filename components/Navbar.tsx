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
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-[#fbfaf5]/85 shadow-sm shadow-stone-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-stone-950/82">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-3 py-2 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold text-stone-950 sm:gap-3 dark:text-white">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-900 text-xs text-white shadow-sm sm:h-10 sm:w-10 sm:text-sm">
            MH
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm sm:text-base">MassagersHome</span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#9f7d2f] sm:text-xs dark:text-[#f0d690]">
              <Sparkles size={12} />
              Premium Wellness
            </span>
          </span>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-semibold text-stone-700 lg:flex dark:text-stone-200">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-emerald-800 dark:hover:text-emerald-300">
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/booking"
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-emerald-900 px-3 text-xs font-bold text-white shadow-lg shadow-emerald-950/15 transition hover:-translate-y-0.5 hover:bg-emerald-800 sm:h-11 sm:gap-2 sm:px-4 sm:text-sm"
        >
          <CalendarCheck size={17} />
          <span className="hidden min-[360px]:inline">Book Now</span>
          <span className="min-[360px]:hidden">Book</span>
        </Link>
      </nav>
      <div className="border-t border-stone-200/70 px-3 py-2 lg:hidden dark:border-white/10">
        <div className="flex gap-4 overflow-x-auto whitespace-nowrap text-xs font-semibold text-stone-700 [scrollbar-width:none] dark:text-stone-200">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="shrink-0 hover:text-emerald-800 dark:hover:text-emerald-300">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

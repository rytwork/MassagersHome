import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarCheck,
  ChevronDown,
  Clock3,
  Crown,
  HeartHandshake,
  Leaf,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  WalletCards,
} from "lucide-react";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { HomeReviews } from "@/components/HomeReviews";
import { Navbar } from "@/components/Navbar";
import { services as serviceCatalog } from "@/lib/services";

const heroStats = [
  { label: "Avg. Rating", value: "4.9", icon: Star },
  { label: "Verified Pros", value: "100%", icon: BadgeCheck },
  { label: "Happy Clients", value: "10k+", icon: HeartHandshake },
];

const servicePresentation = {
  "swedish-massage": {
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
    icon: Leaf,
  },
  "deep-tissue": {
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=900&q=80",
    icon: ShieldCheck,
  },
  aromatherapy: {
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80",
    icon: Sparkles,
  },
  "thai-massage": {
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=900&q=80",
    icon: CalendarCheck,
  },
  "prenatal-massage": {
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80",
    icon: HeartHandshake,
  },
  "foot-reflexology": {
    image:
      "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=900&q=80",
    icon: Star,
  },
};

const steps = [
  {
    title: "Choose Service",
    text: "Select a therapy based on your wellness goal, pressure preference, and available time.",
    icon: Sparkles,
  },
  {
    title: "Select Date & Therapist",
    text: "Pick a convenient slot and confirm a verified professional for your home visit.",
    icon: CalendarCheck,
  },
  {
    title: "Enjoy at Home",
    text: "Your therapist arrives with a hygienic kit so you can relax without travel or waiting.",
    icon: Leaf,
  },
];

const features = [
  { title: "Certified Experts", text: "Experienced therapists trained for premium home care.", icon: BadgeCheck },
  { title: "Hygienic & Safe", text: "Fresh linens, sanitized kits, and clear service protocols.", icon: ShieldCheck },
  { title: "Instant Booking", text: "Reserve your session quickly with secure online payment.", icon: Clock3 },
  { title: "Affordable Pricing", text: "Transparent packages with no surprise visit charges.", icon: WalletCards },
  { title: "24/7 Support", text: "WhatsApp-first help for bookings, changes, and follow-ups.", icon: MessageCircle },
  { title: "Verified Professionals", text: "Identity checks and service reviews for every therapist.", icon: Crown },
];

const plans = [
  {
    name: "Basic",
    price: "Rs. 699",
    note: "Essential relaxation",
    perks: ["45-minute session", "Certified therapist", "Hygiene kit included"],
  },
  {
    name: "Premium",
    price: "Rs. 999",
    note: "Most booked",
    perks: ["60-minute session", "Therapist preference", "Aroma oil upgrade", "Priority slots"],
    recommended: true,
  },
  {
    name: "Elite",
    price: "Rs. 1,499",
    note: "Spa-grade ritual",
    perks: ["90-minute session", "Premium oils", "Extended recovery care", "Concierge support"],
  },
];

const testimonials = [
  {
    name: "Priya S.",
    review: "The therapist arrived on time, the setup felt clean and elegant, and the massage quality was excellent.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Rohan M.",
    review: "Booked a deep tissue session after a long week. Smooth payment, professional service, very calming.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Ananya K.",
    review: "It felt like a boutique spa at home. I loved the therapist profile and the instant booking experience.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
];

const faqs = [
  {
    question: "Are the therapists certified?",
    answer:
      "Yes. Therapists are screened, verified, and selected for professional home wellness services.",
  },
  {
    question: "Can I choose a therapist?",
    answer:
      "You can share your preference while booking. Availability depends on your selected date and area.",
  },
  {
    question: "What hygiene steps do you follow?",
    answer:
      "Therapists carry sanitized essentials, fresh linens, and follow a clean setup process for every session.",
  },
  {
    question: "Where is MassagersHome available?",
    answer:
      "The service currently covers Muzaffarnagar, Saharanpur, Meerut, and Shamli districts of Uttar Pradesh.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#f6f1ec] text-stone-950 dark:bg-stone-950 dark:text-stone-50">
        <section
          id="home"
          className="relative min-h-[calc(100svh-104px)] bg-[linear-gradient(90deg,rgba(17,24,39,0.94),rgba(58,45,26,0.72),rgba(58,45,26,0.28)),url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=2200&q=85')] bg-cover bg-center text-white lg:min-h-[calc(100vh-72px)]"
        >
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f6f1ec] to-transparent dark:from-stone-950" />
          <div className="relative mx-auto grid min-h-[calc(100svh-104px)] max-w-7xl content-center gap-8 px-4 py-12 sm:px-6 sm:py-18 lg:min-h-[calc(100vh-72px)] lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <p className="inline-flex max-w-full items-center gap-2 rounded-lg border border-[#9a5b48]/35 bg-white/10 px-3 py-2 text-xs font-semibold text-[#fff3ea] shadow-lg backdrop-blur-md sm:px-4 sm:text-sm">
                <Sparkles size={16} />
                <span className="truncate">Premium Home Massage Service</span>
              </p>
              <h1 className="professional-heading mt-5 max-w-4xl text-5xl tracking-normal sm:mt-6 sm:text-7xl lg:text-8xl">
                Spa-level massage, delivered to your home
              </h1>
              <span className="accent-divider mt-6" />
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-100 sm:mt-6 sm:text-xl sm:leading-8">
                Certified therapists deliver a calm, spa-level massage experience to your home
                with hygienic care, secure booking, and premium service standards.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-stone-100 sm:text-sm">
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-md">
                  <MapPin size={15} />
                  Muzaffarnagar, Saharanpur, Meerut & Shamli
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-md">
                  <Phone size={15} />
                  WhatsApp-first support
                </span>
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
                <Link
                  href="/booking"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#c7865a] px-5 text-sm font-bold text-[#101816] shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#6f3d35] hover:text-white sm:h-13 sm:px-6"
                >
                  <CalendarCheck size={18} />
                  Book Massage
                </Link>
                <Link
                  href="#services"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-[#9a5b48]/45 bg-white/10 px-5 text-sm font-bold text-white shadow-lg backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/18 sm:h-13 sm:px-6"
                >
                  Explore Services
                </Link>
              </div>
            </div>

            <div className="grid gap-4 self-end lg:justify-items-end">
              <div className="w-full max-w-xl rounded-lg border border-[#9a5b48]/35 bg-[#ffffff]/94 p-4 text-stone-950 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
                    <Image
                      src="/massagershome-logo.png"
                      alt="MassagersHome logo"
                      width={160}
                      height={160}
                      className="h-full w-full object-contain p-1"
                      priority
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#9a5b48]">
                      MassagersHome
                    </p>
                    <p className="professional-heading mt-2 text-xl leading-tight sm:text-3xl">
                      Premium home wellness with verified care
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid w-full max-w-xl grid-cols-3 gap-2 sm:gap-3">
                {heroStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-[#9a5b48]/25 bg-white/12 p-3 shadow-2xl backdrop-blur-xl sm:p-4"
                    >
                      <Icon className="text-[#fff3ea]" size={17} />
                      <p className="mt-2 text-xl font-semibold sm:mt-3 sm:text-2xl">{stat.value}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-stone-100 sm:text-xs sm:tracking-[0.14em]">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="w-full max-w-xl rounded-lg border border-[#9a5b48]/25 bg-white/14 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#fff3ea] sm:text-sm sm:tracking-[0.18em]">
                  Today&apos;s calm
                </p>
                <p className="mt-3 text-xl font-semibold sm:text-2xl">Available slots from 10:00 AM</p>
                <p className="mt-2 text-sm leading-6 text-stone-100">
                  Choose your service, select your therapist, and enjoy professional wellness
                  care without leaving home.
                </p>
              </div>
            </div>
          </div>
        </section>

        <SectionIntro
          id="services"
          eyebrow="Signature Treatments"
          title="Curated rituals for calm, recovery, and renewal"
          description="A focused menu of therapist-led home treatments, designed with spa-grade hygiene and premium service rituals."
        />
        <section className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCatalog.map((service) => {
              const presentation =
                servicePresentation[service.id as keyof typeof servicePresentation] ??
                servicePresentation["swedish-massage"];
              const Icon = presentation.icon;
              return (
                <article
                  key={service.id}
                  className="group overflow-hidden rounded-lg border border-[#9a5b48]/22 bg-[#ffffff] shadow-sm shadow-[#101816]/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#101816]/12 dark:border-[#9a5b48]/18 dark:bg-white/6"
                >
                  <div className="overflow-hidden">
                    <div
                      className="h-56 bg-cover bg-center transition duration-700 group-hover:scale-[1.05]"
                      style={{
                        backgroundImage: `linear-gradient(180deg, transparent 48%, rgba(17,24,39,0.5)), url(${presentation.image})`,
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#101816] text-[#fff3ea] dark:bg-[#fff3ea]/10 dark:text-[#fff3ea]">
                        <Icon size={21} />
                      </div>
                      <p className="rounded-lg bg-[#f3e0d4] px-3 py-1 text-xs font-bold text-[#101816] sm:text-sm dark:bg-[#9a5b48]/20 dark:text-[#fff3ea]">
                        From Rs. {service.price}
                      </p>
                    </div>
                    <h3 className="professional-heading mt-5 text-2xl tracking-normal">{service.name}</h3>
                    <p className="mt-3 min-h-16 text-sm leading-6 text-stone-600 dark:text-stone-300">
                      {service.description}
                    </p>
                    <Link
                      href={`/booking?service=${service.id}`}
                      className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#9a5b48]/45 px-4 text-sm font-bold text-[#9a5b48] transition hover:bg-[#101816] hover:text-[#fff3ea] dark:border-[#9a5b48]/25 dark:text-[#fff3ea]"
                    >
                      Book this service
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="how-it-works" className="professional-dark px-4 py-16 text-white sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="How It Works" title="A seamless spa journey in three steps" />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article key={step.title} className="rounded-lg border border-[#9a5b48]/25 bg-white/8 p-6 shadow-sm backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#c7865a] text-[#101816]">
                        <Icon size={22} />
                      </div>
                      <span className="professional-heading text-6xl text-[#fff3ea]/45">0{index + 1}</span>
                    </div>
                    <h3 className="professional-heading mt-6 text-2xl">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-stone-200">{step.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="about" className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a5b48] dark:text-[#fff3ea]">
                Why Choose Us
              </p>
              <h2 className="professional-heading mt-3 text-4xl tracking-normal sm:text-6xl">
                Professional care, verified trust, and everyday convenience
              </h2>
              <span className="accent-divider mt-5" />
              <p className="mt-5 text-base leading-8 text-stone-600 dark:text-stone-300">
                MassagersHome brings verified wellness professionals to your doorstep with
                transparent pricing, clean service rituals, and support that stays close.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="rounded-xl border border-[#E8DDD3] bg-[#FDF8F3] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-[#3A302A] dark:bg-[#1F1A17]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5E6DA] dark:bg-[#2A211D]">
                      <Icon
                        className="text-[#9A5B48] dark:text-[#D4A373]"
                        size={24}
                      />
                    </div>

                    <h3 className="mt-4 text-xl font-semibold text-[#2D241F] dark:text-[#F5EDE6]">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[#6B5E57] dark:text-[#CBBFB7]">
                      {feature.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-[#eadbd2] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 dark:bg-white/5">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Pricing" title="Choose the right wellness ritual" />
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={
                    plan.recommended
                      ? "relative rounded-lg border border-[#9a5b48] bg-[#101816] p-5 text-white shadow-2xl shadow-[#101816]/25 sm:p-6"
                      : "rounded-lg border border-[#9a5b48]/24 bg-[#ffffff] p-6 shadow-sm shadow-[#101816]/5 dark:border-white/10 dark:bg-white/6"
                  }
                >
                  {plan.recommended ? (
                    <p className="mb-4 inline-flex rounded-lg bg-[#c7865a] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#101816] sm:absolute sm:right-5 sm:top-5 sm:mb-0">
                      Recommended
                    </p>
                  ) : null}
                  <p className={plan.recommended ? "text-[#fff3ea]" : "text-[#9a5b48] dark:text-[#fff3ea]"}>
                    {plan.note}
                  </p>
                  <h3 className="professional-heading mt-3 text-3xl">{plan.name}</h3>
                  <p className="mt-5 text-4xl font-semibold">{plan.price}</p>
                  <div className="mt-6 grid gap-3">
                    {plan.perks.map((perk) => (
                      <p key={perk} className="flex items-center gap-2 text-sm">
                        <ShieldCheck size={16} className={plan.recommended ? "text-[#fff3ea]" : "text-[#9a5b48] dark:text-[#fff3ea]"} />
                        {perk}
                      </p>
                    ))}
                  </div>
                  <Link
                    href="/booking"
                    className={
                      plan.recommended
                        ? "mt-7 inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#c7865a] px-4 text-sm font-bold text-[#101816] transition hover:bg-[#6f3d35] hover:text-white"
                        : "mt-7 inline-flex h-12 w-full items-center justify-center rounded-lg border border-[#9a5b48]/40 px-4 text-sm font-bold text-[#9a5b48] transition hover:bg-[#101816] hover:text-[#fff3ea] dark:border-white/15 dark:hover:text-[#fff3ea]"
                    }
                  >
                    Book Plan
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fffaf5] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 dark:bg-white/5">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Testimonials" title="Loved by customers who value calm" />
            <HomeReviews fallback={testimonials} />
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <SectionHeading eyebrow="FAQ" title="Everything you need before booking" />
            <div className="grid gap-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-lg border border-[#9a5b48]/24 bg-[#ffffff] p-5 shadow-sm shadow-[#101816]/5 dark:border-white/10 dark:bg-white/6"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold sm:text-base">
                    {faq.question}
                    <ChevronDown className="shrink-0 transition group-open:rotate-180" size={18} />
                  </summary>
                  <p className="mt-4 text-sm leading-6 text-stone-600 dark:text-stone-300">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

function SectionIntro({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section id={id} className="px-4 pb-10 pt-16 sm:px-6 sm:pb-12 sm:pt-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a5b48] dark:text-[#fff3ea]">
          {eyebrow}
        </p>
        <h2 className="professional-heading mt-3 text-4xl tracking-normal sm:text-6xl">{title}</h2>
        <span className="accent-divider mx-auto mt-5" />
        <p className="mt-5 text-base leading-8 text-stone-600 dark:text-stone-300">{description}</p>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a5b48] dark:text-[#fff3ea]">
        {eyebrow}
      </p>
      <h2 className="professional-heading mt-3 text-4xl tracking-normal sm:text-6xl">{title}</h2>
      <span className="accent-divider mt-5" />
    </div>
  );
}

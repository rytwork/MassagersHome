import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/lib/services";

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-stone-50">
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Services"
            title="Choose your home massage"
            description="Transparent durations, regular pricing, and new-user visit fees. Service is currently available only in Muzaffarnagar, Saharanpur, Meerut, and Shamli districts of Uttar Pradesh."
          />
          <div className="mx-auto mt-12 grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

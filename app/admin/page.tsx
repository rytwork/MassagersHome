import { AdminDashboard } from "@/components/AdminDashboard";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SectionHeader } from "@/components/SectionHeader";

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <main className="bg-stone-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Admin"
            title="Booking dashboard"
            description="View customer details, payment status, revenue, and mark bookings as pending or completed."
          />
          <div className="mt-12">
            <AdminDashboard />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

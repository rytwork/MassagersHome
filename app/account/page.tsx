import { AccountDashboard } from "@/components/AccountDashboard";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function AccountPage() {
  return (
    <>
      <Navbar />
      <main className="bg-stone-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AccountDashboard />
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

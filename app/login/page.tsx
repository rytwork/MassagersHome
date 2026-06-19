import { AuthForm } from "@/components/AuthForm";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#f6f1ec] px-4 py-16 sm:px-6 lg:px-8">
        <AuthForm />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

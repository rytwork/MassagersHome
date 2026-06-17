import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  const message = encodeURIComponent("Hi MassagersHome, I want to book a home massage.");

  return (
    <a
      href={`https://wa.me/919457037015?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-xl shadow-green-900/25 transition hover:-translate-y-1 hover:bg-green-500"
    >
      <MessageCircle size={26} />
    </a>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { OfferPopup } from "@/components/OfferPopup";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MassagersHome | Premium Home Massage Service",
  description:
    "Book verified home massage services, pay securely online, and claim 2 free massages as a new user.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-stone-50 font-sans text-stone-950">
        {children}
        <OfferPopup />
      </body>
    </html>
  );
}

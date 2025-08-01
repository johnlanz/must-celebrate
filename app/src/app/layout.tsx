import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AIGenerateButton } from "@/components/layout/AIGenerateButton";
import TopNavBar from "@/components/layout/TopNavBar";

// Load Plus Jakarta Sans
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Must Celebrate",
  description: "Your Dream Event Starts Here",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} font-[var(--font-plus-jakarta)] antialiased`}>
        {/* ✅ Move TopNavBar here so it's always visible */}
        <TopNavBar />
        {children}
        <AIGenerateButton />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TravelAI — Personalized Dynamic Tour Planning",
  description: "Chat-to-itinerary: tell us where you want to go, get AI-curated places, and receive an optimized, bookable, dynamic itinerary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full w-full">{children}</body>
    </html>
  );
}
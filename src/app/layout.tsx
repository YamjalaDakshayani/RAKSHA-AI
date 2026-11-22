import type { Metadata, Viewport } from "next";
import "./globals.css";
import { APP_CONFIG } from "@/config/app";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccessibilityProvider } from "@/lib/accessibilityContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
  description: APP_CONFIG.subheadline,
  keywords: [
    "cybersecurity",
    "scam detector",
    "phishing detector",
    "fake internship scam",
    "fake scholarship scam",
    "link scanner",
    "QR scanner quishing",
    "password strength",
    "AI safety coach",
    "digital safety",
  ],
  authors: [{ name: "RAKSHA AI Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen flex flex-col bg-[#070B14] text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">
        <AccessibilityProvider>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </AccessibilityProvider>
      </body>
    </html>
  );
}

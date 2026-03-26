import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { FloatingParticlesBackground } from "../components/FloatingParticlesBackground";
import { SiteAtmosphere } from "../components/SiteAtmosphere";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OneBeauty | Salons, simplified",
  description:
    "Bookings, staff, and client history in one workspace for modern salons.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} min-h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-[var(--ob-hero-deep)] text-[var(--ob-text)]">
        <div className="relative z-10 min-h-screen">
          <SiteAtmosphere />
          <FloatingParticlesBackground />
          <div className="relative z-[2] min-h-screen">
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </div>
        </div>
      </body>
    </html>
  );
}

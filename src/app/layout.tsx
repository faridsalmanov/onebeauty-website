import {
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Inter,
} from "next/font/google";
import type { Viewport } from "next";
import { headers } from "next/headers";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { FloatingParticlesBackground } from "../components/FloatingParticlesBackground";
import { SiteAtmosphere } from "../components/SiteAtmosphere";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument-serif",
  style: ["normal", "italic"],
  display: "swap",
});

/**
 * AZ: `html.locale-az` remaps `--font-serif` → Cormorant below (hero emphasis,
 * showcase headline via `font-serif` / `[data-showcase-az-heading]`, etc.).
 * Pinned “problem” beat uses Inter for sans via `data-pinned-problem-az-latin`.
 */
const interAzLatin = Inter({
  weight: "variable",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-inter-az-latin",
  display: "swap",
});

const cormorantGaramondAzLatin = Cormorant_Garamond({
  weight: "variable",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-cormorant-garamond-az-latin",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

function normalizeLocaleHeader(value: string | null): string {
  if (value === "az" || value === "en" || value === "ru") {
    return value;
  }
  return "az";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const locale = normalizeLocaleHeader(h.get("x-next-intl-locale"));

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${interAzLatin.variable} ${cormorantGaramondAzLatin.variable} min-h-full scroll-smooth antialiased${locale === "az" ? " locale-az" : ""}`}
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

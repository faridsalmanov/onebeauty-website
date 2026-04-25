import {
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Inter,
} from "next/font/google";
import type { ReactElement, ReactNode } from "react";
import type { Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ConvexClientProvider } from "../ConvexClientProvider";
import { FloatingParticlesBackground } from "../../components/FloatingParticlesBackground";
import { SiteAtmosphere } from "../../components/SiteAtmosphere";
import { routing, type AppLocale } from "@/i18n/routing";
import "../globals.css";

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
 * registration title via `[data-register-az-title]`, etc.). App showcase frame
 * headline uses Geist Sans (`font-sans`).
 * Pinned “problem” block: Inter for wrapper copy via `data-pinned-problem-az-latin`;
 * problem title uses Geist Sans (`font-sans`).
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

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}): Promise<ReactElement> {
  const { locale } = await params;

  if (!routing.locales.includes(locale as AppLocale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages({ locale });

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
            <ConvexClientProvider>
              <NextIntlClientProvider locale={locale} messages={messages}>
                {children}
              </NextIntlClientProvider>
            </ConvexClientProvider>
          </div>
        </div>
      </body>
    </html>
  );
}

import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { headers } from "next/headers";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { FloatingParticlesBackground } from "../components/FloatingParticlesBackground";
import { SiteAtmosphere } from "../components/SiteAtmosphere";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument-serif",
  style: ["normal", "italic"],
  display: "swap",
});

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

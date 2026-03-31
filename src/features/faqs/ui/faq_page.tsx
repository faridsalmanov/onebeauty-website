import Link from "next/link";
import type { ReactElement } from "react";
import { LandingShell } from "@/components/landing/LandingShell";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { FAQ_ITEMS } from "../data/faq_items";
import { FaqAccordionItem } from "./faq_accordion_item";

export function FaqPage(): ReactElement {
  return (
    <LandingShell>
      <SiteHeader />
      <main className="relative z-[2] mx-auto w-full max-w-3xl px-4 pb-24 pt-28 md:px-6 md:pt-32">
        <header className="mb-12 text-center md:mb-16">
          <h1 className="font-sans text-5xl font-medium tracking-tighter text-[var(--ob-text)] sm:text-6xl md:text-7xl md:leading-[1.05]">
            FAQs
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed text-[var(--ob-text-soft)] md:text-lg">
            Straightforward answers about OneBeauty, the waitlist, and what we&apos;re building for salons
            and teams.
          </p>
        </header>

        <div className="flex flex-col gap-4" aria-label="Frequently asked questions">
          {FAQ_ITEMS.map((item) => (
            <FaqAccordionItem key={item.id} item={item} />
          ))}
        </div>

        <p className="mt-12 text-center font-sans text-sm text-[var(--ob-text-soft)]">
          Still unsure?{" "}
          <Link
            href="/#waitlist"
            className="font-semibold text-[#e8ecff] underline decoration-[rgba(232,236,255,0.35)] underline-offset-4 transition-colors hover:decoration-[rgba(232,236,255,0.7)]"
          >
            Join the waitlist
          </Link>{" "}
          and we&apos;ll follow up.
        </p>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="font-sans text-sm font-medium text-[var(--ob-text-faint)] transition-colors hover:text-[var(--ob-text-soft)]"
          >
            ← Back to home
          </Link>
        </p>
      </main>
      <SiteFooter />
    </LandingShell>
  );
}

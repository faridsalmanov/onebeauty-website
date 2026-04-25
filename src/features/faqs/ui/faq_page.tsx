import type { ReactElement } from "react";
import { LandingShell } from "@/components/landing/LandingShell";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { Link } from "@/i18n/navigation";
import type { FaqItem } from "../data/faq_items";
import { FaqAccordionItem } from "./faq_accordion_item";

type FaqPageProps = {
  title: string;
  subtitle: string;
  listAriaLabel: string;
  items: readonly FaqItem[];
  ctaPrefix: string;
  ctaLinkLabel: string;
  ctaSuffix: string;
  backHomeLabel: string;
};

export function FaqPage({
  title,
  subtitle,
  listAriaLabel,
  items,
  ctaPrefix,
  ctaLinkLabel,
  ctaSuffix,
  backHomeLabel,
}: FaqPageProps): ReactElement {
  return (
    <LandingShell>
      <SiteHeader />
      <main className="relative z-[2] mx-auto w-full max-w-3xl px-4 pb-24 pt-28 md:px-6 md:pt-32">
        <header className="mb-12 text-center md:mb-16">
          <h1 className="font-sans text-fluid-faq font-medium tracking-tighter text-[var(--ob-text)] leading-[1.05]">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed text-[var(--ob-text-soft)] md:text-lg">
            {subtitle}
          </p>
        </header>

        <div className="flex flex-col gap-4" aria-label={listAriaLabel}>
          {items.map((item) => (
            <FaqAccordionItem key={item.id} item={item} />
          ))}
        </div>

        <p className="mt-12 text-center font-sans text-sm text-[var(--ob-text-soft)]">
          {ctaPrefix}{" "}
          <Link
            href="/#waitlist"
            className="font-semibold text-[#e8ecff] underline decoration-[rgba(232,236,255,0.35)] underline-offset-4 transition-colors hover:decoration-[rgba(232,236,255,0.7)]"
          >
            {ctaLinkLabel}
          </Link>{" "}
          {ctaSuffix}
        </p>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="font-sans text-sm font-medium text-[var(--ob-text-faint)] transition-colors hover:text-[var(--ob-text-soft)]"
          >
            {backHomeLabel}
          </Link>
        </p>
      </main>
      <SiteFooter />
    </LandingShell>
  );
}

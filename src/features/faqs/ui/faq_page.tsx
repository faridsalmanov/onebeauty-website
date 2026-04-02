"use client";

import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { LandingShell } from "@/components/landing/LandingShell";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { Link } from "@/i18n/navigation";
import { FAQ_ITEM_IDS } from "../data/faq_items";
import { FaqAccordionItem } from "./faq_accordion_item";

export function FaqPage(): ReactElement {
  const t = useTranslations("faq");
  return (
    <LandingShell>
      <SiteHeader />
      <main className="relative z-[2] mx-auto w-full max-w-3xl px-4 pb-24 pt-28 md:px-6 md:pt-32">
        <header className="mb-12 text-center md:mb-16">
          <h1 className="font-sans text-fluid-faq font-medium tracking-tighter text-[var(--ob-text)] leading-[1.05]">
            {t("title")}
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed text-[var(--ob-text-soft)] md:text-lg">
            {t("subtitle")}
          </p>
        </header>

        <div className="flex flex-col gap-4" aria-label={t("aria.list")}>
          {FAQ_ITEM_IDS.map((id) => (
            <FaqAccordionItem
              key={id}
              item={{
                id,
                question: t(`items.${id}.q`),
                answer: t(`items.${id}.a`),
              }}
            />
          ))}
        </div>

        <p className="mt-12 text-center font-sans text-sm text-[var(--ob-text-soft)]">
          {t("cta.prefix")}{" "}
          <Link
            href="/#waitlist"
            className="font-semibold text-[#e8ecff] underline decoration-[rgba(232,236,255,0.35)] underline-offset-4 transition-colors hover:decoration-[rgba(232,236,255,0.7)]"
          >
            {t("cta.link")}
          </Link>{" "}
          {t("cta.suffix")}
        </p>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="font-sans text-sm font-medium text-[var(--ob-text-faint)] transition-colors hover:text-[var(--ob-text-soft)]"
          >
            {t("cta.backHome")}
          </Link>
        </p>
      </main>
      <SiteFooter />
    </LandingShell>
  );
}

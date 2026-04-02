"use client";

import { Instagram } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactElement, SVGProps } from "react";
import { LogoMark } from "./LogoMark";

function XMarkIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

type FooterColumnKey = "product" | "useCases" | "compare" | "resources" | "legal";

const FOOTER_COLUMN_KEYS: readonly FooterColumnKey[] = [
  "product",
  "useCases",
  "compare",
  "resources",
  "legal",
] as const;

const FOOTER_ITEM_KEYS: Record<FooterColumnKey, readonly string[]> = {
  product: ["pricing", "features", "changelog"],
  useCases: ["forSalons", "forTeams", "forIndependents"],
  compare: ["vsSpreadsheets", "vsPaper"],
  resources: ["faqs", "updates", "support"],
  legal: ["terms", "privacy"],
} as const;

function FooterLink({ children }: { children: string }): ReactElement {
  return (
    <span className="block text-sm text-[var(--ob-text-soft)] transition-colors hover:text-[var(--ob-text)]">
      {children}
    </span>
  );
}

export function SiteFooter(): ReactElement {
  const t = useTranslations("home.footer");
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[2] border-t border-[var(--ob-glass-border)] bg-transparent px-4 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] pt-16 text-[var(--ob-text)] sm:px-6 md:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="flex max-w-xs flex-col gap-5 tracking-[-0.04em]">
            <div className="flex items-center gap-2">
              <LogoMark />
              <span className="text-lg font-medium lowercase">onebeauty</span>
            </div>
            <div
              className="flex items-center gap-2 text-[var(--ob-text-soft)]"
              aria-label={t("socialAria")}
            >
              <span
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.06]"
                aria-hidden
              >
                <Instagram className="size-[18px] shrink-0" strokeWidth={1.5} aria-hidden />
              </span>
              <span
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.06]"
                aria-hidden
              >
                <XMarkIcon className="size-[15px] shrink-0" />
              </span>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {FOOTER_COLUMN_KEYS.map((columnKey) => (
              <div key={columnKey} className="min-w-0">
                <p className="mb-3 text-sm font-semibold text-[var(--ob-text)]">
                  {t(`columns.${columnKey}.title`)}
                </p>
                <ul className="flex flex-col gap-2.5" role="list">
                  {FOOTER_ITEM_KEYS[columnKey].map((itemKey) => (
                    <li key={itemKey}>
                      <FooterLink>{t(`columns.${columnKey}.items.${itemKey}`)}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-[var(--ob-glass-border)] pt-8">
          <p className="text-center text-sm text-[var(--ob-text-faint)]">
            {t("copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}

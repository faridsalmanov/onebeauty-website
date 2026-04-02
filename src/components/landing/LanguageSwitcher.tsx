"use client";

import { useLocale, useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { startTransition, useId } from "react";
import { routing, type AppLocale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALE_LABEL: Record<AppLocale, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU",
};

export function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}): ReactElement {
  const id = useId();
  const t = useTranslations("home.header.language");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        {t("srLabel")}
      </label>
      <select
        id={id}
        name="language"
        aria-label={t("label")}
        value={locale}
        onChange={(e): void => {
          const next = e.target.value as AppLocale;
          if (!routing.locales.includes(next)) {
            return;
          }
          startTransition((): void => {
            router.replace(pathname, { locale: next });
          });
        }}
        className="h-9 rounded-lg border border-white/15 bg-white/[0.06] px-2.5 text-xs font-semibold tracking-[0.14em] text-[var(--ob-text)] uppercase outline-none backdrop-blur-md transition-colors hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-sky-300/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} className="bg-[var(--ob-hero-mid)]">
            {LOCALE_LABEL[l]}
          </option>
        ))}
      </select>
    </div>
  );
}


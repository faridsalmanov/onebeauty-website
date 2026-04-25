"use client";

import { useReducedMotion } from "framer-motion";
import { Instagram } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactElement, SVGProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { LogoMark } from "./LogoMark";
import { scrollToRegisterForm } from "./scrollToRegisterForm";

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

const FOOTER_LINK_CLASS =
  "block w-fit text-sm text-[var(--ob-text-soft)] transition-colors hover:text-[var(--ob-text)]";

export function SiteFooter(): ReactElement {
  const t = useTranslations("home.footer");
  const tHeader = useTranslations("home.header");
  const pathname = usePathname();
  const reduceMotionPref = useReducedMotion();
  const reduceMotion = reduceMotionPref === true;
  const year = new Date().getFullYear();
  const isHome = pathname === "/";

  function scrollToWorkflow(): void {
    if (typeof window === "undefined") {
      return;
    }
    const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
    document.getElementById("workflow")?.scrollIntoView({
      behavior,
      block: "start",
    });
  }

  return (
    <footer className="relative z-[2] border-t border-[var(--ob-glass-border)] bg-transparent px-4 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] pt-16 text-[var(--ob-text)] sm:px-6 md:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-14">
          <div className="flex flex-col gap-5 tracking-[-0.04em] lg:col-span-5">
            <div className="flex items-center gap-2 overflow-visible">
              <LogoMark />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--ob-text-soft)]">
              {t("tagline")}
            </p>
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

          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7 lg:gap-6">
            <nav className="min-w-0" aria-label={t("explore.ariaLabel")}>
              <p className="mb-4 text-sm font-semibold text-[var(--ob-text)]">
                {t("explore.title")}
              </p>
              <ul className="flex flex-col gap-3" role="list">
                <li>
                  <Link href="/faqs" className={FOOTER_LINK_CLASS}>
                    {t("faqs")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#workflow"
                    className={FOOTER_LINK_CLASS}
                    onClick={(e): void => {
                      if (!isHome) {
                        return;
                      }
                      e.preventDefault();
                      scrollToWorkflow();
                    }}
                  >
                    {tHeader("nav.workflow")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#register-form"
                    className={FOOTER_LINK_CLASS}
                    onClick={(e): void => {
                      if (!isHome) {
                        return;
                      }
                      e.preventDefault();
                      scrollToRegisterForm(reduceMotion);
                    }}
                  >
                    {tHeader("cta")}
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="min-w-0">
              <p className="mb-4 text-sm font-semibold text-[var(--ob-text)]">
                {t("legal.title")}
              </p>
              <ul className="flex flex-col gap-3" role="list">
                <li>
                  <span className="block text-sm text-[var(--ob-text-soft)]">
                    {t("legal.items.terms")}
                  </span>
                </li>
                <li>
                  <span className="block text-sm text-[var(--ob-text-soft)]">
                    {t("legal.items.privacy")}
                  </span>
                </li>
              </ul>
            </div>
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

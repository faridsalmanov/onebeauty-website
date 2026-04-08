"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { FormEvent, ReactElement, ReactNode } from "react";
import { useState } from "react";
import { REGISTER_EMAIL_PREFILL_EVENT } from "./registerPrefillEvent";
import { scrollToRegisterForm } from "./scrollToRegisterForm";

/** Hero clip+fade — soft deceleration, reads smoother on short durations */
const HERO_REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
const CARD_BASE_DELAY = 1.2;

function isValidEmail(value: string): boolean {
  const t = value.trim();
  if (t.length === 0) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

type HeadlineKey = "the" | "allInOne" | "app" | "for";
const HEADLINE_LINE1_KEYS = ["the", "allInOne", "app", "for"] as const;

type HeadlineSegment =
  | { type: "line1"; key: HeadlineKey }
  | { type: "line2"; text: string };

/** Top-down clip + fade + slight rise (staggered on headline words). */
const HERO_REVEAL_INITIAL = {
  clipPath: "inset(0 0 100% 0)",
  opacity: 0,
  y: 10,
} as const;
const HERO_REVEAL_ANIMATE = {
  clipPath: "inset(0 0 0% 0)",
  opacity: 1,
  y: 0,
} as const;

/** Italic serif overshoots the clip box — clip-path would slice glyphs (e.g. “one”). */
const HERO_REVEAL_INITIAL_FADE_UP = {
  opacity: 0,
  y: 10,
} as const;
const HERO_REVEAL_ANIMATE_FADE_UP = {
  opacity: 1,
  y: 0,
} as const;

const HERO_HEADLINE_BASE_DELAY = 0.06;
const HERO_HEADLINE_STAGGER = 0.024;
const HERO_HEADLINE_WORD_DURATION = 0.24;
const HERO_BODY_DELAY = 0.34;
const HERO_BODY_DURATION = 0.22;
const HERO_WAITLIST_DELAY = 0.5;
const HERO_WAITLIST_DURATION = 0.22;

function heroRevealTransition(
  reduceMotion: boolean,
  delay: number,
  duration: number,
):
  | { duration: number }
  | {
      duration: number;
      ease: readonly [number, number, number, number];
      delay: number;
    } {
  if (reduceMotion) {
    return { duration: 0 };
  }
  return { duration, ease: HERO_REVEAL_EASE, delay };
}

/* ------------------------------------------------------------------ */
/*  Workflow cards — solid gradient shells + accent (not glass)        */
/* ------------------------------------------------------------------ */

type WorkflowCardHeightTier = "tall" | "mid" | "short";
const WORKFLOW_TIER_MIN_H: Record<WorkflowCardHeightTier, string> = {
  tall: "min-h-[17.75rem] sm:min-h-[18.5rem]",
  mid: "min-h-[13.75rem] sm:min-h-[14.25rem]",
  short: "min-h-[10.75rem] sm:min-h-[11.25rem]",
};

/** One restrained shell for all cards — premium, not rainbow */
const WORKFLOW_PREMIUM_SHELL =
  "border-white/[0.09] shadow-[0_24px_56px_-28px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.07)]";
const WORKFLOW_PREMIUM_SHEEN =
  "from-white/[0.045] via-transparent to-[#1a1f2e]/40";

function WorkflowCardPanel({
  children,
  className = "",
  delay = 0,
  heightTier,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  heightTier: WorkflowCardHeightTier;
}): ReactElement {
  const tierMinH = WORKFLOW_TIER_MIN_H[heightTier];

  return (
    <motion.div
      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-[#070b14] p-[1.125rem] sm:p-5 ${WORKFLOW_PREMIUM_SHELL} ${tierMinH} ${className}`}
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: CARD_BASE_DELAY + delay,
        duration: 0.7,
        ease: [0.25, 1, 0.5, 1],
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#151d32] via-[#0e1526] to-[#060a12]"
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${WORKFLOW_PREMIUM_SHEEN}`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-start">
        {children}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Individual card content                                            */
/* ------------------------------------------------------------------ */

function BookingCard({
  heightTier,
  delay = 0,
}: {
  heightTier: WorkflowCardHeightTier;
  delay?: number;
}): ReactElement {
  const t = useTranslations("home.hero.cards");
  return (
    <WorkflowCardPanel
      className="w-full"
      delay={delay}
      heightTier={heightTier}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-sky-500/[0.08] ring-1 ring-sky-400/20">
          <Calendar className="size-4 text-sky-300/90" strokeWidth={1.75} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t("nextBookingLabel")}
        </span>
      </div>
      <p className="font-sans text-sm font-semibold tracking-tight text-slate-100">
        {t("nextBookingService")}
      </p>
      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <Clock className="size-3.5 shrink-0 text-sky-400/75" />
        <span>{t("nextBookingTime")}</span>
      </div>
      <div className="mt-auto flex items-center gap-2.5 pt-4">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500/80 to-indigo-700/90 ring-1 ring-white/15" />
        <span className="text-xs font-medium text-slate-300">
          {t("nextBookingClient")}
        </span>
      </div>
    </WorkflowCardPanel>
  );
}

function RevenueCard({
  heightTier,
  delay = 0,
}: {
  heightTier: WorkflowCardHeightTier;
  delay?: number;
}): ReactElement {
  const t = useTranslations("home.hero.cards");
  return (
    <WorkflowCardPanel
      className="w-full"
      delay={delay}
      heightTier={heightTier}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {t("thisWeekLabel")}
      </span>
      <p className="mt-1 font-sans text-3xl font-semibold tracking-tight text-slate-50 tabular-nums">
        ₼2.4K
      </p>
      <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-emerald-500/15 bg-emerald-500/[0.06] px-2.5 py-1.5 text-xs font-medium">
        <TrendingUp className="size-3.5 shrink-0 text-emerald-400/85" strokeWidth={2} />
        <span className="text-emerald-200/85">{t("revenueDelta")}</span>
      </div>
      <div className="mt-auto flex items-end gap-1.5 pt-4">
        {[40, 55, 35, 70, 60, 80, 65].map((h, i) => (
          <div
            key={i}
            className="w-[14px] rounded-sm bg-gradient-to-t from-emerald-900/80 via-emerald-600/70 to-teal-400/55"
            style={{ height: `${h * 0.48}px` }}
          />
        ))}
      </div>
    </WorkflowCardPanel>
  );
}

function StylistCard({
  heightTier,
  delay = 0,
}: {
  heightTier: WorkflowCardHeightTier;
  delay?: number;
}): ReactElement {
  const t = useTranslations("home.hero.cards");
  return (
    <WorkflowCardPanel
      className="w-full"
      delay={delay}
      heightTier={heightTier}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/[0.1]">
          <Trophy className="size-4 text-slate-300" strokeWidth={1.75} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t("topStylistLabel")}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="size-11 shrink-0 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-700 shadow-[0_4px_18px_-4px_rgba(45,212,191,0.38)] ring-2 ring-cyan-200/30" />
        <div className="min-w-0">
          <p className="font-sans text-sm font-semibold text-slate-100">Nigar A.</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs font-medium text-slate-500">
            <Star className="size-3.5 fill-slate-500 text-slate-500" />
            <span className="text-slate-400">4.9</span>
            <span className="text-slate-600">{t("reviewsMeta")}</span>
          </div>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
        {(["color", "bridal", "keratin"] as const).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium text-slate-500"
          >
            {t(`tags.${tag}`)}
          </span>
        ))}
      </div>
    </WorkflowCardPanel>
  );
}

function ScheduleCard({
  heightTier,
  delay = 0,
}: {
  heightTier: WorkflowCardHeightTier;
  delay?: number;
}): ReactElement {
  const t = useTranslations("home.hero.cards");
  const slots = [
    { key: "slot1", active: false },
    { key: "slot2", active: true },
    { key: "slot3", active: false },
  ];

  return (
    <WorkflowCardPanel
      className="w-full"
      delay={delay}
      heightTier={heightTier}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t("todayScheduleLabel")}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {slots.map((slot) => (
          <div
            key={slot.key}
            className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 ${slot.active ? "bg-emerald-500/[0.07] ring-1 ring-emerald-400/25" : "bg-black/25 ring-1 ring-white/[0.05]"}`}
          >
            <span
              className={`w-10 shrink-0 font-mono text-[11px] font-medium ${slot.active ? "text-emerald-200/80" : "text-slate-500"}`}
            >
              {t(`slots.${slot.key}.time`)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-100">
                {t(`slots.${slot.key}.client`)}
              </p>
              <p className="truncate text-[10px] font-medium text-slate-500">
                {t(`slots.${slot.key}.service`)}
              </p>
            </div>
            {slot.active && (
              <span
                className="size-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.35)] ring-1 ring-emerald-200/40"
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>
    </WorkflowCardPanel>
  );
}

function ReviewCard({
  heightTier,
  delay = 0,
}: {
  heightTier: WorkflowCardHeightTier;
  delay?: number;
}): ReactElement {
  const t = useTranslations("home.hero.cards");
  return (
    <WorkflowCardPanel
      className="w-full"
      delay={delay}
      heightTier={heightTier}
    >
      <div className="mb-2.5 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="size-3.5 fill-amber-400/75 text-amber-400/75"
          />
        ))}
      </div>
      <p className="rounded-lg border border-white/[0.07] bg-white/[0.04] px-3 py-2.5 font-sans text-xs font-medium leading-relaxed text-slate-300">
        {t("reviewQuote")}
      </p>
      <div className="mt-auto flex items-center gap-2.5 pt-4">
        <div className="size-8 rounded-full bg-gradient-to-br from-rose-500/85 to-pink-900/90 ring-1 ring-rose-300/20" />
        <div>
          <p className="text-xs font-semibold text-slate-200">{t("reviewName")}</p>
          <p className="text-[10px] font-medium text-slate-500">{t("reviewRole")}</p>
        </div>
      </div>
    </WorkflowCardPanel>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero section                                                       */
/* ------------------------------------------------------------------ */

const HEADLINE_TEXT =
  "font-medium tracking-tighter text-[var(--ob-text)] text-[clamp(0.95rem,5.9vw,2.35rem)] sm:text-fluid-hero";

/**
 * RU: slightly under default `text-fluid-hero` max (5.75rem) so the five-word nowrap
 * line still fits on typical laptop widths; larger than the first RU pass.
 */
const HEADLINE_TEXT_RU =
  "font-medium tracking-tighter text-[var(--ob-text)] text-[clamp(0.93rem,5.5vw,2.32rem)] sm:text-[clamp(1.6rem,calc(1.08rem+3.65vw),4.4rem)] xl:text-[clamp(1.7rem,calc(1rem+3.25vw),4.95rem)]";

const HEADLINE_ROW_CLASS = `flex flex-wrap items-baseline justify-center gap-x-[0.14em] gap-y-[0.08em] sm:flex-nowrap sm:gap-x-[0.25em] sm:gap-y-0 ${HEADLINE_TEXT}`;

const HEADLINE_ROW_CLASS_RU = `flex flex-wrap items-baseline justify-center gap-x-[0.13em] gap-y-[0.08em] sm:flex-nowrap sm:gap-x-[0.22em] sm:gap-y-0 ${HEADLINE_TEXT_RU}`;

/** Glow + italic serif; relative `em` scales sit on the headline row’s `font-size`. */
const HEADLINE_EMPHASIS_GLOW_CORE =
  "inline-block shrink-0 font-semibold italic text-[#eceef8] [text-shadow:0_0_8px_rgba(255,255,255,0.55),0_0_28px_rgba(255,255,255,0.35),0_0_52px_rgba(255,255,255,0.12),0_0_22px_rgba(186,170,255,0.09),0_0_44px_rgba(186,170,255,0.045)]";

const HEADLINE_EMPHASIS_SCALE_DEFAULT = "text-[1.04em] sm:text-[1.05em]";

/** RU `приложения`: Instrument Serif reads smaller than Geist on Cyrillic — nudge up to match siblings. */
const HEADLINE_EMPHASIS_SCALE_RU_LINE2 = "text-[1.12em] sm:text-[1.14em]";

function buildHeadlineSegments(
  line2Trimmed: string,
  locale: string,
): readonly HeadlineSegment[] {
  const line1: HeadlineSegment[] = HEADLINE_LINE1_KEYS.map((key) => ({
    type: "line1",
    key,
  }));
  if (line2Trimmed === "") {
    return line1;
  }
  /* English: place emphasized line2 in the middle (after first two words). */
  if (locale === "en") {
    return [
      line1[0]!,
      line1[1]!,
      { type: "line2", text: line2Trimmed },
      line1[2]!,
      line1[3]!,
    ];
  }
  return [...line1, { type: "line2", text: line2Trimmed }];
}

export function HeroSection(): ReactElement {
  const locale = useLocale();
  const t = useTranslations("home.hero");
  const headlineLine2Trimmed = t("headline.line2").trim();
  /** Empty line2: one headline row; emphasize `allInOne` (same pattern as AZ). */
  const heroSingleLineHeadline = headlineLine2Trimmed === "";
  const [email, setEmail] = useState("");
  const reduceMotionPref = useReducedMotion();
  const reduceMotion = reduceMotionPref === true;

  function focusRegisterEmailField(): void {
    window.setTimeout(() => {
      document.getElementById("email")?.focus({ preventScroll: true });
    }, reduceMotion ? 0 : 640);
  }

  function handleWaitlistSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      return;
    }
    window.dispatchEvent(
      new CustomEvent(REGISTER_EMAIL_PREFILL_EVENT, {
        detail: { email: trimmed },
      }),
    );
    scrollToRegisterForm(reduceMotion);
    focusRegisterEmailField();
  }

  function handleQuickAccessClick(): void {
    scrollToRegisterForm(reduceMotion);
    focusRegisterEmailField();
  }

  return (
    <section
      data-landing-hero
      className="relative z-0 flex min-h-[100svh] flex-col overflow-visible tracking-[-0.04em] md:min-h-[100dvh]"
    >
      {/* Headline + CTA — flex-1 keeps vertical balance; cards sit below in flow (no overlap) */}
      <div
        {...(locale === "az" ? { "data-hero-az-typography": "" } : {})}
        className="relative z-20 flex flex-col items-center justify-start px-4 pt-10 pb-3 md:z-10 md:flex-1 md:justify-center md:px-10 md:pt-14 md:pb-5 lg:px-14 xl:px-16"
      >
        <div
          {...(locale === "az" ? { "data-hero-az-headline": "" } : {})}
          className="mb-5 w-full max-w-[min(100%,88rem)] text-center md:mb-6"
        >
          <div className="flex min-w-0 justify-center">
            <div
              className={
                locale === "ru" ? HEADLINE_ROW_CLASS_RU : HEADLINE_ROW_CLASS
              }
            >
              {buildHeadlineSegments(headlineLine2Trimmed, locale).map(
                (seg, index) => {
                  const emphasized =
                    seg.type === "line2" ||
                    (heroSingleLineHeadline &&
                      seg.type === "line1" &&
                      ((locale === "az" && seg.key === "allInOne") ||
                        (locale === "en" && seg.key === "for")));
                  const motionKey =
                    seg.type === "line1" ? seg.key : `line2-${seg.text}`;
                  const emphasisScaleClass =
                    emphasized &&
                    locale === "ru" &&
                    seg.type === "line2"
                      ? HEADLINE_EMPHASIS_SCALE_RU_LINE2
                      : HEADLINE_EMPHASIS_SCALE_DEFAULT;
                  return (
                    <motion.span
                      key={motionKey}
                      {...(locale === "az" && emphasized
                        ? { "data-hero-az-emphasis-serif": "" }
                        : {})}
                      className={
                        emphasized
                          ? `${HEADLINE_EMPHASIS_GLOW_CORE} ${emphasisScaleClass}${locale === "az" ? "" : " font-serif"}`
                          : "inline-block shrink-0"
                      }
                      initial={
                        reduceMotion
                          ? false
                          : emphasized
                            ? HERO_REVEAL_INITIAL_FADE_UP
                            : HERO_REVEAL_INITIAL
                      }
                      animate={
                        emphasized
                          ? HERO_REVEAL_ANIMATE_FADE_UP
                          : HERO_REVEAL_ANIMATE
                      }
                      transition={heroRevealTransition(
                        reduceMotion,
                        HERO_HEADLINE_BASE_DELAY +
                          HERO_HEADLINE_STAGGER * index,
                        HERO_HEADLINE_WORD_DURATION,
                      )}
                    >
                      {seg.type === "line1"
                        ? t(`headline.line1.${seg.key}`)
                        : seg.text}
                    </motion.span>
                  );
                },
              )}
            </div>
          </div>
        </div>

        <motion.div
          className="mx-auto mb-7 max-w-[42rem] px-1 sm:mb-8 md:mb-10 md:max-w-3xl"
          initial={reduceMotion ? false : HERO_REVEAL_INITIAL}
          animate={HERO_REVEAL_ANIMATE}
          transition={heroRevealTransition(
            reduceMotion,
            HERO_BODY_DELAY,
            HERO_BODY_DURATION,
          )}
        >
          <p className="text-center font-sans text-[clamp(0.95rem,3.7vw,1.125rem)] leading-relaxed text-[var(--ob-text-soft)] sm:text-base md:text-lg">
            {t("subline")}
          </p>
        </motion.div>

        <div className="relative z-40 flex w-full max-w-md flex-col items-center lg:max-w-lg">
          <motion.div
            className="relative z-30 w-full shrink-0"
            initial={reduceMotion ? false : HERO_REVEAL_INITIAL}
            animate={HERO_REVEAL_ANIMATE}
            transition={heroRevealTransition(
              reduceMotion,
              HERO_WAITLIST_DELAY,
              HERO_WAITLIST_DURATION,
            )}
          >
            <button
              type="button"
              onClick={handleQuickAccessClick}
              className="group relative z-[2] flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[var(--ob-cta-bg)] px-5 font-sans text-[clamp(0.92rem,3.8vw,1rem)] font-semibold text-[var(--ob-cta-text)] shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] transition-all duration-200 hover:bg-[var(--ob-cta-bg)]/90 hover:shadow-[0_0_32px_rgba(34,42,53,0.1),0_4px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(34,42,53,0.06),0_16px_68px_rgba(47,48,55,0.08)] active:bg-[var(--ob-cta-bg)]/85 sm:hidden"
              aria-controls="register-form"
            >
              <span>{t("cta")}</span>
              <ArrowRight
                className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </button>

            <form
              id="waitlist"
              className="relative hidden w-full scroll-mt-28 sm:block"
              onSubmit={handleWaitlistSubmit}
            >
              <div className="group relative flex min-h-[4.25rem] flex-row gap-0 rounded-xl border border-white/[0.16] bg-white/[0.13] p-0 py-3 pl-5 pr-[9.25rem] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md transition-[background-color,box-shadow,backdrop-filter,border-color] duration-200 focus-within:border-white/[0.48] focus-within:bg-white/[0.58] focus-within:shadow-[0_22px_64px_-18px_rgba(0,0,0,0.42),0_0_0_1px_rgba(255,255,255,0.35)_inset] focus-within:backdrop-blur-2xl focus-within:outline-none">
                <label className="sr-only" htmlFor="hero-email">
                  {t("email.label")}
                </label>
                <input
                  id="hero-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={t("email.placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative z-[1] min-h-0 w-auto min-w-0 bg-transparent px-0 font-sans text-base font-medium leading-normal text-[var(--ob-text)] outline-none transition-colors duration-200 ease-out placeholder:font-normal placeholder:text-[rgba(244,246,251,0.62)] caret-[#020617] group-focus-within:text-[#020617] group-focus-within:placeholder:text-[#334155] group-focus-within:placeholder:opacity-100 sm:absolute sm:inset-y-3 sm:left-5 sm:right-[9.25rem] md:text-[1.0625rem]"
                />
                <motion.button
                  type="submit"
                  className="relative z-[2] flex min-h-0 w-auto flex-row items-center justify-center gap-1 overflow-hidden rounded-xl bg-[var(--ob-cta-bg)] px-5 font-sans text-sm font-semibold text-[var(--ob-cta-text)] shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] transition-[opacity,transform,background-color,box-shadow] duration-200 hover:bg-[var(--ob-cta-bg)]/90 hover:shadow-[0_0_32px_rgba(34,42,53,0.1),0_4px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(34,42,53,0.06),0_16px_68px_rgba(47,48,55,0.08)] active:bg-[var(--ob-cta-bg)]/85 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-[0_0_24px_rgba(34,42,53,0.04),0_1px_1px_rgba(0,0,0,0.04),0_0_0_1px_rgba(34,42,53,0.03),0_16px_68px_rgba(47,48,55,0.04)] disabled:hover:bg-[var(--ob-cta-bg)] disabled:active:bg-[var(--ob-cta-bg)] disabled:active:text-[var(--ob-cta-text)] sm:absolute sm:bottom-1.5 sm:right-1.5 sm:top-1.5"
                  disabled={!isValidEmail(email)}
                  initial="initial"
                  whileHover="hover"
                  layout
                >
                  <motion.span
                    layout
                    variants={{
                      initial: { x: 0 },
                      hover: { x: -4 },
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {t("cta")}
                  </motion.span>
                  <motion.span
                    className="inline-flex overflow-hidden"
                    variants={{
                      initial: { opacity: 0, maxWidth: 0, x: -8 },
                      hover: { opacity: 1, maxWidth: 24, x: 0 },
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="size-4 shrink-0" aria-hidden />
                  </motion.span>
                </motion.button>
              </div>
              <p className="mt-3 max-w-md px-1 text-center font-sans text-[0.8125rem] leading-snug text-[var(--ob-text-soft)] sm:text-sm">
                {t("email.hint")}
              </p>
            </form>
            <p className="mt-3 px-1 text-center font-sans text-[0.75rem] leading-snug text-[var(--ob-text-soft)] sm:hidden">
              {t("email.hint")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Cards rail — all visible, shrink to fit, no scroll */}
      <div className="relative z-30 mt-0 w-full min-w-0 shrink-0 md:z-20 md:-mt-12 lg:-mt-14">
        {/* Mobile: 3 cards, all visible */}
        <div className="md:hidden" aria-hidden>
          <div className="relative overflow-hidden px-3 pb-3 sm:px-5">
            <div className="relative mx-auto h-[12.25rem] w-full max-w-[24.5rem] sm:h-[15.5rem] sm:max-w-[30.5rem]">
              <div className="absolute left-1/2 top-0 flex w-[36.25rem] -translate-x-1/2 scale-[0.66] origin-top items-stretch gap-3 sm:w-[37.5rem] sm:scale-[0.82]">
                <div className="w-[11.75rem] shrink-0"><ScheduleCard delay={0} heightTier="tall" /></div>
                <div className="w-[11.75rem] shrink-0"><BookingCard delay={0.08} heightTier="mid" /></div>
                <div className="w-[11.75rem] shrink-0"><ReviewCard delay={0.16} heightTier="tall" /></div>
              </div>
            </div>
          </div>
        </div>

        {/* md+: 5 cards, all visible, no scroll */}
        <div className="hidden md:block" aria-hidden>
          <div
            className="flex w-full items-end gap-3 px-6 pb-4 md:gap-4 md:px-8 lg:px-10 xl:px-12"
          >
            <div className="min-w-0 flex-1"><ScheduleCard delay={0} heightTier="tall" /></div>
            <div className="min-w-0 flex-1"><BookingCard delay={0.08} heightTier="mid" /></div>
            <div className="min-w-0 flex-1"><RevenueCard delay={0.16} heightTier="short" /></div>
            <div className="min-w-0 flex-1"><StylistCard delay={0.24} heightTier="mid" /></div>
            <div className="min-w-0 flex-1"><ReviewCard delay={0.32} heightTier="tall" /></div>
          </div>
        </div>
      </div>

      {/* Cream seam + navy scrub (below cards on mobile) */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[min(36%,12rem)] md:z-[25] md:h-[min(52%,24rem)]"
        aria-hidden
      >
        <div className="absolute inset-0 [background-image:var(--ob-seam-hero-to-showcase)]" />
        {/* Same stack as SiteAtmosphere + fixed attachment = pixels align with next section backdrop */}
        <div
          data-landing-hero-seam-atmosphere
          className="absolute inset-0 hidden opacity-0 will-change-[opacity] [background-image:var(--ob-site-atmosphere-bg)] [background-attachment:fixed] [background-repeat:no-repeat] md:block"
          aria-hidden
        />
      </div>

    </section>
  );
}

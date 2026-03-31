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

const HEADLINE_LINE1: { text: string; italic?: boolean }[] = [
  { text: "The" },
  { text: "all-in-one", italic: true },
  { text: "app" },
  { text: "for" },
];

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
  return (
    <WorkflowCardPanel
      className="w-[228px] sm:w-[240px]"
      delay={delay}
      heightTier={heightTier}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-sky-500/[0.08] ring-1 ring-sky-400/20">
          <Calendar className="size-4 text-sky-300/90" strokeWidth={1.75} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Next booking
        </span>
      </div>
      <p className="font-sans text-sm font-semibold tracking-tight text-slate-100">
        Balayage & Trim
      </p>
      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <Clock className="size-3.5 shrink-0 text-sky-400/75" />
        <span>Today, 2:30 PM</span>
      </div>
      <div className="mt-auto flex items-center gap-2.5 pt-4">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500/80 to-indigo-700/90 ring-1 ring-white/15" />
        <span className="text-xs font-medium text-slate-300">Aysel M.</span>
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
  return (
    <WorkflowCardPanel
      className="w-[200px] sm:w-[214px]"
      delay={delay}
      heightTier={heightTier}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        This week
      </span>
      <p className="mt-1 font-sans text-3xl font-semibold tracking-tight text-slate-50 tabular-nums">
        ₼2.4K
      </p>
      <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-emerald-500/15 bg-emerald-500/[0.06] px-2.5 py-1.5 text-xs font-medium">
        <TrendingUp className="size-3.5 shrink-0 text-emerald-400/85" strokeWidth={2} />
        <span className="text-emerald-200/85">+18% vs last week</span>
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
  return (
    <WorkflowCardPanel
      className="w-[228px] sm:w-[240px]"
      delay={delay}
      heightTier={heightTier}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/[0.1]">
          <Trophy className="size-4 text-slate-300" strokeWidth={1.75} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Top stylist
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="size-11 shrink-0 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-700 shadow-[0_4px_18px_-4px_rgba(45,212,191,0.38)] ring-2 ring-cyan-200/30" />
        <div className="min-w-0">
          <p className="font-sans text-sm font-semibold text-slate-100">Nigar A.</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs font-medium text-slate-500">
            <Star className="size-3.5 fill-slate-500 text-slate-500" />
            <span className="text-slate-400">4.9</span>
            <span className="text-slate-600">· 127 reviews</span>
          </div>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
        {(["Color", "Bridal", "Keratin"] as const).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium text-slate-500"
          >
            {tag}
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
  const slots = [
    { time: "10:00", client: "Leyla K.", service: "Blowout", active: false },
    { time: "11:30", client: "Gunel R.", service: "Highlights", active: true },
    { time: "13:00", client: "Sabina T.", service: "Manicure", active: false },
  ];

  return (
    <WorkflowCardPanel
      className="w-[248px] sm:w-[264px]"
      delay={delay}
      heightTier={heightTier}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Today&apos;s schedule
        </span>
        <span className="rounded-md border border-cyan-400/20 bg-cyan-500/[0.08] px-2 py-0.5 text-[10px] font-semibold tabular-nums text-cyan-100/85">
          3 of 8
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {slots.map((slot) => (
          <div
            key={slot.time}
            className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 ${slot.active ? "bg-emerald-500/[0.07] ring-1 ring-emerald-400/25" : "bg-black/25 ring-1 ring-white/[0.05]"}`}
          >
            <span
              className={`w-10 shrink-0 font-mono text-[11px] font-medium ${slot.active ? "text-emerald-200/80" : "text-slate-500"}`}
            >
              {slot.time}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-100">
                {slot.client}
              </p>
              <p className="truncate text-[10px] font-medium text-slate-500">
                {slot.service}
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
  return (
    <WorkflowCardPanel
      className="w-[248px] sm:w-[264px]"
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
        &ldquo;Finally an app that handles everything. My team switched from 3
        different tools.&rdquo;
      </p>
      <div className="mt-auto flex items-center gap-2.5 pt-4">
        <div className="size-8 rounded-full bg-gradient-to-br from-rose-500/85 to-pink-900/90 ring-1 ring-rose-300/20" />
        <div>
          <p className="text-xs font-semibold text-slate-200">Kamila S.</p>
          <p className="text-[10px] font-medium text-slate-500">Salon owner</p>
        </div>
      </div>
    </WorkflowCardPanel>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero section                                                       */
/* ------------------------------------------------------------------ */

const HEADLINE_TEXT =
  "text-4xl font-medium tracking-tighter text-[var(--ob-text)] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.35rem]";

export function HeroSection(): ReactElement {
  const [email, setEmail] = useState("");
  const reduceMotionPref = useReducedMotion();
  const reduceMotion = reduceMotionPref === true;

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
    window.setTimeout(() => {
      document.getElementById("email")?.focus({ preventScroll: true });
    }, reduceMotion ? 0 : 640);
  }

  return (
    <section className="relative z-30 flex min-h-[100dvh] flex-col overflow-hidden tracking-[-0.04em]">
      {/* Headline + CTA — flex-1 keeps vertical balance; cards sit below in flow (no overlap) */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-10 pb-4 md:px-10 md:pt-14 md:pb-5 lg:px-14 xl:px-16">
        <div className="mb-5 w-full max-w-[min(100%,88rem)] text-center md:mb-6">
          <div className="flex flex-col items-center gap-0.5 sm:gap-1 md:gap-1.5">
            <div
              className={`flex flex-wrap justify-center gap-x-[0.25em] gap-y-1 ${HEADLINE_TEXT}`}
            >
              {HEADLINE_LINE1.map((word, index) => {
                const isItalic = word.italic === true;
                return (
                  <motion.span
                    key={word.text}
                    className={
                      isItalic
                        ? "inline-block font-serif font-normal italic text-[#eceef8] [text-shadow:0_0_22px_rgba(186,170,255,0.09),0_0_44px_rgba(186,170,255,0.045)]"
                        : "inline-block"
                    }
                    initial={
                      reduceMotion
                        ? false
                        : isItalic
                          ? HERO_REVEAL_INITIAL_FADE_UP
                          : HERO_REVEAL_INITIAL
                    }
                    animate={
                      isItalic ? HERO_REVEAL_ANIMATE_FADE_UP : HERO_REVEAL_ANIMATE
                    }
                    transition={heroRevealTransition(
                      reduceMotion,
                      HERO_HEADLINE_BASE_DELAY +
                        HERO_HEADLINE_STAGGER * index,
                      HERO_HEADLINE_WORD_DURATION,
                    )}
                  >
                    {word.text}
                  </motion.span>
                );
              })}
            </div>
            <motion.span
              className={`block ${HEADLINE_TEXT}`}
              initial={reduceMotion ? false : HERO_REVEAL_INITIAL}
              animate={HERO_REVEAL_ANIMATE}
              transition={heroRevealTransition(
                reduceMotion,
                HERO_HEADLINE_BASE_DELAY +
                  HERO_HEADLINE_STAGGER * HEADLINE_LINE1.length,
                HERO_HEADLINE_WORD_DURATION,
              )}
            >
              salons
            </motion.span>
          </div>
        </div>

        <motion.div
          className="mx-auto mb-8 max-w-2xl md:mb-10 md:max-w-3xl"
          initial={reduceMotion ? false : HERO_REVEAL_INITIAL}
          animate={HERO_REVEAL_ANIMATE}
          transition={heroRevealTransition(
            reduceMotion,
            HERO_BODY_DELAY,
            HERO_BODY_DURATION,
          )}
        >
          <p className="text-center font-sans text-base leading-relaxed text-[var(--ob-text-soft)] md:text-lg">
            Bookings, staff, and client history in one workspace for modern
            salons.
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
            <form
              id="waitlist"
              className="relative w-full scroll-mt-28"
              onSubmit={handleWaitlistSubmit}
            >
              <div className="group relative min-h-[4.25rem] rounded-xl border-0 bg-[var(--ob-glass-bg)] py-3 pl-5 pr-[9.25rem] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md transition-[background-color,box-shadow,backdrop-filter] duration-200 focus-within:bg-white/[0.32] focus-within:shadow-[0_20px_56px_-16px_rgba(0,0,0,0.4)] focus-within:backdrop-blur-2xl focus-within:outline-none">
                <label className="sr-only" htmlFor="hero-email">
                  Enter email
                </label>
                {/* Absolute inset = only this rect receives clicks; avoids caret in padding / dead zones */}
                <input
                  id="hero-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="absolute inset-y-3 left-5 right-[9.25rem] z-[1] min-h-0 w-auto min-w-0 bg-transparent font-sans text-base leading-normal text-[var(--ob-text)] outline-none transition-colors duration-200 ease-out placeholder:text-[var(--ob-text-faint)] group-focus-within:text-[#0f172a] group-focus-within:placeholder:text-[#0f172a] group-focus-within:placeholder:opacity-100 md:text-[1.0625rem]"
                />
                <motion.button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 z-[2] flex flex-row items-center justify-center gap-1 overflow-hidden rounded-xl bg-[#b8d9f5] px-5 font-sans text-sm font-semibold text-[#0c2a4a] shadow-sm transition-[opacity,transform,background-color] duration-200 hover:bg-[#5a92c4] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-[#b8d9f5]"
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
                    Join waitlist
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
            </form>
          </motion.div>
        </div>
      </div>

      <div
        className="relative z-20 -mt-8 hidden w-full shrink-0 md:-mt-12 md:block lg:-mt-14"
        aria-hidden
      >
        <div className="mx-auto flex max-w-[90rem] items-end justify-center gap-3 px-4 pb-2 md:gap-4 md:px-6 lg:gap-5 xl:gap-6">
          <div className="shrink-0">
            <ScheduleCard delay={0} heightTier="tall" />
          </div>
          <div className="shrink-0">
            <BookingCard delay={0.08} heightTier="mid" />
          </div>
          <div className="shrink-0">
            <RevenueCard delay={0.16} heightTier="short" />
          </div>
          <div className="shrink-0">
            <StylistCard delay={0.24} heightTier="mid" />
          </div>
          <div className="shrink-0">
            <ReviewCard delay={0.32} heightTier="tall" />
          </div>
        </div>
      </div>

      {/* Fade cards into next section — matches pinned top wash via --ob-seam-* */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-[min(52%,24rem)] [background-image:var(--ob-seam-hero-to-showcase)]"
        aria-hidden
      />

      {/* Scroll hint — mobile only */}
      <motion.div
        className="absolute inset-x-0 bottom-6 z-40 flex justify-center md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.35, duration: 0.4 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium tracking-widest text-[var(--ob-text-faint)]">
            scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-[var(--ob-text-faint)]"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

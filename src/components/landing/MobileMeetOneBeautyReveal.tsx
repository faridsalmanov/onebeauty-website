"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { CalendarDays, ClipboardList, MessageSquare, Tag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { useRef } from "react";

/**
 * Scroll length of the outer section in `svh`. Increase for slower phases, decrease for snappier.
 * Spec target: ~180–220svh; default sits in the middle.
 */
const SECTION_SCROLL_SVH = 200;

/**
 * Phase breakpoints are fractions of scroll progress (0 → section enters, 1 → section leaves).
 * - problem → transition: problem copy holds, then fades / lifts while icons drift in.
 * - transition → solution: OneBeauty block fades/scales in; supporting line follows.
 *
 * To tune pacing: widen the gap between `problemFadeStart` and `meetFadeInStart` for more
 * “empty” transition, or tighten for a quicker handoff.
 */
const PHASE = {
  /** Icons begin drifting toward center and losing opacity */
  iconGatherStart: 0.26,
  /** Problem headline/body start fading (slight overlap with icon gather) */
  problemFadeStart: 0.3,
  /** Problem block fully gone */
  problemFadeEnd: 0.48,
  /** Meet eyebrow + brand begin appearing */
  meetFadeInStart: 0.5,
  /** Logo/wordmark mostly visible */
  meetBrandEnd: 0.68,
  /** Supporting line fully visible */
  meetBodyEnd: 0.82,
} as const;

/**
 * Global motion intensity (px for translates, scale delta). Lower = calmer, higher = more movement.
 */
const MOTION = {
  problemLiftPx: 14,
  meetRisePx: 18,
  meetScaleFrom: 0.96,
  /** Max icon drift toward center (px); kept small for a premium feel */
  iconDriftPx: 22,
} as const;

/** Floating “tool” cards — 4 icons; offsets from center in px (tweak for balance). */
const PROBLEM_ICONS: {
  id: string;
  Icon: LucideIcon;
  xPx: number;
  yPx: number;
}[] = [
  { id: "mob-cal", Icon: CalendarDays, xPx: -118, yPx: -92 },
  { id: "mob-chat", Icon: MessageSquare, xPx: 112, yPx: -80 },
  { id: "mob-tag", Icon: Tag, xPx: -108, yPx: 96 },
  { id: "mob-staff", Icon: ClipboardList, xPx: 104, yPx: 88 },
];

export function MobileMeetOneBeautyReveal(): ReactElement {
  const locale = useLocale();
  const t = useTranslations("home.pinned");
  const sectionRef = useRef<HTMLElement>(null);
  /** `null` until mounted — only skip animation when explicitly `true` */
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const p = scrollYProgress;

  const problemOpacity = useTransform(
    p,
    [0, PHASE.problemFadeStart, PHASE.problemFadeEnd, 1],
    [1, 1, 0, 0],
  );
  const problemY = useTransform(
    p,
    [0, PHASE.problemFadeStart, PHASE.problemFadeEnd],
    [0, 0, -MOTION.problemLiftPx],
  );
  /** Very light blur only mid-fade — omit when reduced motion */
  const problemBlur = useTransform(
    p,
    [PHASE.problemFadeStart, PHASE.problemFadeStart + 0.08, PHASE.problemFadeEnd - 0.06],
    ["blur(0px)", "blur(2.5px)", "blur(0px)"],
  );

  const meetEyebrowOpacity = useTransform(
    p,
    [PHASE.meetFadeInStart, PHASE.meetFadeInStart + 0.08],
    [0, 1],
  );
  const meetEyebrowY = useTransform(
    p,
    [PHASE.meetFadeInStart, PHASE.meetBrandEnd],
    [MOTION.meetRisePx * 0.6, 0],
  );

  const meetBrandOpacity = useTransform(
    p,
    [PHASE.meetFadeInStart + 0.04, PHASE.meetBrandEnd],
    [0, 1],
  );
  const meetBrandY = useTransform(
    p,
    [PHASE.meetFadeInStart + 0.04, PHASE.meetBrandEnd],
    [MOTION.meetRisePx, 0],
  );
  const meetBrandScale = useTransform(
    p,
    [PHASE.meetFadeInStart + 0.04, PHASE.meetBrandEnd],
    [MOTION.meetScaleFrom, 1],
  );

  const meetBodyOpacity = useTransform(
    p,
    [PHASE.meetBrandEnd - 0.04, PHASE.meetBodyEnd],
    [0, 1],
  );
  const meetBodyY = useTransform(
    p,
    [PHASE.meetBrandEnd - 0.02, PHASE.meetBodyEnd],
    [MOTION.meetRisePx * 0.75, 0],
  );

  if (reduceMotion === true) {
    return (
      <section
        className="relative w-full bg-transparent px-4 py-16"
        aria-label={t("ariaLabel")}
      >
        <div className="mx-auto flex min-h-[min(100svh,920px)] max-w-lg flex-col items-center justify-center text-center">
          <p className="font-sans text-sm font-medium tracking-[0.25em] text-[var(--ob-text-faint)] uppercase">
            {t("meetEyebrow")}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
            <span
              className="grid grid-cols-2 gap-1 rounded-xl border border-white/25 bg-white/[0.08] p-2.5"
              aria-hidden
            >
              <span className="size-2.5 rounded-md bg-white/95" />
              <span className="size-2.5 rounded-md bg-white/45" />
              <span className="size-2.5 rounded-md bg-white/45" />
              <span className="size-2.5 rounded-md bg-white/95" />
            </span>
            <span className="font-sans text-[clamp(2rem,9vw,3rem)] font-semibold tracking-tight text-[var(--ob-text)] lowercase">
              onebeauty
            </span>
          </div>
          <p className="mt-8 max-w-[24rem] font-sans text-base leading-relaxed text-[var(--ob-text-soft)]">
            {t("meetBody")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-transparent"
      style={{ height: `${SECTION_SCROLL_SVH}svh` }}
      aria-label={t("ariaLabel")}
    >
      {/*
        Sticky stage: one full viewport tall, pinned to top while the outer section scrolls.
        All scenes (problem → transition → solution) share this frame.
      */}
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden px-4">
        <div className="relative mx-auto w-full max-w-lg">
          {PROBLEM_ICONS.map((item) => (
            <ProblemIcon key={item.id} item={item} progress={p} />
          ))}

          <motion.div
            className="relative z-10 flex flex-col items-center text-center"
            style={{
              opacity: problemOpacity,
              y: problemY,
              filter: problemBlur,
            }}
          >
            <p className="font-sans text-xs font-medium tracking-[0.3em] text-[var(--ob-text-faint)] uppercase">
              {t("problemEyebrow")}
            </p>
            <h2
              {...(locale === "az" ? { "data-pinned-problem-az-display": "" } : {})}
              className={`mt-4 max-w-[12ch] text-[clamp(2rem,9vw,3rem)] font-semibold leading-tight tracking-tight text-[var(--ob-text)] ${
                locale === "az"
                  ? "font-sans"
                  : "font-serif"
              }`}
            >
              {t("problemTitle")}
            </h2>
            <p className="mt-5 max-w-[24rem] font-sans text-sm leading-relaxed text-[var(--ob-text-soft)]">
              {t("problemBody")}
            </p>
          </motion.div>

          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
            <motion.p
              className="font-sans text-sm font-medium tracking-[0.25em] text-[var(--ob-text-faint)] uppercase"
              style={{ opacity: meetEyebrowOpacity, y: meetEyebrowY }}
            >
              {t("meetEyebrow")}
            </motion.p>
            <motion.div
              className="mt-5 flex flex-wrap items-center justify-center gap-3"
              style={{
                opacity: meetBrandOpacity,
                y: meetBrandY,
                scale: meetBrandScale,
              }}
            >
              <span
                className="grid grid-cols-2 gap-1 rounded-xl border border-white/25 bg-white/[0.07] p-2.5 shadow-[0_0_32px_rgba(186,170,255,0.12)]"
                aria-hidden
              >
                <span className="size-2.5 rounded-md bg-white/95" />
                <span className="size-2.5 rounded-md bg-white/45" />
                <span className="size-2.5 rounded-md bg-white/45" />
                <span className="size-2.5 rounded-md bg-white/95" />
              </span>
              <span className="font-sans text-[clamp(2rem,9vw,3rem)] font-semibold tracking-tight text-[var(--ob-text)] lowercase">
                onebeauty
              </span>
            </motion.div>
            <motion.p
              className="mt-8 max-w-[24rem] px-1 font-sans text-base leading-relaxed text-[var(--ob-text-soft)]"
              style={{ opacity: meetBodyOpacity, y: meetBodyY }}
            >
              {t("meetBody")}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemIcon({
  item,
  progress,
}: {
  item: (typeof PROBLEM_ICONS)[number];
  progress: MotionValue<number>;
}): ReactElement {
  const { Icon } = item;
  const driftStart = PHASE.iconGatherStart;
  const driftEnd = PHASE.problemFadeEnd + 0.04;

  const opacity = useTransform(
    progress,
    [0, driftStart, PHASE.problemFadeEnd, PHASE.meetFadeInStart],
    [0.72, 0.72, 0.12, 0],
  );

  const driftRatio = MOTION.iconDriftPx / 120;
  const xDrift = useTransform(
    progress,
    [0, driftStart, driftEnd],
    [0, 0, -item.xPx * driftRatio],
  );
  const yDrift = useTransform(
    progress,
    [0, driftStart, driftEnd],
    [0, 0, -item.yPx * driftRatio],
  );

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-[15]"
      style={{
        transform: `translate(calc(-50% + ${String(item.xPx)}px), calc(-50% + ${String(item.yPx)}px))`,
      }}
    >
      <motion.div
        className="will-change-transform"
        style={{ x: xDrift, y: yDrift, opacity }}
      >
        <div className="flex size-[52px] items-center justify-center rounded-2xl border border-white/14 bg-white/[0.06] backdrop-blur-sm">
          <Icon
            className="size-[22px] text-[var(--ob-text)]/85"
            strokeWidth={1.2}
          />
        </div>
      </motion.div>
    </div>
  );
}

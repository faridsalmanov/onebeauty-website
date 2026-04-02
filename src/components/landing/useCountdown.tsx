"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ZERO_TIME_LEFT: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

function splitTotalSeconds(totalSeconds: number): TimeLeft {
  if (totalSeconds <= 0) return ZERO_TIME_LEFT;
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/**
 * Client-only ticking after mount so the first paint matches SSR (zeros) and
 * avoids hydration mismatches from `Date.now()` on the initial client render.
 */
export function useCountdown(targetDate: Date): TimeLeft {
  const targetMs = targetDate.getTime();
  const [totalSecondsRemaining, setTotalSecondsRemaining] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const tick = (): void => {
      const diff = targetMs - Date.now();
      setTotalSecondsRemaining(diff <= 0 ? 0 : Math.floor(diff / 1000));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return (): void => window.clearInterval(id);
  }, [targetMs]);

  if (totalSecondsRemaining === null) {
    return ZERO_TIME_LEFT;
  }

  return splitTotalSeconds(totalSecondsRemaining);
}

export function useDeadline(daysFromNow: number): Date {
  return useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d;
  }, [daysFromNow]);
}

const CALENDAR_SLIDE_EASE = [0.32, 0.72, 0, 1] as const;
const CALENDAR_DURATION = 0.42;

export function CountdownDigit({
  value,
  label,
  reduceMotion,
  compact = false,
}: {
  value: number;
  label: string;
  reduceMotion: boolean | null;
  compact?: boolean;
}): ReactElement {
  const sizeClass = compact
    ? "h-14 w-14 text-xl sm:h-16 sm:w-16 sm:text-2xl"
    : "h-[4.5rem] w-[4.5rem] text-[2rem] sm:h-20 sm:w-20 sm:text-[2.25rem] md:h-[5.5rem] md:w-[5.5rem] md:text-[2.5rem]";

  const display = String(value).padStart(2, "0");
  const instant = Boolean(reduceMotion);
  const transition = instant
    ? { duration: 0 }
    : { duration: CALENDAR_DURATION, ease: CALENDAR_SLIDE_EASE };

  return (
    <div className="group flex flex-col items-center gap-3">
      <div className="relative">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-[rgba(186,170,255,0.15)] to-transparent opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
        <div
          className={`relative overflow-hidden rounded-2xl border border-[var(--ob-glass-border)] bg-[rgba(255,255,255,0.06)] font-sans font-bold tabular-nums tracking-tight text-[var(--ob-text)] shadow-[0_8px_32px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur-lg ${sizeClass}`}
        >
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={display}
              className="absolute inset-0 flex items-center justify-center"
              initial={instant ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={instant ? false : { y: "-100%" }}
              transition={transition}
            >
              {display}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <span className="font-sans text-[0.65rem] font-semibold tracking-[0.25em] text-[var(--ob-text-faint)] uppercase">
        {label}
      </span>
    </div>
  );
}

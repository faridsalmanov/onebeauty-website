"use client";

import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { useMemo, useSyncExternalStore } from "react";

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
 * Uses `useSyncExternalStore` with a numeric snapshot so SSR/hydration match
 * (`getServerSnapshot` → 0) and `getSnapshot` stays referentially stable within
 * each second (avoids `Date.now()` / timezone mismatches vs plain `useState`).
 */
export function useCountdown(targetDate: Date): TimeLeft {
  const targetMs = targetDate.getTime();

  const totalSecondsRemaining = useSyncExternalStore(
    (onStoreChange) => {
      const id = setInterval(onStoreChange, 1000);
      return () => clearInterval(id);
    },
    () => {
      const diff = targetMs - Date.now();
      return diff <= 0 ? 0 : Math.floor(diff / 1000);
    },
    () => 0,
  );

  return splitTotalSeconds(totalSecondsRemaining);
}

export const DIGIT_LABELS = ["Days", "Hours", "Min", "Sec"] as const;

export function useDeadline(daysFromNow: number): Date {
  return useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d;
  }, [daysFromNow]);
}

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

  return (
    <div className="group flex flex-col items-center gap-3">
      <div className="relative">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-[rgba(186,170,255,0.15)] to-transparent opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
        <motion.div
          className={`relative flex items-center justify-center rounded-2xl border border-[var(--ob-glass-border)] bg-[rgba(255,255,255,0.06)] font-sans font-bold tabular-nums tracking-tight text-[var(--ob-text)] shadow-[0_8px_32px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur-lg ${sizeClass}`}
          key={value}
          initial={
            reduceMotion || value === 0
              ? false
              : { y: -6, opacity: 0.6, scale: 1.04 }
          }
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {String(value).padStart(2, "0")}
        </motion.div>
      </div>
      <span className="font-sans text-[0.65rem] font-semibold tracking-[0.25em] text-[var(--ob-text-faint)] uppercase">
        {label}
      </span>
    </div>
  );
}

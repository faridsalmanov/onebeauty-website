"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { useState } from "react";

const HEADLINE_EASE = [0.25, 1, 0.5, 1] as const;

function isValidEmail(value: string): boolean {
  const t = value.trim();
  if (t.length === 0) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

/** Line 1 + line 2 (Sovian-style: last word on its own line). */
const HEADLINE_LINE1: { text: string; italic?: boolean }[] = [
  { text: "The" },
  { text: "all-in-one", italic: true },
  { text: "app" },
  { text: "for" },
];

function RevealBlur({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}): ReactElement {
  return (
    <motion.div
      className={className}
      initial={{ y: 8, opacity: 1, filter: "blur(0px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{
        delay: 0.04 + delay,
        duration: 0.4,
        ease: HEADLINE_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

export function HeroSection(): ReactElement {
  const [email, setEmail] = useState("");

  return (
    <section className="relative z-30 min-h-screen overflow-x-hidden tracking-[-0.04em]">
      <div className="flex min-h-screen flex-col">
        {/* Sovian-style: full-width headline band + centered CTA; flex-1 fills viewport */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-6 pt-10 md:px-10 md:pb-8 md:pt-14 lg:px-14 xl:px-16">
          {/* Full-width headline (not max-w-md) */}
          <div className="mb-5 w-full max-w-[min(100%,88rem)] text-center md:mb-6">
            <div className="flex flex-col items-center gap-0.5 sm:gap-1 md:gap-1.5">
              <div className="flex flex-wrap justify-center gap-x-[0.25em] gap-y-1 text-5xl font-medium tracking-tighter text-[var(--ob-text)] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem]">
                {HEADLINE_LINE1.map((word, index) => (
                  <motion.span
                    key={word.text}
                    className={
                      word.italic
                        ? "inline-block font-serif font-normal italic text-[#e8ecff] drop-shadow-[0_0_28px_rgba(186,170,255,0.4)]"
                        : "inline-block"
                    }
                    initial={{ y: 12, opacity: 1, filter: "blur(0px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{
                      delay: 0.45 + 0.08 * index,
                      duration: 0.5,
                      ease: HEADLINE_EASE,
                    }}
                  >
                    {word.text}
                  </motion.span>
                ))}
              </div>
              <motion.span
                className="block text-5xl font-medium tracking-tighter text-[var(--ob-text)] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem]"
                initial={{ y: 12, opacity: 1, filter: "blur(0px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{
                  delay: 0.45 + 0.08 * HEADLINE_LINE1.length,
                  duration: 0.5,
                  ease: HEADLINE_EASE,
                }}
              >
                salons
              </motion.span>
            </div>
          </div>

          <RevealBlur delay={0.9}>
            <p className="mx-auto mb-8 max-w-2xl text-center font-sans text-base leading-relaxed text-[var(--ob-text-soft)] md:mb-10 md:max-w-3xl md:text-lg">
              Built with salon managers before we launch. One workspace for
              bookings, staff, and clients — join the waitlist for updates and
              early access.
            </p>
          </RevealBlur>

          <div className="relative z-40 flex w-full max-w-md flex-col items-center lg:max-w-lg">
            <RevealBlur delay={1.05} className="relative z-30 w-full">
              <form
                id="waitlist"
                className="relative w-full scroll-mt-28"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="group relative flex items-center rounded-xl border border-[var(--ob-glass-border)] bg-[var(--ob-glass-bg)] py-3 pl-5 pr-[9.25rem] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_80px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-200 focus-within:border-white/25 focus-within:bg-[#f4f7fb] focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_20px_50px_-20px_rgba(0,0,0,0.35)] focus-within:ring-2 focus-within:ring-[var(--ob-primary)]/25 focus-within:ring-offset-0 focus-within:outline-none">
                  <label className="sr-only" htmlFor="hero-email">
                    Email
                  </label>
                  <input
                    id="hero-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Work email…"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 w-full min-w-0 bg-transparent font-sans text-sm text-[var(--ob-text)] outline-none placeholder:text-[var(--ob-text-faint)] group-focus-within:text-[#0f172a] group-focus-within:placeholder:text-slate-400"
                  />
                  <motion.button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 flex flex-row items-center justify-center gap-1 overflow-hidden rounded-xl bg-[#b8d9f5] px-5 font-sans text-sm font-semibold text-[#0c2a4a] shadow-sm transition-[opacity,transform,background-color] duration-200 hover:bg-[#a8cef0] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-[#b8d9f5]"
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
            </RevealBlur>
          </div>
        </div>

        <motion.div
          className="relative z-40 flex shrink-0 justify-center pb-8 pt-2"
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
      </div>
    </section>
  );
}

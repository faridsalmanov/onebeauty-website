"use client";

import { useReducedMotion } from "framer-motion";
import { Menu } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { LogoMark } from "./LogoMark";
import { scrollToRegisterForm } from "./scrollToRegisterForm";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "FAQs", href: "/faqs" },
  { label: "For salons", href: "#" },
  { label: "Pricing", href: "#" },
];

const SCROLL_SHRINK_PX = 56;

/** Viewport scroll position (uses the real scrolling element). */
function readViewportScrollY(): number {
  if (typeof window === "undefined") {
    return 0;
  }
  const se = document.scrollingElement;
  if (se != null) {
    return se.scrollTop;
  }
  return (
    window.scrollY ??
    window.pageYOffset ??
    document.documentElement.scrollTop ??
    document.body.scrollTop ??
    0
  );
}

function isScrolledPastThreshold(): boolean {
  return readViewportScrollY() > SCROLL_SHRINK_PX;
}

export function SiteHeader(): ReactElement {
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const reduceMotionPref = useReducedMotion();
  const reduceMotion = reduceMotionPref === true;

  const scheduleScrollSync = useCallback((): void => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const next = isScrolledPastThreshold();
      setScrolled((prev) => (prev === next ? prev : next));
    });
  }, []);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      const next = isScrolledPastThreshold();
      setScrolled((prev) => (prev === next ? prev : next));
    });
    return (): void => {
      cancelAnimationFrame(id);
    };
  }, []);

  useEffect(() => {
    const onScroll = (): void => {
      scheduleScrollSync();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });

    const se = document.scrollingElement;
    se?.addEventListener("scroll", onScroll, { passive: true });

    const vv = window.visualViewport;
    vv?.addEventListener("scroll", onScroll, { passive: true });
    vv?.addEventListener("resize", onScroll, { passive: true });

    return (): void => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("scroll", onScroll, true);
      se?.removeEventListener("scroll", onScroll);
      vv?.removeEventListener("scroll", onScroll);
      vv?.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [scheduleScrollSync]);

  useLayoutEffect(() => {
    const el = sentinelRef.current;
    if (el == null) {
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry == null) {
          return;
        }
        const fromIo = !entry.isIntersecting;
        setScrolled((prev) => {
          const fromY = isScrolledPastThreshold();
          const next = fromY || fromIo;
          return prev === next ? prev : next;
        });
      },
      { root: null, rootMargin: "0px", threshold: 0 },
    );
    io.observe(el);

    return (): void => {
      io.disconnect();
    };
  }, []);

  const shellClass =
    "mx-auto min-w-0 transition-[margin,max-width,border-radius,padding,background-color,box-shadow,backdrop-filter,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:duration-0";

  const shellScrolled =
    "mt-5 max-w-[min(44rem,calc(100%-2rem))] rounded-2xl border border-[var(--ob-header-float-border)] bg-[var(--ob-header-float-bg)] px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.18)_inset] backdrop-blur-xl backdrop-saturate-150 sm:px-5 sm:py-2.5";

  const shellTop =
    "w-full max-w-7xl rounded-xl border border-transparent bg-transparent px-4 py-2 shadow-none";

  return (
    <>
      <header className="sticky inset-x-0 top-4 z-[100] w-full tracking-[-0.04em]">
        <div className={`${shellClass} ${scrolled ? shellScrolled : shellTop} relative`}>
          {/* Desktop — logo | centered nav | Join waitlist */}
          <div className="relative z-[60] mx-auto hidden min-w-0 flex-row items-center justify-between lg:flex">
            <Link
              href="/"
              className={`relative z-20 mr-4 flex items-center gap-2 px-2 py-1 text-[var(--ob-text)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none hover:opacity-90 ${scrolled ? "scale-[0.96]" : "scale-100"}`}
            >
              <LogoMark compact={scrolled} />
              <span
                className={`font-medium lowercase text-[var(--ob-text)] transition-[font-size,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${scrolled ? "text-base" : "text-lg"}`}
              >
                onebeauty
              </span>
            </Link>

            <nav
              className="absolute inset-0 mx-auto hidden max-w-7xl flex-row items-center justify-center gap-1 text-sm font-medium lg:flex"
              aria-label="Main"
            >
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="relative px-4 py-2 text-[var(--ob-text)] transition-colors hover:text-[var(--ob-text-soft)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="relative z-20 flex items-center">
              <Link
                href="#register-form"
                className={`inline-block cursor-pointer rounded-md bg-[var(--ob-cta-bg)] text-center font-semibold text-[var(--ob-cta-text)] shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none hover:bg-[var(--ob-cta-bg)]/90 ${scrolled ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm"}`}
                onClick={(e): void => {
                  e.preventDefault();
                  scrollToRegisterForm(reduceMotion);
                }}
              >
                Join waitlist
              </Link>
            </div>
          </div>

          {/* Mobile */}
          <div className="relative z-50 mx-auto flex w-full flex-col items-center justify-between lg:hidden">
            <div className="flex w-full flex-row items-center justify-between">
              <Link
                href="/"
                className={`flex items-center gap-2 text-[var(--ob-text)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none hover:opacity-90 ${scrolled ? "scale-[0.96]" : "scale-100"}`}
              >
                <LogoMark compact={scrolled} />
                <span
                  className={`font-medium lowercase text-[var(--ob-text)] transition-[font-size,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${scrolled ? "text-base" : "text-lg"}`}
                >
                  onebeauty
                </span>
              </Link>
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-lg text-[var(--ob-text)] transition-colors hover:bg-white/[0.06]"
                aria-label="Open menu"
              >
                <Menu className="size-6" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </header>
      <div
        ref={sentinelRef}
        className="pointer-events-none h-0.5 w-full shrink-0 opacity-0"
        aria-hidden
      />
    </>
  );
}

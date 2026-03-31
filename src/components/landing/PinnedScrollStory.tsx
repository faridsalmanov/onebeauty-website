"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileSpreadsheet,
  MessageSquare,
  Sparkles,
  Store,
  Tag,
} from "lucide-react";
import type { ReactElement } from "react";
import { useLayoutEffect, useRef } from "react";
import {
  PIN_MEET_IN_START,
  PIN_PROBLEM_FADE_START,
  PIN_TOOL_EXIT_START,
  SCROLL_PIN_DISTANCE_MULTIPLIER,
} from "./pinnedScrollConfig";

/**
 * Rows 0–3: left/right share the same `top` + `yNudge` so pairs sit on one horizontal band.
 * Arc (`calc(50% ± …)`), `tiltDeg`, `xNudge`, and inner GSAP floats keep the unstraight, alive feel.
 */
const ICON_LAYOUT: {
  Icon: LucideIcon;
  /** Stable React key — never use `className` as key (Tailwind can collapse / duplicate long strings). */
  id: string;
  className: string;
  side: "left" | "right";
  tiltDeg: number;
  xNudge: number;
  yNudge: number;
}[] = [
  {
    Icon: CalendarDays,
    id: "pf-cal",
    className:
      "left-[max(0.5rem,calc(50%-min(25.5rem,60vw)))] top-[8%] md:top-[9%] lg:left-[calc(50%-27.5rem)]",
    side: "left",
    tiltDeg: -9.5,
    xNudge: -14,
    yNudge: -4,
  },
  {
    Icon: MessageSquare,
    id: "pf-msg",
    className:
      "left-[max(0.5rem,calc(50%-min(29.5rem,62vw)))] top-[29%] md:top-[30%] lg:left-[calc(50%-31.5rem)]",
    side: "left",
    tiltDeg: 6.5,
    xNudge: 14,
    yNudge: 2,
  },
  {
    Icon: ClipboardList,
    id: "pf-clip",
    className:
      "left-[max(0.5rem,calc(50%-min(29.5rem,62vw)))] top-[48%] md:top-[49%] lg:left-[calc(50%-31.5rem)]",
    side: "left",
    tiltDeg: -5,
    xNudge: -9,
    yNudge: -3,
  },
  {
    Icon: FileSpreadsheet,
    id: "pf-sheet",
    className:
      "left-[max(0.5rem,calc(50%-min(25.5rem,60vw)))] top-[69%] md:top-[70%] lg:left-[calc(50%-27.5rem)]",
    side: "left",
    tiltDeg: 7,
    xNudge: 11,
    yNudge: 0,
  },
  {
    Icon: CreditCard,
    id: "pf-card",
    className:
      "left-[min(calc(50%+min(19.75rem,44vw)),calc(100%-5.5rem))] top-[8%] md:top-[9%] lg:left-[calc(50%+21.25rem)]",
    side: "right",
    tiltDeg: 7.5,
    xNudge: 15,
    yNudge: 4,
  },
  {
    Icon: Sparkles,
    id: "pf-spark",
    className:
      "left-[min(calc(50%+min(23.25rem,48vw)),calc(100%-5.5rem))] top-[29%] md:top-[30%] lg:left-[calc(50%+24.75rem)]",
    side: "right",
    tiltDeg: 5,
    xNudge: 13,
    yNudge: 2,
  },
  {
    Icon: Store,
    id: "pf-store",
    className:
      "left-[min(calc(50%+min(23.25rem,48vw)),calc(100%-5.5rem))] top-[48%] md:top-[49%] lg:left-[calc(50%+24.75rem)]",
    side: "right",
    tiltDeg: -7.5,
    xNudge: 10,
    yNudge: -3,
  },
  {
    Icon: Tag,
    id: "pf-tag",
    className:
      "left-[min(calc(50%+min(19.75rem,44vw)),calc(100%-5.5rem))] top-[69%] md:top-[70%] lg:left-[calc(50%+21.25rem)]",
    side: "right",
    tiltDeg: 4,
    xNudge: 9,
    yNudge: 0,
  },
];

export function PinnedScrollStory(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const meetRef = useRef<HTMLDivElement>(null);
  const meetEyebrowRef = useRef<HTMLParagraphElement>(null);
  const meetBrandRef = useRef<HTMLDivElement>(null);
  const meetBodyRef = useRef<HTMLParagraphElement>(null);
  const problemRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const panel = panelRef.current;
    const meet = meetRef.current;
    const meetEyebrow = meetEyebrowRef.current;
    const meetBrand = meetBrandRef.current;
    const meetBody = meetBodyRef.current;
    const problem = problemRef.current;
    if (
      !panel ||
      !meet ||
      !meetEyebrow ||
      !meetBrand ||
      !meetBody ||
      !problem
    ) {
      return;
    }

    const outerEls: HTMLDivElement[] = [];
    const innerEls: HTMLDivElement[] = [];
    for (let i = 0; i < ICON_LAYOUT.length; i++) {
      const outer = panel.querySelector(`[data-pinned-tool="${String(i)}"]`);
      const inner = panel.querySelector(
        `[data-pinned-tool-inner="${String(i)}"]`,
      );
      if (!(outer instanceof HTMLDivElement) || !(inner instanceof HTMLDivElement)) {
        return;
      }
      outerEls.push(outer);
      innerEls.push(inner);
    }

    const ctx = gsap.context(() => {
      gsap.set(problem, { autoAlpha: 1, y: 10 });

      for (let i = 0; i < ICON_LAYOUT.length; i++) {
        const el = outerEls[i];
        const cfg = ICON_LAYOUT[i];
        if (!el || !cfg) {
          continue;
        }
        const x0 = cfg.xNudge;
        const y0 = cfg.yNudge;
        const rot0 = cfg.tiltDeg;
        gsap.set(el, {
          autoAlpha: 1,
          x: x0,
          y: y0,
          rotation: rot0,
          transformOrigin: "50% 50%",
          force3D: true,
        });
      }

      for (let i = 0; i < ICON_LAYOUT.length; i++) {
        const inner = innerEls[i];
        if (!inner) {
          continue;
        }
        gsap.set(inner, {
          y: 0,
          x: 0,
          rotation: 0,
          transformOrigin: "50% 50%",
          force3D: true,
        });
      }

      gsap.set(meet, { autoAlpha: 1 });
      gsap.set([meetEyebrow, meetBrand, meetBody], {
        autoAlpha: 0,
        y: 20,
      });
      gsap.set(meetBrand, { scale: 0.94 });

      const floatRowY = [12, -11, 12, -11] as const;
      const floatRowRot = [-4.6, 4.1, -4.2, 4.5] as const;
      const floatRowX = [-1.4, 1.35, -1.15, 1.25] as const;

      for (let i = 0; i < ICON_LAYOUT.length; i++) {
        const inner = innerEls[i];
        if (!inner) {
          continue;
        }
        const row = i < 4 ? i : i - 4;
        const isLeft = i < 4;
        const yAmp = isLeft ? floatRowY[row] : -floatRowY[row] * 0.9;
        const rotAmp = floatRowRot[row] * (isLeft ? 1 : -0.88);
        const xAmp = floatRowX[row] * 4.2 * (isLeft ? 1 : -1);
        const delayRow = row * 0.14 + (isLeft ? 0 : 0.06);
        const floatCommon = {
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut" as const,
          overwrite: false as const,
        };
        gsap.to(inner, {
          y: yAmp,
          duration: 2.5 + row * 0.11,
          delay: delayRow,
          ...floatCommon,
        });
        gsap.to(inner, {
          rotation: rotAmp,
          duration: 3.15 + row * 0.12,
          delay: delayRow + 0.04,
          ...floatCommon,
        });
        gsap.to(inner, {
          x: xAmp,
          duration: 2.8 + row * 0.1,
          delay: delayRow + 0.08,
          ...floatCommon,
        });
      }

      const pinDistance = (): string =>
        `+=${window.innerHeight * SCROLL_PIN_DISTANCE_MULTIPLIER}`;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top top",
          end: pinDistance,
          scrub: 1.35,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self): void => {
            panel.style.zIndex = self.isActive ? "50" : "";
          },
        },
      });

      tl.to(problem, { y: 0, duration: 0.1, ease: "power2.out" }, 0);

      const exitXMag = Math.min(window.innerWidth * 0.72, 920);
      for (let i = 0; i < ICON_LAYOUT.length; i++) {
        const el = outerEls[i];
        const cfg = ICON_LAYOUT[i];
        if (!el || !cfg) {
          continue;
        }
        const { side, tiltDeg, xNudge, yNudge } = cfg;
        const xOut =
          side === "left" ? xNudge - exitXMag : xNudge + exitXMag;
        const rotOut = tiltDeg + (side === "left" ? -22 : 22);
        const yOut = yNudge + (side === "left" ? -18 : 18);
        tl.fromTo(
          el,
          {
            x: xNudge,
            y: yNudge,
            rotation: tiltDeg,
            autoAlpha: 1,
            force3D: true,
          },
          {
            x: xOut,
            y: yOut,
            rotation: rotOut,
            autoAlpha: 0,
            duration: 0.28,
            ease: "power3.in",
            immediateRender: false,
          },
          PIN_TOOL_EXIT_START + (i % 4) * 0.022,
        );
      }

      tl.to(
        problem,
        {
          autoAlpha: 0,
          y: -28,
          duration: 0.3,
          ease: "power2.in",
        },
        PIN_PROBLEM_FADE_START,
      );

      tl.fromTo(
        meetEyebrow,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          ease: "sine.out",
        },
        PIN_MEET_IN_START,
      );
      tl.fromTo(
        meetBrand,
        { autoAlpha: 0, y: 28, scale: 0.94 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.38,
          ease: "power2.out",
        },
        PIN_MEET_IN_START + 0.06,
      );
      tl.fromTo(
        meetBody,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.32,
          ease: "sine.out",
        },
        PIN_MEET_IN_START + 0.14,
      );
    });

    const onResize = (): void => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative z-0 w-full"
      aria-label="Product story"
    >
      <div
        ref={panelRef}
        className="relative z-0 flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-transparent px-4 md:px-8"
      >
        {/* Top wash — paired with hero seam; keep behind content (-z-10) */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-12 [background-image:var(--ob-seam-showcase-from-hero)] md:h-14 lg:h-16"
          aria-hidden
        />
        <div className="relative mx-auto h-full min-h-[100dvh] w-full max-w-6xl">
          <div
            ref={meetRef}
            className="absolute inset-0 z-[21] flex flex-col items-center justify-center text-center"
          >
            <p
              ref={meetEyebrowRef}
              className="font-sans text-sm font-medium tracking-[0.25em] text-[var(--ob-text-faint)] uppercase"
            >
              Meet
            </p>
            <div
              ref={meetBrandRef}
              className="mt-5 flex flex-wrap items-center justify-center gap-4 md:gap-6"
            >
              <span
                className="grid grid-cols-2 gap-1 rounded-xl border border-white/30 bg-white/[0.08] p-3 shadow-[0_0_60px_rgba(186,170,255,0.22)]"
                aria-hidden
              >
                <span className="size-3 rounded-md bg-white/95 md:size-3.5" />
                <span className="size-3 rounded-md bg-white/45 md:size-3.5" />
                <span className="size-3 rounded-md bg-white/45 md:size-3.5" />
                <span className="size-3 rounded-md bg-white/95 md:size-3.5" />
              </span>
              <span className="font-sans text-[clamp(2.5rem,8vw,4.5rem)] font-semibold tracking-tight text-[var(--ob-text)] lowercase">
                onebeauty
              </span>
            </div>
            <p
              ref={meetBodyRef}
              className="mt-8 max-w-md font-sans text-base leading-relaxed text-[var(--ob-text-soft)] md:text-lg"
            >
              One workspace for bookings, staff, and clients — built to work
              together from day one.
            </p>
          </div>

          <div
            ref={problemRef}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-2 text-center md:px-8"
          >
            <p className="font-sans text-xs font-medium tracking-[0.3em] text-[var(--ob-text-faint)] uppercase">
              The problem
            </p>
            <h2 className="mt-4 max-w-[20ch] font-serif text-[clamp(1.75rem,4.2vw,3rem)] leading-[1.12] font-semibold tracking-tight text-[var(--ob-text)] md:max-w-3xl">
              Your salon day lives across too many tools
            </h2>
            <p className="mt-5 max-w-xl font-sans text-sm leading-relaxed text-[var(--ob-text-soft)] md:text-base">
              Bookings in one tool, client chats in another, staff schedules in
              a third — each part of your day lives in a different app, and
              nothing connects them for you.
            </p>
          </div>

          {ICON_LAYOUT.map((slot, i) => {
            const Icon = slot.Icon;
            return (
              <div
                key={slot.id}
                data-pinned-tool={String(i)}
                className={`pointer-events-none absolute z-[22] flex size-[72px] items-center justify-center md:size-[84px] ${slot.className}`}
              >
                <div
                  data-pinned-tool-inner={String(i)}
                  className="flex size-[72px] items-center justify-center rounded-2xl border border-white/18 bg-white/[0.09] shadow-[0_16px_48px_-14px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06),0_0_40px_-8px_rgba(186,170,255,0.2)] backdrop-blur-md md:size-[84px] md:rounded-3xl"
                >
                  <Icon
                    className="size-[34px] text-[var(--ob-text)] md:size-[40px]"
                    strokeWidth={1.25}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

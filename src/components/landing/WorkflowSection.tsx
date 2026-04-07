"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

/** Delay phone screenshot swap so step highlight leads the transition (ms). */
const WORKFLOW_PHONE_AFTER_STEP_MS = 150;

/** Native pixel size of `public/images/steps/step*.png` (full device mockup artwork). */
const WORKFLOW_SCREENSHOT_WIDTH = 1335;
const WORKFLOW_SCREENSHOT_HEIGHT = 2775;

/** Fixed active-step + glass height (body scrolls if needed). */
const WORKFLOW_STEP_PANEL_H =
  "h-[7.75rem] min-h-[7.75rem] md:h-[7.25rem] md:min-h-[7.25rem]";

/** Slightly narrower selected state so the active card feels less oversized. */
const WORKFLOW_ACTIVE_STEP_PANEL_MAX_W =
  "max-w-[22.5rem] sm:max-w-[24.5rem] md:max-w-[26rem]";

/** Keep inactive hover state aligned to the active card width. */
const WORKFLOW_STEP_PANEL_MAX_W = WORKFLOW_ACTIVE_STEP_PANEL_MAX_W;

type WorkflowStep = {
  id: string;
  number: string;
  title: string;
  body: string;
  phoneScreenshotSrc: string;
};

export function WorkflowSection(): ReactElement {
  const t = useTranslations("home.workflow");
  const [activeId, setActiveId] = useState<string>("01");
  const [phoneStepId, setPhoneStepId] = useState<string>("01");
  const reduceMotion = useReducedMotion();
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const steps: readonly WorkflowStep[] = [
    {
      id: "01",
      number: "01",
      title: t("steps.01.title"),
      body: t("steps.01.body"),
      phoneScreenshotSrc: "/images/steps/step1.png",
    },
    {
      id: "02",
      number: "02",
      title: t("steps.02.title"),
      body: t("steps.02.body"),
      phoneScreenshotSrc: "/images/steps/step2.png",
    },
    {
      id: "03",
      number: "03",
      title: t("steps.03.title"),
      body: t("steps.03.body"),
      phoneScreenshotSrc: "/images/steps/step3.png",
    },
    {
      id: "04",
      number: "04",
      title: t("steps.04.title"),
      body: t("steps.04.body"),
      phoneScreenshotSrc: "/images/steps/step4.png",
    },
  ];

  const activeStep =
    steps.find((s): boolean => s.id === activeId) ?? steps[0];
  const phoneStep =
    steps.find((s): boolean => s.id === phoneStepId) ?? steps[0];

  /** Phone media follows `activeId` after a short delay (premium sequencing). */
  useEffect((): void | (() => void) => {
    if (reduceMotion) {
      setPhoneStepId(activeId);
      return;
    }
    const id = window.setTimeout((): void => {
      setPhoneStepId(activeId);
    }, WORKFLOW_PHONE_AFTER_STEP_MS);
    return (): void => {
      window.clearTimeout(id);
    };
  }, [activeId, reduceMotion]);

  /** Track viewport for mobile scroll-driven behaviour. */
  useEffect((): (() => void) => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList): void => {
      setIsMobile(e.matches);
    };
    handler(mql);
    mql.addEventListener("change", handler as EventListener);
    return (): void => {
      mql.removeEventListener("change", handler as EventListener);
    };
  }, []);

  /** Mobile: Intersection Observer detects which step zone is in the viewport. */
  useEffect((): void | (() => void) => {
    if (!isMobile) return;
    const container = mobileScrollRef.current;
    if (!container) return;

    const stepEls =
      container.querySelectorAll<HTMLElement>("[data-step-id]");
    if (stepEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries): void => {
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            (!best || entry.intersectionRatio > best.intersectionRatio)
          ) {
            best = entry;
          }
        }
        const stepId = best?.target.getAttribute("data-step-id");
        if (stepId) setActiveId(stepId);
      },
      { threshold: [0.15, 0.3, 0.5, 0.7], rootMargin: "-38% 0px -22% 0px" },
    );

    stepEls.forEach((el): void => {
      observer.observe(el);
    });
    return (): void => {
      observer.disconnect();
    };
  }, [isMobile]);

  /* ── Animation config ── */
  const stackEase = [0.16, 1, 0.32, 1] as const;

  const stackTransition = reduceMotion
    ? { layout: { duration: 0 } as const }
    : {
        layout: {
          type: "tween" as const,
          duration: 0.52,
          ease: stackEase,
        },
      };

  const fadePhone = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.32, ease: stackEase };

  const mobilePhoneTransition = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] };

  return (
    <section
      id="workflow"
      className="relative scroll-mt-28 overflow-x-clip bg-transparent md:scroll-mt-32"
    >
      <div className="relative z-[1] mx-auto w-full max-w-[min(100%,120rem)] px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:px-10">
        {/* ── Headline (shared across mobile & desktop) ── */}
        <div className="max-w-2xl">
          <h2 className="font-sans text-fluid-section-sm leading-[0.95] font-medium tracking-tight text-[var(--ob-text)]">
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
          </h2>
          <p className="mt-4 max-w-sm font-sans text-base leading-relaxed text-[var(--ob-text-soft)] sm:text-[1.05rem]">
            {t("body")}
          </p>
        </div>

        {/* ────────────────────────────────────────────────
            Desktop: clickable tabs + sticky phone (lg+)
            ──────────────────────────────────────────────── */}
        <div className="mt-6 hidden items-start gap-12 sm:mt-8 md:mt-10 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <LayoutGroup id="workflow-steps">
              <div
                className="flex flex-col gap-2 sm:gap-2.5 md:gap-3"
                role="tablist"
                aria-label={t("aria.tablist")}
              >
                {steps.map(
                  (step): ReactElement => {
                    const selected = step.id === activeId;
                    return (
                      <motion.button
                        key={step.id}
                        type="button"
                        role="tab"
                        layout={!reduceMotion}
                        id={`workflow-tab-${step.id}`}
                        aria-selected={selected}
                        aria-controls="workflow-phone-panel"
                        tabIndex={0}
                        transition={stackTransition}
                        onClick={(): void => {
                          setActiveId(step.id);
                        }}
                        className={`relative z-0 w-full cursor-pointer overflow-visible rounded-2xl px-0 text-left caret-transparent select-none outline-none transition-colors ${
                          selected
                            ? "z-[1] flex flex-col items-start py-0"
                            : "py-0"
                        } focus-visible:ring-2 focus-visible:ring-sky-300/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`}
                      >
                        {selected ? (
                          <div
                            className={`relative w-full min-w-0 self-start ${WORKFLOW_ACTIVE_STEP_PANEL_MAX_W} ${WORKFLOW_STEP_PANEL_H}`}
                          >
                            <motion.div
                              layoutId="workflow-step-glass"
                              className="pointer-events-none absolute inset-0 rounded-xl border border-sky-200/35 bg-white/12 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)_inset] ring-1 ring-sky-300/25"
                              initial={false}
                              transition={stackTransition}
                            />
                            <div className="relative z-[1] grid h-full min-h-0 grid-cols-[auto_1fr] grid-rows-[auto_minmax(0,1fr)] gap-x-2.5 gap-y-1 px-2.5 py-1 sm:px-2.5 sm:py-1.5 md:gap-y-1.5 md:px-2.5 md:py-1.5">
                              <span className="col-start-1 row-start-1 shrink-0 self-baseline font-sans text-base font-medium tabular-nums tracking-tight text-[var(--ob-text)] md:text-lg">
                                {step.number}
                              </span>
                              <h3 className="col-start-2 row-start-1 min-w-0 break-words font-sans text-[1.15rem] font-semibold leading-snug tracking-tight text-[var(--ob-text)] md:text-[1.28rem]">
                                {step.title}
                              </h3>
                              <div className="col-start-2 row-start-2 min-h-0 overflow-y-auto overscroll-contain pr-0.5">
                                <motion.p
                                  key={step.id}
                                  initial={{ opacity: 0, y: 2 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={
                                    reduceMotion
                                      ? { duration: 0 }
                                      : {
                                          duration: 0.28,
                                          ease: stackEase,
                                        }
                                  }
                                  className="font-sans text-sm leading-relaxed text-[var(--ob-text-soft)] [text-wrap:pretty]"
                                >
                                  {step.body}
                                </motion.p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`relative z-[1] w-full min-w-0 self-start ${WORKFLOW_STEP_PANEL_MAX_W} rounded-xl py-3 transition-colors hover:bg-white/[0.04] md:py-3.5`}
                          >
                            <div className="relative z-[1] flex min-w-0 flex-col px-2.5 sm:px-3 md:px-3">
                              <div className="flex min-w-0 shrink-0 items-baseline gap-3">
                                <span className="shrink-0 font-sans text-base font-medium tabular-nums tracking-tight text-[var(--ob-text-soft)]/52 md:text-lg">
                                  {step.number}
                                </span>
                                <h3 className="min-w-0 flex-1 break-words font-sans text-[1.15rem] font-semibold leading-snug tracking-tight text-[var(--ob-text-soft)]/88 md:text-[1.28rem]">
                                  {step.title}
                                </h3>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.button>
                    );
                  },
                )}
              </div>
            </LayoutGroup>
          </div>

          <div
            className="flex justify-center lg:sticky lg:top-28 lg:justify-end"
            id="workflow-phone-panel"
            role="tabpanel"
            aria-labelledby={`workflow-tab-${activeStep?.id ?? "01"}`}
          >
            <div className="relative mx-auto w-full max-w-[min(92vw,17.75rem)] select-none sm:max-w-[17.75rem] lg:max-w-[18.25rem]">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={phoneStep.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fadePhone}
                  className="relative w-full"
                >
                  <div
                    className="relative w-full"
                    style={{
                      aspectRatio: `${WORKFLOW_SCREENSHOT_WIDTH} / ${WORKFLOW_SCREENSHOT_HEIGHT}`,
                    }}
                  >
                    <Image
                      src={phoneStep.phoneScreenshotSrc}
                      alt={t("aria.phoneAlt", {
                        stepNumber: phoneStep.number,
                        stepTitle: phoneStep.title,
                      })}
                      width={WORKFLOW_SCREENSHOT_WIDTH}
                      height={WORKFLOW_SCREENSHOT_HEIGHT}
                      className="pointer-events-none block h-auto w-full object-contain drop-shadow-[0_22px_48px_-18px_rgba(0,0,0,0.48)]"
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 19rem"
                      priority={phoneStep.id === "01"}
                      loading={phoneStep.id === "01" ? "eager" : "lazy"}
                      draggable={false}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────
            Mobile: scroll-driven sticky phone + step zones
            ──────────────────────────────────────────────── */}
        <div className="mt-8 lg:hidden" ref={mobileScrollRef}>
          {/* Sticky phone + dot indicators */}
          <div className="sticky top-20 z-10 flex flex-col items-center pb-6">
            <div className="relative w-full max-w-[min(42vw,10.5rem)] select-none">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={phoneStep.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={mobilePhoneTransition}
                  className="relative w-full"
                >
                  <div
                    className="relative w-full"
                    style={{
                      aspectRatio: `${WORKFLOW_SCREENSHOT_WIDTH} / ${WORKFLOW_SCREENSHOT_HEIGHT}`,
                    }}
                  >
                    <Image
                      src={phoneStep.phoneScreenshotSrc}
                      alt={t("aria.phoneAlt", {
                        stepNumber: phoneStep.number,
                        stepTitle: phoneStep.title,
                      })}
                      width={WORKFLOW_SCREENSHOT_WIDTH}
                      height={WORKFLOW_SCREENSHOT_HEIGHT}
                      className="pointer-events-none block h-auto w-full object-contain drop-shadow-[0_16px_32px_-12px_rgba(0,0,0,0.45)]"
                      sizes="42vw"
                      priority={phoneStep.id === "01"}
                      loading={phoneStep.id === "01" ? "eager" : "lazy"}
                      draggable={false}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot / pill indicators */}
            <div className="mt-3 flex items-center justify-center gap-1.5">
              {steps.map(
                (s): ReactElement => (
                  <span
                    key={s.id}
                    className={`block h-[5px] rounded-full transition-all duration-300 ease-out ${
                      s.id === activeId
                        ? "w-5 scale-100 bg-sky-400 opacity-100"
                        : "w-[5px] scale-[0.8] bg-white/40 opacity-40"
                    }`}
                  />
                ),
              )}
            </div>

            {/* Gradient mask so text scrolling behind fades gracefully */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-8"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, var(--ob-hero-deep))",
              }}
            />
          </div>

          {/* Step trigger zones — each zone is a scroll "beat" */}
          <div className="relative z-0">
            {steps.map(
              (step, i): ReactElement => (
                <div
                  key={step.id}
                  data-step-id={step.id}
                  className={`flex flex-col justify-center px-1 ${
                    i === 0 ? "min-h-[45vh] pt-2" : ""
                  }${i > 0 && i < steps.length - 1 ? "min-h-[50vh]" : ""}${
                    i === steps.length - 1 ? "min-h-[40vh] pb-4" : ""
                  }`}
                >
                  <div
                    className={`transition-all duration-300 ease-out ${
                      step.id === activeId
                        ? "translate-y-0 opacity-100"
                        : "translate-y-1 opacity-[0.35]"
                    }`}
                  >
                    <span className="text-xs font-semibold uppercase tabular-nums tracking-widest text-sky-300/80">
                      {step.number}
                    </span>
                    <h3 className="mt-1.5 font-sans text-lg font-semibold leading-snug tracking-tight text-[var(--ob-text)]">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-xs font-sans text-sm leading-relaxed text-[var(--ob-text-soft)] [text-wrap:pretty]">
                      {step.body}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

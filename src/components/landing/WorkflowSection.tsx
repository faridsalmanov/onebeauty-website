"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";

import type { AppLocale } from "@/i18n/routing";

/** Delay phone screenshot swap so step highlight leads the transition (ms). */
const WORKFLOW_PHONE_AFTER_STEP_MS = 150;

/** Native pixel size of `public/images/steps/step*.png` (full device mockup artwork). */
const WORKFLOW_SCREENSHOT_WIDTH = 1335;
const WORKFLOW_SCREENSHOT_HEIGHT = 2775;

/** Mobile workflow phone slot — matches `max-w-[min(vw,rem)]` classes + row layout (< lg). */
const WORKFLOW_PHONE_SIZES_MOBILE =
  "(max-width: 639px) min(46vw, 9.75rem), (max-width: 767px) min(44vw, 11rem), (max-width: 1023px) min(38vw, 12.75rem), 100vw";

/** Desktop sticky phone — matches wrapper `max-w-[min(92vw,17.75rem)] sm:… lg:…`. */
const WORKFLOW_PHONE_SIZES_DESKTOP =
  "(min-width: 1024px) 18.25rem, (min-width: 640px) 17.75rem, min(92vw, 17.75rem)";

/** Fixed active-step + glass height (body scrolls if needed). */
const WORKFLOW_STEP_PANEL_H =
  "h-[7.75rem] min-h-[7.75rem] md:h-[7.25rem] md:min-h-[7.25rem]";

/** Slightly narrower selected state so the active card feels less oversized. */
const WORKFLOW_ACTIVE_STEP_PANEL_MAX_W =
  "max-w-[22.5rem] sm:max-w-[24.5rem] md:max-w-[26rem]";

/** Keep inactive hover state aligned to the active card width. */
const WORKFLOW_STEP_PANEL_MAX_W = WORKFLOW_ACTIVE_STEP_PANEL_MAX_W;

/** Files use `_eng` for English screenshots while the app locale is `en`. */
function workflowStepScreenshotPath(
  step: 1 | 2 | 3 | 4,
  locale: AppLocale,
): string {
  const suffix =
    locale === "en" ? "eng" : locale === "ru" ? "ru" : "az";
  return `/images/steps/step${step}_${suffix}.png`;
}

type WorkflowStep = {
  id: string;
  number: string;
  title: string;
  body: string;
  phoneScreenshotSrc: string;
};

export function WorkflowSection(): ReactElement {
  const t = useTranslations("home.workflow");
  const locale = useLocale() as AppLocale;
  const [activeId, setActiveId] = useState<string>("01");
  const [phoneStepId, setPhoneStepId] = useState<string>("01");
  const reduceMotion = useReducedMotion();

  const steps: readonly WorkflowStep[] = useMemo((): WorkflowStep[] => {
    return [
      {
        id: "01",
        number: "01",
        title: t("steps.01.title"),
        body: t("steps.01.body"),
        phoneScreenshotSrc: workflowStepScreenshotPath(1, locale),
      },
      {
        id: "02",
        number: "02",
        title: t("steps.02.title"),
        body: t("steps.02.body"),
        phoneScreenshotSrc: workflowStepScreenshotPath(2, locale),
      },
      {
        id: "03",
        number: "03",
        title: t("steps.03.title"),
        body: t("steps.03.body"),
        phoneScreenshotSrc: workflowStepScreenshotPath(3, locale),
      },
      {
        id: "04",
        number: "04",
        title: t("steps.04.title"),
        body: t("steps.04.body"),
        phoneScreenshotSrc: workflowStepScreenshotPath(4, locale),
      },
    ];
  }, [locale, t]);

  const activeIndex = steps.findIndex((s): boolean => s.id === activeId);
  const safeIndex = activeIndex < 0 ? 0 : activeIndex;
  const canGoPrev = safeIndex > 0;
  const canGoNext = safeIndex < steps.length - 1;

  const goToPrev = (): void => {
    if (!canGoPrev) return;
    setActiveId(steps[safeIndex - 1].id);
  };

  const goToNext = (): void => {
    if (!canGoNext) return;
    setActiveId(steps[safeIndex + 1].id);
  };

  const activeStep =
    steps.find((s): boolean => s.id === activeId) ?? steps[0];
  const phoneStep =
    steps.find((s): boolean => s.id === phoneStepId) ?? steps[0];

  /* ── Shared: phone follows activeId with a staggered delay ── */
  useEffect((): void | (() => void) => {
    if (reduceMotion) {
      const raf = requestAnimationFrame((): void => {
        setPhoneStepId(activeId);
      });
      return (): void => {
        cancelAnimationFrame(raf);
      };
    }
    const id = window.setTimeout((): void => {
      setPhoneStepId(activeId);
    }, WORKFLOW_PHONE_AFTER_STEP_MS);
    return (): void => {
      window.clearTimeout(id);
    };
  }, [activeId, reduceMotion]);

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

  const mobileFadeEase = [0.25, 0.1, 0.25, 1] as const;

  const mobileFadeIn = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.28, ease: mobileFadeEase };

  const mobileFadeOut = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.15, ease: "easeIn" as const };

  return (
    <section
      id="workflow"
      className="relative scroll-mt-28 overflow-x-clip bg-transparent md:scroll-mt-32"
    >
      <div className="relative z-[1] mx-auto w-full max-w-[min(100%,120rem)] px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="max-w-2xl">
            <h2 className="font-sans text-fluid-section-sm leading-[0.95] font-medium tracking-tight text-[var(--ob-text)]">
              {t("titleLine1")}
              <br />
              {t("titleLine2")}
            </h2>
            <p className="mt-4 max-w-sm font-sans text-base leading-relaxed text-[var(--ob-text-soft)] sm:text-[1.05rem]">
              {t("body")}
            </p>

            <LayoutGroup id="workflow-steps">
              <div
                className="mt-6 hidden flex-col gap-2 sm:mt-8 sm:gap-2.5 md:mt-10 md:gap-3 lg:flex"
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
            className="hidden justify-center lg:sticky lg:top-28 lg:flex lg:justify-end"
            id="workflow-phone-panel"
            role="tabpanel"
            aria-labelledby={`workflow-tab-${activeStep?.id ?? "01"}`}
          >
            <div className="relative mx-auto w-full max-w-[min(92vw,17.75rem)] select-none sm:max-w-[17.75rem] lg:max-w-[18.25rem]">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={`${phoneStep.id}-${locale}`}
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
                      sizes={WORKFLOW_PHONE_SIZES_DESKTOP}
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
            Mobile: same stack as before (phone → text → dots), arrows only beside phone.
            ──────────────────────────────────────────────── */}
        <div className="relative mt-10 lg:hidden">
          <div className="flex flex-col items-center px-5">
            <div
              className="flex w-full max-w-[17.5rem] items-center justify-center gap-1.5 sm:max-w-[19.5rem] sm:gap-2 md:max-w-[21rem] md:gap-2.5"
              role="group"
              aria-label={t("aria.stepNavigation")}
            >
              <button
                type="button"
                onClick={goToPrev}
                disabled={!canGoPrev}
                aria-label={t("aria.previousStep")}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[var(--ob-text)]/90 transition-opacity active:opacity-80 disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40"
              >
                <ChevronLeft className="size-[1.15rem]" strokeWidth={2.25} aria-hidden />
              </button>

              <div
                className="relative w-full min-w-0 max-w-[min(46vw,9.75rem)] select-none sm:max-w-[min(44vw,11rem)] md:max-w-[min(38vw,12.75rem)]"
                style={{
                  aspectRatio: `${WORKFLOW_SCREENSHOT_WIDTH} / ${WORKFLOW_SCREENSHOT_HEIGHT}`,
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${phoneStep.id}-${locale}`}
                    className="absolute inset-0"
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1, transition: mobileFadeIn }}
                    exit={{ opacity: 0, transition: mobileFadeOut }}
                  >
                    <Image
                      src={phoneStep.phoneScreenshotSrc}
                      alt={t("aria.phoneAlt", {
                        stepNumber: phoneStep.number,
                        stepTitle: phoneStep.title,
                      })}
                      fill
                      className="pointer-events-none object-contain drop-shadow-[0_16px_32px_-12px_rgba(0,0,0,0.45)]"
                      sizes={WORKFLOW_PHONE_SIZES_MOBILE}
                      priority={phoneStep.id === "01"}
                      loading={phoneStep.id === "01" ? "eager" : "lazy"}
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={goToNext}
                disabled={!canGoNext}
                aria-label={t("aria.nextStep")}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[var(--ob-text)]/90 transition-opacity active:opacity-80 disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40"
              >
                <ChevronRight className="size-[1.15rem]" strokeWidth={2.25} aria-hidden />
              </button>
            </div>

            <div className="relative mt-5 h-[8rem] w-full max-w-[18rem] overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeStep.id}
                  className="absolute inset-x-0 top-0 flex flex-col items-center text-center"
                  initial={
                    reduceMotion
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 6 }
                  }
                  animate={{ opacity: 1, y: 0, transition: mobileFadeIn }}
                  exit={
                    reduceMotion
                      ? { opacity: 1, y: 0, transition: { duration: 0 } }
                      : { opacity: 0, y: -6, transition: mobileFadeOut }
                  }
                >
                  <span className="text-[0.7rem] font-semibold uppercase tabular-nums tracking-[0.18em] text-sky-300/80">
                    {activeStep.number}
                  </span>
                  <h3 className="mt-1 font-sans text-[1.1rem] font-semibold leading-snug tracking-tight text-[var(--ob-text)]">
                    {activeStep.title}
                  </h3>
                  <p className="mt-1.5 font-sans text-[0.82rem] leading-relaxed text-[var(--ob-text-soft)] [text-wrap:pretty]">
                    {activeStep.body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              {steps.map(
                (s): ReactElement => (
                  <span
                    key={s.id}
                    className={`block h-[5px] rounded-full transition-all duration-300 ease-out ${
                      s.id === activeId
                        ? "w-5 scale-100 bg-sky-400 opacity-100"
                        : "w-[5px] scale-[0.8] bg-white/40 opacity-40"
                    }`}
                    aria-hidden
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

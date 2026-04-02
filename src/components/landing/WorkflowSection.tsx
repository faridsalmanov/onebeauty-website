"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { useState } from "react";

/** Native pixel size of `public/images/steps/step*.png` (full device mockup artwork). */
const WORKFLOW_SCREENSHOT_WIDTH = 1335;
const WORKFLOW_SCREENSHOT_HEIGHT = 2775;

/** Fixed open-step + glass height (body scrolls if needed). */
const WORKFLOW_STEP_PANEL_H =
  "h-[9.25rem] min-h-[9.25rem] md:h-[8.75rem] md:min-h-[8.75rem]";

/** Same max width for glass panel and collapsed row hover so highlight matches selection. */
const WORKFLOW_STEP_PANEL_MAX_W =
  "max-w-[24rem] sm:max-w-[26rem] md:max-w-[27.5rem]";

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
  const reduceMotion = useReducedMotion();

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

  /** Shared layout tween: slightly longer + softer ease for stack + glass (less snappy). */
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

  return (
    <section className="relative overflow-hidden bg-transparent">
      <div className="relative z-[1] mx-auto w-full max-w-[min(100%,120rem)] px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="max-w-2xl">
            <h2 className="font-sans text-fluid-section leading-[0.95] font-medium tracking-tight text-[var(--ob-text)]">
              {t("titleLine1")}
              <br />
              {t("titleLine2")}
            </h2>
            <p className="mt-4 max-w-sm font-sans text-base leading-relaxed text-[var(--ob-text-soft)] sm:text-[1.05rem]">
              {t("body")}
            </p>

            <LayoutGroup id="workflow-steps">
              <div
                className="mt-6 flex flex-col gap-2 sm:mt-8 sm:gap-2.5 md:mt-10 md:gap-3"
                role="tablist"
                aria-label={t("aria.tablist")}
              >
                {steps.map((step): ReactElement => {
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
                      className={`relative z-0 w-full overflow-visible rounded-2xl text-left outline-none transition-colors ${
                        selected
                          ? "z-[1] flex flex-col items-start py-0"
                          : "py-0"
                      } px-3 sm:px-4 md:px-5 focus-visible:ring-2 focus-visible:ring-sky-300/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`}
                    >
                      {selected ? (
                        <div
                          className={`relative w-full min-w-0 self-start ${WORKFLOW_STEP_PANEL_MAX_W} ${WORKFLOW_STEP_PANEL_H}`}
                        >
                          <motion.div
                            layoutId="workflow-step-glass"
                            className="pointer-events-none absolute inset-y-0 -left-1 -right-0.5 rounded-xl border border-sky-200/35 bg-white/12 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)_inset] ring-1 ring-sky-300/25 sm:-left-1.5 sm:-right-1 md:-left-2 md:-right-1.5"
                            initial={false}
                            transition={stackTransition}
                          />
                          <div className="relative z-[1] grid h-full min-h-0 grid-cols-[auto_1fr] grid-rows-[auto_minmax(0,1fr)] gap-x-2.5 gap-y-1.5 px-2.5 py-2 sm:px-3 sm:py-2.5 md:gap-y-2 md:px-3 md:py-2.5">
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
                          className={`relative z-[1] w-full min-w-0 self-start ${WORKFLOW_STEP_PANEL_MAX_W} rounded-xl py-3.5 transition-colors hover:bg-white/[0.04] md:py-4`}
                        >
                          <div className="relative z-[1] flex min-w-0 flex-col px-2.5 sm:px-3 md:px-3">
                            <div className="flex min-w-0 shrink-0 items-baseline gap-3">
                              <span className="shrink-0 font-sans text-base font-medium tabular-nums tracking-tight text-[var(--ob-text-faint)] md:text-lg">
                                {step.number}
                              </span>
                              <h3 className="min-w-0 flex-1 break-words font-sans text-[1.15rem] font-semibold leading-snug tracking-tight text-[var(--ob-text-soft)]/75 md:text-[1.28rem]">
                                {step.title}
                              </h3>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </LayoutGroup>
          </div>

          <div
            className="flex justify-center lg:sticky lg:top-28 lg:justify-end"
            id="workflow-phone-panel"
            role="tabpanel"
            aria-labelledby={`workflow-tab-${activeStep?.id ?? "01"}`}
          >
            <div className="relative mx-auto w-full max-w-[min(92vw,18.5rem)] select-none sm:max-w-[18.5rem] lg:max-w-[19rem]">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={activeStep.id}
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
                    src={activeStep.phoneScreenshotSrc}
                    alt={t("aria.phoneAlt", {
                      stepNumber: activeStep.number,
                      stepTitle: activeStep.title,
                    })}
                    width={WORKFLOW_SCREENSHOT_WIDTH}
                    height={WORKFLOW_SCREENSHOT_HEIGHT}
                    className="pointer-events-none block h-auto w-full object-contain drop-shadow-[0_22px_48px_-18px_rgba(0,0,0,0.48)]"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 19rem"
                    priority={activeStep.id === "01"}
                    loading={activeStep.id === "01" ? "eager" : "lazy"}
                    draggable={false}
                  />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

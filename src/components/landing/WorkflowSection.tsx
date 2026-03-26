"use client";

import { Calendar, Inbox, MessageCircle, Repeat2, Sparkles } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import type { ReactElement, ReactNode } from "react";
import { useState } from "react";

/** PNG in `public/images/iphone-15.png` (1335×2775). Inset fine-tunes screen vs bezel. */
const WORKFLOW_IPHONE_FRAME = "/images/iphone-15.png";

/** Fixed open-step + glass height (body scrolls if needed). */
const WORKFLOW_STEP_PANEL_H =
  "h-[9.25rem] min-h-[9.25rem] md:h-[8.75rem] md:min-h-[8.75rem]";

/** Same max width for glass panel and collapsed row hover so highlight matches selection. */
const WORKFLOW_STEP_PANEL_MAX_W =
  "max-w-[24rem] sm:max-w-[26rem] md:max-w-[27.5rem]";

type PhoneRow = {
  label: string;
  value?: string;
};

type WorkflowStep = {
  id: string;
  number: string;
  title: string;
  body: string;
  phoneIcon: LucideIcon;
  phoneTitle: string;
  phoneHint: string;
  phoneRows: readonly PhoneRow[];
};

const WORKFLOW_STEPS: readonly WorkflowStep[] = [
  {
    id: "01",
    number: "01",
    title: "Capture booking requests",
    body:
      "Collect service, date, and stylist preference from Instagram, WhatsApp, and web forms in one shared inbox.",
    phoneIcon: Inbox,
    phoneTitle: "Inbox",
    phoneHint: "All channels in one place",
    phoneRows: [
      { label: "Instagram DM", value: "Balayage + toner — Sat 2pm?" },
      { label: "WhatsApp", value: "Cut & blowdry for next week" },
      { label: "Web form", value: "First visit — color consult" },
    ],
  },
  {
    id: "02",
    number: "02",
    title: "Confirm & schedule",
    body:
      "Assign staff, lock timeslots, and send confirmations so your calendar stays accurate across the team.",
    phoneIcon: Calendar,
    phoneTitle: "Schedule",
    phoneHint: "Confirm before you commit",
    phoneRows: [
      { label: "Slot", value: "Sat 14:00 · 90 min" },
      { label: "Stylist", value: "Maya K." },
      { label: "Status", value: "Awaiting client confirm" },
    ],
  },
  {
    id: "03",
    number: "03",
    title: "Run service with notes",
    body:
      "Save formulas, preferences, and before/after media per client profile for better repeat visits.",
    phoneIcon: Sparkles,
    phoneTitle: "Client profile",
    phoneHint: "Notes follow every visit",
    phoneRows: [
      { label: "Last formula", value: "7N + 8G gloss" },
      { label: "Preference", value: "Cool tone, low heat" },
      { label: "Photos", value: "Before / after attached" },
    ],
  },
  {
    id: "04",
    number: "04",
    title: "Checkout & rebook",
    body:
      "Complete payment, apply loyalty points, and secure the next appointment before the client leaves.",
    phoneIcon: Repeat2,
    phoneTitle: "Checkout",
    phoneHint: "Pay & book the next visit",
    phoneRows: [
      { label: "Total", value: "€142.00" },
      { label: "Loyalty", value: "+28 pts · redeem €10" },
      { label: "Next visit", value: "6 weeks — color refresh" },
    ],
  },
  {
    id: "05",
    number: "05",
    title: "Follow-up automation",
    body:
      "Send reminders and aftercare follow-ups automatically to improve retention and keep chairs full.",
    phoneIcon: MessageCircle,
    phoneTitle: "Automations",
    phoneHint: "Stay in touch without the busywork",
    phoneRows: [
      { label: "Tomorrow", value: "Reminder · 10:00 appointment" },
      { label: "Day 3", value: "Aftercare tips for color care" },
      { label: "Week 6", value: "Rebook nudge — same stylist" },
    ],
  },
];

/** Device frame from `public/images/iphone-15.png`; app UI is inset into the screen area. */
function IphoneMockup({ children }: { children: ReactNode }): ReactElement {
  return (
    <div className="relative mx-auto w-full max-w-[min(88vw,258px)] select-none sm:max-w-[276px]">
      <Image
        src={WORKFLOW_IPHONE_FRAME}
        alt=""
        width={1335}
        height={2775}
        className="pointer-events-none block h-auto w-full object-contain drop-shadow-[0_22px_48px_-18px_rgba(0,0,0,0.48)]"
        sizes="(max-width: 640px) 88vw, 276px"
        priority
        aria-hidden
      />
      <div
        className="absolute z-[1] flex min-h-0 flex-col overflow-hidden bg-[#f5f2ed] pt-1"
        style={{
          top: "9.2%",
          right: "6.7%",
          bottom: "9.9%",
          left: "6.7%",
          borderRadius: "2.1rem",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function WorkflowSection(): ReactElement {
  const [activeId, setActiveId] = useState<string>("01");
  const reduceMotion = useReducedMotion();

  const activeStep =
    WORKFLOW_STEPS.find((s): boolean => s.id === activeId) ?? WORKFLOW_STEPS[0];
  const ActiveIcon = activeStep?.phoneIcon ?? Inbox;

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
      <div className="relative z-[1] mx-auto w-full max-w-[1920px] px-4 py-16 md:px-8 md:py-20 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="max-w-2xl">
            <h2 className="font-sans text-[clamp(2.45rem,6vw,5rem)] leading-[0.95] font-medium tracking-tight text-[var(--ob-text)]">
              Salon
              <br />
              Workflow
            </h2>

            <LayoutGroup id="workflow-steps">
              <div
                className="mt-6 flex flex-col gap-2 sm:mt-8 sm:gap-2.5 md:mt-10 md:gap-3"
                role="tablist"
                aria-label="Workflow steps"
              >
                {WORKFLOW_STEPS.map((step): ReactElement => {
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
            <IphoneMockup>
              <div className="relative flex min-h-[min(42vh,320px)] w-full flex-1 flex-col sm:min-h-[340px]">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={activeStep.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={fadePhone}
                    className="absolute inset-0 flex min-h-0 flex-col overflow-y-auto px-4 pb-2 pt-2"
                  >
                  <div className="mb-4 flex items-center gap-2.5 border-b border-black/[0.06] pb-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--ob-primary)] text-white shadow-sm">
                      <ActiveIcon className="size-[18px]" strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-sans text-[0.95rem] font-semibold tracking-tight text-[var(--ob-primary)]">
                        {activeStep.phoneTitle}
                      </p>
                      <p className="font-sans text-[0.7rem] text-[#6b6560]">
                        {activeStep.phoneHint}
                      </p>
                    </div>
                  </div>

                  {reduceMotion ? (
                    <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto">
                      {activeStep.phoneRows.map(
                        (row): ReactElement => (
                          <div
                            key={row.label}
                            className="rounded-xl border border-black/[0.07] bg-white px-3 py-2.5 shadow-[0_1px_0_rgba(0,0,0,0.03)]"
                          >
                            <p className="font-sans text-[0.62rem] font-semibold tracking-[0.14em] text-[#56504a] uppercase">
                              {row.label}
                            </p>
                            {row.value != null && row.value.length > 0 ? (
                              <p className="mt-1 font-sans text-[0.82rem] leading-snug text-[#2a2826]">
                                {row.value}
                              </p>
                            ) : (
                              <div className="mt-2 h-2 rounded bg-black/[0.06]" />
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <motion.div
                      className="flex flex-1 flex-col gap-2.5 overflow-y-auto"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.05,
                            delayChildren: 0.06,
                          },
                        },
                      }}
                    >
                      {activeStep.phoneRows.map(
                        (row): ReactElement => (
                          <motion.div
                            key={row.label}
                            variants={{
                              hidden: { opacity: 0, y: 6 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                  duration: 0.22,
                                  ease: [0.22, 1, 0.36, 1],
                                },
                              },
                            }}
                            className="rounded-xl border border-black/[0.07] bg-white px-3 py-2.5 shadow-[0_1px_0_rgba(0,0,0,0.03)]"
                          >
                            <p className="font-sans text-[0.62rem] font-semibold tracking-[0.14em] text-[#56504a] uppercase">
                              {row.label}
                            </p>
                            {row.value != null && row.value.length > 0 ? (
                              <p className="mt-1 font-sans text-[0.82rem] leading-snug text-[#2a2826]">
                                {row.value}
                              </p>
                            ) : (
                              <div className="mt-2 h-2 rounded bg-black/[0.06]" />
                            )}
                          </motion.div>
                        ),
                      )}
                    </motion.div>
                  )}

                  <p className="mt-auto pt-2 text-center font-sans text-[0.65rem] text-[#9a948c]">
                    Placeholder UI — swap for product shots when ready.
                  </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </IphoneMockup>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useCallback, useId, useState, type ReactElement } from "react";
import type { FaqItem } from "../data/faq_items";

/** Matches AppShowcase / marketing easing — smooth “natural” open. */
const EASE = [0.22, 1, 0.36, 1] as const;

const FAQ_CARD_BASE_CLASS = [
  "ob-faq-item group rounded-2xl border bg-[rgba(255,255,255,0.03)] backdrop-blur-xl",
  "transition-[border-color,box-shadow,background-color] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-150",
  "hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.045)]",
  /* Subtle white glow */
  "hover:shadow-[0_18px_44px_-26px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_0_32px_-10px_rgba(255,255,255,0.14),0_0_56px_-18px_rgba(255,255,255,0.06)]",
].join(" ");

export function FaqAccordionItem({ item }: { item: FaqItem }): ReactElement {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const triggerId = `faq-trigger-${item.id}-${baseId}`;
  const panelId = `faq-panel-${item.id}-${baseId}`;

  const instant = reduceMotion === true;
  const heightDuration = instant ? 0 : 0.38;
  const contentDuration = instant ? 0 : 0.28;

  const toggle = useCallback((): void => {
    setOpen((v) => !v);
  }, []);

  return (
    <div
      className={`${FAQ_CARD_BASE_CLASS} ${
        open
          ? "border-[rgba(255,255,255,0.16)] shadow-[0_20px_56px_-24px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.1)_inset]"
          : "border-[var(--ob-glass-border)] shadow-[0_16px_48px_-28px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.04)_inset]"
      }`}
    >
      <button
        type="button"
        id={triggerId}
        className="flex w-full cursor-pointer touch-manipulation select-none items-center justify-between gap-3 px-4 py-3 text-left font-sans text-[0.95rem] font-medium tracking-tight text-[var(--ob-text)] transition-colors duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#e8ecff] sm:px-5 sm:text-base"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
      >
        <span className="min-w-0 pr-2">{item.question}</span>
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-[0.5rem] border shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_4px_12px_rgba(0,0,0,0.12)] transition-[border-color,background-color,box-shadow] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-150 group-hover:border-[rgba(255,255,255,0.28)] group-hover:bg-[rgba(255,255,255,0.08)] group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_0_20px_rgba(255,255,255,0.14)] ${
            open
              ? "border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.09)]"
              : "border-[var(--ob-glass-border)] bg-[rgba(255,255,255,0.06)]"
          }`}
          aria-hidden
        >
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{
              duration: instant ? 0 : 0.32,
              ease: EASE,
            }}
            className="inline-flex"
          >
            <ChevronDown
              className="size-4 text-[var(--ob-text-soft)] transition-colors duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#e8ecff]"
              strokeWidth={2.25}
            />
          </motion.span>
        </span>
      </button>

      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!open}
        initial={false}
        animate={{ height: open ? "auto" : 0 }}
        transition={{
          height: { duration: heightDuration, ease: EASE },
        }}
        style={{ overflow: "hidden" }}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: open ? 1 : 0,
            y: open ? 0 : -6,
          }}
          transition={{
            duration: contentDuration,
            ease: EASE,
          }}
          className="ob-faq-answer-selectable px-4 pb-4 pt-1 font-sans text-sm leading-relaxed text-[var(--ob-text-soft)] sm:px-5 sm:text-[0.9375rem]"
        >
          {item.answer}
        </motion.div>
      </motion.div>
    </div>
  );
}

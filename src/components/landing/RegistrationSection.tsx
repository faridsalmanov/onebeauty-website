"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Users } from "lucide-react";
import type { ChangeEvent, FormEvent, ReactElement } from "react";
import { useEffect, useState } from "react";
import { REGISTER_EMAIL_PREFILL_EVENT } from "./registerPrefillEvent";
import { CountdownDigit, DIGIT_LABELS, useCountdown, useDeadline } from "./useCountdown";

interface FormData {
  salonName: string;
  ownerName: string;
  phone: string;
  email: string;
  city: string;
  employees: string;
  agreeDiscount: boolean;
}

const INITIAL_FORM: FormData = {
  salonName: "",
  ownerName: "",
  phone: "",
  email: "",
  city: "",
  employees: "",
  agreeDiscount: false,
};

const STAGGER_EASE = [0.22, 1, 0.36, 1] as const;

function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}): ReactElement {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-sans text-xs font-semibold tracking-[0.12em] text-[var(--ob-text-soft)] uppercase"
      >
        {label}
        {required && <span className="ml-0.5 text-[#e8ecff]">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--ob-glass-border)] bg-[rgba(255,255,255,0.04)] px-4 py-3 font-sans text-sm text-[var(--ob-text)] outline-none transition-all duration-300 placeholder:text-[var(--ob-text-faint)] hover:border-[rgba(255,255,255,0.2)] focus:border-[rgba(186,170,255,0.5)] focus:bg-[rgba(255,255,255,0.06)] focus:shadow-[0_0_0_3px_rgba(186,170,255,0.12)] focus:ring-0"
      />
    </div>
  );
}

function SuccessState(): ReactElement {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="register"
      className="relative scroll-mt-28 overflow-hidden bg-transparent py-24 md:py-32 md:scroll-mt-32"
    >
      <div className="relative z-[1] mx-auto max-w-xl px-4 text-center md:px-8">
        <motion.div
          initial={reduceMotion ? {} : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: STAGGER_EASE }}
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(46,125,50,0.3)] bg-[rgba(46,125,50,0.1)] shadow-[0_0_40px_rgba(46,125,50,0.15)]">
            <CheckCircle2
              className="size-10 text-[var(--ob-success)]"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-[var(--ob-text)] md:text-3xl">
            You&rsquo;re on the list!
          </h2>
          <p className="mt-3 font-sans text-base leading-relaxed text-[var(--ob-text-soft)]">
            We&rsquo;ll reach out when your salon&rsquo;s spot is ready. Keep
            an eye on your inbox.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function RegistrationSection(): ReactElement {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const onPrefill = (e: Event): void => {
      if (!(e instanceof CustomEvent)) {
        return;
      }
      const raw = (e.detail as { email?: string })?.email;
      const em = typeof raw === "string" ? raw.trim() : "";
      if (em.length === 0) {
        return;
      }
      setForm((prev) => ({ ...prev, email: em }));
    };
    window.addEventListener(REGISTER_EMAIL_PREFILL_EVENT, onPrefill);
    return (): void => {
      window.removeEventListener(REGISTER_EMAIL_PREFILL_EVENT, onPrefill);
    };
  }, []);

  const deadline = useDeadline(30);
  const timeLeft = useCountdown(deadline);
  const countdownValues = [
    timeLeft.days,
    timeLeft.hours,
    timeLeft.minutes,
    timeLeft.seconds,
  ];

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return <SuccessState />;
  }

  return (
    <section
      id="register"
      className="relative scroll-mt-28 overflow-hidden bg-transparent py-24 md:py-32 md:scroll-mt-32"
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
        aria-hidden
      >
        <div className="h-[500px] w-[900px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(186,170,255,0.06)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-[1] mx-auto max-w-3xl px-4 md:px-8">
        {/* Badge */}
        <motion.div
          className="flex justify-center"
          initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: STAGGER_EASE }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ob-glass-border)] bg-[var(--ob-glass-bg)] px-4 py-1.5 font-sans text-xs font-semibold tracking-[0.18em] text-[var(--ob-text-soft)] uppercase backdrop-blur-md">
            <Users className="size-3.5" strokeWidth={2.2} />
            Register now
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="mx-auto mt-6 max-w-xl text-center font-serif text-[clamp(1.75rem,4.5vw,3rem)] font-medium italic leading-[1.1] tracking-tight text-[#e8ecff] drop-shadow-[0_0_28px_rgba(186,170,255,0.35)]"
          initial={reduceMotion ? {} : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.08, ease: STAGGER_EASE }}
        >
          Early Registration Benefit
        </motion.h2>

        {/* Description */}
        <motion.p
          className="mx-auto mt-5 max-w-lg text-center font-sans text-base leading-relaxed text-[var(--ob-text-soft)]"
          initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: STAGGER_EASE }}
        >
          Register during this early access window and lock in exclusive
          lifetime benefits for your salon.
        </motion.p>

        {/* Compact countdown timer */}
        <motion.div
          className="mt-8"
          initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: STAGGER_EASE }}
        >
          <p className="mb-4 text-center font-sans text-xs font-semibold tracking-[0.2em] text-[var(--ob-text-faint)] uppercase">
            Offer expires in
          </p>
          <div className="flex items-center justify-center gap-3 md:gap-4">
            {countdownValues.map((v, i) => (
              <CountdownDigit
                key={DIGIT_LABELS[i]}
                value={v}
                label={DIGIT_LABELS[i]}
                reduceMotion={reduceMotion}
                compact
              />
            ))}
          </div>
        </motion.div>

        {/* Form card — scroll target from hero waitlist */}
        <motion.form
          id="register-form"
          onSubmit={handleSubmit}
          className="mt-12 scroll-mt-28 rounded-2xl border border-[var(--ob-glass-border)] bg-[rgba(255,255,255,0.03)] p-6 shadow-[0_16px_64px_-16px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-xl sm:p-8 md:p-10 md:scroll-mt-32"
          initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.25, ease: STAGGER_EASE }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              id="salonName"
              label="Salon Name"
              value={form.salonName}
              onChange={handleChange}
              placeholder="e.g. Luxe Hair Studio"
            />
            <InputField
              id="ownerName"
              label="Owner Name"
              value={form.ownerName}
              onChange={handleChange}
            />
            <InputField
              id="phone"
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+994 XX XXX XX XX"
            />
            <InputField
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@salon.com"
            />
            <InputField
              id="city"
              label="City"
              value={form.city}
              onChange={handleChange}
            />
            <div>
              <label
                htmlFor="employees"
                className="mb-1.5 block font-sans text-xs font-semibold tracking-[0.12em] text-[var(--ob-text-soft)] uppercase"
              >
                Number of Employees
                <span className="ml-0.5 text-[#e8ecff]">*</span>
              </label>
              <select
                id="employees"
                name="employees"
                required
                value={form.employees}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-[var(--ob-glass-border)] bg-[rgba(255,255,255,0.04)] px-4 py-3 font-sans text-sm text-[var(--ob-text)] outline-none transition-all duration-300 hover:border-[rgba(255,255,255,0.2)] focus:border-[rgba(186,170,255,0.5)] focus:bg-[rgba(255,255,255,0.06)] focus:shadow-[0_0_0_3px_rgba(186,170,255,0.12)] focus:ring-0"
              >
                <option value="" className="bg-[var(--ob-hero-mid)] text-[var(--ob-text-faint)]">
                  Select range
                </option>
                <option value="1-3" className="bg-[var(--ob-hero-mid)]">1 – 3</option>
                <option value="4-10" className="bg-[var(--ob-hero-mid)]">4 – 10</option>
                <option value="11-25" className="bg-[var(--ob-hero-mid)]">11 – 25</option>
                <option value="25+" className="bg-[var(--ob-hero-mid)]">25+</option>
              </select>
            </div>
          </div>

          {/* Checkbox */}
          <div className="mt-6 flex items-start gap-3">
            <input
              id="agreeDiscount"
              name="agreeDiscount"
              type="checkbox"
              required
              checked={form.agreeDiscount}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 rounded border-[var(--ob-glass-border)] bg-transparent accent-[#baaafe]"
            />
            <label
              htmlFor="agreeDiscount"
              className="font-sans text-sm leading-relaxed text-[var(--ob-text-soft)]"
            >
              I agree to receive updates about my founding salon benefits and
              early access.
            </label>
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--ob-cta-bg)] py-4 font-sans text-sm font-semibold tracking-tight text-[var(--ob-cta-text)] shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] transition-all duration-300 hover:shadow-[0_0_32px_rgba(34,42,53,0.1),0_4px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(34,42,53,0.06),0_16px_68px_rgba(47,48,55,0.08)]"
            whileHover={reduceMotion ? {} : { scale: 1.01 }}
            whileTap={reduceMotion ? {} : { scale: 0.98 }}
          >
            Secure your spot
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </motion.button>

          {/* Fine print */}
          <p className="mt-4 text-center font-sans text-xs text-[var(--ob-text-faint)]">
            No payment required. We&rsquo;ll contact you when onboarding begins.
          </p>
        </motion.form>
      </div>
    </section>
  );
}

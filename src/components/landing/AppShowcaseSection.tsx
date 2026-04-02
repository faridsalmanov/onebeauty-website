"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { useLayoutEffect, useRef, useState, useEffect } from "react";

type ShowcaseCard = {
  id: string;
  title: string;
  description: string;
  placeholderLabel?: string;
  /** `true` = image on the right on md+; `false` = image on top. */
  mediaOnSide: boolean;
  customMedia?: () => ReactElement;
};

/** Decorative spear + stem above the cream block (not part of the scroll mask). */
function ShowcaseSpearOrnament(): ReactElement {
  return (
    <div
      className="pointer-events-none -mb-px flex justify-center"
      aria-hidden
    >
      <svg
        width={22}
        height={52}
        viewBox="0 0 22 52"
        aria-hidden
        className="text-[var(--ob-showcase-surface)] drop-shadow-[0_0_14px_rgb(247_241_230_/_0.35)]"
      >
        {/* Thin stem */}
        <line
          x1="11"
          y1="0"
          x2="11"
          y2="34"
          stroke="currentColor"
          strokeWidth={1.35}
          strokeLinecap="round"
          opacity={0.92}
        />
        {/* Spear head — tapered diamond pointing into the panel */}
        <path
          d="M11 32 L17.2 42 L11 50 L4.8 42 Z"
          fill="currentColor"
          fillOpacity={0.22}
          stroke="currentColor"
          strokeWidth={1.1}
          strokeLinejoin="round"
          opacity={0.95}
        />
      </svg>
    </div>
  );
}

function BookingTimelineIllustration(): ReactElement {
  const APPTS = [
    { time: "09:00", service: "Balayage", client: "S.M.", stylist: "Maya K.", accent: "#c7d2fe" },
    { time: "09:30", service: "Blowdry & Style", client: "L.K.", stylist: "Sara L.", accent: "#fde68a" },
    { time: "10:30", service: "Trim & Finish", client: "R.J.", stylist: "Alex T.", accent: "#a7f3d0" },
    { time: "11:00", service: "Color Refresh", client: "A.N.", stylist: "Maya K.", accent: "#c7d2fe" },
    { time: "12:30", service: "Full Highlights", client: "D.B.", stylist: "Sara L.", accent: "#fde68a" },
  ];

  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = containerRef.current?.closest("[data-showcase-card]");
    if (!card) return;
    const onEnter = (): void => setHovered(true);
    const onLeave = (): void => setHovered(false);
    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-white">
      <div className="px-5 pb-3 pt-5">
        <div>
          <p className="font-sans text-[0.6rem] font-semibold tracking-[0.18em] text-[var(--ob-showcase-muted)] uppercase">
            Today&apos;s Appointments
          </p>
          <p className="mt-0.5 font-sans text-sm font-bold text-[var(--ob-showcase-ink)]">
            Thursday, Mar 28
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 overflow-hidden px-4 pb-4">
        {APPTS.map((a, i) => (
          <div
            key={a.time + a.client}
            className="flex items-center gap-3 rounded-xl border bg-[#fafaf9] px-3 py-2 transition-all duration-500 ease-out"
            style={{
              transitionDelay: `${i * 70}ms`,
              borderColor: hovered ? `${a.accent}88` : "#f0f0ee",
              boxShadow: hovered
                ? `0 0 12px 1px ${a.accent}55, inset 0 0 8px ${a.accent}18`
                : "none",
            }}
          >
            <span className="w-10 shrink-0 font-sans text-[0.65rem] font-semibold tabular-nums text-[var(--ob-showcase-muted)]">
              {a.time}
            </span>
            <div
              className="h-7 w-1.5 shrink-0 rounded-full transition-all duration-500 ease-out"
              style={{
                backgroundColor: a.accent,
                transitionDelay: `${i * 70}ms`,
                boxShadow: hovered
                  ? `0 0 12px 3px ${a.accent}, 0 0 24px 6px ${a.accent}66`
                  : `0 0 0 0 ${a.accent}00`,
                transform: hovered ? "scaleY(1.15)" : "scaleY(1)",
              }}
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-sans text-[0.78rem] font-semibold text-[var(--ob-showcase-ink)]">
                {a.service}
              </span>
              <span className="font-sans text-[0.62rem] text-[var(--ob-showcase-muted)]">
                {a.client}
              </span>
            </div>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 font-sans text-[0.6rem] font-semibold text-[var(--ob-primary)]"
              style={{ background: "rgba(3,39,97,0.06)" }}
            >
              {a.stylist}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamAndServicesIllustration(): ReactElement {
  const ROWS: {
    name: string;
    initial: string;
    color: string;
    services: { label: string; price: number; duration: string }[];
    hours: string;
  }[] = [
    {
      name: "Maya K.",
      initial: "M",
      color: "#6366f1",
      services: [
        { label: "Balayage", price: 140, duration: "90m" },
        { label: "Cut & finish", price: 68, duration: "45m" },
      ],
      hours: "Mon–Sat · 09:00–18:00",
    },
    {
      name: "Sara L.",
      initial: "S",
      color: "#8b5cf6",
      services: [
        { label: "Color refresh", price: 112, duration: "60m" },
        { label: "Blowdry & style", price: 46, duration: "30m" },
      ],
      hours: "Tue–Sat · 10:00–19:00",
    },
    {
      name: "Alex T.",
      initial: "A",
      color: "#0ea5e9",
      services: [
        { label: "Men's cut", price: 52, duration: "30m" },
        { label: "Beard trim", price: 28, duration: "15m" },
      ],
      hours: "Wed–Sun · 09:30–17:00",
    },
  ];

  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = containerRef.current?.closest("[data-showcase-card]");
    if (!card) return;
    const onEnter = (): void => setHovered(true);
    const onLeave = (): void => setHovered(false);
    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-gradient-to-br from-[#fafafa] to-[#f5f5f4]"
    >
      {/* Reserve top space so the header isn&apos;t clipped by the media frame */}
      <div className="shrink-0 basis-4 sm:basis-5" aria-hidden />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center px-3 pb-1 pt-0.5 sm:px-4 sm:pb-1.5 sm:pt-1">
          <div className="min-w-0">
            <p className="font-sans text-[0.6rem] font-semibold tracking-[0.2em] text-[var(--ob-showcase-muted)] uppercase">
              Team &amp; services
            </p>
            <p className="mt-0.5 truncate font-sans text-[0.9rem] font-bold tracking-tight text-[var(--ob-showcase-ink)] sm:text-[1rem]">
              Your salon menu
            </p>
          </div>
        </div>

        <div className="grid min-h-0 min-w-0 flex-1 grid-cols-3 gap-1.5 overflow-hidden px-2.5 pb-3 pt-3 sm:gap-2 sm:px-3.5 sm:pb-4 sm:pt-3.5">
        {ROWS.map(({ name, initial, color, services, hours }, colIdx) => (
          <div
            key={name}
            className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border bg-white transition-all duration-500 ease-out"
            style={{
              transitionDelay: `${colIdx * 100}ms`,
              borderColor: hovered ? `${color}44` : "rgba(255,255,255,0.8)",
              boxShadow: hovered
                ? `0 8px 24px -4px ${color}22, 0 0 0 1px ${color}18`
                : "0 2px 8px rgba(0,0,0,0.04)",
              /* Subtle lift + padding above so overflow-hidden doesn&apos;t clip on hover */
              transform: hovered ? "translateY(-2px) scale(1.02)" : "translateY(0) scale(1)",
            }}
          >
            <div
              className="flex shrink-0 items-center gap-1.5 px-2 py-2 transition-all duration-500 ease-out"
              style={{
                transitionDelay: `${colIdx * 100}ms`,
                background: hovered
                  ? `linear-gradient(135deg, ${color}22 0%, ${color}10 100%)`
                  : `linear-gradient(135deg, ${color}12 0%, ${color}06 100%)`,
              }}
            >
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-sans text-[0.58rem] font-bold text-white transition-[box-shadow] duration-500 ease-out"
                style={{
                  backgroundColor: color,
                  transitionDelay: `${colIdx * 100}ms`,
                  boxShadow: hovered
                    ? `0 0 14px 3px ${color}66`
                    : "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-sans text-[0.6rem] font-bold leading-tight text-[var(--ob-showcase-ink)]">
                  {name.split(" ")[0]}
                </p>
                <p className="truncate font-sans text-[0.46rem] leading-snug text-[var(--ob-showcase-muted)]">
                  {hours}
                </p>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden px-1.5 pb-1.5 pt-1">
              {services.map((s, sIdx) => (
                <div
                  key={s.label}
                  className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-white to-[#fafafa] px-1.5 py-1 transition-all duration-500 ease-out"
                  style={{
                    transitionDelay: `${colIdx * 100 + sIdx * 80}ms`,
                    borderColor: hovered ? `${color}30` : "#e8e8e4",
                    transform: hovered ? "translateY(-1px)" : "translateY(0)",
                    boxShadow: hovered
                      ? `0 2px 8px ${color}15`
                      : "none",
                  }}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-sans text-[0.56rem] font-semibold leading-tight text-[var(--ob-showcase-ink)]">
                        {s.label}
                      </p>
                      <p className="font-sans text-[0.46rem] leading-tight text-[var(--ob-showcase-muted)]">
                        {s.duration}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md border border-[#e0e0dc] bg-white px-1.5 py-0.5 font-sans text-[0.54rem] font-bold tabular-nums leading-none text-[var(--ob-primary)] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                      {s.price}₼
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

/**
 * When `active`, animates from `animateFrom` (default 0) up to `target`.
 * When inactive, snaps to `target` so the resting state always shows full values.
 */
function useAnimatedNumber(
  target: number,
  active: boolean,
  duration = 800,
  delay = 0,
  animateFrom = 0,
): number {
  const [value, setValue] = useState(target);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => setValue(target));
      return;
    }
    const from = Math.min(animateFrom, target);
    rafRef.current = requestAnimationFrame(() => setValue(from));
    let start: number | null = null;
    const delayTimeout = window.setTimeout(() => {
      const step = (ts: number): void => {
        if (start === null) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(from + eased * (target - from)));
        if (progress < 1) rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(delayTimeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, target, duration, delay, animateFrom]);

  return value;
}

function StaffPerformanceIllustration(): ReactElement {
  const STYLISTS = [
    { name: "Maya K.", initial: "M", revenue: 4200, pct: 84, bookings: 28 },
    { name: "Sara L.", initial: "S", revenue: 3800, pct: 76, bookings: 24 },
    { name: "Alex T.", initial: "A", revenue: 2950, pct: 59, bookings: 19 },
    { name: "Lena R.", initial: "L", revenue: 1870, pct: 37, bookings: 12 },
  ];

  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = containerRef.current?.closest("[data-showcase-card]");
    if (!card) return;
    const onEnter = (): void => setHovered(true);
    const onLeave = (): void => setHovered(false);
    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-sans text-[0.6rem] font-semibold tracking-[0.18em] text-[var(--ob-showcase-muted)] uppercase">
            Performance
          </p>
          <p className="mt-0.5 font-sans text-sm font-bold text-[var(--ob-showcase-ink)]">
            This Month
          </p>
        </div>
        <span
          className="rounded-full px-2.5 py-1 font-sans text-[0.68rem] font-semibold text-green-700"
          style={{ background: "rgba(22,163,74,0.08)" }}
        >
          +12% vs last
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {STYLISTS.map((s, i) => (
          <StaffPerformanceRow key={s.name} stylist={s} index={i} hovered={hovered} />
        ))}
      </div>
    </div>
  );
}

function StaffPerformanceRow({
  stylist,
  index,
  hovered,
}: {
  stylist: { name: string; initial: string; revenue: number; pct: number; bookings: number };
  index: number;
  hovered: boolean;
}): ReactElement {
  const delay = index * 120;
  const animRevenue = useAnimatedNumber(stylist.revenue, hovered, 900, delay);
  const animBookings = useAnimatedNumber(stylist.bookings, hovered, 700, delay);

  // Bar starts full, resets to 0 on hover entry, then CSS-transitions to full
  const [barWidth, setBarWidth] = useState(stylist.pct);
  const [barGlow, setBarGlow] = useState(false);

  useEffect(() => {
    if (hovered) {
      requestAnimationFrame(() => {
        setBarWidth(0);
        setBarGlow(false);
      });
      const t = window.setTimeout(() => {
        requestAnimationFrame(() => {
          setBarWidth(stylist.pct);
          setBarGlow(true);
        });
      }, delay);
      return () => clearTimeout(t);
    } else {
      requestAnimationFrame(() => {
        setBarWidth(stylist.pct);
        setBarGlow(false);
      });
    }
  }, [hovered, delay, stylist.pct]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ob-primary)] font-sans text-[0.6rem] font-bold text-white">
        {stylist.initial}
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="font-sans text-[0.72rem] font-semibold text-[var(--ob-showcase-ink)]">
            {stylist.name}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-sans text-[0.62rem] tabular-nums text-[var(--ob-showcase-muted)]">
              {animBookings} bookings
            </span>
            <span className="font-sans text-[0.72rem] font-semibold tabular-nums text-[var(--ob-primary)]">
              {animRevenue.toLocaleString()}₼
            </span>
          </div>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--ob-primary)]/[0.08]">
          <div
            className="h-full rounded-full transition-[width,box-shadow,background] duration-700 ease-out"
            style={{
              width: `${barWidth}%`,
              background: "linear-gradient(90deg, #032761, #0645a8)",
              boxShadow: barGlow ? "0 0 8px 1px rgba(3,39,97,0.4)" : "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* Chart geometry — viewBox 0 0 400 140 */
const W = 400;
const H = 140;
/* Raw data points [x, y] — y=0 is top */
const CHART_PTS: [number, number][] = [
  [0, 118], [57, 104], [114, 82], [171, 62],
  [228, 80], [285, 42], [372, 10],
];
/* Horizontal grid lines at y=20,50,80,110 */
const GRID_YS = [20, 50, 80, 110] as const;
const CHART_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
/* Vertical grid lines, one per data point */
const VERT_XS = CHART_PTS.map(([x]) => x);

/** Catmull-Rom → cubic bezier path string */
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const CHART_LINE = smoothPath(CHART_PTS);
const CHART_AREA = `${CHART_LINE} L ${CHART_PTS[CHART_PTS.length - 1][0]} ${H} L 0 ${H} Z`;

/** Monthly revenue headline — hover counts from 10,260₼ up to 12,250₼ */
const ANALYTICS_REVENUE_TARGET = 12250;
const ANALYTICS_REVENUE_ANIM_FROM = 10260;

function AnalyticsLineChart(): ReactElement {
  const [hovered, setHovered] = useState(false);
  const [pathLength, setPathLength] = useState(0);
  // `chartDrawn` drives the dash-offset. Starts true so the line is
  // visible in the default (unhovered) state. On hover: reset to false,
  // then RAF to true so the CSS transition re-plays the draw animation.
  const [chartDrawn, setChartDrawn] = useState(true);
  // Increment on each hover to remount dots → re-triggers pop animation
  const [hoverKey, setHoverKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (lineRef.current) setPathLength(lineRef.current.getTotalLength());
  }, []);

  useEffect(() => {
    const card = containerRef.current?.closest("[data-showcase-card]");
    if (!card) return;
    const onEnter = (): void => {
      setHovered(true);
      setHoverKey((k) => k + 1);
      // Reset line to hidden, then animate in next paint
      setChartDrawn(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setChartDrawn(true));
      });
    };
    const onLeave = (): void => {
      setHovered(false);
      setChartDrawn(true); // stay drawn, no animation
    };
    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const animRevenue = useAnimatedNumber(
    ANALYTICS_REVENUE_TARGET,
    hovered,
    1200,
    200,
    ANALYTICS_REVENUE_ANIM_FROM,
  );
  const dash = pathLength || 1400;

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-white"
      aria-hidden
    >
      <div className="flex items-start justify-between px-5 pb-2 pt-5">
        <div>
          <p className="font-sans text-[0.6rem] font-semibold tracking-[0.18em] text-[var(--ob-showcase-muted)] uppercase">
            Monthly Revenue
          </p>
          <p className="mt-1 font-sans text-[1.85rem] font-bold leading-none tracking-tight tabular-nums text-[var(--ob-showcase-ink)]">
            {animRevenue.toLocaleString()}₼
          </p>
        </div>
      </div>

      <div className="relative flex-1 px-1">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          preserveAspectRatio="none"
          style={{ display: "block", height: "100%", minHeight: "63px" }}
        >
          <defs>
            <linearGradient id="ob-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#032761" stopOpacity="0.18" />
              <stop offset="85%" stopColor="#032761" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#032761" stopOpacity="0" />
            </linearGradient>
            <filter id="ob-line-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {GRID_YS.map((y) => (
            <line
              key={y}
              x1="8" y1={y} x2={W - 8} y2={y}
              stroke="#032761" strokeOpacity="0.08" strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {VERT_XS.map((x) => (
            <line
              key={x}
              x1={x} y1="0" x2={x} y2={H}
              stroke="#032761" strokeOpacity="0.05" strokeWidth="1"
              strokeDasharray="3 5"
            />
          ))}

          {/* Area fill — always visible */}
          <path d={CHART_AREA} fill="url(#ob-area-grad)" />

          {/* Glow halo behind line — only animate on hover, otherwise hidden */}
          <path
            d={CHART_LINE}
            fill="none"
            stroke="#032761"
            strokeOpacity={0.15}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#ob-line-glow)"
            style={{
              strokeDasharray: dash,
              strokeDashoffset: chartDrawn ? 0 : dash,
              // No transition when snapping back to drawn; animate only when drawing
              transition: chartDrawn ? "stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)" : "none",
            }}
          />

          {/* Main line */}
          <path
            ref={lineRef}
            d={CHART_LINE}
            fill="none"
            stroke="#032761"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: dash,
              strokeDashoffset: chartDrawn ? 0 : dash,
              transition: chartDrawn ? "stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)" : "none",
            }}
          />

          {/* Data-point dots — always rendered; hoverKey remounts them to re-pop */}
          {CHART_PTS.map(([cx, cy], idx) => (
            <circle
              key={`${idx}-${hoverKey}`}
              cx={cx}
              cy={cy}
              r="4"
              fill="white"
              stroke="#032761"
              strokeWidth="2"
              style={
                hoverKey > 0
                  ? {
                      opacity: 0,
                      animation: `ob-dot-pop 0.35s ease-out ${0.3 + idx * 0.12}s forwards`,
                    }
                  : { opacity: 1 }
              }
            />
          ))}
        </svg>
      </div>

      <div className="flex justify-between px-4 pb-3 pt-1">
        {CHART_DAYS.map((d) => (
          <span key={d} className="font-sans text-[0.58rem] font-medium text-[var(--ob-showcase-muted)]">
            {d}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes ob-dot-pop {
          0% { opacity: 0; r: 0; }
          60% { opacity: 1; r: 5; }
          100% { opacity: 1; r: 4; }
        }
      `}</style>
    </div>
  );
}

const SHOWCASE_CARDS: readonly ShowcaseCard[] = [
  {
    id: "smart-booking",
    title: "",
    description: "",
    mediaOnSide: false,
    customMedia: BookingTimelineIllustration,
  },
  {
    id: "team-services",
    title: "",
    description: "",
    mediaOnSide: false,
    customMedia: TeamAndServicesIllustration,
  },
  {
    id: "staff-performance",
    title: "",
    description: "",
    mediaOnSide: false,
    customMedia: StaffPerformanceIllustration,
  },
  {
    id: "salon-analytics",
    title: "",
    description: "",
    mediaOnSide: false,
    customMedia: AnalyticsLineChart,
  },
];

export function AppShowcaseSection(): ReactElement {
  const locale = useLocale();
  const t = useTranslations("home.showcase");
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!section || !panel || !content) {
      return;
    }

    gsap.set(panel, {
      scaleX: 0.88,
      scaleY: 0.78,
      transformOrigin: "50% 0%",
      force3D: true,
      willChange: "transform",
    });
    gsap.set(content, { opacity: 0.62, y: 12 });

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-showcase-card]");
      const cardMedia = gsap.utils.toArray<HTMLElement>(
        "[data-showcase-card-media]",
      );

      const endDistance = (): string =>
        `+=${window.innerHeight * (window.innerWidth < 768 ? 0.95 : 1.05)}`;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top 92%",
          end: endDistance,
          scrub: 0.85,
          pin: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        panel,
        { scaleX: 1, scaleY: 1, duration: 1, ease: "none" },
        0,
      );

      tl.to(
        content,
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.55,
        },
        0.22,
      );

      tl.fromTo(
        cardMedia,
        { scale: 1.08, opacity: 0.84 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.08,
        },
        0.36,
      );

      tl.fromTo(
        cards,
        { opacity: 0, y: 28, scale: 0.982 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.36,
          ease: "power2.out",
          stagger: 0.1,
        },
        0.4,
      );

    }, section);

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
    <section
      ref={sectionRef}
      id="app-preview"
      className="relative z-10 scroll-mt-24"
      aria-labelledby="app-showcase-heading"
    >
      <div className="mx-auto flex w-full max-w-[min(100%,120rem)] flex-col items-stretch px-3 sm:px-4 md:pl-0 md:pr-4 lg:pr-5">
        <ShowcaseSpearOrnament />
        <div className="relative w-full overflow-visible rounded-[clamp(1.15rem,2.8vw,2rem)] shadow-[0_-28px_80px_-36px_rgba(0,0,0,0.5)]">
          <div
            ref={panelRef}
            data-app-showcase-panel
            className="w-full origin-top overflow-hidden rounded-[clamp(1.15rem,2.8vw,2rem)] border border-black/[0.08] bg-[var(--ob-showcase-surface)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] will-change-transform"
            style={{
              transform: "scale3d(0.88, 0.78, 1)",
              transformOrigin: "50% 0%",
            }}
          >
            <div
              ref={contentRef}
              data-app-showcase-content
              className="mx-auto max-w-7xl px-4 pb-24 pt-12 md:px-8 md:pb-28 md:pt-20 lg:px-10"
              style={{ opacity: 0.62, transform: "translateY(12px)" }}
            >
              <div className="mx-auto max-w-2xl text-center md:max-w-3xl">
                <p className="flex items-center justify-center gap-2 font-sans text-xs font-medium tracking-[0.2em] text-[var(--ob-showcase-muted)] uppercase">
                  <Sparkles
                    className="size-3.5 shrink-0 text-[var(--ob-primary)]/55"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  {t("eyebrow")}
                </p>
                <h2
                  id="app-showcase-heading"
                  {...(locale === "az" ? { "data-showcase-az-heading": "" } : {})}
                  className="mt-3 font-serif text-fluid-serif-lg font-semibold leading-tight tracking-tighter text-[var(--ob-primary)]"
                >
                  {t("title")}
                </h2>
                <p className="mt-4 font-sans text-base leading-relaxed text-[var(--ob-showcase-muted)] md:text-lg">
                  {t("body")}
                </p>
              </div>

              <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-5">
                {SHOWCASE_CARDS.map((card): ReactElement => {
                  const cardKey =
                    card.id === "smart-booking"
                      ? ("smartBooking" as const)
                      : card.id === "team-services"
                        ? ("teamServices" as const)
                        : card.id === "staff-performance"
                          ? ("staffPerformance" as const)
                          : ("salonAnalytics" as const);
                  const bodyClass =
                    "font-sans text-[0.9375rem] leading-relaxed text-[var(--ob-primary)]/60";

                  const textBlockTopImage = (
                    /*
                     * Clip-based slide — no opacity, pure transform.
                     * H = 7rem (md 7.5rem).
                     *
                     * Body at rest: translate-y-[4.5rem] → top edge past container → clipped.
                     * Body on hover: translate-y-0 → slides into view.
                     * Title on hover: −translate-y-[3.75rem] → slides up to make room.
                     */
                    <div className="relative h-[7rem] overflow-hidden px-4 pb-4 md:h-[7.5rem] md:px-6 md:pb-5">
                      <p
                        data-showcase-card-body
                        className={`${bodyClass} absolute bottom-4 left-4 right-4 line-clamp-2 translate-y-[4.5rem] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 group-hover:translate-y-0 group-focus-within:translate-y-0 md:bottom-5 md:left-6 md:right-6`}
                      >
                        {t(`cards.${cardKey}.description`)}
                      </p>
                      <h3 className="absolute bottom-4 left-4 right-4 font-sans text-[clamp(1.35rem,2.4vw,2.05rem)] font-semibold leading-[1.08] tracking-tight text-[var(--ob-primary)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:translate-y-0 group-hover:-translate-y-[3.75rem] group-focus-within:-translate-y-[3.75rem] md:bottom-5 md:left-6 md:right-6">
                        {t(`cards.${cardKey}.title`)}
                      </h3>
                    </div>
                  );

                  const textBlockSideImage = (
                    <div className="flex flex-col px-4 pb-3 pt-3 md:px-6 md:pb-4 md:pt-4">
                      <h3 className="font-sans text-[clamp(1.35rem,2.4vw,2.05rem)] font-semibold leading-[1.08] tracking-tight text-[var(--ob-primary)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform md:translate-y-0 md:group-hover:-translate-y-1.5 md:group-focus-within:-translate-y-1.5 motion-reduce:translate-y-0">
                        {t(`cards.${cardKey}.title`)}
                      </h3>
                      <div
                        data-showcase-card-body-wrap
                        className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-within:grid-rows-[1fr]"
                      >
                        <div className="min-h-0 overflow-hidden">
                          <p
                            data-showcase-card-body
                            className={`pt-3 ${bodyClass} opacity-100 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100`}
                          >
                            {t(`cards.${cardKey}.description`)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );

                  const textBlock = card.mediaOnSide
                    ? textBlockSideImage
                    : textBlockTopImage;

                  const bottomImageFadeClass =
                    card.id === "smart-booking"
                      ? "pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[18%] min-h-[1.9rem] max-h-[3.85rem] [background:linear-gradient(to_top,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.42)_48%,rgba(255,255,255,0.06)_82%,transparent_100%)]"
                      : "pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[32%] min-h-[3.65rem] max-h-[7.7rem] [background:linear-gradient(to_top,#fff_0%,#fff_6%,rgba(255,255,255,0.95)_18%,rgba(255,255,255,0.62)_42%,rgba(255,255,255,0.22)_68%,transparent_100%)]";

                  const mediaBlock = (
                    <div
                      data-showcase-card-media
                      className={`relative cursor-default select-none overflow-hidden bg-white ${
                        card.mediaOnSide
                          ? "order-1 h-[11.9rem] shrink-0 sm:h-[12.6rem] md:order-2 md:h-full md:min-h-[12.6rem] md:w-[min(36%,12.25rem)] md:self-stretch"
                          : "h-[11.9rem] shrink-0 sm:h-[12.6rem] md:h-[13.65rem]"
                      }`}
                    >
                      {card.customMedia != null && <card.customMedia />}
                      {card.mediaOnSide ? (
                        <div
                          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[32%] min-w-[2.75rem] max-w-[6rem] [background:linear-gradient(to_right,#fff_0%,rgba(255,255,255,0.96)_10%,rgba(255,255,255,0.72)_32%,rgba(255,255,255,0.28)_62%,transparent_100%)]"
                          aria-hidden
                        />
                      ) : (
                        <div className={bottomImageFadeClass} aria-hidden />
                      )}
                    </div>
                  );

                  return (
                    <article
                      key={card.id}
                      data-showcase-card
                      tabIndex={0}
                      className={`group flex min-h-0 overflow-hidden rounded-[1.5rem] border border-[var(--ob-primary)]/[0.09] bg-white outline-none focus-visible:ring-2 focus-visible:ring-[var(--ob-primary)]/35 ${
                        card.mediaOnSide
                          ? "flex-col md:flex-row md:items-stretch"
                          : "flex-col"
                      }`}
                    >
                      {card.mediaOnSide ? (
                        <>
                          <div className="order-2 flex min-h-0 min-w-0 flex-1 flex-col justify-end md:order-1">
                            {textBlock}
                          </div>
                          {mediaBlock}
                        </>
                      ) : (
                        <>
                          {mediaBlock}
                          {textBlock}
                        </>
                      )}
                    </article>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

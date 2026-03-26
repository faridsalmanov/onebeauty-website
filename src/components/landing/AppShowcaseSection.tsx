"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImageIcon, Sparkles } from "lucide-react";
import Link from "next/link";
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
        className="text-[var(--ob-showcase-surface)] drop-shadow-[0_0_14px_rgba(245,240,232,0.35)]"
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

function CardMediaPlaceholder({ label }: { label: string }): ReactElement {
  return (
    <div className="relative flex h-full min-h-0 flex-col items-center justify-center gap-2 p-5 text-center md:gap-2.5 md:p-6">
      <ImageIcon
        className="size-10 text-[var(--ob-primary)]/15 md:size-11"
        strokeWidth={1.15}
        aria-hidden
      />
      <p className="max-w-[14rem] font-sans text-[0.65rem] font-medium tracking-[0.16em] text-[var(--ob-showcase-muted)] uppercase">
        {label}
      </p>
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

function AnalyticsLineChart(): ReactElement {
  const [isVisible, setIsVisible] = useState(false);
  const [pathLength, setPathLength] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (lineRef.current) setPathLength(lineRef.current.getTotalLength());
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setIsVisible(true); }); },
      { threshold: 0.15 },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const dash = pathLength || 1400;

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden"
      style={{ background: "#f5f0e8" }}
      aria-hidden
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 pb-2 pt-5">
        <div>
          <p className="font-sans text-[0.6rem] font-semibold tracking-[0.18em] text-[var(--ob-showcase-muted)] uppercase">
            Monthly Revenue
          </p>
          <p className="mt-1 font-sans text-[1.85rem] font-bold leading-none tracking-tight text-[var(--ob-showcase-ink)]">
            €24,850
          </p>
        </div>
        <span
          className="mt-1 inline-flex items-center gap-1 rounded-full border border-[var(--ob-primary)]/12 px-2.5 py-1 font-sans text-[0.7rem] font-semibold text-[var(--ob-primary)]"
          style={{ background: "rgba(3,39,97,0.06)" }}
        >
          +€317&nbsp;↗
        </span>
      </div>

      {/* Chart */}
      <div className="relative flex-1 px-1">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          preserveAspectRatio="none"
          style={{ display: "block", height: "100%", minHeight: "90px" }}
        >
          <defs>
            <linearGradient id="ob-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#032761" stopOpacity="0.18" />
              <stop offset="85%" stopColor="#032761" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#032761" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {GRID_YS.map((y) => (
            <line
              key={y}
              x1="8" y1={y} x2={W - 8} y2={y}
              stroke="#032761" strokeOpacity="0.08" strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Vertical grid lines */}
          {VERT_XS.map((x) => (
            <line
              key={x}
              x1={x} y1="0" x2={x} y2={H}
              stroke="#032761" strokeOpacity="0.05" strokeWidth="1"
              strokeDasharray="3 5"
            />
          ))}

          {/* Area fill */}
          <path
            d={CHART_AREA}
            fill="url(#ob-area-grad)"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "opacity 0.6s ease 0.4s",
            }}
          />

          {/* Line */}
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
              strokeDashoffset: isVisible ? 0 : dash,
              transition: "stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </svg>
      </div>

      {/* Day labels */}
      <div className="flex justify-between px-4 pb-3 pt-1">
        {CHART_DAYS.map((d) => (
          <span key={d} className="font-sans text-[0.58rem] font-medium text-[var(--ob-showcase-muted)]">
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

const SHOWCASE_CARDS: readonly ShowcaseCard[] = [
  {
    id: "smart-booking",
    title: "Smart Booking Timeline",
    description:
      "Live bookings, no-show flags, and staff load in one view so reception can plan the day faster.",
    placeholderLabel: "Booking timeline screenshot",
    mediaOnSide: false,
  },
  {
    id: "client-notes",
    title: "Client Notes & History",
    description:
      "Consultation notes, formulas, and visit history stay attached to each client profile for every stylist.",
    placeholderLabel: "Client profile screenshot",
    mediaOnSide: true,
  },
  {
    id: "staff-performance",
    title: "Staff Performance Snapshot",
    description:
      "Track service revenue, rebooking rate, and productivity by team member without jumping across tools.",
    placeholderLabel: "Team analytics screenshot",
    mediaOnSide: false,
  },
  {
    id: "salon-analytics",
    title: "Salon Analytics & Insights",
    description:
      "Track ratings, identify loyal clients, and see which services drive repeat bookings — all in one dashboard.",
    mediaOnSide: false,
    customMedia: AnalyticsLineChart,
  },
];

export function AppShowcaseSection(): ReactElement {
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
      const ctaWrap = section.querySelector<HTMLElement>(
        "[data-showcase-cta]",
      );

      const endDistance = (): string =>
        `+=${window.innerHeight * (window.innerWidth < 768 ? 0.95 : 1.05)}`;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          // In-flow handoff: as the section enters view, it expands in place.
          start: "top 92%",
          end: endDistance,
          scrub: 0.85,
          pin: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // set + .to so scrub at 0 stays at the pre-tween values (reliable with ScrollTrigger).
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

      if (ctaWrap) {
        tl.fromTo(
          ctaWrap,
          { opacity: 0, y: 18, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.28,
            ease: "power2.out",
          },
          0.3,
        );
      }

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
      <div className="mx-auto flex w-full max-w-[1920px] flex-col items-stretch pl-0 pr-2.5 md:pr-4 lg:pr-5">
        <ShowcaseSpearOrnament />
        {/* Outer shell matches inner surface so scale gaps read as one panel. */}
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
                  For salons
                </p>
                <h2
                  id="app-showcase-heading"
                  className="mt-3 font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-[var(--ob-primary)]"
                >
                  See OneBeauty on desk and on the go
                </h2>
                <p className="mt-4 font-sans text-base leading-relaxed text-[var(--ob-showcase-muted)] md:text-lg">
                  This waitlist is for{" "}
                  <span className="font-medium text-[var(--ob-showcase-ink)]">
                    salons
                  </span>{" "}
                  only — we&apos;re onboarding teams first. Salons that join
                  before launch get an{" "}
                  <span className="font-medium text-[var(--ob-primary)]">
                    early-bird discount on their plan
                  </span>
                  .
                </p>
              </div>

              <div
                data-showcase-cta
                className="mt-10 flex flex-col items-center gap-4 md:mt-12"
              >
                <Link
                  href="#waitlist"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--ob-primary)] px-6 font-sans text-sm font-semibold tracking-tight text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_3px_14px_-3px_rgba(3,39,97,0.38),0_0_22px_-4px_rgba(3,39,97,0.22)] transition-[background-color,box-shadow] duration-200 ease-out hover:bg-[#021a4a] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_4px_18px_-3px_rgba(2,26,74,0.42),0_0_28px_-4px_rgba(3,39,97,0.28)] active:bg-[#011632]"
                >
                  Join waitlist
                </Link>
                <p className="max-w-md text-center font-sans text-xs leading-relaxed text-[var(--ob-showcase-muted)]">
                  Same waitlist as above — we&apos;ll email salons first when
                  spots open. Early-bird pricing applies to waitlist signups
                  before public launch.
                </p>
              </div>

              <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-5">
                {SHOWCASE_CARDS.map((card): ReactElement => {
                  const textBlock = (
                    <div className="flex flex-col px-4 pb-4 pt-4 md:px-6 md:pb-5 md:pt-5">
                      <h3
                        className="font-sans text-[clamp(1.35rem,2.4vw,2.05rem)] font-semibold leading-[1.08] tracking-tight text-[var(--ob-primary)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform md:translate-y-0 md:group-hover:-translate-y-1.5 md:group-focus-within:-translate-y-1.5 motion-reduce:translate-y-0"
                      >
                        {card.title}
                      </h3>
                      <div
                        data-showcase-card-body-wrap
                        className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-within:grid-rows-[1fr]"
                      >
                        <div className="min-h-0 overflow-hidden">
                          <p
                            data-showcase-card-body
                            className="pt-3 font-sans text-[0.9375rem] leading-relaxed text-[var(--ob-showcase-ink)] opacity-100 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
                          >
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );

                  const mediaBlock = (
                    <div
                      data-showcase-card-media
                      className={`relative overflow-hidden bg-white ${
                        card.mediaOnSide
                          ? "order-1 h-[13rem] shrink-0 border-b border-[var(--ob-primary)]/[0.08] sm:h-[13.65rem] md:order-2 md:h-full md:min-h-[13.65rem] md:w-[min(36%,17.5rem)] md:self-stretch md:border-b-0 md:border-l md:border-[var(--ob-primary)]/[0.08]"
                          : "h-[13rem] shrink-0 border-b border-[var(--ob-primary)]/[0.08] sm:h-[13.65rem] md:h-[14.95rem]"
                      }`}
                    >
                      {card.customMedia ? (
                        <card.customMedia />
                      ) : (
                        <CardMediaPlaceholder label={card.placeholderLabel!} />
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

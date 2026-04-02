"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import type { ReactElement } from "react";
import { useLayoutEffect } from "react";

const DATA_HERO = "[data-landing-hero]";
const DATA_HERO_ATMOSPHERE = "[data-landing-hero-seam-atmosphere]";

/**
 * Scrubbed opacity for the fixed SiteAtmosphere stack over the cream seam (matches next section backdrop).
 */
export function HeroPinnedSeamScroll(): ReactElement | null {
  const reduceMotionPref = useReducedMotion();
  const reduceMotion = reduceMotionPref === true;

  useLayoutEffect(() => {
    if (reduceMotion) {
      return;
    }

    const hero = document.querySelector<HTMLElement>(DATA_HERO);
    const heroAtmo = document.querySelector<HTMLElement>(DATA_HERO_ATMOSPHERE);

    if (hero == null || heroAtmo == null) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          /* Lower viewport % = hero bottom must travel farther → overlay / card fade completes after more scroll */
          end: "bottom 12%",
          scrub: 0.85,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(
        heroAtmo,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "none" },
        0,
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
  }, [reduceMotion]);

  return null;
}

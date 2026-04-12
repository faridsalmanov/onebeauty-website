"use client";

import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";

/** Aligns with Tailwind `md` — no tap-to-push sparkle below this width. */
const CLICK_SPARKLE_MAX_WIDTH_PX = 767;

const pushParticleHoldSeconds = { min: 4, max: 6.5 } as const;
const pushParticleFadeSpeed = { min: 0.38, max: 0.62 } as const;

function subscribeMatchMedia(
  mq: MediaQueryList,
  onChange: () => void,
): () => void {
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", onChange);
    return (): void => mq.removeEventListener("change", onChange);
  }
  mq.addListener(onChange);
  return (): void => mq.removeListener(onChange);
}

function buildParticleOptions(
  reducedMotion: boolean,
  clickPushEnabled: boolean,
): ISourceOptions {
  return {
    fullScreen: { enable: false },
    background: { color: { value: "transparent" } },
    clear: true,
    fpsLimit: 60,
    detectRetina: true,
    pause: reducedMotion,
    interactivity: {
      events: {
        onHover: { enable: false },
        onClick: {
          enable: clickPushEnabled,
          mode: "push",
        },
        resize: { enable: true },
      },
      modes: {
        push: {
          quantity: { min: 8, max: 18 },
          particles: {
            opacity: {
              value: { min: 0, max: 0.58 },
              animation: {
                enable: true,
                mode: "decrease",
                startValue: "max",
                destroy: "min",
                delay: pushParticleHoldSeconds,
                speed: pushParticleFadeSpeed,
                decay: 0,
                count: 0,
                sync: false,
              },
            },
          },
        },
      },
    },
    particles: {
      color: { value: "#ffffff" },
      links: { enable: false },
      number: {
        value: 90,
        density: {
          enable: true,
          width: 1920,
          height: 1080,
        },
      },
      opacity: {
        value: { min: 0.1, max: 0.4 },
      },
      shape: { type: "circle" },
      size: {
        value: { min: 0.55, max: 1.65 },
      },
      move: {
        enable: true,
        speed: { min: 0.06, max: 0.28 },
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "bounce",
        },
      },
    },
  };
}

export function FloatingParticlesBackground(): ReactElement | null {
  const [engineReady, setEngineReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  /** Until first client sync, assume narrow/touch so we do not enable push briefly on phones. */
  const [clickSparkleSuppressed, setClickSparkleSuppressed] = useState(true);

  useEffect((): (() => void) | void => {
    void initParticlesEngine(async (engine): Promise<void> => {
      await loadSlim(engine);
    }).then((): void => {
      setEngineReady(true);
    });

    const mqReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqNarrow = window.matchMedia(
      `(max-width: ${CLICK_SPARKLE_MAX_WIDTH_PX}px)`,
    );
    const mqCoarsePointer = window.matchMedia("(pointer: coarse)");

    const syncInteractionFlags = (): void => {
      setReducedMotion(mqReducedMotion.matches);
      setClickSparkleSuppressed(mqNarrow.matches || mqCoarsePointer.matches);
    };
    syncInteractionFlags();

    const unsubReduced = subscribeMatchMedia(mqReducedMotion, syncInteractionFlags);
    const unsubNarrow = subscribeMatchMedia(mqNarrow, syncInteractionFlags);
    const unsubCoarse = subscribeMatchMedia(mqCoarsePointer, syncInteractionFlags);

    return (): void => {
      unsubReduced();
      unsubNarrow();
      unsubCoarse();
    };
  }, []);

  const clickPushEnabled = !reducedMotion && !clickSparkleSuppressed;

  const options = useMemo(
    (): ISourceOptions => buildParticleOptions(reducedMotion, clickPushEnabled),
    [reducedMotion, clickPushEnabled],
  );

  if (!engineReady) {
    return null;
  }

  // Wrapper `pointer-events-none`: not a hit target. Canvas uses default `auto`,
  // so clicks on empty backdrop (nothing above z-[1]) still trigger push mode.
  return (
    <Particles
      className="pointer-events-none fixed inset-0 z-[1] size-full"
      options={options}
    />
  );
}

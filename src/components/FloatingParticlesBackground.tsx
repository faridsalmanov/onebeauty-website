"use client";

import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";

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

function buildParticleOptions(reducedMotion: boolean): ISourceOptions {
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
        onClick: { enable: false },
        resize: { enable: true },
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

  useEffect((): (() => void) | void => {
    void initParticlesEngine(async (engine): Promise<void> => {
      await loadSlim(engine);
    }).then((): void => {
      setEngineReady(true);
    });

    const mqReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReduced = (): void => {
      setReducedMotion(mqReducedMotion.matches);
    };
    syncReduced();

    const unsub = subscribeMatchMedia(mqReducedMotion, syncReduced);
    return (): void => {
      unsub();
    };
  }, []);

  const options = useMemo(
    (): ISourceOptions => buildParticleOptions(reducedMotion),
    [reducedMotion],
  );

  if (!engineReady) {
    return null;
  }

  return (
    <Particles
      className="pointer-events-none fixed inset-0 z-[1] size-full"
      options={options}
    />
  );
}

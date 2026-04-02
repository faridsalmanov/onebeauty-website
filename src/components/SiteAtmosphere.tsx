import type { ReactElement } from "react";

/**
 * Full-viewport decorative gradients + film noise (fixed z-0).
 * Particles render above this layer in `FloatingParticlesBackground`.
 */
export function SiteAtmosphere(): ReactElement {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: "var(--ob-site-atmosphere-bg)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.042]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
    </>
  );
}

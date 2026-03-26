import type { ReactElement } from "react";

/**
 * Full-viewport decorative gradients + film noise (fixed z-0).
 * Particles render above this layer in `FloatingParticlesBackground`.
 */
export function SiteAtmosphere(): ReactElement {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_100%_68%_at_50%_-18%,var(--ob-glow-lavender),transparent_52%),radial-gradient(ellipse_82%_48%_at_100%_28%,var(--ob-glow-violet),transparent_48%),radial-gradient(ellipse_55%_42%_at_8%_92%,var(--ob-glow-cyan),transparent_55%),radial-gradient(ellipse_50%_40%_at_92%_88%,rgba(3,39,97,0.45),transparent_50%),linear-gradient(180deg,var(--ob-hero-mid)_0%,var(--ob-hero-deep)_48%,#030810_100%)]"
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

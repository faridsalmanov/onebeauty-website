import Image from "next/image";
import type { ReactElement } from "react";

type LogoMarkProps = {
  compact?: boolean;
  /** Set on above-the-fold header logos for faster LCP. */
  priority?: boolean;
  /** Use `""` when a parent link already has `aria-label`. */
  alt?: string;
};

const LOGO_SRC = "/images/mylogo.png";

/** Layout footprint (flow box) — keeps header / footer row height stable. */
const LAYOUT_SLOT_CLASS = "relative inline-block h-8 shrink-0 overflow-visible";

const SLOT_WIDTH_CLASS = "w-[6.25rem] sm:w-28";

export function LogoMark({
  compact = false,
  priority = false,
  alt = "onebeauty",
}: LogoMarkProps): ReactElement {
  const innerHeightClass = compact ? "h-14" : "h-24";

  return (
    <span
      className={`${LAYOUT_SLOT_CLASS} ${SLOT_WIDTH_CLASS} z-[1] motion-reduce:transition-none`}
    >
      <Image
        src={LOGO_SRC}
        alt={alt}
        width={1024}
        height={1024}
        priority={priority}
        className={`absolute left-0 top-1/2 w-auto -translate-y-1/2 object-contain object-left transition-[height,width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${innerHeightClass}`}
      />
    </span>
  );
}

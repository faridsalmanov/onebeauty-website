import type { ReactElement } from "react";

type LogoMarkProps = {
  compact?: boolean;
};

export function LogoMark({ compact = false }: LogoMarkProps): ReactElement {
  const box = compact ? "size-[26px] p-0.5" : "size-[30px] p-1";
  const cell = compact ? "size-[6px]" : "size-[7px]";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg shadow-[0_1px_2px_rgba(3,39,97,0.08)] transition-[width,height,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${box}`}
      style={{ background: "var(--ob-logo-tile-bg)" }}
      aria-hidden
    >
      <span className="grid grid-cols-2 gap-px rounded-sm p-0.5">
        <span className={`rounded-[2px] bg-[var(--ob-primary)] ${cell}`} />
        <span className={`rounded-[2px] bg-[var(--ob-primary)]/55 ${cell}`} />
        <span className={`rounded-[2px] bg-[var(--ob-primary)]/55 ${cell}`} />
        <span className={`rounded-[2px] bg-[var(--ob-primary)] ${cell}`} />
      </span>
    </div>
  );
}

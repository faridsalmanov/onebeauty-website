import type { ReactElement, ReactNode } from "react";

export function LandingShell({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-transparent text-[var(--ob-text)]">
      {children}
    </div>
  );
}

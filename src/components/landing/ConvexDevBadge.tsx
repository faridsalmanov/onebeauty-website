"use client";

import { useQuery } from "convex/react";
import type { ReactElement } from "react";
import { api } from "../../../convex/_generated/api";

export function ConvexDevBadge({
  hasConvexUrl,
}: {
  hasConvexUrl: boolean;
}): ReactElement | null {
  /** Avoid fingerprinting prod traffic or firing dev-only queries in production. */
  if (process.env.NODE_ENV !== "development" || !hasConvexUrl) {
    return null;
  }
  return <ConvexDevBadgeInner />;
}

function ConvexDevBadgeInner(): ReactElement {
  const ping = useQuery(api.example.ping);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-[10px] text-white/70 backdrop-blur-md">
      {ping === undefined ? "Convex…" : `Convex: ${ping.message}`}
    </div>
  );
}

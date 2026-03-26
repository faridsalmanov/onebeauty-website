"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactElement, ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const convex =
  convexUrl != null && convexUrl.length > 0
    ? new ConvexReactClient(convexUrl)
    : null;

export function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  if (convex == null) {
    return <>{children}</>;
  }
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

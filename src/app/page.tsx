import type { ReactElement } from "react";
import { ConvexDevBadge } from "../components/landing/ConvexDevBadge";
import { LandingPage } from "../components/landing/LandingPage";

export default function Home(): ReactElement {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const hasConvexUrl = convexUrl != null && convexUrl.length > 0;

  return (
    <>
      <LandingPage />
      <ConvexDevBadge hasConvexUrl={hasConvexUrl} />
    </>
  );
}

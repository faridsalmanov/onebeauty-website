import type { ReactElement } from "react";
import { AppShowcaseSection } from "./AppShowcaseSection";
import { HeroPinnedSeamScroll } from "./HeroPinnedSeamScroll";
import { HeroSection } from "./HeroSection";
import { LandingShell } from "./LandingShell";
import { PinnedScrollStory } from "./PinnedScrollStory";
import { RegistrationSection } from "./RegistrationSection";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { WorkflowSection } from "./WorkflowSection";

export function LandingPage(): ReactElement {
  return (
    <LandingShell>
      <SiteHeader />
      <HeroPinnedSeamScroll />
      <HeroSection />
      <PinnedScrollStory />
      <AppShowcaseSection />
      <WorkflowSection />
      <RegistrationSection />
      <SiteFooter />
    </LandingShell>
  );
}

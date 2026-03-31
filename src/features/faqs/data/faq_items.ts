export type FaqItem = {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
};

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: "what",
    question: "What is OneBeauty?",
    answer:
      "OneBeauty is a workspace for modern salons: bookings, staff schedules, client history, and day-to-day operations in one place—built for teams that outgrew spreadsheets and paper.",
  },
  {
    id: "waitlist",
    question: "Who should join the waitlist?",
    answer:
      "Salon owners and managers who want early access, product updates, and a chance to shape features before public launch. Stylists and independents are welcome too—we’ll match onboarding to your setup.",
  },
  {
    id: "launch",
    question: "When are you launching?",
    answer:
      "We’re rolling out in stages to keep quality high. Waitlist members hear first about betas, pilot programs, and regional availability.",
  },
  {
    id: "locations",
    question: "Does it work for single-location salons?",
    answer:
      "Yes. OneBeauty is designed to scale from a single chair or studio to multi-location groups without changing how your team works day to day.",
  },
  {
    id: "mobile",
    question: "Can staff use it on their phones?",
    answer:
      "The product is being built mobile-first where it matters—so stylists can check schedules, notes, and bookings without being tied to the front desk.",
  },
  {
    id: "pricing",
    question: "How will pricing work?",
    answer:
      "We’re finalizing simple, predictable plans for salons of different sizes. Waitlist subscribers will get early pricing and founding incentives when we open billing.",
  },
  {
    id: "data",
    question: "Is client and business data secure?",
    answer:
      "We treat salon and client data as sensitive by default: modern infrastructure, access controls, and practices aligned with what regulated industries expect. Details will be published in our security and privacy pages.",
  },
  {
    id: "migrate",
    question: "Can we migrate from our current tool?",
    answer:
      "We plan guided import paths for common calendars and client lists. Tell us what you use today when you join the waitlist so we can prioritize it.",
  },
  {
    id: "support",
    question: "What kind of support will you offer?",
    answer:
      "Helpful documentation, in-product guidance, and direct support for teams on paid plans. Early partners get closer access while we refine the experience.",
  },
] as const;

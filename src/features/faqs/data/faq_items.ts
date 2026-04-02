export type FaqItem = {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
};

export type FaqItemId =
  | "what"
  | "waitlist"
  | "launch"
  | "locations"
  | "mobile"
  | "pricing"
  | "data"
  | "migrate"
  | "support";

export const FAQ_ITEM_IDS: readonly FaqItemId[] = [
  "what",
  "waitlist",
  "launch",
  "locations",
  "mobile",
  "pricing",
  "data",
  "migrate",
  "support",
] as const;

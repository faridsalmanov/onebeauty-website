import { query } from "./_generated/server";

export const ping = query({
  args: {},
  handler: async (): Promise<{ ok: true; message: string }> => {
    return { ok: true, message: "Convex is wired up." };
  },
});

import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return handleI18n(request);
}

/** Match page routes only — same pattern as next-intl docs (skip api, RSC internals, Vercel hooks, static files). */
export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};

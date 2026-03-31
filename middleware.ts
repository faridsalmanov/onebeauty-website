import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip Next.js internals + common static assets.
  matcher: ["/((?!_next|.*\\..*).*)"],
};


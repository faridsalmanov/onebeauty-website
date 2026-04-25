import { getRequestConfig } from "next-intl/server";
import { routing, type AppLocale } from "./routing";

function resolveLocale(candidate: string | undefined): AppLocale {
  if (candidate != null && routing.locales.includes(candidate as AppLocale)) {
    return candidate as AppLocale;
  }

  return routing.defaultLocale;
}

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const resolvedLocale = resolveLocale(locale ?? (await requestLocale));

  return {
    locale: resolvedLocale,
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default,
  };
});

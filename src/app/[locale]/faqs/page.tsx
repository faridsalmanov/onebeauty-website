import type { ReactElement } from "react";
import { getTranslations } from "next-intl/server";
import { FaqPage } from "@/features/faqs/ui/faq_page";
import { FAQ_ITEM_IDS } from "@/features/faqs/data/faq_items";

export default async function FaqsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactElement> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });

  return (
    <FaqPage
      title={t("title")}
      subtitle={t("subtitle")}
      listAriaLabel={t("aria.list")}
      items={FAQ_ITEM_IDS.map((id) => ({
        id,
        question: t(`items.${id}.q`),
        answer: t(`items.${id}.a`),
      }))}
      ctaPrefix={t("cta.prefix")}
      ctaLinkLabel={t("cta.link")}
      ctaSuffix={t("cta.suffix")}
      backHomeLabel={t("cta.backHome")}
    />
  );
}

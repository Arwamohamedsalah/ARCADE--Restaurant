"use client";

import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { useLanguage } from "@/lib/context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <ArcadePanel className="max-w-md p-8 text-center">
        <p className="font-hud text-[10px] text-magenta tracking-[0.3em] rtl:tracking-normal">{t("notFound.error")}</p>
        <h1 className="mt-4 font-pixel text-sm leading-7 text-cyan">{t("notFound.continue")}</h1>
        <p className="mt-3 text-sm text-muted">{t("notFound.body")}</p>
        <ArcadeButton href="/" className="mt-6">
          {t("notFound.back")}
        </ArcadeButton>
      </ArcadePanel>
    </div>
  );
}

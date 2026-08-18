"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { useOnboarding } from "@/lib/context/OnboardingContext";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { arcadeSfx } from "@/lib/sound";

export function PlayerSelect() {
  const { t } = useLanguage();
  const { startBeginner, startReturning } = useOnboarding();

  return (
    <div className="fixed inset-0 z-[72] flex items-center justify-center arcade-bg px-4">
      <div className="w-full max-w-lg border border-cyan/30 bg-void/90 px-6 py-10 text-center cabinet-frame sm:px-10 sm:py-12">
        <p className="font-hud text-[10px] text-magenta tracking-[0.35em] rtl:tracking-normal">
          {t("onboard.askEyebrow")}
        </p>
        <h1 className="mt-5 font-pixel text-xl leading-relaxed text-cyan glitch sm:text-3xl">
          {t("onboard.askTitle")}
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-cream">{t("onboard.askBody")}</p>
        <ol className="mx-auto mt-5 max-w-md space-y-2 border border-gold/40 bg-gold/10 px-4 py-4 text-start font-hud text-sm leading-7 text-gold">
          <li>{t("onboard.flow1")}</li>
          <li>{t("onboard.flow2")}</li>
          <li>{t("onboard.flow3")}</li>
          <li>{t("onboard.flow4")}</li>
        </ol>
        <div className="mt-8 grid gap-3">
          <ArcadeButton
            className="w-full min-h-16 text-base"
            variant="magenta"
            onClick={() => {
              arcadeSfx.click();
              startBeginner();
            }}
          >
            {t("onboard.beginner")}
          </ArcadeButton>
          <ArcadeButton
            className="w-full min-h-14"
            variant="cyan"
            onClick={() => {
              arcadeSfx.coin();
              startReturning();
            }}
          >
            {t("onboard.returning")}
          </ArcadeButton>
        </div>
      </div>
    </div>
  );
}

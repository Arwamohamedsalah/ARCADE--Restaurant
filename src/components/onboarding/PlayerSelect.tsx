"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { useOnboarding } from "@/lib/context/OnboardingContext";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { arcadeSfx } from "@/lib/sound";
import { PlayerNameForm } from "@/components/profile/PlayerNameForm";
import { useArcade } from "@/lib/context/ArcadeContext";
import { hasCustomHandle } from "@/lib/utils";

export function PlayerSelect() {
  const { t } = useLanguage();
  const { player } = useArcade();
  const { startBeginner, startReturning } = useOnboarding();
  const named = hasCustomHandle(player.handle);

  return (
    <div className="fixed inset-0 z-[72] flex items-start justify-center overflow-y-auto arcade-bg px-4 py-6 sm:items-center">
      <div className="my-auto w-full max-w-lg border border-cyan/30 bg-void/90 px-6 py-10 text-center cabinet-frame sm:px-10 sm:py-12">
        <p className="font-hud text-[10px] text-magenta tracking-[0.35em] rtl:tracking-normal">
          {t("onboard.askEyebrow")}
        </p>
        <h1 className="mt-5 font-pixel text-xl leading-relaxed text-cyan glitch sm:text-3xl">
          {named ? t("onboard.askTitle") : t("onboard.nameTitle")}
        </h1>
        {!named ? (
          <div className="mt-8">
            <PlayerNameForm submitLabel={t("onboard.continue")} />
          </div>
        ) : (
          <>
            <p className="mx-auto mt-4 font-pixel text-sm text-gold">{player.handle}</p>
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
          </>
        )}
      </div>
    </div>
  );
}

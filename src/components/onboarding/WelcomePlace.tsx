"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { useOnboarding } from "@/lib/context/OnboardingContext";
import { FoodVisual } from "@/components/ui/FoodVisual";
import { PlayerNameForm } from "@/components/profile/PlayerNameForm";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { useArcade } from "@/lib/context/ArcadeContext";
import { hasCustomHandle } from "@/lib/utils";
import { arcadeSfx } from "@/lib/sound";

export function WelcomePlace() {
  const { t } = useLanguage();
  const { player } = useArcade();
  const { startPlay } = useOnboarding();
  const named = hasCustomHandle(player.handle);

  return (
    <div className="fixed inset-0 z-[72] flex items-start justify-center overflow-y-auto arcade-bg px-4 py-6 sm:items-center">
      <div className="my-auto w-full max-w-lg border border-cyan/30 bg-void/90 px-6 py-8 text-center cabinet-frame sm:px-10 sm:py-10">
        <p className="font-hud text-[10px] text-magenta tracking-[0.35em] rtl:tracking-normal">
          {t("onboard.welcomeEyebrow")}
        </p>
        <h1 className="mt-4 font-pixel text-2xl leading-relaxed text-cyan glitch sm:text-4xl">
          {t("insert.place")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg leading-7 text-gold">{t("onboard.welcomeBody")}</p>
        <div className="mx-auto mt-5 grid max-w-xs grid-cols-3 gap-2">
          <FoodVisual kind="burger" variant="arcade-smash" size="sm" className="mx-auto h-16 w-16" />
          <FoodVisual kind="fries" variant="pixel-fries" size="sm" className="mx-auto h-16 w-16" />
          <FoodVisual kind="pizza" variant="pixel-pep" size="sm" className="mx-auto h-16 w-16" />
        </div>
        <ol className="mx-auto mt-5 max-w-md space-y-2 border border-gold/40 bg-gold/10 px-4 py-3 text-start font-hud text-sm leading-7 text-gold">
          <li>{t("onboard.flow1")}</li>
          <li>{t("onboard.flow2")}</li>
          <li>{t("onboard.flow3")}</li>
        </ol>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-cream">{t("onboard.welcomeGame")}</p>
        {named ? (
          <ArcadeButton
            className="mt-8 w-full min-h-14"
            variant="gold"
            onClick={() => {
              arcadeSfx.click();
              startPlay();
            }}
          >
            {t("home.playNow")}
          </ArcadeButton>
        ) : (
          <div className="mt-6">
            <PlayerNameForm submitLabel={t("home.playNow")} onSaved={startPlay} />
          </div>
        )}
      </div>
    </div>
  );
}

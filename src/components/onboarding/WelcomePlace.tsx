"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { useOnboarding } from "@/lib/context/OnboardingContext";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { FoodVisual } from "@/components/ui/FoodVisual";
import { arcadeSfx } from "@/lib/sound";

export function WelcomePlace() {
  const { t } = useLanguage();
  const { continueWelcome } = useOnboarding();

  return (
    <div className="fixed inset-0 z-[72] flex items-center justify-center arcade-bg px-4">
      <div className="w-full max-w-lg border border-cyan/30 bg-void/90 px-6 py-10 text-center cabinet-frame sm:px-10 sm:py-12">
        <p className="font-hud text-[10px] text-magenta tracking-[0.35em] rtl:tracking-normal">
          {t("onboard.welcomeEyebrow")}
        </p>
        <h1 className="mt-5 font-pixel text-2xl leading-relaxed text-cyan glitch sm:text-4xl">
          {t("insert.place")}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-xl leading-8 text-gold">{t("onboard.welcomeBody")}</p>
        <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-3">
          <FoodVisual kind="burger" variant="arcade-smash" size="sm" className="mx-auto h-20 w-20" />
          <FoodVisual kind="fries" variant="pixel-fries" size="sm" className="mx-auto h-20 w-20" />
          <FoodVisual kind="pizza" variant="pixel-pep" size="sm" className="mx-auto h-20 w-20" />
        </div>
        <div className="mx-auto mt-6 max-w-md space-y-3 text-start">
          <p className="border border-cyan/40 bg-cyan/10 px-4 py-3 text-base leading-7 text-cream">
            {t("onboard.welcomeRestaurant")}
          </p>
          <p className="border border-magenta/40 bg-magenta/10 px-4 py-3 text-base leading-7 text-cream">
            {t("onboard.welcomeGame")}
          </p>
        </div>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-gold">{t("onboard.welcomeJob")}</p>
        <p className="mx-auto mt-4 max-w-md border border-gold/40 bg-gold/10 px-4 py-3 text-base leading-7 text-gold">
          {t("game.goalTitle")}: {t("game.goalBody")}
        </p>
        <ArcadeButton
          className="mt-8 w-full min-h-14"
          variant="gold"
          onClick={() => {
            arcadeSfx.click();
            continueWelcome();
          }}
        >
          {t("onboard.continue")}
        </ArcadeButton>
      </div>
    </div>
  );
}

"use client";

import { AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useArcade } from "@/lib/context/ArcadeContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import { ArcadeNav } from "@/components/layout/ArcadeNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { CRTOverlay } from "@/components/ui/CRTOverlay";
import { ArcadeToasts } from "@/components/ui/ArcadeToasts";
import { InsertCoin } from "@/components/insert/InsertCoin";
import { PlayerSelect } from "@/components/onboarding/PlayerSelect";
import { WelcomePlace } from "@/components/onboarding/WelcomePlace";
import { GuidedTour } from "@/components/onboarding/GuidedTour";
import { useOnboarding } from "@/lib/context/OnboardingContext";

export function ArcadeShell({ children }: { children: ReactNode }) {
  const { hydrated, insertedCoin, insertCoin } = useArcade();
  const { t, ready } = useLanguage();
  const { phase } = useOnboarding();
  const pathname = usePathname();
  const playMode = pathname.startsWith("/play");
  const floatingLang = playMode || !insertedCoin || phase === "ask" || phase === "welcome";
  const inSite = hydrated && insertedCoin && ready && phase !== "ask" && phase !== "welcome" && phase !== "loading";

  return (
    <div className="arcade-bg min-h-dvh text-cream">
      <CRTOverlay />
      {floatingLang && (
        <div className="fixed top-3 z-[80] end-3">
          <LanguageSwitcher />
        </div>
      )}
      <div className="relative z-10 mx-auto min-h-dvh max-w-[1440px] lg:p-3">
        <div className="cabinet-frame flex min-h-dvh flex-col bg-void/40 lg:min-h-[calc(100dvh-24px)]">
          {inSite && !playMode && <ArcadeNav />}
          <main
            className={
              playMode
                ? "relative flex-1 px-2 pb-4 pt-3 sm:px-5 lg:px-8"
                : "relative flex-1 px-3 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8"
            }
          >
            {inSite ? children : null}
            {(!hydrated || !ready) && (
              <div className="flex h-[70vh] items-center justify-center">
                <p className="font-pixel text-xs text-cyan blink">{t("boot")}</p>
              </div>
            )}
          </main>
          {inSite && !playMode && <MobileNav />}
        </div>
      </div>
      <ArcadeToasts />
      <AnimatePresence>
        {hydrated && !insertedCoin && <InsertCoin key="insert-coin" onDone={insertCoin} />}
      </AnimatePresence>
      {hydrated && insertedCoin && ready && phase === "welcome" && <WelcomePlace />}
      {hydrated && insertedCoin && ready && phase === "ask" && <PlayerSelect />}
      {hydrated && insertedCoin && ready && (phase === "tour" || phase === "coach") && <GuidedTour />}
    </div>
  );
}

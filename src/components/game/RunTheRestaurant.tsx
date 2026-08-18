"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useArcade } from "@/lib/context/ArcadeContext";
import { nextRestaurantLevel } from "@/lib/game/shift";
import { dailyCheckIn, todayStamp } from "@/lib/data/restaurant";
import type { ShiftSummary } from "@/lib/types";
import { RestaurantMenu } from "@/components/game/restaurant/RestaurantMenu";
import { RestaurantHub } from "@/components/game/restaurant/RestaurantHub";
import { UpgradeShop } from "@/components/game/restaurant/UpgradeShop";
import { ShiftPlay } from "@/components/game/restaurant/ShiftPlay";
import { ShiftResults } from "@/components/game/restaurant/ShiftResults";
import { BurgerRush } from "@/components/game/BurgerRush";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useOnboarding } from "@/lib/context/OnboardingContext";

type View = "menu" | "hub" | "upgrades" | "settings" | "shift" | "results" | "rush";

export function RunTheRestaurant() {
  const router = useRouter();
  const { t } = useLanguage();
  const { restaurant, buyUpgrade, applyShift, setMuted } = useArcade();
  const { autoShift, clearAutoShift } = useOnboarding();
  const [view, setView] = useState<View>("menu");
  const [summary, setSummary] = useState<ShiftSummary | null>(null);
  const [shiftKey, setShiftKey] = useState(0);
  const closing = useRef(false);

  function startShift() {
    closing.current = false;
    setShiftKey((k) => k + 1);
    setView("shift");
  }

  useEffect(() => {
    if (!autoShift) return;
    startShift();
    clearAutoShift();
  }, [autoShift, clearAutoShift]);

  function endShift(raw: ShiftSummary) {
    if (closing.current) return;
    closing.current = true;
    const next = nextRestaurantLevel(restaurant.xp + raw.xp, restaurant.level);
    const check = dailyCheckIn(restaurant.lastPlayDate, restaurant.streak, todayStamp(), raw.passed);
    const full: ShiftSummary = {
      ...raw,
      leveledUp: next.leveledUp,
      newLevel: next.level,
      levelName: next.name,
      streak: check.streak,
      dailyBonus: check.applied,
      bonusMoney: check.bonusMoney,
      bonusXp: check.bonusXp,
    };
    applyShift(full);
    setSummary(full);
    setView("results");
  }

  return (
    <div className="pb-4">
      {view === "menu" && (
        <RestaurantMenu
          progress={restaurant}
          onStart={startShift}
          onRestaurant={() => setView("hub")}
          onUpgrades={() => setView("upgrades")}
          onLeaderboard={() => router.push("/leaderboard")}
          onSettings={() => setView("settings")}
          onRush={() => setView("rush")}
        />
      )}
      {view === "hub" && (
        <RestaurantHub
          progress={restaurant}
          onBack={() => setView("menu")}
          onUpgrades={() => setView("upgrades")}
          onStart={startShift}
          onRush={() => setView("rush")}
        />
      )}
      {view === "upgrades" && (
        <UpgradeShop progress={restaurant} onBuy={buyUpgrade} onBack={() => setView("menu")} />
      )}
      {view === "settings" && (
        <ArcadePanel className="mx-auto max-w-lg space-y-4 p-5">
          <h1 className="font-pixel text-sm">{t("game.settings")}</h1>
          <p className="text-sm text-muted">{t("game.settingsBody")}</p>
          <ArcadeButton className="w-full" variant={restaurant.muted ? "ghost" : "cyan"} onClick={() => setMuted(!restaurant.muted)}>
            {restaurant.muted ? t("game.soundOff") : t("game.soundOn")}
          </ArcadeButton>
          <ArcadeButton variant="ghost" onClick={() => setView("menu")}>{t("game.back")}</ArcadeButton>
        </ArcadePanel>
      )}
      {view === "shift" && (
        <ShiftPlay
          key={shiftKey}
          progress={restaurant}
          muted={restaurant.muted}
          onMute={() => setMuted(!restaurant.muted)}
          onQuit={() => setView("menu")}
          onEnd={endShift}
        />
      )}
      {view === "results" && summary && (
        <ShiftResults
          summary={summary}
          onNext={startShift}
          onRetry={startShift}
          onRestaurant={() => setView("hub")}
        />
      )}
      {view === "rush" && (
        <div>
          <ArcadeButton variant="ghost" className="mb-4" onClick={() => setView("menu")}>
            {t("game.backRestaurant")}
          </ArcadeButton>
          <BurgerRush />
        </div>
      )}
    </div>
  );
}

"use client";

import { CAMPAIGN_GOAL, getDayConfig, xpToNext } from "@/lib/data/restaurant";
import { formatMoney } from "@/lib/utils";
import type { RestaurantProgress } from "@/lib/types";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { useLanguage } from "@/lib/context/LanguageContext";

type Props = {
  progress: RestaurantProgress;
  onStart: () => void;
  onRestaurant: () => void;
  onUpgrades: () => void;
  onLeaderboard: () => void;
  onSettings: () => void;
  onRush: () => void;
};

export function RestaurantMenu({
  progress,
  onStart,
  onRestaurant,
  onUpgrades,
  onLeaderboard,
  onSettings,
  onRush,
}: Props) {
  const { t, locale } = useLanguage();
  const day = getDayConfig(progress.day);
  const xp = xpToNext(progress.xp);
  const arcadeReady = progress.upgrades.arcade >= 1;
  const dayName = day.day <= 5 ? t(`day.${Math.min(day.day, 5)}`) : t("day.endless", { n: day.day });

  return (
    <div className="mx-auto max-w-lg space-y-6 py-4 text-center">
      <p className="font-hud text-[10px] text-magenta tracking-[0.35em] rtl:tracking-normal">{t("game.os")}</p>
      <h1 className="font-pixel text-xl leading-relaxed text-cyan glitch sm:text-3xl">{t("game.title")}</h1>
      <p className="font-hud text-[11px] tracking-[0.28em] text-gold rtl:tracking-normal">{t("game.loop")}</p>
      <ArcadePanel glow="gold" className="p-4 text-start">
        <p className="font-hud text-[10px] text-gold tracking-[0.18em] rtl:tracking-normal">{t("game.goalTitle")}</p>
        <p className="mt-2 text-sm leading-7 text-cream">
          {progress.level >= CAMPAIGN_GOAL.level ? t("game.goalDone") : t("game.goalBody")}
        </p>
        <p className="mt-3 font-hud text-[10px] text-cyan rtl:tracking-normal">
          {t("game.goalProgress", {
            xp: progress.xp,
            need: CAMPAIGN_GOAL.xp,
            level: progress.level,
          })}
        </p>
        <div className="mt-2 h-2 w-full bg-void">
          <div
            className="h-full bg-gold"
            style={{ width: `${Math.min(100, (progress.xp / CAMPAIGN_GOAL.xp) * 100)}%` }}
          />
        </div>
      </ArcadePanel>
      <ArcadePanel className="p-4 text-start">
        <p className="font-pixel text-xs text-cream">{t(`tier.${progress.level}`)}</p>
        <p className="mt-2 font-hud text-[10px] text-muted">
          {t("game.dayLine", {
            day: String(day.day).padStart(2, "0"),
            name: dayName,
            money: formatMoney(progress.money, locale),
            xp: progress.xp,
            next: xp.next,
          })}
        </p>
      </ArcadePanel>
      <div className="grid gap-3">
        <ArcadeButton className="w-full min-h-12" tour="game-start" onClick={onStart}>{t("game.startShift")}</ArcadeButton>
        <ArcadeButton className="w-full min-h-12" variant="magenta" onClick={onRestaurant}>{t("game.restaurant")}</ArcadeButton>
        <ArcadeButton className="w-full min-h-12" variant="gold" onClick={onUpgrades}>{t("game.upgrades")}</ArcadeButton>
        <ArcadeButton className="w-full min-h-12" variant="ghost" onClick={onLeaderboard}>{t("game.leaderboard")}</ArcadeButton>
        <ArcadeButton className="w-full min-h-12" variant="ghost" onClick={onSettings}>{t("game.settings")}</ArcadeButton>
        <ArcadeButton className="w-full min-h-12" variant="ghost" disabled={!arcadeReady} onClick={onRush}>
          {arcadeReady ? t("game.burgerRush") : t("game.arcadeLocked")}
        </ArcadeButton>
      </div>
      <ArcadeButton href="/" variant="ghost">{t("game.exit")}</ArcadeButton>
    </div>
  );
}

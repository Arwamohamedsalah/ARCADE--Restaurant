"use client";

import { ACHIEVEMENT_DEFS } from "@/lib/data/player";
import { useArcade } from "@/lib/context/ArcadeContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlayerNameForm } from "@/components/profile/PlayerNameForm";
import { cn, displayHandle } from "@/lib/utils";

const BADGE = ["first-order", "speed-eater", "burger-master", "arcade-legend"] as const;
const COLORS = ["bg-cyan", "bg-magenta", "bg-gold", "bg-purple"];

export function PlayerProfile() {
  const { player, coins, highScore, unlockedAchievements } = useArcade();
  const { t, locale } = useLanguage();
  const num = (n: number) => n.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");

  const stats = [
    { label: t("hud.level"), value: String(player.level).padStart(2, "0") },
    { label: t("hud.xp"), value: num(player.xp) },
    { label: t("hud.coins"), value: num(coins) },
    { label: t("profile.games"), value: String(player.gamesPlayed) },
    { label: t("profile.orders"), value: String(player.orders) },
    { label: t("profile.best"), value: num(highScore) },
  ];

  return (
    <div>
      <PageHeader eyebrow={t("profile.eyebrow")} title={t("profile.title")} subtitle={t("profile.subtitle")} />
      <ArcadePanel className="mb-6 p-6">
        <p className="font-hud text-[10px] text-magenta">{t("profile.handle")}</p>
        <h2 className="mt-2 font-pixel text-lg text-cyan sm:text-2xl">
          {displayHandle(player.handle, `${t("hud.player")} 01`)}
        </h2>
        <p className="mt-2 font-hud text-xs text-gold">{t("profile.levelLine", { n: String(player.level).padStart(2, "0") })}</p>
        <div className="mt-6 max-w-md">
          <PlayerNameForm />
        </div>
      </ArcadePanel>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <ArcadePanel key={stat.label} className="p-4">
            <p className="font-hud text-[9px] text-muted tracking-[0.16em] rtl:tracking-normal">{stat.label}</p>
            <p className="mt-2 font-pixel text-sm text-cream">{stat.value}</p>
          </ArcadePanel>
        ))}
      </div>
      <h3 className="mt-8 mb-4 font-pixel text-xs">{t("profile.achievements")}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {ACHIEVEMENT_DEFS.map((ach, i) => {
          const unlocked = unlockedAchievements.includes(ach.id);
          return (
            <ArcadePanel key={ach.id} glow={unlocked ? "cyan" : "none"} className={cn("flex gap-4 p-4", !unlocked && "opacity-50")}>
              <div className={cn("flex h-12 w-12 items-center justify-center font-pixel text-[10px] text-void", COLORS[i])}>
                {BADGE[i]?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-pixel text-[10px] leading-5">{t(`achievement.${ach.id}.name`)}</p>
                <p className="mt-1 text-xs text-muted">{t(`achievement.${ach.id}.desc`)}</p>
                <p className="mt-1 font-hud text-[9px] text-gold">{unlocked ? t("profile.unlocked") : t("profile.locked")}</p>
              </div>
            </ArcadePanel>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { LEADERBOARD } from "@/lib/data/leaderboard";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn, displayHandle } from "@/lib/utils";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useArcade } from "@/lib/context/ArcadeContext";

export function LeaderboardBoard() {
  const { t, locale } = useLanguage();
  const { player, highScore } = useArcade();
  const you = displayHandle(player.handle, `${t("hud.player")} 01`);
  return (
    <div>
      <PageHeader eyebrow={t("board.eyebrow")} title={t("board.title")} subtitle={t("board.subtitle")} />
      <ArcadePanel className="overflow-hidden">
        <ul>
          {LEADERBOARD.map((row) => (
            <li
              key={row.name}
              className={cn(
                "flex items-center justify-between gap-3 border-b border-line px-4 py-4 last:border-0",
                row.isPlayer && "bg-cyan/10 shadow-[inset_0_0_24px_rgba(34,240,255,0.12)]",
              )}
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className={cn("font-pixel text-xs", row.rank === 1 ? "text-gold" : "text-muted")}>
                  {row.rank}
                </span>
                <span className={cn("truncate font-pixel text-[11px]", row.isPlayer ? "text-cyan" : "text-cream")}>
                  {row.isPlayer ? you : row.name}
                </span>
              </div>
              <span className="font-hud text-sm text-gold">
                {(row.isPlayer ? Math.max(row.score, highScore) : row.score).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
              </span>
            </li>
          ))}
        </ul>
      </ArcadePanel>
    </div>
  );
}

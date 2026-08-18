"use client";

import { LEADERBOARD } from "@/lib/data/leaderboard";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/context/LanguageContext";

export function LeaderboardBoard() {
  const { t, locale } = useLanguage();
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
              <div className="flex items-center gap-4">
                <span className={cn("font-pixel text-xs", row.rank === 1 ? "text-gold" : "text-muted")}>
                  {row.rank}
                </span>
                <span className={cn("font-pixel text-[11px]", row.isPlayer ? "text-cyan" : "text-cream")}>
                  {row.isPlayer ? `${t("hud.player")}01` : row.name}
                </span>
              </div>
              <span className="font-hud text-sm text-gold">
                {row.score.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
              </span>
            </li>
          ))}
        </ul>
      </ArcadePanel>
    </div>
  );
}

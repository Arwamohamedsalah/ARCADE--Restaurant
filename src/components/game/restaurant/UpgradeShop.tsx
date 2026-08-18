"use client";

import { UPGRADES } from "@/lib/data/restaurant";
import { formatMoney } from "@/lib/utils";
import type { RestaurantProgress, UpgradeId } from "@/lib/types";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { useLanguage } from "@/lib/context/LanguageContext";

type Props = {
  progress: RestaurantProgress;
  onBuy: (id: UpgradeId) => void;
  onBack: () => void;
};

export function UpgradeShop({ progress, onBuy, onBack }: Props) {
  const { t, locale } = useLanguage();
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-hud text-[10px] text-gold tracking-[0.2em] rtl:tracking-normal">{t("game.shop")}</p>
          <h1 className="mt-1 font-pixel text-sm text-cream">{t("game.upgrades")}</h1>
        </div>
        <p className="font-pixel text-xs text-gold">{formatMoney(progress.money, locale)}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {UPGRADES.map((item) => {
          const level = progress.upgrades[item.id];
          const maxed = level >= item.max;
          const cost = maxed ? 0 : item.costs[level];
          const locked = !maxed && progress.money < cost;
          return (
            <ArcadePanel key={item.id} glow={maxed ? "gold" : "cyan"} className="p-4">
              <p className="font-hud text-[10px] text-cyan">{t(`upgrade.${item.id}.name`)}</p>
              <p className="mt-1 font-pixel text-[10px] leading-5">{t("game.levelN", { n: level })}</p>
              <p className="mt-2 text-sm text-muted">{t(`upgrade.${item.id}.blurb`)}</p>
              <p className="mt-1 font-hud text-[9px] text-lime">{t(`upgrade.${item.id}.benefit`)}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="font-hud text-[11px] text-gold">{maxed ? t("game.max") : formatMoney(cost, locale)}</span>
                <ArcadeButton
                  variant={maxed ? "ghost" : "gold"}
                  disabled={maxed || locked}
                  onClick={() => onBuy(item.id)}
                >
                  {maxed ? t("game.maxed") : t("game.upgrade")}
                </ArcadeButton>
              </div>
            </ArcadePanel>
          );
        })}
      </div>
      <ArcadeButton variant="ghost" onClick={onBack}>{t("game.back")}</ArcadeButton>
    </div>
  );
}

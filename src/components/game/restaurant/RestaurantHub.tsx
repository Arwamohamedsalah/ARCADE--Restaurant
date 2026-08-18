"use client";

import { formatMoney } from "@/lib/utils";
import type { RestaurantProgress } from "@/lib/types";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { PixelCustomer } from "@/components/game/restaurant/PixelCustomer";
import { useLanguage } from "@/lib/context/LanguageContext";

type Props = {
  progress: RestaurantProgress;
  onBack: () => void;
  onUpgrades: () => void;
  onStart: () => void;
  onRush: () => void;
};

export function RestaurantHub({ progress, onBack, onUpgrades, onStart, onRush }: Props) {
  const { t, locale } = useLanguage();
  const u = progress.upgrades;
  return (
    <div className="space-y-4">
      <ArcadePanel glow="gold" className="overflow-hidden">
        <div className={`relative min-h-48 bg-gradient-to-b p-5 ${progress.level >= 3 ? "from-[#102436] to-[#0b1020]" : "from-[#24102e] to-[#120918]"}`}>
          <p className="font-pixel text-[10px] text-magenta sm:text-xs">{t(`tier.${progress.level}`)}</p>
          <p className="mt-2 font-hud text-[10px] text-gold">
            {t("game.neonOpen", { day: String(progress.day).padStart(2, "0") })}
          </p>
          <div className="mt-6 flex items-end justify-around">
            <PixelCustomer type="regular" mood="happy" compact />
            <PixelCustomer type="foodie" mood="waiting" compact />
            {progress.level >= 3 && <PixelCustomer type="vip" mood="loved" compact />}
            {u.arcade >= 1 && (
              <button type="button" onClick={onRush} className="h-16 w-12 border border-cyan bg-void text-[8px] font-hud text-cyan">
                {t("game.cab")}
              </button>
            )}
          </div>
        </div>
      </ArcadePanel>
      <div className="grid gap-2 sm:grid-cols-3">
        <ArcadePanel className="p-3">
          <p className="font-hud text-[8px] text-muted">{t("hud.money")}</p>
          <p className="font-pixel text-sm text-gold">{formatMoney(progress.money, locale)}</p>
        </ArcadePanel>
        <ArcadePanel className="p-3">
          <p className="font-hud text-[8px] text-muted">{t("game.served")}</p>
          <p className="font-pixel text-sm text-cyan">{progress.totalServed}</p>
        </ArcadePanel>
        <ArcadePanel className="p-3">
          <p className="font-hud text-[8px] text-muted">{t("game.bestCombo")}</p>
          <p className="font-pixel text-sm text-magenta">x{progress.bestCombo}</p>
        </ArcadePanel>
      </div>
      <p className="font-hud text-[9px] text-muted tracking-[0.16em] rtl:tracking-normal">
        {t("game.status", { kitchen: u.kitchen, staff: u.staff, tables: u.tables, decor: u.decor })}
      </p>
      <div className="flex flex-wrap gap-2">
        <ArcadeButton onClick={onStart}>{t("game.startShift")}</ArcadeButton>
        <ArcadeButton variant="gold" onClick={onUpgrades}>{t("game.upgrades")}</ArcadeButton>
        <ArcadeButton variant="ghost" onClick={onBack}>{t("game.back")}</ArcadeButton>
      </div>
    </div>
  );
}

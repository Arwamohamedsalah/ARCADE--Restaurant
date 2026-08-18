"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REWARDS } from "@/lib/data/rewards";
import { useArcade } from "@/lib/context/ArcadeContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { PageHeader } from "@/components/ui/PageHeader";

export function RewardsBoard() {
  const { coins, redeemedRewards, redeem } = useArcade();
  const { t } = useLanguage();
  const [flash, setFlash] = useState<string | null>(null);

  function claim(id: string) {
    const ok = redeem(id);
    if (ok) {
      setFlash(id);
      window.setTimeout(() => setFlash(null), 1200);
    }
  }

  return (
    <div>
      <PageHeader eyebrow={t("rewards.eyebrow")} title={t("rewards.title")} subtitle={t("rewards.subtitle")} />
      <ArcadePanel glow="gold" className="mb-6 flex items-end justify-between p-5">
        <div>
          <p className="font-hud text-[10px] text-muted">{t("rewards.yourCoins")}</p>
          <p className="mt-2 font-pixel text-2xl text-gold">{coins}</p>
        </div>
        <p className="font-hud text-[10px] text-cyan">{t("rewards.earnMore")}</p>
      </ArcadePanel>
      <div className="grid gap-4 sm:grid-cols-2">
        {REWARDS.map((reward) => {
          const claimed = redeemedRewards.includes(reward.id);
          const locked = coins < reward.cost && !claimed;
          return (
            <ArcadePanel key={reward.id} glow={claimed ? "gold" : "purple"} className="relative overflow-hidden p-5">
              <AnimatePresence>
                {flash === reward.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gold/20"
                  />
                )}
              </AnimatePresence>
              <p className="font-hud text-[10px] text-gold">{t("rewards.cost", { n: reward.cost })}</p>
              <h2 className="mt-3 font-pixel text-[11px] leading-6">{t(`reward.${reward.id}.name`)}</h2>
              <p className="mt-2 text-sm text-muted">{t(`reward.${reward.id}.desc`)}</p>
              <ArcadeButton
                className="mt-5 w-full"
                variant={claimed ? "ghost" : "gold"}
                disabled={claimed || locked}
                onClick={() => claim(reward.id)}
              >
                {claimed ? t("rewards.claimed") : locked ? t("rewards.locked") : t("rewards.redeem")}
              </ArcadeButton>
            </ArcadePanel>
          );
        })}
      </div>
    </div>
  );
}

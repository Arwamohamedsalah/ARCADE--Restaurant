"use client";

import { motion } from "framer-motion";
import { formatMoney } from "@/lib/utils";
import type { ShiftSummary } from "@/lib/types";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { useLanguage } from "@/lib/context/LanguageContext";

type Props = {
  summary: ShiftSummary;
  onNext: () => void;
  onRestaurant: () => void;
  onRetry: () => void;
};

export function ShiftResults({ summary, onNext, onRestaurant, onRetry }: Props) {
  const { t, locale } = useLanguage();
  const dayName = summary.day <= 5 ? t(`day.${Math.min(summary.day, 5)}`) : t("day.endless", { n: summary.day });

  if (!summary.passed) {
    return (
      <div className="mx-auto max-w-lg space-y-5 py-6 text-center">
        <motion.p initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-pixel text-lg text-magenta sm:text-2xl">
          {t("game.failed")}
        </motion.p>
        <ArcadePanel className="space-y-3 p-5 text-start">
          <Row label={t("game.satisfaction")} value={`${Math.round(summary.satisfaction)}%`} />
          <Row label={t("game.moneyEarned")} value={formatMoney(summary.earnings, locale)} />
          <Row label={t("game.ordersServed")} value={`${summary.completed}/${summary.quota}`} />
        </ArcadePanel>
        <div className="flex flex-wrap justify-center gap-3">
          <ArcadeButton onClick={onRetry}>{t("game.tryAgain")}</ArcadeButton>
          <ArcadeButton variant="ghost" onClick={onRestaurant}>{t("game.restaurant")}</ArcadeButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-5 py-4 text-center">
      <motion.p initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-pixel text-lg text-lime sm:text-2xl">
        {t("game.dayComplete", { day: String(summary.day).padStart(2, "0") })}
      </motion.p>
      <p className="font-hud text-[10px] text-cyan tracking-[0.2em] rtl:tracking-normal">{dayName}</p>
      <ArcadePanel className="space-y-3 p-5 text-start">
        <Row label={t("game.customersServed")} value={String(summary.served)} />
        <Row label={t("game.ordersCompleted")} value={String(summary.completed)} />
        <Row label={t("game.ordersFailed")} value={String(summary.failed)} />
        <Row label={t("game.totalEarnings")} value={formatMoney(summary.earnings, locale)} />
        <Row label={t("game.xpEarned")} value={String(summary.xp)} />
        <Row label={t("game.bestCombo")} value={`x${Math.max(summary.bestCombo, 1)}`} />
      </ArcadePanel>
      {summary.leveledUp && (
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="border border-gold bg-gold/10 p-5">
          <p className="font-pixel text-sm text-gold">{t("game.levelUp")}</p>
          <p className="mt-3 font-hud text-xs text-cream">{t("game.levelUnlocked", { n: String(summary.newLevel).padStart(2, "0") })}</p>
          <p className="mt-2 font-pixel text-[10px] leading-6 text-cyan">{t(`tier.${summary.newLevel}`)}</p>
        </motion.div>
      )}
      {summary.newLevel >= 5 && summary.leveledUp && (
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="border-2 border-lime bg-lime/10 p-5">
          <p className="font-pixel text-lg text-lime">{t("game.victoryTitle")}</p>
          <p className="mt-3 text-base leading-7 text-cream">{t("game.victoryBody")}</p>
        </motion.div>
      )}
      <div className="flex flex-wrap justify-center gap-3">
        <ArcadeButton onClick={onNext}>{t("game.nextDay")}</ArcadeButton>
        <ArcadeButton variant="gold" onClick={onRestaurant}>{t("game.restaurant")}</ArcadeButton>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 font-hud text-[10px] tracking-[0.12em] rtl:tracking-normal">
      <span className="text-muted">{label}</span>
      <span className="text-cream">{value}</span>
    </div>
  );
}

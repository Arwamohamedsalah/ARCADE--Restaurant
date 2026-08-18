"use client";

import { motion } from "framer-motion";
import type { PrepItem } from "@/lib/types";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { FoodVisual } from "@/components/ui/FoodVisual";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/context/LanguageContext";

type Job = { id: string; item: PrepItem; t: number; dur: number };

type Props = {
  pool: PrepItem[];
  plate: PrepItem[];
  cooking: Job[];
  canCook: boolean;
  onCook: (item: PrepItem) => void;
  onClear: () => void;
  onServe: () => void;
  serveDisabled: boolean;
  tourItemId?: string | null;
  hasCustomer?: boolean;
};

export function KitchenStation({
  pool,
  plate,
  cooking,
  canCook,
  onCook,
  onClear,
  onServe,
  serveDisabled,
  tourItemId,
  hasCustomer = false,
}: Props) {
  const { t } = useLanguage();
  const hint = !hasCustomer
    ? t("game.serveNeedCustomer")
    : cooking.length > 0 && plate.length === 0
      ? t("game.serveCooking")
      : plate.length === 0
        ? t("game.serveNeedCook")
        : t("game.serveReady");
  return (
    <ArcadePanel className="p-3">
      <div className="mb-3 min-h-24 border-2 border-dashed border-gold bg-gold/10 p-3" data-tour="shift-plate">
        <p className="font-hud text-[10px] text-gold rtl:tracking-normal">{t("game.plate")}</p>
        <div className="mt-2 flex min-h-12 flex-wrap gap-2">
          {plate.length === 0 && cooking.length === 0 && (
            <span className="text-sm leading-6 text-cream">{t("game.plateEmpty")}</span>
          )}
          {cooking.map((job) => (
            <span key={job.id} className="border-2 border-gold bg-void px-2 py-2 font-hud text-[10px] text-gold">
              {job.item.emoji} {t(`food.${job.item.id}.name`)} · {t("game.plateCooking")}
            </span>
          ))}
          {plate.map((item, i) => (
            <span key={`${item.id}-${i}`} className="border-2 border-cyan bg-cyan/10 px-2 py-2 font-hud text-[10px] text-cream">
              {item.emoji} {t(`food.${item.id}.name`)}
            </span>
          ))}
        </div>
      </div>
      <p className="mb-2 font-hud text-[9px] text-cyan tracking-[0.2em] rtl:tracking-normal">{t("game.kitchenLine")}</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3" data-tour="shift-kitchen">
        {pool.map((item) => {
          const job = cooking.find((entry) => entry.item.id === item.id);
          const pct = job ? Math.min(100, (job.t / job.dur) * 100) : 0;
          const tourThis = Boolean(tourItemId && item.id === tourItemId);
          return (
            <button
              key={item.id}
              type="button"
              disabled={!canCook && !job}
              onPointerDown={(event) => {
                event.preventDefault();
                onCook(item);
              }}
              className={cn(
                "relative min-h-16 overflow-hidden border border-line bg-void px-1 py-2 text-center disabled:opacity-40",
                job && "border-gold",
                tourThis && "border-gold shadow-[0_0_18px_#ffd24a]",
              )}
            >
              {item.kind && item.visual ? (
                <FoodVisual kind={item.kind} variant={item.visual} size="sm" className="pointer-events-none mx-auto h-10 w-10" />
              ) : (
                <span className="block text-xl">{item.emoji}</span>
              )}
              <span className="mt-1 block font-hud text-[7px] leading-3 tracking-[0.08em] rtl:tracking-normal">
                {t(`food.${item.id}.name`)}
              </span>
              {job && (
                <span className="absolute inset-x-0 bottom-0 h-1 bg-line">
                  <motion.span className="block h-full bg-gold" style={{ width: `${pct}%` }} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-sm leading-6 text-gold">{hint}</p>
      <ArcadeButton
        variant="magenta"
        className={cn("mt-2 w-full min-h-14 text-sm", !serveDisabled && "shadow-[0_0_22px_#ff2ec8]")}
        tour="shift-serve"
        disabled={serveDisabled}
        onClick={onServe}
      >
        {t("game.serve")}
      </ArcadeButton>
      <ArcadeButton variant="ghost" className="mt-2 w-full min-h-10" onClick={onClear}>
        {t("game.clear")}
      </ArcadeButton>
    </ArcadePanel>
  );
}

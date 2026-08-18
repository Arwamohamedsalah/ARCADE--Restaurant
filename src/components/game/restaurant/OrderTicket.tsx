"use client";

import type { PrepItem } from "@/lib/types";
import { formatMoney, powerBar } from "@/lib/utils";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { FoodVisual } from "@/components/ui/FoodVisual";
import { useLanguage } from "@/lib/context/LanguageContext";

type Props = {
  name: string;
  order: PrepItem[];
  patience: number;
  maxPatience: number;
  reward: { money: number; xp: number };
  onCook?: (item: PrepItem) => void;
  plate?: PrepItem[];
};

export function OrderTicket({ name, order, patience, maxPatience, reward, onCook, plate = [] }: Props) {
  const { t, locale } = useLanguage();
  const ratio = Math.max(0, patience / maxPatience);
  const filled = Math.round(ratio * 10);
  return (
    <ArcadePanel glow="magenta" className="p-4">
      <p className="font-hud text-[9px] text-magenta tracking-[0.22em] rtl:tracking-normal">{t("game.order")}</p>
      <p className="mt-1 font-pixel text-[10px] text-cyan">{name}</p>
      <p className="mt-2 text-sm leading-6 text-gold">{t("game.tapOrderToCook")}</p>
      <ul className="mt-3 space-y-2">
        {order.map((line) => (
          <li key={line.id}>
            <button
              type="button"
              onPointerDown={(event) => {
                event.preventDefault();
                onCook?.(line);
              }}
              className="flex w-full items-center gap-2 border border-line bg-void px-2 py-2 text-start hover:border-gold"
            >
              {line.kind && line.visual ? (
                <FoodVisual kind={line.kind} variant={line.visual} size="sm" className="h-9 w-9" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center bg-panel-2 text-lg">{line.emoji}</span>
              )}
              <span className="font-hud text-[10px] tracking-[0.08em] rtl:tracking-normal">
                {line.emoji} {t(`food.${line.id}.name`)}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-hud text-[9px] text-muted">{t("game.timeLeft")}</p>
      <p className={ratio < 0.35 ? "font-pixel text-[11px] text-magenta" : "font-pixel text-[11px] text-lime"}>
        {powerBar(filled)}
      </p>
      <div className="mt-3 flex justify-between font-hud text-[10px]">
        <span className="text-gold">{t("game.reward", { money: formatMoney(reward.money, locale) })}</span>
        <span className="text-cyan">+{reward.xp} {t("hud.xp")}</span>
      </div>
      <div className="mt-3 border-2 border-dashed border-gold bg-gold/10 p-2">
        <p className="font-hud text-[9px] text-gold rtl:tracking-normal">{t("game.plate")}</p>
        <div className="mt-1 flex min-h-10 flex-wrap gap-1">
          {plate.length === 0 ? (
            <span className="text-sm text-cream">{t("game.plateEmpty")}</span>
          ) : (
            plate.map((item, i) => (
              <span key={`${item.id}-${i}`} className="border border-cyan bg-void px-2 py-1 font-hud text-[10px]">
                {item.emoji} {t(`food.${item.id}.name`)}
              </span>
            ))
          )}
        </div>
      </div>
    </ArcadePanel>
  );
}

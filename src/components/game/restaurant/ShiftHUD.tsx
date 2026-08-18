"use client";

import { xpToNext } from "@/lib/data/restaurant";
import { formatMoney } from "@/lib/utils";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";

type Props = {
  day: number;
  level: number;
  money: number;
  xp: number;
  score: number;
  combo: number;
  muted: boolean;
  onMute: () => void;
};

export function ShiftHUD({ day, level, money, xp, score, combo, muted, onMute }: Props) {
  const { t, locale } = useLanguage();
  const ladder = xpToNext(xp);
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-7">
      {[
        { label: t("hud.day"), value: String(day).padStart(2, "0") },
        { label: t("hud.level"), value: String(level).padStart(2, "0") },
        { label: t("hud.money"), value: formatMoney(money, locale), gold: true },
        { label: t("hud.xp"), value: `${xp}/${ladder.next}` },
        { label: t("hud.score"), value: score.toLocaleString() },
        { label: t("hud.combo"), value: `x${Math.max(combo, 1)}` },
      ].map((stat) => (
        <div key={stat.label} className="hud-chip px-2 py-2">
          <p className="font-hud text-[7px] text-muted tracking-[0.14em] sm:text-[8px] rtl:tracking-normal">{stat.label}</p>
          <p className={`mt-1 font-pixel text-[8px] sm:text-[10px] ${"gold" in stat ? "text-gold" : "text-cyan"}`}>
            {stat.value}
          </p>
        </div>
      ))}
      <button
        type="button"
        onClick={onMute}
        aria-label={muted ? t("hud.unmute") : t("hud.mute")}
        className="hud-chip flex items-center justify-center text-cyan"
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      <p className="col-span-3 font-hud text-[8px] text-magenta tracking-[0.18em] sm:col-span-7 rtl:tracking-normal">
        {t(`tier.${level}`)}
      </p>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import {
  LOADOUT_DRINKS,
  LOADOUT_MAINS,
  LOADOUT_SAUCES,
  LOADOUT_SIDES,
  LOADOUT_TOPPINGS,
} from "@/lib/data/loadout";
import type { LoadoutOption } from "@/lib/types";
import { cn, powerBar, displayHandle } from "@/lib/utils";
import { useArcade } from "@/lib/context/ArcadeContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { FoodVisual } from "@/components/ui/FoodVisual";
import { PageHeader } from "@/components/ui/PageHeader";

function Choice({
  option,
  active,
  onClick,
}: {
  option: LoadoutOption;
  active: boolean;
  onClick: () => void;
}) {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-12 border px-3 py-2 text-start font-hud text-[10px] tracking-[0.12em] rtl:tracking-normal transition",
        active ? "border-cyan bg-cyan/15 text-cyan" : "border-line text-muted hover:border-cyan/40 hover:text-cream",
      )}
    >
      <span className="block">{t(`food.${option.id}.name`)}</span>
      <span className="text-gold">+{option.price}</span>
    </button>
  );
}

export function LoadoutBuilder() {
  const { loadout, setLoadout, lockLoadout, player } = useArcade();
  const { t, locale } = useLanguage();
  const egp = (n: number) =>
    t("currency.egp", { n: n.toLocaleString(locale === "ar" ? "ar-EG" : "en-EG") });

  const main = LOADOUT_MAINS.find((m) => m.id === loadout.main);
  const toppings = LOADOUT_TOPPINGS.filter((top) => loadout.toppings.includes(top.id));
  const sauce = LOADOUT_SAUCES.find((s) => s.id === loadout.sauce);
  const side = LOADOUT_SIDES.find((s) => s.id === loadout.side);
  const drink = LOADOUT_DRINKS.find((d) => d.id === loadout.drink);

  const total =
    (main?.price ?? 0) +
    toppings.reduce((s, top) => s + top.price, 0) +
    (sauce?.price ?? 0) +
    (side?.price ?? 0) +
    (drink?.price ?? 0);

  const power = useMemo(() => {
    return Math.min(10, (main ? 3 : 0) + toppings.length + (sauce ? 1 : 0) + (side ? 1 : 0) + (drink ? 1 : 0));
  }, [main, toppings.length, sauce, side, drink]);

  function toggleTopping(id: string) {
    const next = loadout.toppings.includes(id)
      ? loadout.toppings.filter((top) => top !== id)
      : [...loadout.toppings, id];
    setLoadout({ ...loadout, toppings: next });
  }

  function lock() {
    if (!main) return;
    lockLoadout({
      id: `loadout-${Date.now()}`,
      name: t("build.custom", { name: t(`food.${main.id}.name`) }),
      price: total,
      quantity: 1,
      xp: 40 + toppings.length * 6,
      kind: "burger",
      visual: main.visual ?? "double-boss",
    });
  }

  const dash = t("build.empty");
  const blocks = [
    { step: "01", title: t("build.step1"), options: LOADOUT_MAINS, mode: "main" as const },
    { step: "02", title: t("build.step2"), options: LOADOUT_TOPPINGS, mode: "topping" as const },
    { step: "03", title: t("build.step3"), options: LOADOUT_SAUCES, mode: "sauce" as const },
    { step: "04", title: t("build.step4"), options: LOADOUT_SIDES, mode: "side" as const },
    { step: "05", title: t("build.step5"), options: LOADOUT_DRINKS, mode: "drink" as const },
  ];

  return (
    <div>
      <PageHeader eyebrow={t("build.eyebrow")} title={t("build.title")} subtitle={t("build.subtitle")} />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          {blocks.map((block) => (
            <ArcadePanel key={block.step} className="p-4">
              <p className="font-hud text-[10px] text-magenta tracking-[0.2em] rtl:tracking-normal">
                {t("build.step", { n: block.step })}
              </p>
              <h2 className="mt-1 mb-3 font-pixel text-[11px] leading-6">{block.title}</h2>
              <div className={`grid grid-cols-2 gap-2 ${block.mode === "drink" ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
                {block.options.map((opt) => (
                  <Choice
                    key={opt.id}
                    option={opt}
                    active={
                      block.mode === "topping"
                        ? loadout.toppings.includes(opt.id)
                        : block.mode === "main"
                          ? loadout.main === opt.id
                          : block.mode === "sauce"
                            ? loadout.sauce === opt.id
                            : block.mode === "side"
                              ? loadout.side === opt.id
                              : loadout.drink === opt.id
                    }
                    onClick={() => {
                      if (block.mode === "topping") toggleTopping(opt.id);
                      else if (block.mode === "main") setLoadout({ ...loadout, main: opt.id });
                      else if (block.mode === "sauce") setLoadout({ ...loadout, sauce: opt.id });
                      else if (block.mode === "side") setLoadout({ ...loadout, side: opt.id });
                      else setLoadout({ ...loadout, drink: opt.id });
                    }}
                  />
                ))}
              </div>
            </ArcadePanel>
          ))}
        </div>

        <ArcadePanel glow="gold" className="h-fit p-5 lg:sticky lg:top-24">
          <p className="font-hud text-[10px] text-gold tracking-[0.2em] rtl:tracking-normal">
            {displayHandle(player.handle, `${t("hud.player")} 01`)}
          </p>
          <h2 className="mt-2 font-pixel text-xs">{t("build.current")}</h2>
          <div className="mx-auto my-5 flex justify-center">
            <FoodVisual kind="burger" variant={main?.visual ?? "pixel-cheese"} size="lg" />
          </div>
          <dl className="space-y-2 font-hud text-[10px] tracking-[0.12em] rtl:tracking-normal">
            <div className="flex justify-between gap-2 text-muted">
              <dt>{t("build.burger")}</dt>
              <dd className="text-cream">{main ? t(`food.${main.id}.name`) : dash}</dd>
            </div>
            <div className="flex justify-between gap-2 text-muted">
              <dt>{t("build.toppings")}</dt>
              <dd className="text-end text-cream">
                {toppings.length ? toppings.map((top) => t(`food.${top.id}.name`)).join(locale === "ar" ? "، " : ", ") : dash}
              </dd>
            </div>
            <div className="flex justify-between gap-2 text-muted">
              <dt>{t("build.sauce")}</dt>
              <dd className="text-cream">{sauce ? t(`food.${sauce.id}.name`) : dash}</dd>
            </div>
            <div className="flex justify-between gap-2 text-muted">
              <dt>{t("build.side")}</dt>
              <dd className="text-cream">{side ? t(`food.${side.id}.name`) : dash}</dd>
            </div>
            <div className="flex justify-between gap-2 text-muted">
              <dt>{t("build.drink")}</dt>
              <dd className="text-cream">{drink ? t(`food.${drink.id}.name`) : dash}</dd>
            </div>
          </dl>
          <p className="mt-4 font-hud text-[10px] text-lime">{t("build.power", { bar: powerBar(power) })}</p>
          <p className="mt-2 font-hud text-[10px] text-cyan">{t("build.score", { n: total * 2 })}</p>
          <p className="mt-4 font-pixel text-sm text-gold">{egp(total)}</p>
          <ArcadeButton className="mt-5 w-full" variant="gold" disabled={!main} onClick={lock}>
            {t("build.lock")}
          </ArcadeButton>
        </ArcadePanel>
      </div>
    </div>
  );
}

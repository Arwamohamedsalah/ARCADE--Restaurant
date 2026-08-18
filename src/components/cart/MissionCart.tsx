"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useArcade } from "@/lib/context/ArcadeContext";
import { catalogId, useLanguage } from "@/lib/context/LanguageContext";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { FoodVisual } from "@/components/ui/FoodVisual";
import { PageHeader } from "@/components/ui/PageHeader";

export function MissionCart() {
  const { cart, setQty, removeFromCart, subtotal, discount, total, coinsEarned, xpTotal } = useArcade();
  const { t, locale } = useLanguage();
  const egp = (n: number) =>
    t("currency.egp", { n: n.toLocaleString(locale === "ar" ? "ar-EG" : "en-EG") });

  function label(id: string, fallback: string, visual: string) {
    if (id.startsWith("loadout-")) return t("build.custom", { name: t(`food.${visual}.name`) });
    const key = `food.${catalogId(id)}.name`;
    const translated = t(key);
    return translated === key ? fallback : translated;
  }

  return (
    <div>
      <PageHeader eyebrow={t("cart.eyebrow")} title={t("cart.title")} subtitle={t("cart.subtitle")} />

      {cart.length === 0 ? (
        <ArcadePanel className="p-8 text-center">
          <p className="font-pixel text-xs">{t("cart.empty")}</p>
          <p className="mt-3 text-sm text-muted">{t("cart.emptyBody")}</p>
          <ArcadeButton href="/menu" className="mt-6">{t("cart.startOrder")}</ArcadeButton>
        </ArcadePanel>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            {cart.map((item) => (
              <ArcadePanel key={item.id} className="flex items-center gap-3 p-3">
                <FoodVisual kind={item.kind} variant={item.visual} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-pixel text-[10px] leading-5">{label(item.id, item.name, item.visual)}</p>
                  <p className="mt-1 font-hud text-[9px] text-cyan">
                    {egp(item.price)} · {t("menu.xp", { xp: item.xp })}
                    {item.isFree ? ` · ${t("cart.reward")}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" aria-label={t("cart.decrease")} onClick={() => setQty(item.id, item.quantity - 1)} className="border border-cyan/30 p-1 text-cyan">
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-hud text-xs">{item.quantity}</span>
                  <button type="button" aria-label={t("cart.increase")} onClick={() => setQty(item.id, item.quantity + 1)} className="border border-cyan/30 p-1 text-cyan">
                    <Plus size={14} />
                  </button>
                  <button type="button" aria-label={t("cart.remove")} onClick={() => removeFromCart(item.id)} className="p-1 text-magenta">
                    <Trash2 size={14} />
                  </button>
                </div>
              </ArcadePanel>
            ))}
          </div>

          <ArcadePanel glow="magenta" className="h-fit p-5">
            <h2 className="font-pixel text-xs">{t("cart.total")}</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted"><dt>{t("cart.food")}</dt><dd className="text-cream">{egp(subtotal)}</dd></div>
              <div className="flex justify-between text-muted"><dt>{t("cart.xp")}</dt><dd className="text-cyan">+{xpTotal}</dd></div>
              <div className="flex justify-between text-muted"><dt>{t("cart.discount")}</dt><dd className="text-lime">-{egp(discount)}</dd></div>
              <div className="flex justify-between text-muted"><dt>{t("cart.coins")}</dt><dd className="text-gold">+{coinsEarned}</dd></div>
              <div className="flex justify-between border-t border-line pt-3 font-pixel text-[11px]">
                <dt>{t("cart.grand")}</dt>
                <dd className="text-gold">{egp(total)}</dd>
              </div>
            </dl>
            <ArcadeButton href="/checkout" variant="magenta" className="mt-6 w-full">{t("cart.start")}</ArcadeButton>
          </ArcadePanel>
        </div>
      )}
    </div>
  );
}

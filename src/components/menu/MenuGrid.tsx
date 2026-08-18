"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { CATEGORIES, MENU, PUBLIC_MENU } from "@/lib/data/menu";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { useArcade } from "@/lib/context/ArcadeContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { FoodVisual } from "@/components/ui/FoodVisual";
import { PageHeader } from "@/components/ui/PageHeader";

function MenuCard({ item, onAdd }: { item: MenuItem; onAdd: () => void }) {
  const { t, locale } = useLanguage();
  const [hover, setHover] = useState(false);
  const price = t("currency.egp", {
    n: item.price.toLocaleString(locale === "ar" ? "ar-EG" : "en-EG"),
  });
  return (
    <motion.article
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      whileHover={{ y: -8 }}
      className="group"
    >
      <ArcadePanel className="h-full overflow-hidden transition group-hover:shadow-[0_0_28px_rgba(34,240,255,0.25)]">
        <div className="relative overflow-hidden">
          <motion.div animate={{ scale: hover ? 1.08 : 1 }} transition={{ duration: 0.35 }}>
            <FoodVisual kind={item.kind} variant={item.visual} size="lg" className="h-40 w-full" />
          </motion.div>
          {item.tag && (
            <span className="absolute start-3 top-3 bg-magenta px-2 py-1 font-hud text-[9px] tracking-[0.16em] rtl:tracking-normal">
              {t(`tag.${item.tag}`)}
            </span>
          )}
          {hover &&
            Array.from({ length: 8 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-1.5 w-1.5 bg-cyan"
                initial={{ opacity: 1, x: 80, y: 80 }}
                animate={{
                  opacity: 0,
                  x: 80 + Math.cos((i / 8) * Math.PI * 2) * 70,
                  y: 80 + Math.sin((i / 8) * Math.PI * 2) * 50,
                }}
                transition={{ duration: 0.7 }}
              />
            ))}
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-pixel text-[10px] leading-5 text-cream">{t(`food.${item.id}.name`)}</h3>
            <p className="shrink-0 font-hud text-[11px] text-gold">{price}</p>
          </div>
          <p className="text-xs leading-5 text-muted">{t(`food.${item.id}.desc`)}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 text-gold">
              <Star size={12} fill="currentColor" /> {item.rating.toFixed(1)}
            </span>
            <span className="font-hud text-[9px] text-cyan">{t("menu.xp", { xp: item.xp })}</span>
          </div>
          <ArcadeButton variant="cyan" className="w-full" onClick={onAdd}>
            {t("menu.add")}
          </ArcadeButton>
        </div>
      </ArcadePanel>
    </motion.article>
  );
}

export function MenuGrid() {
  const { addToCart, secretUnlocked } = useArcade();
  const { t } = useLanguage();
  const [category, setCategory] = useState<MenuCategory>("burgers");

  const items = useMemo(() => {
    const source = secretUnlocked ? MENU : PUBLIC_MENU;
    return source.filter((item) => item.category === category);
  }, [category, secretUnlocked]);

  return (
    <div>
      <PageHeader eyebrow={t("menu.eyebrow")} title={t("menu.title")} subtitle={t("menu.subtitle")} />
      <div className="no-scrollbar -mx-3 mb-6 flex gap-2 overflow-x-auto px-3 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`shrink-0 border px-4 py-2 font-hud text-[10px] tracking-[0.18em] rtl:tracking-normal ${
              category === cat.id
                ? "border-cyan bg-cyan text-void"
                : "border-cyan/30 text-cyan hover:bg-cyan/10"
            }`}
          >
            {t(`category.${cat.id}`)}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} onAdd={() => addToCart(item)} />
        ))}
      </div>
    </div>
  );
}

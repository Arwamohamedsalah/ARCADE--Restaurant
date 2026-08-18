"use client";

import { BurgerRush } from "@/components/game/BurgerRush";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { useLanguage } from "@/lib/context/LanguageContext";

export default function RushPage() {
  const { t } = useLanguage();
  return (
    <div>
      <ArcadeButton href="/play" variant="ghost" className="mb-4">
        {t("game.backRestaurant")}
      </ArcadeButton>
      <BurgerRush />
    </div>
  );
}

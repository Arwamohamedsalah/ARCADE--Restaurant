"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gamepad2,
  Home,
  ShoppingBag,
  Sword,
  Trophy,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useArcade } from "@/lib/context/ArcadeContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export const NAV = [
  { href: "/", key: "nav.home", icon: Home },
  { href: "/menu", key: "nav.menu", icon: UtensilsCrossed },
  { href: "/play", key: "nav.play", icon: Gamepad2 },
  { href: "/build", key: "nav.build", icon: Sword },
  { href: "/rewards", key: "nav.rewards", icon: Trophy },
  { href: "/profile", key: "nav.profile", icon: User },
  { href: "/cart", key: "nav.cart", icon: ShoppingBag },
];

export function ArcadeNav() {
  const pathname = usePathname();
  const { player, coins, cartCount } = useArcade();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-cyan/20 bg-void/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 md:px-6">
        <Link href="/" className="shrink-0">
          <p className="font-pixel text-[9px] text-cyan sm:text-[11px]">{t("brand.arcade")}</p>
          <p className="font-pixel text-[9px] text-magenta sm:text-[11px]">{t("brand.eatery")}</p>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={t("nav.main")}>
          {NAV.filter((item) => item.href !== "/").map((item) => {
            const active = pathname === item.href;
            const play = item.href === "/play";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 font-hud text-[10px] tracking-[0.18em] rtl:tracking-normal transition",
                  play && "bg-gold px-4 text-void hover:brightness-110",
                  !play && (active ? "text-cyan" : "text-muted hover:text-cream"),
                )}
                data-tour={play ? "nav-play" : undefined}
              >
                {play ? t("home.playNow") : t(item.key)}
                {item.href === "/cart" && cartCount > 0 && (
                  <span className="absolute -end-0.5 -top-0.5 min-w-4 bg-magenta px-1 text-center font-hud text-[8px] text-white">
                    {cartCount}
                  </span>
                )}
                {active && !play && (
                  <span className="absolute inset-x-2 -bottom-0.5 h-0.5 bg-cyan shadow-[0_0_8px_#22f0ff]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          <Link
            href="/play"
            className="inline-flex min-h-9 items-center bg-gold px-3 py-1.5 font-hud text-[10px] tracking-[0.16em] text-void rtl:tracking-normal lg:hidden"
            data-tour="nav-play"
          >
            {t("nav.play")}
          </Link>
          <Link href="/profile" className="hud-chip px-2 py-1.5">
            <p className="font-hud text-[8px] text-muted">{t("hud.player")}</p>
            <p className="font-hud text-[10px] text-cyan">01</p>
          </Link>
          <div className="hud-chip hidden px-2 py-1.5 sm:block">
            <p className="font-hud text-[8px] text-muted">{t("hud.level")}</p>
            <p className="font-hud text-[10px] text-magenta">{String(player.level).padStart(2, "0")}</p>
          </div>
          <div className="hud-chip px-2 py-1.5" data-tour="hud-coins">
            <p className="font-hud text-[8px] text-muted">{t("hud.coins")}</p>
            <p className="font-hud text-[10px] text-gold">{coins}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, ShoppingBag, Sword, Trophy, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import { useArcade } from "@/lib/context/ArcadeContext";
import { useLanguage } from "@/lib/context/LanguageContext";

const ITEMS = [
  { href: "/menu", key: "nav.menu", icon: UtensilsCrossed },
  { href: "/rewards", key: "nav.rewards", icon: Trophy },
  { href: "/play", key: "nav.play", icon: Gamepad2, primary: true },
  { href: "/build", key: "nav.buildShort", icon: Sword },
  { href: "/cart", key: "nav.cart", icon: ShoppingBag },
];

export function MobileNav() {
  const pathname = usePathname();
  const { cartCount } = useArcade();
  const { t } = useLanguage();

  return (
    <nav
      aria-label={t("nav.handheld")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-cyan/25 bg-void/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-end justify-between">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          const primary = "primary" in item && item.primary;
          return (
            <li key={item.href} className={cn("flex-1", primary && "relative z-10")}>
              <Link
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-1 py-1 font-hud text-[8px] tracking-[0.14em] rtl:tracking-normal",
                  primary ? "text-gold" : active ? "text-cyan" : "text-muted",
                )}
                data-tour={item.href === "/play" ? "nav-play-mobile" : undefined}
              >
                <span
                  className={cn(
                    "flex items-center justify-center",
                    primary &&
                      "-mt-6 h-14 w-14 rounded-full bg-gold text-void shadow-[0_0_22px_#ffd24a]",
                  )}
                >
                  <Icon size={primary ? 26 : 18} strokeWidth={2.2} />
                </span>
                {t(item.key)}
                {item.href === "/cart" && cartCount > 0 && (
                  <span className="absolute end-1 top-0 min-w-4 bg-magenta text-center text-[8px] text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

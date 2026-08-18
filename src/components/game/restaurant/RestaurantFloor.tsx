"use client";

import { motion } from "framer-motion";
import { PixelCustomer } from "@/components/game/restaurant/PixelCustomer";
import type { CustomerMood, CustomerTypeId, PrepItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/context/LanguageContext";

export type FloorGuest = {
  id: string;
  seat: number;
  type: CustomerTypeId;
  mood: CustomerMood;
  order: PrepItem[];
  patience: number;
  maxPatience: number;
};

type Props = {
  level: number;
  seats: number;
  guests: FloorGuest[];
  selected: string | null;
  onSelect: (id: string) => void;
  serveReady?: boolean;
};

const FLOOR: Record<number, string> = {
  1: "from-[#1b1230] to-[#120918]",
  2: "from-[#2a1030] to-[#14081c]",
  3: "from-[#102030] to-[#0b1220]",
  4: "from-[#2a2410] to-[#16100a]",
  5: "from-[#201040] to-[#0c0820]",
};

export function RestaurantFloor({ level, seats, guests, selected, onSelect, serveReady }: Props) {
  const { t } = useLanguage();
  return (
    <div className={cn("relative overflow-hidden border border-cyan/25 bg-gradient-to-b p-3 sm:p-5", FLOOR[level] ?? FLOOR[1])}>
      <div className="pointer-events-none absolute start-3 top-3 font-pixel text-[8px] text-magenta sm:text-[10px]">
        {t("game.open")}
      </div>
      <div className="pointer-events-none absolute end-3 top-2 hidden h-16 w-10 border border-gold/40 bg-void/50 sm:block" />
      <div className="mx-auto mb-4 h-3 w-2/3 bg-magenta/70 shadow-[0_0_18px_#ff2ec8]" />
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
        {Array.from({ length: seats }).map((_, seat) => {
          const guest = guests.find((g) => g.seat === seat);
          const ratio = guest ? guest.patience / guest.maxPatience : 0;
          return (
            <button
              key={seat}
              type="button"
              disabled={!guest}
              onClick={() => guest && onSelect(guest.id)}
              className={cn(
                "min-w-[120px] flex-1 border bg-black/25 px-2 py-3 sm:min-w-0",
                guest && selected === guest.id ? "border-cyan shadow-[0_0_16px_#22f0ff66]" : "border-line",
              )}
              data-tour={guest ? "shift-customer" : undefined}
            >
              <div className="mb-2 h-1.5 w-full bg-void">
                {guest && (
                  <motion.div
                    className={cn("h-full", ratio > 0.4 ? "bg-lime" : "bg-magenta")}
                    style={{ width: `${ratio * 100}%` }}
                  />
                )}
              </div>
              {guest ? (
                <>
                  <PixelCustomer type={guest.type} mood={guest.mood} selected={selected === guest.id} />
                  {serveReady && selected === guest.id && (
                    <p className="mt-2 bg-gold px-1 py-1 text-center font-hud text-[8px] leading-4 text-void rtl:tracking-normal">
                      {t("game.tapAgainServe")}
                    </p>
                  )}
                </>
              ) : (
                <p className="py-8 text-center font-hud text-[8px] text-muted">{t("game.emptySeat")}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

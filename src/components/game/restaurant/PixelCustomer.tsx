"use client";

import { CUSTOMER_TYPES } from "@/lib/data/restaurant";
import type { CustomerMood, CustomerTypeId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/context/LanguageContext";

const FACE: Record<CustomerMood, string> = {
  happy: "😊",
  waiting: "😐",
  angry: "😡",
  loved: "❤️",
  leaving: "💢",
};

type Props = {
  type: CustomerTypeId;
  mood: CustomerMood;
  selected?: boolean;
  compact?: boolean;
};

export function PixelCustomer({ type, mood, selected, compact }: Props) {
  const spec = CUSTOMER_TYPES[type];
  const { t } = useLanguage();
  return (
    <div className={cn("flex flex-col items-center", selected && "drop-shadow-[0_0_12px_#22f0ff]")}>
      <div
        className={cn("relative", compact ? "h-14 w-10" : "h-20 w-14")}
        aria-hidden
      >
        <div className="absolute inset-x-[18%] top-0 h-[22%] " style={{ background: spec.hat }} />
        <div className="absolute inset-x-[22%] top-[18%] h-[28%] bg-[#f0c9a0]" />
        <div
          className="absolute inset-x-[12%] top-[44%] h-[38%]"
          style={{ background: spec.palette }}
        />
        <div className="absolute bottom-0 left-[18%] h-[18%] w-[22%] bg-[#1a1024]" />
        <div className="absolute bottom-0 right-[18%] h-[18%] w-[22%] bg-[#1a1024]" />
        <span className="absolute left-1/2 top-[22%] -translate-x-1/2 text-[10px] sm:text-xs">
          {FACE[mood]}
        </span>
      </div>
      <p className="mt-1 max-w-[88px] text-center font-hud text-[7px] leading-3 tracking-[0.12em] rtl:tracking-normal text-cream">
        {t(`customer.${type}`)}
      </p>
    </div>
  );
}

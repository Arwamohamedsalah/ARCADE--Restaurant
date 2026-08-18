import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  glow?: "cyan" | "magenta" | "purple" | "gold" | "none";
};

const glowMap = {
  cyan: "shadow-[0_0_24px_rgba(34,240,255,0.16)] border-cyan/35",
  magenta: "shadow-[0_0_24px_rgba(255,46,200,0.16)] border-magenta/35",
  purple: "shadow-[0_0_24px_rgba(180,74,255,0.16)] border-purple/40",
  gold: "shadow-[0_0_24px_rgba(255,210,74,0.16)] border-gold/40",
  none: "border-line",
};

export function ArcadePanel({ children, className, glow = "cyan" }: Props) {
  return (
    <div className={cn("relative bg-panel/90 border", glowMap[glow], className)}>
      <span className="pointer-events-none absolute left-1 top-1 h-2 w-2 bg-cyan" />
      <span className="pointer-events-none absolute right-1 top-1 h-2 w-2 bg-magenta" />
      <span className="pointer-events-none absolute bottom-1 left-1 h-2 w-2 bg-magenta" />
      <span className="pointer-events-none absolute bottom-1 right-1 h-2 w-2 bg-cyan" />
      {children}
    </div>
  );
}

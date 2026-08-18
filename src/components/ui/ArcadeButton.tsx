"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "cyan" | "magenta" | "gold" | "ghost";

const styles: Record<Variant, string> = {
  cyan: "bg-cyan text-void hover:brightness-110",
  magenta: "bg-magenta text-white hover:brightness-110",
  gold: "bg-gold text-void hover:brightness-110",
  ghost: "bg-transparent text-cyan border border-cyan/50 hover:bg-cyan/10",
};

const base =
  "relative inline-flex items-center justify-center gap-2 px-5 py-3 font-hud text-[11px] uppercase tracking-[0.2em] rtl:normal-case rtl:tracking-normal disabled:cursor-not-allowed disabled:opacity-40";

type Props = {
  variant?: Variant;
  children: ReactNode;
  pixel?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  href?: string;
  tour?: string;
};

export function ArcadeButton({
  variant = "cyan",
  className,
  children,
  pixel = true,
  disabled,
  onClick,
  type = "button",
  href,
  tour,
}: Props) {
  const classes = cn(base, pixel && "pixel-frame", styles[variant], className);

  if (href && !disabled) {
    return (
      <motion.div
        data-tour={tour}
        className={cn(className?.includes("w-full") && "w-full")}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ y: 2, scale: 0.98 }}
      >
        <Link href={href} className={classes}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      data-tour={tour}
      whileHover={disabled ? undefined : { y: -2, scale: 1.02 }}
      whileTap={disabled ? undefined : { y: 2, scale: 0.98 }}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

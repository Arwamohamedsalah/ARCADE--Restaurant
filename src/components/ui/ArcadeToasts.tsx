"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useArcade } from "@/lib/context/ArcadeContext";
import { useLanguage } from "@/lib/context/LanguageContext";

export function ArcadeToasts() {
  const { toasts } = useArcade();
  const { dir } = useLanguage();
  const offset = dir === "rtl" ? -40 : 40;
  return (
    <div className="pointer-events-none fixed end-4 top-20 z-50 flex w-[min(90vw,280px)] flex-col gap-2 md:top-24">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: offset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: offset }}
            className="border border-gold/50 bg-void/90 px-3 py-2 shadow-[0_0_18px_rgba(255,210,74,0.25)]"
          >
            <p className="font-hud text-[10px] text-gold tracking-[0.2em] rtl:tracking-normal">{toast.title}</p>
            {toast.body && <p className="mt-1 text-xs text-cream">{toast.body}</p>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

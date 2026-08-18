"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/context/LanguageContext";
import { arcadeSfx } from "@/lib/sound";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { useEffect, useState } from "react";

type Stage = "attract" | "drop" | "inserting" | "ready";

export function InsertCoin({ onDone }: { onDone: () => void }) {
  const { t } = useLanguage();
  const [stage, setStage] = useState<Stage>("attract");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stage !== "inserting") return;
    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          window.clearInterval(id);
          return 100;
        }
        return p + 4;
      });
    }, 50);
    return () => window.clearInterval(id);
  }, [stage]);

  useEffect(() => {
    if (progress < 100 || stage !== "inserting") return;
    const t = window.setTimeout(() => setStage("ready"), 250);
    return () => window.clearTimeout(t);
  }, [progress, stage]);

  useEffect(() => {
    if (stage !== "ready") return;
    const t = window.setTimeout(onDone, 1400);
    return () => window.clearTimeout(t);
  }, [stage, onDone]);

  function insert() {
    arcadeSfx.coin();
    setStage("drop");
    window.setTimeout(() => setStage("inserting"), 850);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center arcade-bg"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.7 }}
    >
      <div className="relative mx-4 w-full max-w-xl border border-cyan/30 bg-void/80 px-6 py-10 text-center cabinet-frame sm:px-12 sm:py-14">
        <p className="font-hud text-[10px] text-magenta tracking-[0.4em] rtl:tracking-normal">{t("insert.cabinet")}</p>
        <h1 className="mt-5 font-pixel text-xl text-cyan glitch sm:text-3xl">{t("brand.full")}</h1>
        <p className="mt-4 font-hud text-[10px] text-gold tracking-[0.35em] sm:text-xs rtl:tracking-normal">
          {t("brand.tagline")}
        </p>

        <div className="relative mx-auto mt-10 h-36 w-24">
          <AnimatePresence>
            {(stage === "drop" || stage === "inserting") && (
              <motion.div
                key="coin"
                initial={{ y: -90, rotate: 0, opacity: 1 }}
                animate={{ y: 78, rotate: 720 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeIn" }}
                className="absolute left-1/2 top-0 h-10 w-10 -translate-x-1/2 rounded-full border-4 border-[#c9a227] bg-gold shadow-[0_0_20px_#ffd24a]"
              />
            )}
          </AnimatePresence>
          <div className="absolute bottom-2 left-1/2 h-4 w-16 -translate-x-1/2 bg-panel-2 shadow-[inset_0_2px_0_#000]">
            <div className="mx-auto h-full w-10 bg-void" />
          </div>
          <div className="absolute bottom-0 left-1/2 h-2 w-20 -translate-x-1/2 bg-line" />
        </div>

        {stage === "attract" && (
          <div className="mt-8 space-y-6">
            <p className="font-pixel text-lg text-gold blink sm:text-2xl">{t("insert.insertCoin")}</p>
            <ArcadeButton variant="gold" onClick={insert} className="min-h-12 min-w-[220px]">
              {t("insert.insertCoin")}
            </ArcadeButton>
            <p className="text-xs text-muted">{t("insert.credit")}</p>
          </div>
        )}

        {stage === "inserting" && (
          <div className="mt-8 space-y-4">
            <p className="font-pixel text-xs text-cyan sm:text-sm">{t("insert.inserting")}</p>
            <div className="mx-auto h-4 w-full max-w-sm border border-cyan/40 bg-void p-0.5">
              <motion.div
                className="h-full neon-gradient"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-hud text-[10px] text-muted">{progress}%</p>
          </div>
        )}

        {stage === "ready" && (
          <motion.p
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-10 font-pixel text-sm text-lime sm:text-lg"
          >
            {t("insert.ready")}
          </motion.p>
        )}

        <p className="mt-10 font-hud text-[9px] text-muted tracking-[0.3em] rtl:tracking-normal">
          {t("insert.copy")}
        </p>
      </div>
    </motion.div>
  );
}

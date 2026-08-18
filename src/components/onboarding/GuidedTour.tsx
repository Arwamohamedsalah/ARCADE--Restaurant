"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { COACH_STEPS, useOnboarding } from "@/lib/context/OnboardingContext";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { arcadeSfx } from "@/lib/sound";

function readTarget(id: string | null) {
  if (!id || typeof document === "undefined") return null;
  const nodes = document.querySelectorAll<HTMLElement>(
    `[data-tour="${id}"], [data-tour="${id}-mobile"]`,
  );
  for (const el of nodes) {
    const r = el.getBoundingClientRect();
    if (r.width > 2 && r.height > 2) return { el, r };
  }
  return null;
}

export function GuidedTour() {
  const { t } = useLanguage();
  const { phase, step, next, skip } = useOnboarding();
  const pathname = usePathname();
  const router = useRouter();
  const steps = COACH_STEPS;
  const current = steps[step];
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [vh, setVh] = useState(800);
  const [vw, setVw] = useState(1200);
  const scrolledFor = useRef<string | null>(null);

  useEffect(() => {
    if (!current) return;
    if (pathname !== current.route) router.push(current.route);
  }, [current, pathname, router]);

  useEffect(() => {
    scrolledFor.current = null;
  }, [current?.id]);

  useEffect(() => {
    const measure = () => {
      setVh(window.innerHeight);
      setVw(window.innerWidth);
      const hit = current?.target ? readTarget(current.target) : null;
      setRect(hit?.r ?? null);
      if (hit && scrolledFor.current !== current?.id) {
        scrolledFor.current = current?.id ?? null;
        hit.el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
      }
    };
    measure();
    const id = window.setInterval(measure, 180);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [current, pathname]);

  if (!current || phase !== "coach") return null;

  const last = step === steps.length - 1;
  const pad = 12;
  const highlight = rect
    ? {
        top: Math.max(4, rect.top - pad),
        left: Math.max(4, rect.left - pad),
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null;

  const banner = Boolean(current.target);
  const dockTop = !highlight || highlight.top + highlight.height / 2 > vh * 0.45;
  const showNext = !current.interact;

  const onAdvance = () => {
    arcadeSfx.click();
    next();
  };

  return (
    <div className="fixed inset-0 z-[68] pointer-events-none">
      {highlight ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 bg-void/70" style={{ height: highlight.top }} />
          <div
            className="pointer-events-none absolute left-0 bg-void/70"
            style={{ top: highlight.top, width: highlight.left, height: highlight.height }}
          />
          <div
            className="pointer-events-none absolute bg-void/70"
            style={{
              top: highlight.top,
              left: highlight.left + highlight.width,
              right: 0,
              height: highlight.height,
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 bg-void/70"
            style={{ top: highlight.top + highlight.height }}
          />
          <motion.div
            className="absolute z-[70] border-4 border-gold shadow-[0_0_36px_#ffd24a]"
            style={highlight}
            animate={{ opacity: [1, 0.45, 1], scale: [1, 1.015, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
          <motion.div
            className="pointer-events-none absolute z-[71] flex h-14 w-14 items-center justify-center rounded-full border-4 border-void bg-gold font-pixel text-2xl text-void"
            style={{ top: Math.max(8, highlight.top - 22), left: Math.max(8, highlight.left - 18) }}
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          >
            {step + 1}
          </motion.div>
          <motion.div
            className="pointer-events-none absolute z-[71] flex flex-col items-center text-gold"
            style={{
              top: Math.min(
                vh - 90,
                Math.max(
                  8,
                  dockTop ? highlight.top + highlight.height + 4 : highlight.top - 80,
                ),
              ),
              left: Math.min(vw - 128, Math.max(8, highlight.left + highlight.width / 2 - 60)),
              width: 120,
            }}
            animate={{ y: dockTop ? [0, 8, 0] : [0, -8, 0] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          >
            {dockTop ? (
              <>
                <ArrowDown size={48} strokeWidth={3.8} className="rotate-180 drop-shadow-[0_0_8px_#ffd24a]" />
                <span className="rounded-sm bg-gold px-3 py-1.5 text-center font-pixel text-[11px] leading-none text-void">
                  {t("onboard.tapHere")}
                </span>
              </>
            ) : (
              <>
                <span className="rounded-sm bg-gold px-3 py-1.5 text-center font-pixel text-[11px] leading-none text-void">
                  {t("onboard.tapHere")}
                </span>
                <ArrowDown size={48} strokeWidth={3.8} className="drop-shadow-[0_0_8px_#ffd24a]" />
              </>
            )}
          </motion.div>
        </>
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-void/70" />
      )}

      {banner ? (
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto absolute inset-x-3 z-[72] border-2 border-gold bg-void p-4 shadow-[0_0_24px_#ffd24a88] sm:inset-x-6"
          style={{ top: 52 }}
        >
          <p className="font-hud text-[11px] text-gold tracking-[0.16em] rtl:tracking-normal">
            {t("onboard.doThis")} · {t("onboard.step", { n: step + 1, total: steps.length })}
            {phase === "coach" ? ` · ${t("onboard.paused")}` : ""}
          </p>
          <div className="mt-2 flex gap-1.5">
            {steps.map((s, i) => (
              <span
                key={s.id}
                className={`h-2 flex-1 ${i === step ? "bg-gold" : i < step ? "bg-cyan" : "bg-line"}`}
              />
            ))}
          </div>
          <h2 className="mt-3 font-pixel text-lg leading-8 text-cyan sm:text-xl">{t(current.titleKey)}</h2>
          <p className="mt-2 text-lg leading-8 text-cream sm:text-xl">
            {highlight ? t(current.bodyKey) : t("onboard.waitTarget")}
          </p>
          {showNext && (
            <ArcadeButton variant="gold" className="mt-4 min-h-12 w-full sm:w-auto" onClick={onAdvance}>
              {last ? t("onboard.gotIt") : t("onboard.next")}
            </ArcadeButton>
          )}
          <button
            type="button"
            onClick={skip}
            className="mt-3 block font-hud text-[10px] text-muted tracking-[0.14em] rtl:tracking-normal hover:text-cream"
          >
            {t("onboard.skip")}
          </button>
        </motion.div>
      ) : (
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="pointer-events-auto absolute z-[69] border-2 border-cyan bg-void p-6 cabinet-frame"
          style={{
            top: Math.max(24, vh / 2 - 200),
            left: Math.max(12, (vw - Math.min(vw - 24, 420)) / 2),
            width: Math.min(vw - 24, 420),
          }}
        >
          <p className="font-hud text-[10px] text-gold tracking-[0.18em] rtl:tracking-normal">
            {t("onboard.doThis")} · {t("onboard.step", { n: step + 1, total: steps.length })}
          </p>
          <h2 className="mt-3 font-pixel text-lg leading-8 text-cyan sm:text-xl">{t(current.titleKey)}</h2>
          <p className="mt-3 text-lg leading-8 text-cream">{t(current.bodyKey)}</p>
          <ol className="mt-4 space-y-2 border border-gold/50 bg-gold/10 px-4 py-3 text-start font-hud text-sm leading-7 text-gold">
            <li>{t("onboard.flow1")}</li>
            <li>{t("onboard.flow2")}</li>
            <li>{t("onboard.flow3")}</li>
            <li>{t("onboard.flow4")}</li>
          </ol>
          <ArcadeButton variant="gold" className="mt-5 min-h-12 w-full" onClick={onAdvance}>
            {t("onboard.next")}
          </ArcadeButton>
          <button
            type="button"
            onClick={skip}
            className="mt-3 font-hud text-[10px] text-muted tracking-[0.14em] rtl:tracking-normal hover:text-cream"
          >
            {t("onboard.skip")}
          </button>
        </motion.div>
      )}
    </div>
  );
}

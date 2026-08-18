"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useArcade } from "@/lib/context/ArcadeContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import { arcadeSfx } from "@/lib/sound";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { FoodVisual } from "@/components/ui/FoodVisual";
import { PageHeader } from "@/components/ui/PageHeader";
import { randomBetween } from "@/lib/utils";

type Phase = "idle" | "playing" | "over";
type Floater = { id: number; text: string; x: number; y: number };

const DURATION = 20;

export function BurgerRush() {
  const { highScore, submitGame } = useArcade();
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(DURATION);
  const [combo, setCombo] = useState(0);
  const [pos, setPos] = useState({ x: 40, y: 40 });
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [result, setResult] = useState({ score: 0, coins: 0, isHigh: false });
  const lastHit = useRef(0);
  const comboMax = useRef(0);
  const ended = useRef(false);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);

  const moveBurger = useCallback(() => {
    setPos({
      x: randomBetween(8, 78),
      y: randomBetween(8, 68),
    });
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const tick = window.setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);
    return () => window.clearInterval(tick);
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing" || time > 0 || ended.current) return;
    ended.current = true;
    const payload = submitGame(scoreRef.current, comboMax.current);
    setResult({ score: scoreRef.current, coins: payload.coinsEarned, isHigh: payload.isHigh });
    setPhase("over");
    arcadeSfx.win();
  }, [phase, time, submitGame]);

  function start() {
    ended.current = false;
    scoreRef.current = 0;
    setScore(0);
    setTime(DURATION);
    setCombo(0);
    comboMax.current = 0;
    comboRef.current = 0;
    lastHit.current = 0;
    setFloaters([]);
    moveBurger();
    setPhase("playing");
  }

  function hit() {
    if (phase !== "playing") return;
    const now = Date.now();
    const nextCombo = now - lastHit.current < 900 ? comboRef.current + 1 : 1;
    lastHit.current = now;
    comboRef.current = nextCombo;
    setCombo(nextCombo);
    comboMax.current = Math.max(comboMax.current, nextCombo);
    const gain = 10 * nextCombo;
    scoreRef.current += gain;
    setScore(scoreRef.current);
    if (nextCombo >= 3) arcadeSfx.combo();
    else arcadeSfx.hit();
    const id = now;
    setFloaters((f) => [...f, { id, text: `+${gain}`, x: pos.x, y: pos.y }]);
    window.setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 700);
    moveBurger();
  }

  return (
    <div>
      <PageHeader
        eyebrow={t("rush.eyebrow")}
        title={t("rush.title")}
        subtitle={t("rush.subtitle")}
      />

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: t("hud.score"), value: score },
          { label: t("rush.time"), value: phase === "playing" ? time : DURATION },
          { label: t("hud.combo"), value: `x${Math.max(combo, 1)}` },
          { label: t("rush.highScore"), value: highScore },
        ].map((stat) => (
          <ArcadePanel key={stat.label} className="px-3 py-3">
            <p className="font-hud text-[9px] text-muted tracking-[0.16em] rtl:tracking-normal">{stat.label}</p>
            <p className="mt-1 font-pixel text-[11px] text-cyan">{stat.value}</p>
          </ArcadePanel>
        ))}
      </div>

      <ArcadePanel glow="magenta" className="relative overflow-hidden">
        <div className="relative h-[360px] touch-none bg-[radial-gradient(circle_at_center,rgba(255,46,200,0.12),transparent_60%)] sm:h-[420px]">
          {phase === "idle" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-void/70 p-6 text-center">
              <p className="font-pixel text-sm text-cream">{t("rush.ready")}</p>
              <p className="max-w-sm text-sm text-muted">{t("rush.how")}</p>
              <ArcadeButton onClick={start}>{t("rush.start")}</ArcadeButton>
            </div>
          )}

          {phase === "playing" && (
            <motion.button
              type="button"
              aria-label={t("rush.tap")}
              className="absolute"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={hit}
              animate={{ scale: [1, 1.06, 1], rotate: [0, -4, 4, 0] }}
              transition={{ duration: 0.45 }}
            >
              <FoodVisual kind="burger" variant="double-boss" size="sm" className="h-20 w-20 shadow-[0_0_22px_#ff2ec8]" />
            </motion.button>
          )}

          <AnimatePresence>
            {floaters.map((f) => (
              <motion.span
                key={f.id}
                className="pointer-events-none absolute font-pixel text-[10px] text-gold"
                style={{ left: `${f.x}%`, top: `${f.y}%` }}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -28 }}
                exit={{ opacity: 0 }}
              >
                {f.text}
                {combo >= 3 ? `  ${t("rush.combo", { n: combo })}` : ""}
              </motion.span>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {phase === "over" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-void/85 p-6 text-center"
              >
                <p className="font-pixel text-lg text-magenta">{t("rush.over")}</p>
                {result.isHigh && (
                  <p className="font-pixel text-xs text-gold blink">{t("rush.newHigh")}</p>
                )}
                <p className="font-hud text-sm text-cyan">{t("rush.yourScore", { score: result.score })}</p>
                <p className="text-sm text-muted">{t("rush.coinsEarned", { coins: result.coins })}</p>
                <div className="mt-2 flex flex-wrap justify-center gap-3">
                  <ArcadeButton onClick={start}>{t("rush.playAgain")}</ArcadeButton>
                  <ArcadeButton href="/" variant="ghost">{t("rush.back")}</ArcadeButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ArcadePanel>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { FoodVisual } from "@/components/ui/FoodVisual";
import { T } from "@/components/i18n/T";
import { useArcade } from "@/lib/context/ArcadeContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import { CAMPAIGN_GOAL, streakStatus, todayStamp, xpToNext } from "@/lib/data/restaurant";

const FLOATS = [
  { key: "hud.coins", color: "text-gold", x: "6%", y: "18%", delay: 0 },
  { key: "hud.score", color: "text-cyan", x: "78%", y: "14%", delay: 0.4 },
  { key: "hud.bonus", color: "text-magenta", x: "10%", y: "62%", delay: 0.8 },
  { key: "game.levelUp", color: "text-lime", x: "72%", y: "58%", delay: 0.2 },
  { key: "hud.achievement", color: "text-purple", x: "54%", y: "8%", delay: 1 },
];

export function ArcadeDashboard() {
  const { restaurant, highScore } = useArcade();
  const { t, locale } = useLanguage();
  const num = (n: number) => n.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");
  const xp = xpToNext(restaurant.xp);
  const empirePct = Math.min(100, (restaurant.xp / CAMPAIGN_GOAL.xp) * 100);
  const status = streakStatus(restaurant.lastPlayDate, todayStamp());
  const continuing = restaurant.day > 1 || restaurant.shiftsCleared > 0;
  const playLabel = continuing
    ? t("home.continueRun", { day: restaurant.day })
    : t("home.playNow");
  const streakLabel =
    restaurant.streak > 0
      ? t("home.streak", { n: restaurant.streak })
      : t("home.streakStart");

  return (
    <div lang={locale} className="relative overflow-x-hidden pb-4">
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {FLOATS.map((token) => (
          <motion.span
            key={`${locale}-${token.key}`}
            className={`absolute font-hud text-[10px] tracking-[0.2em] rtl:tracking-normal opacity-70 ${token.color}`}
            style={{ left: token.x, top: token.y }}
            animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, delay: token.delay }}
          >
            <T k={token.key} />
          </motion.span>
        ))}
      </div>

      <div className="-mx-3 mb-6 overflow-hidden border-y border-cyan/20 bg-magenta/10 py-2 sm:-mx-6 lg:-mx-8">
        <div className="marquee-track flex w-max gap-10 font-hud text-[10px] text-cyan tracking-[0.25em] rtl:tracking-normal">
          {Array.from({ length: 2 }).map((_, i) => (
            <p key={`${locale}-marquee-${i}`} className="flex gap-10 px-6">
              <span><T k="home.highScore" vars={{ score: num(highScore) }} /></span>
              <span>{streakLabel}</span>
              <span><T k="home.marqueeRun" /></span>
              <span><T k="home.whyReturn" /></span>
              <span><T k="home.marqueeFood" /></span>
            </p>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-2xl text-center">
        <p className="font-hud text-[10px] text-magenta tracking-[0.35em] rtl:tracking-normal">
          <T k="home.pressStart" />
        </p>
        <h1 className="mt-4 font-pixel text-[26px] leading-[1.7] text-cream glitch sm:text-5xl">
          {t(`tier.${restaurant.level}`)}
        </h1>
        <p className="mt-4 font-hud text-sm text-cyan tracking-[0.2em] rtl:tracking-normal">
          <T k="home.support" />
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted">
          <T k="home.body" />
        </p>

        <motion.div
          className="mx-auto mt-8 max-w-md"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <ArcadeButton href="/play" variant="gold" tour="shift-btn" className="w-full min-h-16 px-8 text-sm sm:text-base">
            {playLabel}
          </ArcadeButton>
        </motion.div>
        <p className="mt-3 font-hud text-[10px] text-gold tracking-[0.18em] rtl:tracking-normal">
          {status === "today" ? t("home.playedToday") : t("home.whyReturn")}
        </p>

        <div className="relative mx-auto mt-8 grid max-w-sm grid-cols-4 gap-2">
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.2, repeat: Infinity }}>
            <FoodVisual kind="burger" variant="double-boss" size="sm" className="w-full" />
          </motion.div>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.8, repeat: Infinity }}>
            <FoodVisual kind="pizza" variant="final-boss" size="sm" className="w-full" />
          </motion.div>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2.8, repeat: Infinity }}>
            <FoodVisual kind="drink" variant="milkshake" size="sm" className="w-full" />
          </motion.div>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>
            <FoodVisual kind="fries" variant="pixel-fries" size="sm" className="w-full" />
          </motion.div>
        </div>
      </section>

      <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: t("hud.day"), value: String(restaurant.day).padStart(2, "0"), glow: "cyan" as const },
          { label: t("hud.level"), value: t(`tier.${restaurant.level}`), glow: "magenta" as const },
          { label: t("home.streakLabel"), value: String(restaurant.streak || 0).padStart(2, "0"), glow: "gold" as const },
          { label: t("hud.score"), value: num(highScore), glow: "purple" as const },
        ].map((stat) => (
          <ArcadePanel key={`${locale}-${stat.label}`} glow={stat.glow} className="px-4 py-4 text-center">
            <p className="font-hud text-[10px] text-muted tracking-[0.2em] rtl:tracking-normal">
              {stat.label}
            </p>
            <p className="mt-2 font-pixel text-sm text-cream">{stat.value}</p>
          </ArcadePanel>
        ))}
      </section>

      <ArcadePanel glow="gold" className="mt-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-hud text-[10px] text-gold tracking-[0.18em] rtl:tracking-normal">
            {t("home.xpToEmpire", { xp: num(restaurant.xp), need: num(xp.needed) })}
          </p>
          <p className="font-hud text-[10px] text-muted">{streakLabel}</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden border border-gold/40 bg-void">
          <div className="h-full bg-gold" style={{ width: `${empirePct}%` }} />
        </div>
      </ArcadePanel>

      <section className="mt-8">
        <p className="mb-3 font-hud text-[10px] text-muted tracking-[0.25em] rtl:tracking-normal">
          <T k="home.extras" />
        </p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/menu">
            <ArcadePanel className="h-full p-5 transition hover:border-cyan/60">
              <p className="font-hud text-[10px] text-cyan"><T k="home.startOrder" /></p>
              <h2 className="mt-2 font-pixel text-xs leading-6"><T k="menu.title" /></h2>
              <p className="mt-2 text-sm text-muted"><T k="menu.subtitle" /></p>
            </ArcadePanel>
          </Link>
          <Link href="/build">
            <ArcadePanel className="h-full p-5 transition hover:border-magenta/60">
              <p className="font-hud text-[10px] text-magenta"><T k="home.loadout" /></p>
              <h2 className="mt-2 font-pixel text-xs leading-6"><T k="home.buildTitle" /></h2>
              <p className="mt-2 text-sm text-muted"><T k="home.buildBody" /></p>
            </ArcadePanel>
          </Link>
          <Link href="/rewards">
            <ArcadePanel glow="gold" className="h-full p-5 transition hover:border-gold/60">
              <p className="font-hud text-[10px] text-gold"><T k="home.prize" /></p>
              <h2 className="mt-2 font-pixel text-xs leading-6"><T k="home.spendTitle" /></h2>
              <p className="mt-2 text-sm text-muted"><T k="home.spendBody" /></p>
            </ArcadePanel>
          </Link>
          <Link href="/leaderboard">
            <ArcadePanel glow="purple" className="h-full p-5 transition hover:border-purple/60">
              <p className="font-hud text-[10px] text-purple"><T k="home.rankings" /></p>
              <h2 className="mt-2 font-pixel text-xs leading-6"><T k="home.boardTitle" /></h2>
              <p className="mt-2 text-sm text-muted"><T k="home.boardBody" /></p>
            </ArcadePanel>
          </Link>
        </div>
      </section>
    </div>
  );
}

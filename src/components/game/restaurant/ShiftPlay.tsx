"use client";

import { useEffect, useMemo, useReducer, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EVENTS, getDayConfig, kitchenPool } from "@/lib/data/restaurant";
import { useLanguage } from "@/lib/context/LanguageContext";
import {
  buildOrder,
  clampSatisfaction,
  comboMultiplier,
  cookDuration,
  maxCookSlots,
  moodFromPatience,
  patienceFor,
  payout,
  pickCustomerType,
  platesMatch,
  seatCount,
  shiftPass,
  spawnInterval,
} from "@/lib/game/shift";
import { arcadeSfx } from "@/lib/sound";
import type { PrepItem, RestaurantProgress, RestaurantUpgrades, ShiftEventId, ShiftSummary } from "@/lib/types";
import type { FloorGuest } from "@/components/game/restaurant/RestaurantFloor";
import { RestaurantFloor } from "@/components/game/restaurant/RestaurantFloor";
import { KitchenStation } from "@/components/game/restaurant/KitchenStation";
import { OrderTicket } from "@/components/game/restaurant/OrderTicket";
import { ShiftHUD } from "@/components/game/restaurant/ShiftHUD";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { useOnboarding } from "@/lib/context/OnboardingContext";

type Guest = FloorGuest & { maxPatience: number };

type Job = { id: string; item: PrepItem; t: number; dur: number };

type Floater = { id: number; kind: "good" | "bad" | "combo"; key: string; vars?: Record<string, string | number> };

type ShiftState = {
  guests: Guest[];
  plate: PrepItem[];
  cooking: Job[];
  selected: string | null;
  spawned: number;
  remaining: number;
  served: number;
  completed: number;
  failed: number;
  combo: number;
  bestCombo: number;
  score: number;
  earned: number;
  xp: number;
  satisfaction: number;
  spawnAcc: number;
  over: boolean;
  floaters: Floater[];
  pop: { titleKey: string; bodyKey: string; vars?: Record<string, string | number> } | null;
};

type Action =
  | { type: "TICK"; dt: number; freezeGuests?: boolean }
  | { type: "SELECT"; id: string }
  | { type: "COOK"; item: PrepItem; fast?: boolean }
  | { type: "CLEAR" }
  | { type: "SERVE" }
  | { type: "POP_CLEAR" }
  | { type: "SPAWN" };

type ShiftMeta = {
  day: number;
  dayName: string;
  quota: number;
  spawnMs: number;
  complexity: number;
  event: ShiftEventId | null;
  seats: number;
  cookMs: number;
  slots: number;
  upgrades: RestaurantUpgrades;
};

function createShift(progress: RestaurantProgress): { state: ShiftState; meta: ShiftMeta } {
  const day = getDayConfig(progress.day);
  const event = day.event;
  const seats = seatCount(progress.upgrades.tables);
  return {
    meta: {
      day: day.day,
      dayName: day.name,
      quota: day.quota,
      spawnMs: spawnInterval(day.spawnMs, event),
      complexity: day.complexity,
      event,
      seats,
      cookMs: cookDuration(progress.upgrades.kitchen, progress.upgrades.staff),
      slots: maxCookSlots(progress.upgrades.staff),
      upgrades: progress.upgrades,
    },
    state: {
      guests: [],
      plate: [],
      cooking: [],
      selected: null,
      spawned: 0,
      remaining: day.quota,
      served: 0,
      completed: 0,
      failed: 0,
      combo: 0,
      bestCombo: 0,
      score: 0,
      earned: 0,
      xp: 0,
      satisfaction: 100,
      spawnAcc: spawnInterval(day.spawnMs, event),
      over: false,
      floaters: [],
      pop: null,
    },
  };
}

function spawnGuest(state: ShiftState, meta: ShiftMeta, autoSelect = true): ShiftState {
  const taken = new Set(state.guests.map((g) => g.seat));
  const seat = Array.from({ length: meta.seats }, (_, i) => i).find((i) => !taken.has(i));
  if (seat == null || state.remaining <= 0) return state;
  const type = pickCustomerType(meta.day, meta.event);
  const order = buildOrder(type, meta.complexity, meta.upgrades);
  const max = patienceFor(type, meta.upgrades.decor);
  const guest: Guest = {
    id: `g-${state.spawned + 1}`,
    seat,
    type,
    order,
    patience: max,
    maxPatience: max,
    mood: "happy",
  };
  return {
    ...state,
    guests: [...state.guests, guest],
    spawned: state.spawned + 1,
    remaining: state.remaining - 1,
    selected: autoSelect ? state.selected ?? guest.id : state.selected,
    spawnAcc: 0,
  };
}

function nextNeededFood(order: PrepItem[], plate: PrepItem[]) {
  const left = new Map<string, number>();
  for (const item of plate) left.set(item.id, (left.get(item.id) ?? 0) + 1);
  for (const item of order) {
    const n = left.get(item.id) ?? 0;
    if (n <= 0) return item.id;
    left.set(item.id, n - 1);
  }
  return order[0]?.id ?? null;
}

function makeReducer(meta: ShiftMeta) {
  return function reducer(state: ShiftState, action: Action): ShiftState {
    if (state.over && action.type !== "POP_CLEAR") return state;

    switch (action.type) {
      case "SELECT":
        return { ...state, selected: action.id };
      case "SPAWN":
        return spawnGuest(state, meta, false);
      case "CLEAR":
        return { ...state, plate: [] };
      case "COOK": {
        if (state.cooking.length >= meta.slots) return state;
        if (state.plate.length + state.cooking.length >= 4) return state;
        arcadeSfx.cook();
        return {
          ...state,
          cooking: [
            ...state.cooking,
            {
              id: `${action.item.id}-${Date.now()}`,
              item: action.item,
              t: 0,
              dur: action.fast ? Math.max(1600, meta.cookMs * 0.55) : meta.cookMs,
            },
          ],
        };
      }
      case "POP_CLEAR":
        return { ...state, pop: null };
      case "SERVE": {
        const guest = state.guests.find((g) => g.id === state.selected);
        if (!guest || state.plate.length === 0) return state;
        if (!platesMatch(state.plate, guest.order)) {
          arcadeSfx.error();
          return {
            ...state,
            plate: [],
            combo: 0,
            satisfaction: clampSatisfaction(state.satisfaction - 8),
            guests: state.guests.map((g) =>
              g.id === guest.id
                ? { ...g, patience: g.patience * 0.72, mood: moodFromPatience((g.patience * 0.72) / g.maxPatience) }
                : g,
            ),
            pop: { titleKey: "game.wrong", bodyKey: "game.checkTicket" },
            floaters: [...state.floaters.slice(-4), { id: Date.now(), kind: "bad", key: "game.wrong" }],
          };
        }
        const nextCombo = state.combo + 1;
        const perfect = guest.patience / guest.maxPatience > 0.65;
        const pay = payout(guest.order, guest.type, nextCombo, meta.event, perfect);
        const scoreGain = Math.round(80 * comboMultiplier(nextCombo) * (perfect ? 1.3 : 1));
        if (nextCombo >= 3) arcadeSfx.combo();
        else arcadeSfx.serve();
        return {
          ...state,
          guests: state.guests.filter((g) => g.id !== guest.id),
          selected: null,
          plate: [],
          combo: nextCombo,
          bestCombo: Math.max(state.bestCombo, nextCombo),
          served: state.served + 1,
          completed: state.completed + 1,
          earned: state.earned + pay.money,
          xp: state.xp + pay.xp,
          score: state.score + scoreGain,
          satisfaction: clampSatisfaction(state.satisfaction + 3),
          pop: {
            titleKey: perfect ? "game.perfect" : "game.complete",
            bodyKey: nextCombo > 1 ? "game.rewardPopCombo" : "game.rewardPop",
            vars: { xp: pay.xp, money: pay.money, combo: nextCombo },
          },
          floaters: [
            ...state.floaters.slice(-4),
            {
              id: Date.now(),
              kind: nextCombo >= 3 ? "combo" : "good",
              key: perfect ? "game.perfectShort" : "game.plusMoney",
              vars: { money: pay.money },
            },
          ],
        };
      }
      case "TICK": {
        let plate = [...state.plate];
        const cooking: Job[] = [];
        for (const job of state.cooking) {
          const t = job.t + action.dt;
          if (t >= job.dur) {
            plate.push(job.item);
            arcadeSfx.hit();
          } else {
            cooking.push({ ...job, t });
          }
        }

        if (action.freezeGuests) {
          return {
            ...state,
            plate,
            cooking,
            floaters: state.floaters.filter((f) => Date.now() - f.id < 1200),
          };
        }

        let failed = state.failed;
        let combo = state.combo;
        let satisfaction = state.satisfaction;
        let selected = state.selected;
        let pop = state.pop;
        let floaters = state.floaters;
        let lost = false;
        const guests: Guest[] = [];
        for (const guest of state.guests) {
          const patience = guest.patience - action.dt;
          if (patience <= 0) {
            lost = true;
            failed += 1;
            combo = 0;
            satisfaction = clampSatisfaction(satisfaction - 12);
            if (selected === guest.id) selected = null;
            pop = { titleKey: "game.tooSlow", bodyKey: "game.comboBreak" };
            floaters = [...floaters.slice(-4), { id: Date.now() + failed, kind: "bad", key: "game.tooSlow" }];
            continue;
          }
          guests.push({
            ...guest,
            patience,
            mood: moodFromPatience(patience / guest.maxPatience),
          });
        }
        if (lost) arcadeSfx.error();

        let next: ShiftState = {
          ...state,
          plate,
          cooking,
          guests,
          failed,
          combo,
          satisfaction,
          selected,
          pop,
          floaters: floaters.filter((f) => Date.now() - f.id < 1200),
          spawnAcc: state.spawnAcc + action.dt,
        };
        if (next.spawnAcc >= meta.spawnMs) next = spawnGuest(next, meta);
        if (next.remaining <= 0 && next.guests.length === 0 && next.spawned >= meta.quota) {
          next = { ...next, over: true };
        }
        return next;
      }
      default:
        return state;
    }
  };
}

type Props = {
  progress: RestaurantProgress;
  muted: boolean;
  onMute: () => void;
  onQuit: () => void;
  onEnd: (summary: ShiftSummary) => void;
};

export function ShiftPlay({ progress, muted, onMute, onQuit, onEnd }: Props) {
  const { t } = useLanguage();
  const { phase, step, next, back } = useOnboarding();
  const coaching = phase === "coach";
  const boot = useMemo(() => createShift(progress), [progress]);
  const meta = boot.meta;
  const reducer = useMemo(() => makeReducer(meta), [meta]);
  const [state, dispatch] = useReducer(reducer, boot.state);
  const ended = useRef(false);
  const event = meta.event ? EVENTS[meta.event] : null;
  const pool = kitchenPool(progress.upgrades.equipment, progress.upgrades.coffee);
  const selected = state.guests.find((g) => g.id === state.selected);
  const previewPay = selected
    ? payout(selected.order, selected.type, Math.max(1, state.combo + 1), meta.event, selected.patience / selected.maxPatience > 0.65)
    : { money: 0, xp: 0 };

  useEffect(() => {
    const id = window.setInterval(() => dispatch({ type: "TICK", dt: 100, freezeGuests: coaching }), 100);
    return () => window.clearInterval(id);
  }, [coaching]);

  useEffect(() => {
    if (coaching && state.guests.length === 0) dispatch({ type: "SPAWN" });
  }, [coaching, state.guests.length]);

  useEffect(() => {
    if (!coaching || step !== 1 || !selected) return;
    if (platesMatch(state.plate, selected.order) && state.cooking.length === 0) next();
  }, [coaching, step, selected, state.plate, state.cooking.length, next]);

  useEffect(() => {
    if (coaching && step === 2 && state.completed > 0) next();
  }, [coaching, step, state.completed, next]);

  useEffect(() => {
    if (coaching && step === 2 && state.pop?.titleKey === "game.wrong") back();
  }, [coaching, step, state.pop, back]);

  useEffect(() => {
    if (!state.pop) return;
    const t = window.setTimeout(() => dispatch({ type: "POP_CLEAR" }), 1100);
    return () => window.clearTimeout(t);
  }, [state.pop]);

  useEffect(() => {
    if (!state.over || ended.current) return;
    ended.current = true;
    const passed = shiftPass(state.satisfaction, state.served, meta.quota);
    onEnd({
      day: meta.day,
      dayName: meta.dayName,
      served: state.served + state.failed,
      completed: state.completed,
      failed: state.failed,
      earnings: state.earned,
      xp: state.xp,
      bestCombo: state.bestCombo,
      satisfaction: state.satisfaction,
      quota: meta.quota,
      leveledUp: false,
      newLevel: progress.level,
      levelName: "",
      passed,
    });
  }, [state.over, state.satisfaction, state.served, state.completed, state.failed, state.earned, state.xp, state.bestCombo, meta.day, meta.dayName, meta.quota, onEnd, progress.level]);

  return (
    <div className="space-y-3 pb-28">
      <ShiftHUD
        day={meta.day}
        level={progress.level}
        money={progress.money + state.earned}
        xp={progress.xp + state.xp}
        score={state.score}
        combo={state.combo}
        muted={muted}
        onMute={onMute}
      />

      {event && (
        <div className="border border-gold/40 bg-gold/10 px-3 py-2 font-hud text-[10px] tracking-[0.16em] text-gold rtl:tracking-normal">
          {event.icon} {t(`event.${event.id}.name`)} — {t(`event.${event.id}.blurb`)}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <p className="font-hud text-[9px] text-muted rtl:tracking-normal">
          {t("game.serveHud", { done: state.completed, quota: meta.quota, sat: Math.round(state.satisfaction) })}
        </p>
        {!coaching && (
          <ArcadeButton variant="ghost" className="!px-3 !py-2" onClick={onQuit}>
            {t("game.abort")}
          </ArcadeButton>
        )}
      </div>

      <p className="border border-gold/40 bg-gold/10 px-3 py-2 text-center text-sm leading-6 text-gold">
        {t("game.howToServe")}
      </p>

      <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative">
          <RestaurantFloor
            level={progress.level}
            seats={meta.seats}
            guests={state.guests}
            selected={state.selected}
            serveReady={Boolean(selected && state.plate.length > 0)}
            onSelect={(id) => {
              const again = state.selected === id && state.plate.length > 0;
              dispatch({ type: "SELECT", id });
              if (coaching && step === 0) next();
              if (again) dispatch({ type: "SERVE" });
            }}
          />
          <AnimatePresence>
            {state.floaters.map((f) => (
              <motion.p
                key={f.id}
                initial={{ opacity: 1, y: 10 }}
                animate={{ opacity: 0, y: -28 }}
                className={`pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 font-pixel text-[11px] ${
                  f.kind === "bad" ? "text-magenta" : f.kind === "combo" ? "text-gold" : "text-lime"
                }`}
              >
                {t(f.key, f.vars)}
              </motion.p>
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {state.pop && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-x-6 top-1/3 border border-cyan bg-void/90 p-4 text-center"
              >
                <p className="font-pixel text-xs text-cyan">{t(state.pop.titleKey, state.pop.vars)}</p>
                <p className="mt-2 font-hud text-[10px] text-gold rtl:tracking-normal">{t(state.pop.bodyKey, state.pop.vars)}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-3">
          {selected ? (
            <div data-tour="shift-ticket">
            <OrderTicket
              name={t(`customer.${selected.type}`)}
              order={selected.order}
              patience={selected.patience}
              maxPatience={selected.maxPatience}
              reward={previewPay}
              plate={state.plate}
              onCook={(item) => dispatch({ type: "COOK", item, fast: true })}
            />
            </div>
          ) : (
            <div data-tour="shift-ticket" className="border border-line p-4 font-hud text-[10px] text-muted rtl:tracking-normal">
              {t("game.pickTicket")}
            </div>
          )}
          <KitchenStation
            pool={pool}
            plate={state.plate}
            cooking={state.cooking}
            canCook={state.cooking.length < meta.slots}
            hasCustomer={Boolean(selected)}
            tourItemId={coaching && step === 1 && selected ? nextNeededFood(selected.order, state.plate) : null}
            onCook={(item) => dispatch({ type: "COOK", item, fast: coaching })}
            onClear={() => dispatch({ type: "CLEAR" })}
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[75] border-t-4 border-gold bg-void/95 p-3">
        <div className="mx-auto flex max-w-[1440px] items-stretch gap-3">
          <div className="min-h-16 flex-1 border-2 border-dashed border-gold bg-gold/10 px-3 py-2">
            <p className="font-hud text-[10px] text-gold rtl:tracking-normal">{t("game.plate")}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {state.plate.length === 0 ? (
                <span className="text-sm text-cream">{t("game.plateEmpty")}</span>
              ) : (
                state.plate.map((item, i) => (
                  <span key={`${item.id}-${i}`} className="border border-cyan bg-void px-2 py-1 font-hud text-[11px]">
                    {item.emoji} {t(`food.${item.id}.name`)}
                  </span>
                ))
              )}
            </div>
          </div>
          <ArcadeButton
            variant="magenta"
            className="min-h-16 min-w-36"
            tour="shift-serve"
            disabled={!selected || state.plate.length === 0}
            onClick={() => dispatch({ type: "SERVE" })}
          >
            {t("game.serve")}
          </ArcadeButton>
        </div>
      </div>
    </div>
  );
}

import type { CustomerTypeId, PrepItem, RestaurantUpgrades, ShiftEventId } from "@/lib/types";
import {
  CUSTOMER_TYPES,
  kitchenPool,
  restaurantLevelFromXp,
  restaurantName,
} from "@/lib/data/restaurant";
import { clamp } from "@/lib/utils";

export function seatCount(tables: number) {
  return 2 + tables;
}

export function cookDuration(kitchen: number, staff: number) {
  const speed = 1 + kitchen * 0.1 + staff * 0.06;
  return Math.max(2800, 4200 / speed);
}

export function spawnInterval(base: number, event: ShiftEventId | null) {
  return event === "rush" ? Math.round(base * 0.55) : base;
}

export function patienceFor(type: CustomerTypeId, decor: number) {
  return CUSTOMER_TYPES[type].patience * (1.85 + decor * 0.12);
}

export function maxCookSlots(staff: number) {
  return staff >= 2 ? 2 : 1;
}

export function pickCustomerType(day: number, event: ShiftEventId | null): CustomerTypeId {
  const roll = Math.random();
  if (event === "vip") {
    if (roll < 0.18) return "boss";
    if (roll < 0.45) return "vip";
    if (roll < 0.6) return "critic";
  }
  if (day >= 5 && roll < 0.08) return "boss";
  if (day >= 3 && roll < 0.16) return "critic";
  if (day >= 2 && roll < 0.32) return "impatient";
  if (roll < 0.5) return "foodie";
  return "regular";
}

export function buildOrder(
  type: CustomerTypeId,
  complexity: number,
  upgrades: RestaurantUpgrades,
): PrepItem[] {
  const pool = kitchenPool(upgrades.equipment, upgrades.coffee).filter(
    (item) => item.id !== "double-boss" && item.id !== "secret-boss-burger",
  );
  const sides = pool.filter((item) => item.kind === "fries");
  const mains = pool.filter((item) => item.kind === "burger" || item.kind === "pizza");
  const pick = (list: PrepItem[]) => list[Math.floor(Math.random() * list.length)];
  const fallback = sides[0] ?? mains[0] ?? pool[0];
  if (!fallback) return [];

  // One item only — sides first so tickets stay simple.
  if (complexity <= 2) {
    return [pick(sides.length ? sides : mains.length ? mains : pool) ?? fallback];
  }

  const lines: PrepItem[] = [pick(mains.length ? mains : pool) ?? fallback];
  if (complexity >= 3 && sides.length) lines.push(pick(sides));
  if (type === "boss" && pool.find((item) => item.kind === "drink")) {
    const drink = pick(pool.filter((item) => item.kind === "drink"));
    if (drink) lines.push(drink);
  }
  const unique = new Map(lines.map((line) => [line.id, line]));
  return [...unique.values()].slice(0, 2);
}

export function comboMultiplier(combo: number) {
  return 1 + Math.max(0, combo - 1) * 0.18;
}

export function payout(order: PrepItem[], type: CustomerTypeId, combo: number, event: ShiftEventId | null, perfect: boolean) {
  const spec = CUSTOMER_TYPES[type];
  let money = order.reduce((sum, item) => sum + item.money, 0) * spec.reward;
  let xp = order.reduce((sum, item) => sum + item.xp, 0) * spec.xp;
  const mult = comboMultiplier(combo);
  money *= mult;
  xp *= mult;
  if (event === "double-money") money *= 2;
  if (event === "arcade-night") xp *= 1.5;
  if (perfect) {
    money *= 1.25;
    xp *= 1.25;
  }
  return { money: Math.round(money), xp: Math.round(xp) };
}

export function platesMatch(plate: PrepItem[], order: PrepItem[]) {
  if (plate.length !== order.length) return false;
  const needed = [...order.map((item) => item.id)].sort();
  const got = [...plate.map((item) => item.id)].sort();
  return needed.every((id, i) => id === got[i]);
}

export function moodFromPatience(ratio: number): "happy" | "waiting" | "angry" {
  if (ratio > 0.62) return "happy";
  if (ratio > 0.32) return "waiting";
  return "angry";
}

export function shiftPass(satisfaction: number, served: number, quota: number) {
  return satisfaction >= 40 && served >= Math.ceil(quota * 0.5);
}

export function nextRestaurantLevel(xp: number, prevLevel: number) {
  const level = restaurantLevelFromXp(xp);
  return {
    level,
    leveledUp: level > prevLevel,
    name: restaurantName(level),
  };
}

export function clampSatisfaction(value: number) {
  return clamp(value, 0, 100);
}

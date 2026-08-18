import type { CustomerTypeId, PrepItem, ShiftEventId, UpgradeId } from "@/lib/types";
import { MENU } from "@/lib/data/menu";
import { LOADOUT_TOPPINGS } from "@/lib/data/loadout";

export const DEFAULT_UPGRADES = {
  kitchen: 0,
  staff: 0,
  tables: 0,
  decor: 0,
  equipment: 0,
  coffee: 0,
  arcade: 0,
} as const;

export const DEFAULT_RESTAURANT = {
  day: 1,
  level: 1,
  xp: 0,
  money: 250,
  upgrades: { ...DEFAULT_UPGRADES },
  muted: false,
  totalServed: 0,
  bestCombo: 0,
  shiftsCleared: 0,
  streak: 0,
  lastPlayDate: "",
};

export const RESTAURANT_TIERS = [
  { level: 1, name: "PIXEL CAFE", xp: 0 },
  { level: 2, name: "NEON DINER", xp: 600 },
  { level: 3, name: "ARCADE KITCHEN", xp: 1600 },
  { level: 4, name: "NEON BISTRO", xp: 3200 },
  { level: 5, name: "ARCADE EMPIRE", xp: 5600 },
] as const;

export const CAMPAIGN_GOAL = {
  level: RESTAURANT_TIERS[4].level,
  xp: RESTAURANT_TIERS[4].xp,
} as const;

export const CUSTOMER_TYPES: Record<
  CustomerTypeId,
  {
    id: CustomerTypeId;
    name: string;
    patience: number;
    reward: number;
    xp: number;
    palette: string;
    accent: string;
    hat: string;
  }
> = {
  regular: {
    id: "regular",
    name: "THE REGULAR",
    patience: 15000,
    reward: 1,
    xp: 1,
    palette: "#4d8bff",
    accent: "#f3eee6",
    hat: "#22f0ff",
  },
  foodie: {
    id: "foodie",
    name: "THE FOODIE",
    patience: 19000,
    reward: 1.35,
    xp: 1.25,
    palette: "#9dff4a",
    accent: "#14220a",
    hat: "#ffd24a",
  },
  impatient: {
    id: "impatient",
    name: "THE IMPATIENT",
    patience: 7800,
    reward: 1.7,
    xp: 1.15,
    palette: "#ff2ec8",
    accent: "#fff",
    hat: "#ff4d6d",
  },
  critic: {
    id: "critic",
    name: "THE CRITIC",
    patience: 10000,
    reward: 1.25,
    xp: 2.3,
    palette: "#b44aff",
    accent: "#fff",
    hat: "#3b2158",
  },
  boss: {
    id: "boss",
    name: "THE BOSS",
    patience: 12500,
    reward: 2.6,
    xp: 2.6,
    palette: "#ffd24a",
    accent: "#1a1000",
    hat: "#c9a227",
  },
  vip: {
    id: "vip",
    name: "VIP GUEST",
    patience: 16500,
    reward: 2.1,
    xp: 1.9,
    palette: "#f3eee6",
    accent: "#12091c",
    hat: "#ffd24a",
  },
};

export const EVENTS: Record<
  ShiftEventId,
  { id: ShiftEventId; name: string; blurb: string; icon: string }
> = {
  rush: { id: "rush", name: "RUSH HOUR", blurb: "Customers arrive much faster.", icon: "🔥" },
  "arcade-night": { id: "arcade-night", name: "ARCADE NIGHT", blurb: "Every plate pays extra XP.", icon: "🎮" },
  "double-money": { id: "double-money", name: "DOUBLE MONEY", blurb: "All orders pay 2x cash.", icon: "💰" },
  vip: { id: "vip", name: "VIP NIGHT", blurb: "Special guests hit the floor.", icon: "👑" },
};

export const DAYS = [
  { day: 1, name: "Opening Day", quota: 8, spawnMs: 4300, complexity: 1, event: null as ShiftEventId | null },
  { day: 2, name: "Busy Lunch", quota: 10, spawnMs: 3600, complexity: 2, event: null },
  { day: 3, name: "Friday Rush", quota: 12, spawnMs: 2900, complexity: 2, event: "rush" as ShiftEventId },
  { day: 4, name: "Arcade Night", quota: 12, spawnMs: 3100, complexity: 2, event: "arcade-night" as ShiftEventId },
  { day: 5, name: "VIP Night", quota: 14, spawnMs: 2700, complexity: 3, event: "vip" as ShiftEventId },
];

export const UPGRADES: {
  id: UpgradeId;
  name: string;
  blurb: string;
  benefit: string;
  max: number;
  costs: number[];
}[] = [
  {
    id: "kitchen",
    name: "KITCHEN",
    blurb: "Hotter grill. Faster tickets.",
    benefit: "Cooking speed +15% / level",
    max: 5,
    costs: [180, 400, 750, 1200, 1800],
  },
  {
    id: "staff",
    name: "STAFF",
    blurb: "Hire hands. Serve cleaner.",
    benefit: "Serving speed + extra cook slot at Lv.2",
    max: 5,
    costs: [200, 450, 800, 1300, 2000],
  },
  {
    id: "tables",
    name: "TABLES",
    blurb: "More seats on the floor.",
    benefit: "+1 customer seat / level",
    max: 3,
    costs: [300, 650, 1100],
  },
  {
    id: "decor",
    name: "DECOR",
    blurb: "Neon, booths, patience.",
    benefit: "Customer patience +12% / level",
    max: 5,
    costs: [150, 350, 700, 1100, 1700],
  },
  {
    id: "equipment",
    name: "EQUIPMENT",
    blurb: "Unlock new food on the line.",
    benefit: "Pizza, desserts, toppings, secret burger",
    max: 5,
    costs: [250, 550, 950, 1500, 2200],
  },
  {
    id: "coffee",
    name: "COFFEE MACHINE",
    blurb: "Unlock drinks on tickets.",
    benefit: "Cola at Lv.1, full bar at Lv.2",
    max: 3,
    costs: [220, 500, 900],
  },
  {
    id: "arcade",
    name: "ARCADE MACHINE",
    blurb: "Cabinets that pay rent.",
    benefit: "Passive income + Burger Rush access",
    max: 3,
    costs: [400, 850, 1400],
  },
];

const KIND_EMOJI: Record<string, string> = {
  burger: "🍔",
  pizza: "🍕",
  fries: "🍟",
  drink: "🥤",
  dessert: "🍰",
};

export const EXTRA_PREP: PrepItem[] = LOADOUT_TOPPINGS.slice(0, 3).map((t) => ({
  id: t.id,
  name: t.id === "neon-cheddar" ? "EXTRA CHEESE" : t.name,
  emoji: t.id === "neon-cheddar" ? "🧀" : "🥓",
  money: t.price,
  xp: 6,
}));

export function toPrepItem(id: string): PrepItem | undefined {
  const extra = EXTRA_PREP.find((item) => item.id === id);
  if (extra) return extra;
  const food = MENU.find((item) => item.id === id);
  if (!food) return undefined;
  return {
    id: food.id,
    name: food.name,
    emoji: KIND_EMOJI[food.kind] ?? "🍔",
    money: Math.max(12, Math.round(food.price * 0.28)),
    xp: food.xp,
    kind: food.kind,
    visual: food.visual,
  };
}

export function kitchenPool(equipment: number, coffee: number): PrepItem[] {
  const mains = ["pixel-cheese", "arcade-smash"];
  if (equipment >= 3) mains.push("glitch-bacon");
  if (equipment >= 4) mains.push("double-boss", "secret-boss-burger");

  const sides = ["pixel-fries"];
  if (equipment >= 1) sides.push("neon-cheese-fries");
  if (equipment >= 2) sides.push("power-fries");

  const pizza = equipment >= 1 ? ["pixel-pepperoni"] : [];
  if (equipment >= 2) pizza.push("magenta-margherita");
  if (equipment >= 3) pizza.push("final-boss-pizza", "extra-life");

  const desserts = equipment >= 2 ? ["pixel-cookie"] : [];
  if (equipment >= 3) desserts.push("bit-sundae", "level-up-cake");

  const drinks: string[] = [];
  if (coffee >= 1) drinks.push("pixel-cola");
  if (coffee >= 2) drinks.push("cyan-cooler", "neon-milkshake");
  if (coffee >= 3) drinks.push("boss-energy");

  const extras = equipment >= 2 ? EXTRA_PREP : [];

  return [...mains, ...sides, ...pizza, ...desserts, ...drinks]
    .map(toPrepItem)
    .filter((item): item is PrepItem => Boolean(item))
    .concat(extras);
}

export function getDayConfig(day: number) {
  const base = DAYS[Math.min(day, DAYS.length) - 1];
  if (day <= DAYS.length) return { ...base, day };
  const extra = day - DAYS.length;
  const events: ShiftEventId[] = ["rush", "arcade-night", "double-money", "vip"];
  return {
    day,
    name: `Endless Service ${day}`,
    quota: Math.min(22, 14 + extra * 2),
    spawnMs: Math.max(1700, 2700 - extra * 120),
    complexity: 3,
    event: events[day % events.length],
  };
}

export function restaurantLevelFromXp(xp: number) {
  let level = 1;
  for (const tier of RESTAURANT_TIERS) {
    if (xp >= tier.xp) level = tier.level;
  }
  return level;
}

export function restaurantName(level: number) {
  return RESTAURANT_TIERS.find((tier) => tier.level === level)?.name ?? "PIXEL CAFE";
}

export function xpToNext(xp: number) {
  const next = RESTAURANT_TIERS.find((tier) => tier.xp > xp);
  if (!next) return { current: xp, next: RESTAURANT_TIERS[4].xp, needed: RESTAURANT_TIERS[4].xp };
  return { current: xp, next: next.xp, needed: next.xp };
}

export function todayStamp() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function yesterdayStamp(today: string) {
  const parts = today.split("-").map(Number);
  const stamp = new Date(parts[0], parts[1] - 1, parts[2]);
  stamp.setDate(stamp.getDate() - 1);
  return `${stamp.getFullYear()}-${String(stamp.getMonth() + 1).padStart(2, "0")}-${String(stamp.getDate()).padStart(2, "0")}`;
}

export function streakStatus(lastPlayDate: string | undefined, today: string) {
  if (!lastPlayDate) return "none" as const;
  if (lastPlayDate === today) return "today" as const;
  if (lastPlayDate === yesterdayStamp(today)) return "due" as const;
  return "broken" as const;
}

export function bumpStreak(lastPlayDate: string | undefined, streak: number, today: string) {
  const current = streak || 0;
  if (lastPlayDate === today) return { lastPlayDate: today, streak: Math.max(1, current) };
  if (lastPlayDate === yesterdayStamp(today)) return { lastPlayDate: today, streak: current + 1 };
  return { lastPlayDate: today, streak: 1 };
}

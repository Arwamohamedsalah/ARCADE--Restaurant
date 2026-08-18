export type MenuCategory = "burgers" | "pizza" | "fries" | "drinks" | "desserts";

export type FoodKind = "burger" | "pizza" | "fries" | "drink" | "dessert";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  xp: number;
  category: MenuCategory;
  kind: FoodKind;
  visual: string;
  tag?: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  xp: number;
  kind: FoodKind;
  visual: string;
  isFree?: boolean;
};

export type RewardType = "free-item" | "discount" | "unlock";

export type Reward = {
  id: string;
  name: string;
  cost: number;
  description: string;
  type: RewardType;
  itemId?: string;
};

export type LoadoutOption = {
  id: string;
  name: string;
  price: number;
  visual?: string;
  kind?: FoodKind;
};

export type Loadout = {
  main: string | null;
  toppings: string[];
  sauce: string | null;
  side: string | null;
  drink: string | null;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
  isPlayer?: boolean;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
};

export type PlayerStats = {
  handle: string;
  level: number;
  xp: number;
  coins: number;
  gamesPlayed: number;
  orders: number;
  bestScore: number;
};

export type PaymentMethod = "cod" | "card" | "wallet";

export type Order = {
  id: string;
  items: { id?: string; name: string; quantity: number; price: number }[];
  total: number;
  payment: PaymentMethod;
  customer: { name: string; phone: string; address: string };
  coinsEarned: number;
};

export type ToastMessage = {
  id: string;
  title: string;
  body?: string;
};

export type UpgradeId =
  | "kitchen"
  | "staff"
  | "tables"
  | "decor"
  | "equipment"
  | "coffee"
  | "arcade";

export type CustomerTypeId = "regular" | "foodie" | "impatient" | "critic" | "boss" | "vip";

export type ShiftEventId = "rush" | "arcade-night" | "double-money" | "vip";

export type CustomerMood = "happy" | "waiting" | "angry" | "loved" | "leaving";

export type PrepItem = {
  id: string;
  name: string;
  emoji: string;
  money: number;
  xp: number;
  kind?: FoodKind;
  visual?: string;
};

export type TicketLine = PrepItem;

export type RestaurantUpgrades = Record<UpgradeId, number>;

export type RestaurantProgress = {
  day: number;
  level: number;
  xp: number;
  money: number;
  upgrades: RestaurantUpgrades;
  muted: boolean;
  totalServed: number;
  bestCombo: number;
  shiftsCleared: number;
  streak: number;
  lastPlayDate: string;
};

export type ShiftSummary = {
  day: number;
  dayName: string;
  served: number;
  completed: number;
  failed: number;
  earnings: number;
  xp: number;
  bestCombo: number;
  satisfaction: number;
  quota: number;
  leveledUp: boolean;
  newLevel: number;
  levelName: string;
  passed: boolean;
  streak?: number;
  dailyBonus?: boolean;
  bonusMoney?: number;
  bonusXp?: number;
};

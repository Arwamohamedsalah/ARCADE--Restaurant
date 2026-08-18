import type { Achievement, PlayerStats } from "@/lib/types";

export const DEFAULT_PLAYER: PlayerStats = {
  handle: "PLAYER 01",
  level: 8,
  xp: 7850,
  coins: 1250,
  gamesPlayed: 42,
  orders: 18,
  bestScore: 9850,
};

export const ACHIEVEMENT_DEFS: Omit<Achievement, "unlocked">[] = [
  { id: "first-order", name: "FIRST ORDER", description: "Complete your first mission" },
  { id: "speed-eater", name: "SPEED EATER", description: "Hit combo x5 in Burger Rush" },
  { id: "burger-master", name: "BURGER MASTER", description: "Lock in a custom loadout" },
  { id: "arcade-legend", name: "ARCADE LEGEND", description: "Score 5,000+ in Burger Rush" },
];

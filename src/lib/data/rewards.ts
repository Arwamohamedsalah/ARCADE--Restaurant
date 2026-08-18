import type { Reward } from "@/lib/types";

export const REWARDS: Reward[] = [
  {
    id: "free-fries",
    name: "FREE PIXEL FRIES",
    cost: 500,
    description: "Sidekick unlocked. Adds Pixel Fries to your next mission.",
    type: "free-item",
    itemId: "pixel-fries",
  },
  {
    id: "free-shake",
    name: "FREE MILKSHAKE",
    cost: 750,
    description: "HP restore on the house. Neon Milkshake, zero EGP.",
    type: "free-item",
    itemId: "neon-milkshake",
  },
  {
    id: "off-20",
    name: "20% OFF",
    cost: 1000,
    description: "Coupon cartridge. Applies to your current mission loadout.",
    type: "discount",
  },
  {
    id: "secret-boss",
    name: "SECRET BOSS BURGER",
    cost: 2500,
    description: "Hidden final form. Unlocks the classified burger and adds it to cart.",
    type: "unlock",
    itemId: "secret-boss-burger",
  },
];

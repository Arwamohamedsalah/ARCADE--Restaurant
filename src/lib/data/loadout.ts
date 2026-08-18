import type { LoadoutOption } from "@/lib/types";

export const LOADOUT_MAINS: LoadoutOption[] = [
  { id: "double-boss", name: "DOUBLE BOSS", price: 285, visual: "double-boss", kind: "burger" },
  { id: "pixel-cheese", name: "PIXEL CHEESE", price: 220, visual: "pixel-cheese", kind: "burger" },
  { id: "glitch-bacon", name: "GLITCH BACON", price: 260, visual: "glitch-bacon", kind: "burger" },
  { id: "arcade-smash", name: "ARCADE SMASH", price: 195, visual: "arcade-smash", kind: "burger" },
];

export const LOADOUT_TOPPINGS: LoadoutOption[] = [
  { id: "neon-cheddar", name: "NEON CHEDDAR", price: 18 },
  { id: "glitch-bacon-bit", name: "GLITCH BACON", price: 22 },
  { id: "pixel-pickles", name: "PIXEL PICKLES", price: 10 },
  { id: "magenta-onion", name: "MAGENTA ONION", price: 12 },
  { id: "laser-jalapeno", name: "LASER JALAPEÑO", price: 14 },
  { id: "1up-lettuce", name: "1-UP LETTUCE", price: 8 },
];

export const LOADOUT_SAUCES: LoadoutOption[] = [
  { id: "boss-sauce", name: "BOSS SAUCE", price: 12 },
  { id: "cyan-mayo", name: "CYAN MAYO", price: 10 },
  { id: "pixel-ketchup", name: "PIXEL KETCHUP", price: 8 },
  { id: "spicy-glitch", name: "SPICY GLITCH", price: 14 },
  { id: "gold-bbq", name: "GOLD BBQ", price: 12 },
];

export const LOADOUT_SIDES: LoadoutOption[] = [
  { id: "pixel-fries", name: "PIXEL FRIES", price: 95, visual: "pixel-fries", kind: "fries" },
  { id: "power-fries", name: "POWER FRIES", price: 140, visual: "power-fries", kind: "fries" },
  { id: "neon-cheese-fries", name: "NEON CHEESE", price: 125, visual: "neon-fries", kind: "fries" },
];

export const LOADOUT_DRINKS: LoadoutOption[] = [
  { id: "neon-milkshake", name: "NEON SHAKE", price: 120, visual: "milkshake", kind: "drink" },
  { id: "pixel-cola", name: "PIXEL COLA", price: 45, visual: "cola", kind: "drink" },
  { id: "cyan-cooler", name: "CYAN COOLER", price: 65, visual: "cooler", kind: "drink" },
  { id: "boss-energy", name: "BOSS ENERGY", price: 80, visual: "energy", kind: "drink" },
];

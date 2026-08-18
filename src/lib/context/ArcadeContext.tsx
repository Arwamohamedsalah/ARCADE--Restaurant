"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { getMenuItem } from "@/lib/data/menu";
import { REWARDS } from "@/lib/data/rewards";
import { DEFAULT_PLAYER } from "@/lib/data/player";
import { DEFAULT_RESTAURANT, restaurantLevelFromXp, UPGRADES, bumpStreak, todayStamp, streakStatus } from "@/lib/data/restaurant";
import { arcadeSfx, setArcadeMuted } from "@/lib/sound";
import { useLanguage } from "@/lib/context/LanguageContext";
import type {
  CartItem,
  Loadout,
  MenuItem,
  Order,
  PaymentMethod,
  PlayerStats,
  RestaurantProgress,
  ShiftSummary,
  ToastMessage,
  UpgradeId,
} from "@/lib/types";
import { makeOrderId, xpToLevel, sanitizeHandle } from "@/lib/utils";

const STORAGE_KEY = "arcade-eatery-save";
const INSERT_KEY = "arcade-eatery-inserted";

type Persisted = {
  coins: number;
  cart: CartItem[];
  highScore: number;
  player: PlayerStats;
  unlockedAchievements: string[];
  redeemedRewards: string[];
  discountActive: boolean;
  secretUnlocked: boolean;
  restaurant: RestaurantProgress;
};

type State = Persisted & {
  insertedCoin: boolean;
  loadout: Loadout;
  lastOrder: Order | null;
  toasts: ToastMessage[];
};

const emptyLoadout: Loadout = {
  main: null,
  toppings: [],
  sauce: null,
  side: null,
  drink: null,
};

const initialState: State = {
  insertedCoin: false,
  coins: DEFAULT_PLAYER.coins,
  cart: [],
  highScore: DEFAULT_PLAYER.bestScore,
  player: DEFAULT_PLAYER,
  unlockedAchievements: ["first-order", "burger-master"],
  redeemedRewards: [],
  discountActive: false,
  secretUnlocked: false,
  restaurant: { ...DEFAULT_RESTAURANT, upgrades: { ...DEFAULT_RESTAURANT.upgrades } },
  loadout: emptyLoadout,
  lastOrder: null,
  toasts: [],
};

type Action =
  | { type: "HYDRATE"; payload: Partial<Persisted> }
  | { type: "INSERT_COIN" }
  | { type: "ADD_ITEM"; item: MenuItem; free?: boolean }
  | { type: "SET_QTY"; id: string; quantity: number }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR_CART" }
  | { type: "SET_LOADOUT"; loadout: Loadout }
  | { type: "LOCK_LOADOUT"; item: CartItem }
  | { type: "REDEEM"; rewardId: string; item?: MenuItem }
  | { type: "GAME_RESULT"; score: number; comboMax: number }
  | { type: "COMPLETE_ORDER"; order: Order }
  | { type: "TOAST"; toast: ToastMessage }
  | { type: "DISMISS_TOAST"; id: string }
  | { type: "SET_MUTED"; muted: boolean }
  | { type: "BUY_UPGRADE"; id: UpgradeId }
  | { type: "APPLY_SHIFT"; summary: ShiftSummary }
  | { type: "SET_HANDLE"; handle: string };

function persistable(state: State): Persisted {
  return {
    coins: state.coins,
    cart: state.cart,
    highScore: state.highScore,
    player: state.player,
    unlockedAchievements: state.unlockedAchievements,
    redeemedRewards: state.redeemedRewards,
    discountActive: state.discountActive,
    secretUnlocked: state.secretUnlocked,
    restaurant: state.restaurant,
  };
}

function addAchievement(list: string[], id: string) {
  return list.includes(id) ? list : [...list, id];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE": {
      const restaurant = {
        ...DEFAULT_RESTAURANT,
        ...action.payload.restaurant,
        upgrades: {
          ...DEFAULT_RESTAURANT.upgrades,
          ...action.payload.restaurant?.upgrades,
        },
      };
      if (streakStatus(restaurant.lastPlayDate, todayStamp()) === "broken") {
        restaurant.streak = 0;
      }
      return {
        ...state,
        ...action.payload,
        player: {
          ...DEFAULT_PLAYER,
          ...action.payload.player,
        },
        restaurant,
      };
    }
    case "INSERT_COIN":
      return { ...state, insertedCoin: true };
    case "ADD_ITEM": {
      const existing = state.cart.find((c) => c.id === action.item.id && !c.isFree);
      if (existing && !action.free) {
        return {
          ...state,
          cart: state.cart.map((c) =>
            c.id === action.item.id && !c.isFree ? { ...c, quantity: c.quantity + 1 } : c,
          ),
        };
      }
      const next: CartItem = {
        id: action.free ? `${action.item.id}-free-${Date.now()}` : action.item.id,
        name: action.item.name,
        price: action.free ? 0 : action.item.price,
        quantity: 1,
        xp: action.item.xp,
        kind: action.item.kind,
        visual: action.item.visual,
        isFree: action.free,
      };
      return { ...state, cart: [...state.cart, next] };
    }
    case "SET_QTY":
      return {
        ...state,
        cart: state.cart
          .map((c) => (c.id === action.id ? { ...c, quantity: action.quantity } : c))
          .filter((c) => c.quantity > 0),
      };
    case "REMOVE":
      return { ...state, cart: state.cart.filter((c) => c.id !== action.id) };
    case "CLEAR_CART":
      return { ...state, cart: [], discountActive: false };
    case "SET_LOADOUT":
      return { ...state, loadout: action.loadout };
    case "LOCK_LOADOUT":
      return {
        ...state,
        cart: [...state.cart, action.item],
        unlockedAchievements: addAchievement(state.unlockedAchievements, "burger-master"),
      };
    case "REDEEM": {
      const reward = REWARDS.find((r) => r.id === action.rewardId);
      if (!reward || state.coins < reward.cost || state.redeemedRewards.includes(reward.id)) {
        return state;
      }
      let cart = state.cart;
      let discountActive = state.discountActive;
      let secretUnlocked = state.secretUnlocked;
      if (reward.type === "discount") discountActive = true;
      if (reward.type === "unlock") secretUnlocked = true;
      if (action.item && (reward.type === "free-item" || reward.type === "unlock")) {
        cart = [
          ...cart,
          {
            id: `${action.item.id}-reward-${Date.now()}`,
            name: action.item.name,
            price: 0,
            quantity: 1,
            xp: action.item.xp,
            kind: action.item.kind,
            visual: action.item.visual,
            isFree: true,
          },
        ];
      }
      return {
        ...state,
        coins: state.coins - reward.cost,
        player: { ...state.player, coins: state.coins - reward.cost },
        cart,
        discountActive,
        secretUnlocked,
        redeemedRewards: [...state.redeemedRewards, reward.id],
      };
    }
    case "GAME_RESULT": {
      const coinsEarned = Math.max(5, Math.floor(action.score / 20));
      const highScore = Math.max(state.highScore, action.score);
      let achievements = state.unlockedAchievements;
      if (action.comboMax >= 5) achievements = addAchievement(achievements, "speed-eater");
      if (action.score >= 5000) achievements = addAchievement(achievements, "arcade-legend");
      return {
        ...state,
        coins: state.coins + coinsEarned,
        highScore,
        unlockedAchievements: achievements,
        player: {
          ...state.player,
          coins: state.coins + coinsEarned,
          gamesPlayed: state.player.gamesPlayed + 1,
          bestScore: Math.max(state.player.bestScore, action.score),
        },
      };
    }
    case "COMPLETE_ORDER": {
      const xpGain = action.order.items.reduce((sum, item) => sum + item.quantity * 20, 0);
      const xp = state.player.xp + xpGain;
      return {
        ...state,
        lastOrder: action.order,
        cart: [],
        discountActive: false,
        coins: state.coins + action.order.coinsEarned,
        unlockedAchievements: addAchievement(state.unlockedAchievements, "first-order"),
        player: {
          ...state.player,
          coins: state.coins + action.order.coinsEarned,
          orders: state.player.orders + 1,
          xp,
          level: xpToLevel(xp),
        },
      };
    }
    case "TOAST":
      return { ...state, toasts: [...state.toasts.slice(-2), action.toast] };
    case "DISMISS_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case "SET_MUTED":
      return { ...state, restaurant: { ...state.restaurant, muted: action.muted } };
    case "BUY_UPGRADE": {
      const spec = UPGRADES.find((item) => item.id === action.id);
      if (!spec) return state;
      const level = state.restaurant.upgrades[action.id];
      if (level >= spec.max) return state;
      const cost = spec.costs[level];
      if (state.restaurant.money < cost) return state;
      return {
        ...state,
        restaurant: {
          ...state.restaurant,
          money: state.restaurant.money - cost,
          upgrades: { ...state.restaurant.upgrades, [action.id]: level + 1 },
        },
      };
    }
    case "APPLY_SHIFT": {
      const xp = state.restaurant.xp + action.summary.xp;
      const level = restaurantLevelFromXp(xp);
      const arcadePay = state.restaurant.upgrades.arcade * 18;
      const streak = action.summary.passed
        ? bumpStreak(state.restaurant.lastPlayDate, state.restaurant.streak, todayStamp())
        : { lastPlayDate: state.restaurant.lastPlayDate, streak: state.restaurant.streak };
      return {
        ...state,
        coins: state.coins + Math.max(8, Math.floor(action.summary.earnings / 8)),
        restaurant: {
          ...state.restaurant,
          xp,
          level,
          money: state.restaurant.money + action.summary.earnings + arcadePay,
          day: action.summary.passed ? state.restaurant.day + 1 : state.restaurant.day,
          totalServed: state.restaurant.totalServed + action.summary.served,
          bestCombo: Math.max(state.restaurant.bestCombo, action.summary.bestCombo),
          shiftsCleared: state.restaurant.shiftsCleared + (action.summary.passed ? 1 : 0),
          streak: streak.streak,
          lastPlayDate: streak.lastPlayDate,
        },
        player: {
          ...state.player,
          gamesPlayed: state.player.gamesPlayed + 1,
        },
      };
    }
    case "SET_HANDLE": {
      const handle = sanitizeHandle(action.handle);
      if (!handle) return state;
      return {
        ...state,
        player: { ...state.player, handle },
      };
    }
    default:
      return state;
  }
}

type ArcadeContextValue = State & {
  hydrated: boolean;
  cartCount: number;
  subtotal: number;
  discount: number;
  total: number;
  coinsEarned: number;
  xpTotal: number;
  insertCoin: () => void;
  addToCart: (item: MenuItem) => void;
  setQty: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  setLoadout: (loadout: Loadout) => void;
  lockLoadout: (item: CartItem) => void;
  redeem: (rewardId: string) => boolean;
  submitGame: (score: number, comboMax: number) => { coinsEarned: number; isHigh: boolean };
  checkout: (input: {
    name: string;
    phone: string;
    address: string;
    payment: PaymentMethod;
  }) => Order;
  toast: (title: string, body?: string) => void;
  dismissToast: (id: string) => void;
  buyUpgrade: (id: UpgradeId) => boolean;
  applyShift: (summary: ShiftSummary) => void;
  setMuted: (muted: boolean) => void;
  setHandle: (handle: string) => boolean;
};

const ArcadeContext = createContext<ArcadeContextValue | null>(null);

export function ArcadeProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", payload: JSON.parse(raw) as Partial<Persisted> });
      if (sessionStorage.getItem(INSERT_KEY) === "1") dispatch({ type: "INSERT_COIN" });
    } catch {
      /* ignore corrupt saves */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    setArcadeMuted(state.restaurant.muted);
  }, [state.restaurant.muted]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable(state)));
  }, [hydrated, state]);

  const subtotal = useMemo(
    () => state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.cart],
  );
  const discount = state.discountActive ? Math.round(subtotal * 0.2) : 0;
  const total = Math.max(0, subtotal - discount);
  const coinsEarned = Math.floor(total / 10);
  const xpTotal = state.cart.reduce((sum, item) => sum + item.xp * item.quantity, 0);
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const toast = useCallback((title: string, body?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    dispatch({ type: "TOAST", toast: { id, title, body } });
    setTimeout(() => dispatch({ type: "DISMISS_TOAST", id }), 2800);
  }, []);

  const value = useMemo<ArcadeContextValue>(
    () => ({
      ...state,
      hydrated,
      cartCount,
      subtotal,
      discount,
      total,
      coinsEarned,
      xpTotal,
      insertCoin() {
        sessionStorage.setItem(INSERT_KEY, "1");
        dispatch({ type: "INSERT_COIN" });
      },
      addToCart(item) {
        dispatch({ type: "ADD_ITEM", item });
        arcadeSfx.click();
        toast(t("toast.itemEquipped"), t(`food.${item.id}.name`));
      },
      setQty(id, quantity) {
        dispatch({ type: "SET_QTY", id, quantity });
      },
      removeFromCart(id) {
        dispatch({ type: "REMOVE", id });
      },
      setLoadout(loadout) {
        dispatch({ type: "SET_LOADOUT", loadout });
      },
      lockLoadout(item) {
        dispatch({ type: "LOCK_LOADOUT", item });
        arcadeSfx.win();
        toast(t("toast.loadoutLocked"), item.name);
      },
      redeem(rewardId) {
        const reward = REWARDS.find((r) => r.id === rewardId);
        if (!reward) return false;
        if (state.redeemedRewards.includes(rewardId)) {
          toast(t("toast.alreadyClaimed"));
          return false;
        }
        if (state.coins < reward.cost) {
          arcadeSfx.error();
          toast(t("toast.notEnough"), t("toast.needCoins", { n: reward.cost }));
          return false;
        }
        const item = reward.itemId ? getMenuItem(reward.itemId) : undefined;
        dispatch({ type: "REDEEM", rewardId, item });
        arcadeSfx.win();
        toast(t("toast.rewardUnlocked"), t(`reward.${reward.id}.name`));
        return true;
      },
      submitGame(score, comboMax) {
        const prev = state.highScore;
        const coinsGain = Math.max(5, Math.floor(score / 20));
        dispatch({ type: "GAME_RESULT", score, comboMax });
        return { coinsEarned: coinsGain, isHigh: score > prev };
      },
      checkout(input) {
        const order: Order = {
          id: makeOrderId(),
          items: state.cart.map((c) => ({
            id: c.id,
            name: c.name,
            quantity: c.quantity,
            price: c.price * c.quantity,
          })),
          total,
          payment: input.payment,
          customer: { name: input.name, phone: input.phone, address: input.address },
          coinsEarned,
        };
        dispatch({ type: "COMPLETE_ORDER", order });
        arcadeSfx.win();
        return order;
      },
      toast,
      dismissToast(id) {
        dispatch({ type: "DISMISS_TOAST", id });
      },
      buyUpgrade(id) {
        const spec = UPGRADES.find((item) => item.id === id);
        const level = state.restaurant.upgrades[id];
        const cost = spec?.costs[level];
        if (!spec || cost == null || state.restaurant.money < cost || level >= spec.max) {
          arcadeSfx.error();
          toast(t("game.cantUpgrade"), t("game.cantUpgradeBody"));
          return false;
        }
        dispatch({ type: "BUY_UPGRADE", id });
        arcadeSfx.buy();
        toast(t("game.installed"), t(`upgrade.${id}.name`));
        return true;
      },
      applyShift(summary) {
        dispatch({ type: "APPLY_SHIFT", summary });
        if (summary.leveledUp) arcadeSfx.levelup();
        else if (summary.passed) arcadeSfx.win();
        else arcadeSfx.error();
      },
      setMuted(muted) {
        setArcadeMuted(muted);
        dispatch({ type: "SET_MUTED", muted });
      },
      setHandle(handle) {
        const next = sanitizeHandle(handle);
        if (!next) {
          arcadeSfx.error();
          toast(t("onboard.nameNeed"));
          return false;
        }
        dispatch({ type: "SET_HANDLE", handle: next });
        arcadeSfx.coin();
        toast(t("toast.handleSaved"), next);
        return true;
      },
    }),
    [state, hydrated, cartCount, subtotal, discount, total, coinsEarned, xpTotal, toast, t],
  );

  return <ArcadeContext.Provider value={value}>{children}</ArcadeContext.Provider>;
}

export function useArcade() {
  const ctx = useContext(ArcadeContext);
  if (!ctx) throw new Error("useArcade must be used inside ArcadeProvider");
  return ctx;
}

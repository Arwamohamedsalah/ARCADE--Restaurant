export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatEGP(value: number) {
  return `${value.toLocaleString("en-EG")} EGP`;
}

export function formatMoney(value: number, locale: "en" | "ar" = "en") {
  return `$${Math.round(value).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function makeOrderId() {
  return String(8000 + Math.floor(Math.random() * 1999));
}

export function xpToLevel(xp: number) {
  return Math.max(1, Math.floor(xp / 1000) + 1);
}

export function sanitizeHandle(raw: string) {
  return raw.replace(/\s+/g, " ").trim().slice(0, 16);
}

export function hasCustomHandle(handle?: string) {
  const value = sanitizeHandle(handle || "");
  if (!value) return false;
  const compact = value.replace(/\s/g, "").toUpperCase();
  return compact !== "PLAYER01" && compact !== "PLAYER1";
}

export function displayHandle(handle: string | undefined, fallback: string) {
  return hasCustomHandle(handle) ? sanitizeHandle(handle || "") : fallback;
}

export function powerBar(filled: number, total = 10) {
  const safe = clamp(filled, 0, total);
  return `${"█".repeat(safe)}${"░".repeat(total - safe)}`;
}

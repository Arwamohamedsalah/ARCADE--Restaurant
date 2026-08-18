"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translate, type Locale } from "@/lib/i18n/messages";

const STORAGE_KEY = "arcade-eatery-lang";

type TFn = (key: string, vars?: Record<string, string | number>) => string;

type LanguageValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  ready: boolean;
  setLocale: (locale: Locale) => void;
  t: TFn;
};

const LanguageContext = createContext<LanguageValue | null>(null);

function persist(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  localStorage.setItem(STORAGE_KEY, locale);
  document.cookie = `${STORAGE_KEY}=${locale};path=/;max-age=31536000;SameSite=Lax`;
  document.title = translate(locale, "meta.title");
}

export function LanguageProvider({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const next: Locale = saved === "ar" || saved === "en" ? saved : initialLocale;
    setLocaleState(next);
    persist(next);
    setReady(true);
  }, [initialLocale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persist(next);
  }, []);

  const t = useCallback<TFn>(
    (key, vars) => translate(locale, key, vars),
    [locale],
  );

  const value = useMemo<LanguageValue>(
    () => ({
      locale,
      dir: locale === "ar" ? "rtl" : "ltr",
      ready,
      setLocale,
      t,
    }),
    [locale, ready, setLocale, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

export function catalogId(id: string) {
  return id.replace(/-free-.*$/, "").replace(/-reward-.*$/, "");
}

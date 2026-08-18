"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      className={cn("hud-chip flex items-center gap-1 px-2 py-1.5", className)}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={cn(
          "font-hud text-[9px] tracking-[0.12em]",
          locale === "en" ? "text-cyan" : "text-muted hover:text-cream",
        )}
      >
        EN
      </button>
      <span className="text-muted" aria-hidden>
        |
      </span>
      <button
        type="button"
        onClick={() => setLocale("ar")}
        aria-pressed={locale === "ar"}
        className={cn(
          "font-hud text-[10px]",
          locale === "ar" ? "text-cyan" : "text-muted hover:text-cream",
        )}
      >
        عربي
      </button>
    </div>
  );
}

"use client";

import { useLanguage } from "@/lib/context/LanguageContext";

export function T({
  k,
  vars,
}: {
  k: string;
  vars?: Record<string, string | number>;
}) {
  const { t } = useLanguage();
  return <>{t(k, vars)}</>;
}

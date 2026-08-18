"use client";

import { ArcadeDashboard } from "@/components/home/ArcadeDashboard";
import { useLanguage } from "@/lib/context/LanguageContext";

export default function HomePage() {
  const { locale } = useLanguage();
  return <ArcadeDashboard key={locale} />;
}

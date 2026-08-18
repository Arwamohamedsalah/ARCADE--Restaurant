"use client";

import { LanguageProvider } from "@/lib/context/LanguageContext";
import { ArcadeProvider } from "@/lib/context/ArcadeContext";
import { OnboardingProvider } from "@/lib/context/OnboardingContext";
import { ArcadeShell } from "@/components/layout/ArcadeShell";
import type { Locale } from "@/lib/i18n/messages";
import type { ReactNode } from "react";

export function Providers({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  return (
    <LanguageProvider initialLocale={initialLocale}>
      <ArcadeProvider>
        <OnboardingProvider>
          <ArcadeShell>{children}</ArcadeShell>
        </OnboardingProvider>
      </ArcadeProvider>
    </LanguageProvider>
  );
}

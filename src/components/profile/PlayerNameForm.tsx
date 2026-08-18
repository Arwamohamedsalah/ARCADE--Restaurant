"use client";

import { useState, type FormEvent } from "react";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { useArcade } from "@/lib/context/ArcadeContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import { hasCustomHandle, sanitizeHandle } from "@/lib/utils";

type Props = {
  onSaved?: () => void;
  submitLabel?: string;
};

export function PlayerNameForm({ onSaved, submitLabel }: Props) {
  const { player, setHandle } = useArcade();
  const { t } = useLanguage();
  const [name, setName] = useState(() => (hasCustomHandle(player.handle) ? player.handle : ""));

  function save(event?: FormEvent) {
    event?.preventDefault();
    if (!setHandle(name)) return;
    onSaved?.();
  }

  return (
    <form className="w-full text-start" onSubmit={save}>
      <label className="block">
        <span className="font-hud text-[10px] text-gold tracking-[0.18em] rtl:tracking-normal">
          {t("onboard.nameLabel")}
        </span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value.slice(0, 16))}
          maxLength={16}
          autoComplete="nickname"
          autoCapitalize="words"
          placeholder={t("onboard.namePh")}
          className="mt-2 w-full border border-cyan/40 bg-void px-3 py-3 text-base text-cream outline-none focus:border-gold"
        />
      </label>
      <p className="mt-2 font-hud text-[10px] text-muted rtl:tracking-normal">{t("onboard.nameNeed")}</p>
      <ArcadeButton type="submit" variant="gold" className="mt-4 w-full min-h-12" disabled={!sanitizeHandle(name)}>
        {submitLabel ?? t("profile.saveName")}
      </ArcadeButton>
    </form>
  );
}

export function NameGate() {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-[72] flex items-start justify-center overflow-y-auto arcade-bg px-4 py-6 sm:items-center">
      <div className="my-auto w-full max-w-lg border border-cyan/30 bg-void/90 px-6 py-10 text-center cabinet-frame sm:px-10 sm:py-12">
        <p className="font-hud text-[10px] text-magenta tracking-[0.35em] rtl:tracking-normal">
          {t("onboard.askEyebrow")}
        </p>
        <h1 className="mt-5 font-pixel text-xl leading-relaxed text-cyan glitch sm:text-3xl">
          {t("onboard.nameTitle")}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-cream">{t("onboard.nameBody")}</p>
        <div className="mt-8">
          <PlayerNameForm submitLabel={t("onboard.continue")} />
        </div>
      </div>
    </div>
  );
}

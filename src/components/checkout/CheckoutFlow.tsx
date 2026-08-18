"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useArcade } from "@/lib/context/ArcadeContext";
import { catalogId, useLanguage } from "@/lib/context/LanguageContext";
import type { Order, PaymentMethod } from "@/lib/types";
import { ArcadeButton } from "@/components/ui/ArcadeButton";
import { ArcadePanel } from "@/components/ui/ArcadePanel";
import { PageHeader } from "@/components/ui/PageHeader";

const PAYMENTS: PaymentMethod[] = ["cod", "card", "wallet"];

export function CheckoutFlow() {
  const { cart, total, checkout } = useArcade();
  const { t, locale } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const egp = (n: number) =>
    t("currency.egp", { n: n.toLocaleString(locale === "ar" ? "ar-EG" : "en-EG") });

  function itemLabel(id: string | undefined, fallback: string) {
    if (!id) return fallback;
    if (id.startsWith("loadout-")) return fallback;
    const key = `food.${catalogId(id)}.name`;
    const translated = t(key);
    return translated === key ? fallback : translated;
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cart.length) return;
    const data = new FormData(e.currentTarget);
    const created = checkout({
      name: String(data.get("name") || `${t("hud.player")} 01`),
      phone: String(data.get("phone") || ""),
      address: String(data.get("address") || ""),
      payment: (String(data.get("payment")) as PaymentMethod) || "cod",
    });
    setOrder(created);
    setLoading(true);
    let p = 0;
    const timer = window.setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        window.clearInterval(timer);
        setDone(true);
      }
    }, 70);
  }

  if (order) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <motion.p
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-pixel text-lg text-lime sm:text-2xl"
        >
          {t("checkout.complete")}
        </motion.p>
        <ArcadePanel className="mt-6 p-6 text-start">
          <p className="font-hud text-[10px] text-cyan">{t("checkout.order", { id: order.id })}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {order.items.map((item) => (
              <li key={`${item.name}-${item.quantity}`} className="flex justify-between text-muted">
                <span className="text-cream">{itemLabel(item.id, item.name)} x{item.quantity}</span>
                <span>{egp(item.price)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-pixel text-xs text-gold">{t("checkout.total", { total: egp(order.total) })}</p>
        </ArcadePanel>
        <p className="mt-6 font-pixel text-[11px] text-cyan">
          {done ? t("checkout.deployed") : t("checkout.loading")}
        </p>
        <div className="mx-auto mt-3 h-4 max-w-sm border border-cyan/40 p-0.5">
          <div className="h-full neon-gradient" style={{ width: `${progress}%` }} />
        </div>
        {done && <ArcadeButton href="/" className="mt-8">{t("checkout.back")}</ArcadeButton>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader eyebrow={t("checkout.eyebrow")} title={t("checkout.title")} subtitle={t("checkout.subtitle")} />
      {cart.length === 0 ? (
        <ArcadePanel className="p-8 text-center">
          <p className="font-pixel text-xs">{t("checkout.none")}</p>
          <ArcadeButton href="/menu" className="mt-6">{t("checkout.goMenu")}</ArcadeButton>
        </ArcadePanel>
      ) : (
        <ArcadePanel className="p-5">
          <form className="space-y-4" onSubmit={submit}>
            <label className="block">
              <span className="font-hud text-[10px] text-muted tracking-[0.16em] rtl:tracking-normal">{t("checkout.name")}</span>
              <input required name="name" defaultValue={`${t("hud.player")} 01`} className="mt-1 w-full border border-cyan/30 bg-void px-3 py-3 text-sm outline-none focus:border-cyan" />
            </label>
            <label className="block">
              <span className="font-hud text-[10px] text-muted tracking-[0.16em] rtl:tracking-normal">{t("checkout.phone")}</span>
              <input required name="phone" inputMode="tel" placeholder={t("checkout.phonePh")} className="mt-1 w-full border border-cyan/30 bg-void px-3 py-3 text-sm outline-none focus:border-cyan" />
            </label>
            <label className="block">
              <span className="font-hud text-[10px] text-muted tracking-[0.16em] rtl:tracking-normal">{t("checkout.address")}</span>
              <textarea required name="address" rows={3} placeholder={t("checkout.addressPh")} className="mt-1 w-full border border-cyan/30 bg-void px-3 py-3 text-sm outline-none focus:border-cyan" />
            </label>
            <fieldset>
              <legend className="font-hud text-[10px] text-muted tracking-[0.16em] rtl:tracking-normal">{t("checkout.payment")}</legend>
              <div className="mt-2 grid gap-2">
                {PAYMENTS.map((id) => (
                  <label key={id} className="flex items-center gap-3 border border-line px-3 py-3 has-[:checked]:border-cyan">
                    <input type="radio" name="payment" value={id} defaultChecked={id === "cod"} className="accent-[#22f0ff]" />
                    <span className="font-hud text-[11px]">{t(`checkout.${id}`)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="border border-gold/50 bg-gold/10 px-3 py-3 text-sm leading-6 text-gold">
              {t("checkout.fakePay")}
            </p>
            <p className="font-pixel text-sm text-gold">{egp(total)}</p>
            <ArcadeButton type="submit" variant="magenta" className="w-full" disabled={loading}>
              {t("checkout.confirm")}
            </ArcadeButton>
          </form>
        </ArcadePanel>
      )}
    </div>
  );
}

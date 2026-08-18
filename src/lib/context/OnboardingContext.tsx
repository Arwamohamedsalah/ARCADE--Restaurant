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

const STORAGE_KEY = "arcade-eatery-onboard-v3";

export type TourStep = {
  id: string;
  route: string;
  target: string | null;
  titleKey: string;
  bodyKey: string;
  flow?: boolean;
  interact?: boolean;
};

export const TOUR_STEPS: TourStep[] = [
  { id: "what", route: "/play", target: null, titleKey: "onboard.whatTitle", bodyKey: "onboard.whatBody", flow: true },
  { id: "start", route: "/play", target: "game-start", titleKey: "onboard.startTitle", bodyKey: "onboard.startBody", interact: true },
];

export const COACH_STEPS: TourStep[] = [
  { id: "c-customer", route: "/play", target: "shift-customer", titleKey: "onboard.coach1Title", bodyKey: "onboard.coach1Body", interact: true },
  { id: "c-ticket", route: "/play", target: "shift-ticket", titleKey: "onboard.coach2Title", bodyKey: "onboard.coach2Body" },
  { id: "c-kitchen", route: "/play", target: "shift-kitchen", titleKey: "onboard.coach3Title", bodyKey: "onboard.coach3Body", interact: true },
  { id: "c-serve", route: "/play", target: "shift-serve", titleKey: "onboard.coach4Title", bodyKey: "onboard.coach4Body", interact: true },
];

type Phase = "loading" | "welcome" | "ask" | "tour" | "coach" | "done";

type OnboardingValue = {
  phase: Phase;
  step: number;
  autoShift: boolean;
  continueWelcome: () => void;
  startBeginner: () => void;
  startReturning: () => void;
  next: () => void;
  back: () => void;
  skip: () => void;
  beginCoach: () => void;
  clearAutoShift: () => void;
};

const OnboardingContext = createContext<OnboardingValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [step, setStep] = useState(0);
  const [autoShift, setAutoShift] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setPhase(saved === "done" ? "done" : "welcome");
  }, []);

  const finish = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "done");
    setPhase("done");
    setStep(0);
    setAutoShift(false);
  }, []);

  const continueWelcome = useCallback(() => {
    setPhase("ask");
  }, []);

  const startBeginner = useCallback(() => {
    setStep(0);
    setPhase("tour");
  }, []);

  const beginCoach = useCallback(() => {
    setStep(0);
    setAutoShift(true);
    setPhase("coach");
  }, []);

  const clearAutoShift = useCallback(() => setAutoShift(false), []);

  const next = useCallback(() => {
    if (phase === "tour") {
      if (step + 1 >= TOUR_STEPS.length) {
        beginCoach();
        return;
      }
      setStep(step + 1);
      return;
    }
    if (phase === "coach") {
      if (step + 1 >= COACH_STEPS.length) {
        finish();
        return;
      }
      setStep(step + 1);
    }
  }, [phase, step, beginCoach, finish]);

  const back = useCallback(() => {
    setStep((current) => Math.max(0, current - 1));
  }, []);

  const value = useMemo<OnboardingValue>(
    () => ({
      phase,
      step,
      autoShift,
      continueWelcome,
      startBeginner,
      startReturning: finish,
      next,
      back,
      skip: finish,
      beginCoach,
      clearAutoShift,
    }),
    [phase, step, autoShift, continueWelcome, startBeginner, finish, next, back, beginCoach, clearAutoShift],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return ctx;
}

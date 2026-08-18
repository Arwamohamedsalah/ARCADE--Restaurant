"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type Props = {
  kind: "burger" | "pizza" | "fries" | "drink" | "dessert";
  variant?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizes = {
  sm: "h-16 w-16",
  md: "h-28 w-28",
  lg: "h-40 w-40",
  xl: "h-52 w-52",
};

function Burger({ variant }: { variant: string }) {
  const uid = useId().replace(/:/g, "");
  const double = variant === "double-boss" || variant === "secret-boss";
  const bacon = variant === "glitch-bacon";
  const smash = variant === "arcade-smash";
  const gold = variant === "secret-boss";
  const bun0 = gold ? "#c9a227" : smash ? "#d4a15a" : "#e8b56a";
  const bun1 = gold ? "#8a6a12" : smash ? "#b57a32" : "#c4843a";

  return (
    <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-bunTop`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gold ? "#f3d56a" : "#f6d7a0"} />
          <stop offset="40%" stopColor={bun0} />
          <stop offset="100%" stopColor={bun1} />
        </linearGradient>
        <linearGradient id={`${uid}-bunBot`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gold ? "#e8c04a" : "#f0c88a"} />
          <stop offset="100%" stopColor={bun1} />
        </linearGradient>
        <linearGradient id={`${uid}-patty`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a3a1c" />
          <stop offset="50%" stopColor="#4a1f0e" />
          <stop offset="100%" stopColor="#3a160a" />
        </linearGradient>
        <linearGradient id={`${uid}-cheese`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe27a" />
          <stop offset="100%" stopColor="#e0a020" />
        </linearGradient>
        <linearGradient id={`${uid}-lettuce`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9fde4a" />
          <stop offset="100%" stopColor="#4f9a22" />
        </linearGradient>
        <linearGradient id={`${uid}-tomato`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff6b5a" />
          <stop offset="100%" stopColor="#c41d1d" />
        </linearGradient>
        <linearGradient id={`${uid}-bacon`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0a090" />
          <stop offset="45%" stopColor="#c4452d" />
          <stop offset="100%" stopColor="#7a2414" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="72" rx="22" ry="5" fill={`url(#${uid}-shadow)`} />
      <ellipse cx="40" cy="62" rx="23" ry="8" fill={`url(#${uid}-bunBot)`} />
      <ellipse cx="40" cy="59" rx="21" ry="5" fill="#f3d5a4" opacity="0.55" />
      <ellipse cx="40" cy={double ? 54 : 52} rx="22" ry={smash ? 4.5 : 6.5} fill={`url(#${uid}-patty)`} />
      <path
        d={smash ? "M22 52 Q40 49 58 52" : "M20 51 Q40 48 60 51"}
        stroke="#2a1208"
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
      {double && (
        <>
          <path d="M24 47 L56 47 L54 51 L22 50 Z" fill={`url(#${uid}-cheese)`} />
          <ellipse cx="40" cy="44" rx="21.5" ry="6" fill={`url(#${uid}-patty)`} />
        </>
      )}
      <path
        d="M21 46 L59 45 L57 51 Q40 54 23 51 Z"
        fill={`url(#${uid}-cheese)`}
      />
      <path d="M56 46 L61 52 L56 50 Z" fill="#e0a020" />
      <path d="M24 46 L18 52 L24 50 Z" fill="#e0a020" />
      {bacon && (
        <>
          <path d="M22 42 Q40 38 58 43 L56 46 Q40 42 24 46 Z" fill={`url(#${uid}-bacon)`} />
          <path d="M26 43 Q40 41 54 44" stroke="#f8d0c4" strokeWidth="0.7" fill="none" opacity="0.7" />
        </>
      )}
      {!smash && (
        <>
          <ellipse cx="30" cy="40" rx="10" ry="3.2" fill={`url(#${uid}-tomato)`} />
          <ellipse cx="50" cy="40.5" rx="9" ry="3" fill={`url(#${uid}-tomato)`} />
          <ellipse cx="30" cy="39.4" rx="5" ry="1.2" fill="#ffb0a4" opacity="0.45" />
        </>
      )}
      {smash && (
        <>
          <ellipse cx="28" cy="42" rx="4" ry="2.2" fill="#7dbf3a" />
          <ellipse cx="40" cy="43" rx="4" ry="2" fill="#8acc44" />
          <ellipse cx="52" cy="42" rx="4" ry="2.2" fill="#7dbf3a" />
          <path d="M24 39 Q40 36 56 40" stroke="#c45aa0" strokeWidth="2.2" fill="none" opacity="0.85" />
        </>
      )}
      <path
        d="M18 38 Q24 34 32 36 Q40 32 48 36 Q56 33 62 38 Q54 42 40 41 Q26 42 18 38 Z"
        fill={`url(#${uid}-lettuce)`}
      />
      <ellipse cx="40" cy="26" rx="23" ry="12" fill={`url(#${uid}-bunTop)`} />
      <path d="M18 28 Q40 16 62 28 Q40 22 18 28 Z" fill="#fff6e0" opacity="0.22" />
      {[
        [28, 22],
        [36, 18],
        [46, 19],
        [54, 23],
        [32, 26],
        [44, 25],
        [50, 28],
        [40, 22],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="1.15" ry="0.8" fill="#fff4d2" opacity="0.95" />
      ))}
    </svg>
  );
}

function Pizza({ variant }: { variant: string }) {
  const uid = useId().replace(/:/g, "");
  const margherita = variant === "margherita";
  const supreme = variant === "supreme" || variant === "final-boss";
  const pep = !margherita;

  return (
    <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`${uid}-crust`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f0c878" />
          <stop offset="70%" stopColor="#d4a04a" />
          <stop offset="100%" stopColor="#a86a22" />
        </radialGradient>
        <radialGradient id={`${uid}-sauce`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#e24a32" />
          <stop offset="100%" stopColor="#9a1c14" />
        </radialGradient>
        <radialGradient id={`${uid}-cheese`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff4c8" />
          <stop offset="45%" stopColor="#f2d56a" />
          <stop offset="100%" stopColor="#d4a028" />
        </radialGradient>
        <radialGradient id={`${uid}-pep`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#e85a48" />
          <stop offset="100%" stopColor="#8a1c18" />
        </radialGradient>
        <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="70" rx="26" ry="6" fill={`url(#${uid}-shadow)`} />
      <ellipse cx="40" cy="42" rx="30" ry="28" fill={`url(#${uid}-crust)`} />
      <ellipse cx="32" cy="24" rx="4" ry="2.2" fill="#c4842a" opacity="0.45" />
      <ellipse cx="54" cy="30" rx="3.5" ry="2" fill="#c4842a" opacity="0.4" />
      <ellipse cx="22" cy="42" rx="3" ry="1.8" fill="#b57422" opacity="0.35" />
      <ellipse cx="40" cy="42" rx="24" ry="22" fill={`url(#${uid}-sauce)`} />
      <ellipse cx="40" cy="42" rx="22.5" ry="20.5" fill={`url(#${uid}-cheese)`} />
      <path d="M28 30 Q36 28 40 34 Q46 30 54 36 Q48 42 40 40 Q32 38 28 30 Z" fill="#fff8d8" opacity="0.35" />
      <path d="M40 22 L40 62 M22 42 L58 42 M28 28 L52 56 M52 28 L28 56" stroke="#c4842a" strokeWidth="0.45" opacity="0.28" />
      {pep &&
        [
          [32, 32, 5.2],
          [48, 30, 4.8],
          [54, 44, 5],
          [40, 48, 5.4],
          [28, 46, 4.6],
          [42, 34, 4.2],
          ...(supreme ? [[36, 40, 4.4] as const, [50, 52, 4] as const] : []),
        ].map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill={`url(#${uid}-pep)`} />
            <circle cx={x - 1.2} cy={y - 1.4} r={r * 0.28} fill="#ffb0a0" opacity="0.4" />
            <circle cx={x + 1} cy={y} r="0.7" fill="#6a1410" opacity="0.35" />
          </g>
        ))}
      {margherita && (
        <>
          <ellipse cx="34" cy="36" rx="7" ry="5" fill="#f7f0dc" opacity="0.9" />
          <ellipse cx="48" cy="44" rx="6.5" ry="5" fill="#f7f0dc" opacity="0.85" />
          <ellipse cx="40" cy="50" rx="5.5" ry="4" fill="#fffaf0" opacity="0.7" />
          <path d="M36 34 Q40 28 44 34 Q40 32 36 34 Z" fill="#3d9a32" />
          <path d="M44 42 Q50 38 52 46 Q48 44 44 42 Z" fill="#2f7a28" />
          <path d="M32 46 Q36 42 38 50 Q34 48 32 46 Z" fill="#4aad3c" />
        </>
      )}
      {supreme && (
        <>
          <ellipse cx="36" cy="38" rx="3.2" ry="2.2" fill="#3d8f3a" />
          <ellipse cx="50" cy="40" rx="3" ry="2" fill="#e8a020" />
          <ellipse cx="30" cy="52" rx="3.4" ry="2.1" fill="#7a3ea8" />
          <circle cx="46" cy="54" r="2.1" fill="#2a2a32" />
          <circle cx="46" cy="54" r="0.8" fill="#1a1a20" />
          <ellipse cx="24" cy="40" rx="3" ry="1.8" fill="#c45aa0" />
        </>
      )}
    </svg>
  );
}

function Fries({ variant }: { variant: string }) {
  const uid = useId().replace(/:/g, "");
  const loaded = variant === "power-fries";
  const cheese = variant === "neon-fries" || loaded;

  return (
    <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-cup`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff4d7a" />
          <stop offset="100%" stopColor="#b01440" />
        </linearGradient>
        <linearGradient id={`${uid}-fry`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c47a18" />
          <stop offset="35%" stopColor="#ffd24a" />
          <stop offset="70%" stopColor="#ffe9a0" />
          <stop offset="100%" stopColor="#e0a020" />
        </linearGradient>
        <linearGradient id={`${uid}-cheese`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe27a" />
          <stop offset="100%" stopColor="#e0a020" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="74" rx="20" ry="4.5" fill={`url(#${uid}-shadow)`} />
      <path d="M18 48 L22 70 Q40 76 58 70 L62 48 Z" fill={`url(#${uid}-cup)`} />
      <path d="M20 50 L23 68 Q40 73 57 68 L60 50 Z" fill="#ff6b90" opacity="0.35" />
      <path d="M16 44 L64 44 L62 50 L18 50 Z" fill="#d41d4a" />
      <path d="M18 44 L62 44 L60 47 L20 47 Z" fill="#ff8aa8" opacity="0.35" />
      {[
        [24, 18, 7, 36, -11],
        [31, 14, 6.5, 38, -5],
        [38, 12, 7, 40, 2],
        [45, 15, 6.2, 37, 7],
        [52, 19, 6.8, 35, 12],
        [28, 22, 5.5, 30, -8],
        [48, 20, 5.8, 32, 9],
      ].map(([x, y, w, h, rot], i) => (
        <g key={i} transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
          <rect x={x} y={y} width={w} height={h} rx="2.2" fill={`url(#${uid}-fry)`} />
          <rect x={x + 1.2} y={y + 2} width={1.4} height={h * 0.55} rx="0.6" fill="#fff6c8" opacity="0.35" />
        </g>
      ))}
      {cheese && (
        <>
          <path d="M22 42 Q40 36 58 42 L56 50 Q40 46 24 50 Z" fill={`url(#${uid}-cheese)`} />
          <path d="M30 48 Q32 58 28 62" stroke="#e0a020" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M50 47 Q54 58 52 64" stroke="#ffd24a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </>
      )}
      {loaded && (
        <>
          <path d="M26 40 L54 38 L52 44 L28 45 Z" fill="#c4452d" />
          <path d="M30 41 L50 40" stroke="#f0a090" strokeWidth="0.8" fill="none" />
          <circle cx="34" cy="46" r="1.4" fill="#6b2b16" />
          <circle cx="44" cy="47" r="1.3" fill="#6b2b16" />
          <circle cx="39" cy="44" r="1.1" fill="#3a160a" />
        </>
      )}
    </svg>
  );
}

function Drink({ variant }: { variant: string }) {
  const uid = useId().replace(/:/g, "");
  if (variant === "milkshake") {
    return (
      <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`${uid}-shake`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff9ad4" />
            <stop offset="55%" stopColor="#ff2ec8" />
            <stop offset="100%" stopColor="#22f0ff" />
          </linearGradient>
          <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="40" cy="74" rx="16" ry="4" fill={`url(#${uid}-shadow)`} />
        <path d="M22 70 L58 70 L54 74 L26 74 Z" fill="#d9d2c5" />
        <path d="M26 32 L22 70 L58 70 L54 32 Z" fill="#e8f4ff" opacity="0.55" />
        <path d="M28 34 L25 68 L55 68 L52 34 Z" fill={`url(#${uid}-shake)`} />
        <path d="M30 36 L29 50 L36 50 L38 36 Z" fill="#fff" opacity="0.22" />
        <ellipse cx="40" cy="32" rx="16" ry="6" fill="#fffaf4" />
        <ellipse cx="34" cy="26" rx="7" ry="5.5" fill="#fff" />
        <ellipse cx="44" cy="24" rx="8" ry="6" fill="#fffaf8" />
        <ellipse cx="40" cy="29" rx="9" ry="5" fill="#fff" />
        <circle cx="48" cy="18" r="4.2" fill="#e12424" />
        <ellipse cx="47" cy="16.5" rx="1.4" ry="0.8" fill="#ff8a8a" opacity="0.7" />
        <rect x="50" y="8" width="2.4" height="28" rx="1.2" fill="#22f0ff" transform="rotate(12 51 22)" />
      </svg>
    );
  }

  if (variant === "energy") {
    return (
      <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`${uid}-can`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3a0a58" />
            <stop offset="40%" stopColor="#7a1cff" />
            <stop offset="100%" stopColor="#ff2ec8" />
          </linearGradient>
          <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="40" cy="74" rx="12" ry="3.5" fill={`url(#${uid}-shadow)`} />
        <rect x="28" y="14" width="24" height="56" rx="5" fill={`url(#${uid}-can)`} />
        <rect x="30" y="18" width="6" height="48" rx="2" fill="#fff" opacity="0.18" />
        <ellipse cx="40" cy="14" rx="12" ry="4" fill="#c8c4d8" />
        <ellipse cx="40" cy="13" rx="7" ry="2.2" fill="#8a8698" />
        <ellipse cx="40" cy="70" rx="12" ry="3.4" fill="#2a0838" />
        <text x="40" y="46" textAnchor="middle" fill="#ffd24a" fontSize="9" fontWeight="700">
          ⚡
        </text>
      </svg>
    );
  }

  if (variant === "cooler") {
    return (
      <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`${uid}-cool`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b8fff4" />
            <stop offset="50%" stopColor="#22f0ff" />
            <stop offset="100%" stopColor="#1a6ad4" />
          </linearGradient>
          <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="40" cy="74" rx="14" ry="3.8" fill={`url(#${uid}-shadow)`} />
        <path d="M26 22 L24 68 Q40 74 56 68 L54 22 Z" fill="#e8fbff" opacity="0.5" />
        <path d="M28 24 L26.5 66 Q40 71 53.5 66 L52 24 Z" fill={`url(#${uid}-cool)`} />
        <path d="M30 26 L29 42 L35 42 L36 26 Z" fill="#fff" opacity="0.28" />
        <ellipse cx="40" cy="22" rx="14" ry="4.5" fill="#dff8ff" />
        <rect x="49" y="8" width="2.6" height="30" rx="1.2" fill="#ffd24a" />
        <ellipse cx="28" cy="44" rx="5" ry="4" fill="#ffd24a" />
        <ellipse cx="28" cy="44" rx="3.4" ry="2.6" fill="#fff4c0" />
        <circle cx="34" cy="38" r="1.3" fill="#fff" opacity="0.55" />
        <circle cx="48" cy="50" r="1.1" fill="#fff" opacity="0.45" />
        <circle cx="32" cy="56" r="1" fill="#fff" opacity="0.4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-cola`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b1d32" />
          <stop offset="40%" stopColor="#3a0c14" />
          <stop offset="100%" stopColor="#1a0508" />
        </linearGradient>
        <linearGradient id={`${uid}-cup`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f3eee6" />
          <stop offset="100%" stopColor="#d4cdc2" />
        </linearGradient>
        <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="74" rx="16" ry="4" fill={`url(#${uid}-shadow)`} />
      <path d="M24 24 L20 68 Q40 74 60 68 L56 24 Z" fill={`url(#${uid}-cup)`} />
      <path d="M26 28 L23 64 Q40 69 57 64 L54 28 Z" fill={`url(#${uid}-cola)`} />
      <path d="M28 30 L27 48 L34 48 L36 30 Z" fill="#fff" opacity="0.12" />
      <ellipse cx="40" cy="24" rx="16.5" ry="5" fill="#e12424" />
      <ellipse cx="40" cy="22" rx="7" ry="2.4" fill="#fff" opacity="0.35" />
      <rect x="48" y="6" width="3" height="34" rx="1.4" fill="#e12424" />
      <ellipse cx="32" cy="40" rx="2.2" ry="1.4" fill="#fff" opacity="0.2" />
      <ellipse cx="50" cy="52" rx="1.8" ry="1.1" fill="#fff" opacity="0.15" />
    </svg>
  );
}

function Dessert({ variant }: { variant: string }) {
  const uid = useId().replace(/:/g, "");

  if (variant === "cookie") {
    return (
      <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id={`${uid}-dough`} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#e8b56a" />
            <stop offset="55%" stopColor="#c47a3a" />
            <stop offset="100%" stopColor="#8a4a1c" />
          </radialGradient>
          <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="40" cy="70" rx="22" ry="5" fill={`url(#${uid}-shadow)`} />
        <ellipse cx="40" cy="42" rx="24" ry="22" fill={`url(#${uid}-dough)`} />
        <ellipse cx="32" cy="34" rx="10" ry="7" fill="#f0c88a" opacity="0.28" />
        {[
          [30, 34],
          [46, 30],
          [50, 44],
          [36, 48],
          [28, 46],
          [42, 38],
          [34, 28],
          [52, 36],
        ].map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx="3.1" ry="2.6" fill="#3b2114" />
            <ellipse cx={x - 0.7} cy={y - 0.7} rx="1" ry="0.7" fill="#6b3a22" opacity="0.7" />
          </g>
        ))}
      </svg>
    );
  }

  if (variant === "cake") {
    return (
      <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`${uid}-pink`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffb0d4" />
            <stop offset="100%" stopColor="#ff2ec8" />
          </linearGradient>
          <linearGradient id={`${uid}-cream`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffaf0" />
            <stop offset="100%" stopColor="#f0e0c0" />
          </linearGradient>
          <linearGradient id={`${uid}-choc`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8a4a22" />
            <stop offset="100%" stopColor="#4a2410" />
          </linearGradient>
          <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="42" cy="72" rx="22" ry="5" fill={`url(#${uid}-shadow)`} />
        <path d="M16 50 L16 64 L64 64 L64 50 L40 42 Z" fill={`url(#${uid}-choc)`} />
        <path d="M16 50 L40 42 L64 50 L40 56 Z" fill="#6b3418" />
        <path d="M16 42 L16 50 L40 56 L64 50 L64 42 L40 34 Z" fill={`url(#${uid}-cream)`} />
        <path d="M16 42 L40 34 L64 42 L40 48 Z" fill="#fffaf8" />
        <path d="M16 32 L16 42 L40 48 L64 42 L64 32 L40 24 Z" fill={`url(#${uid}-pink)`} />
        <path d="M16 32 L40 24 L64 32 L40 38 Z" fill="#ffd0e8" />
        <path d="M38 16 C38 12 42 12 42 16 L42 26 L38 26 Z" fill="#ff2ec8" />
        <ellipse cx="40" cy="15" rx="4.5" ry="3.2" fill="#e12424" />
        <ellipse cx="39" cy="13.8" rx="1.4" ry="0.8" fill="#ff8a8a" opacity="0.7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8f4ff" />
          <stop offset="100%" stopColor="#c8d8e8" />
        </linearGradient>
        <linearGradient id={`${uid}-chocs`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a4a22" />
          <stop offset="100%" stopColor="#4a2410" />
        </linearGradient>
        <radialGradient id={`${uid}-pink`} cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffd0ea" />
          <stop offset="100%" stopColor="#ff2ec8" />
        </radialGradient>
        <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="74" rx="16" ry="4" fill={`url(#${uid}-shadow)`} />
      <path d="M24 70 L56 70 L52 74 L28 74 Z" fill="#d9d2c5" />
      <path d="M26 46 L24 70 L56 70 L54 46 Z" fill={`url(#${uid}-glass)`} opacity="0.55" />
      <path d="M28 48 L26.5 68 L53.5 68 L52 48 Z" fill={`url(#${uid}-chocs)`} />
      <ellipse cx="34" cy="34" rx="11" ry="10" fill="#fffaf4" />
      <ellipse cx="48" cy="36" rx="10" ry="9" fill={`url(#${uid}-pink)`} />
      <ellipse cx="40" cy="28" rx="10" ry="9" fill="#fff" />
      <ellipse cx="36" cy="26" rx="4" ry="3" fill="#fff" opacity="0.8" />
      <path d="M38 18 C38 14 44 14 44 18 L40 30 Z" fill="#c47a3a" />
      <circle cx="46" cy="18" r="4" fill="#e12424" />
      <ellipse cx="45" cy="16.6" rx="1.3" ry="0.7" fill="#ff8a8a" opacity="0.7" />
      <path d="M30 50 Q40 56 50 50" stroke="#5b3018" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

export function FoodVisual({ kind, variant = "", size = "md", className }: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-[#1b0d2e] via-[#12091c] to-[#0b0614]",
        sizes[size],
        className,
      )}
      aria-hidden
    >
      {kind === "burger" && <Burger variant={variant} />}
      {kind === "pizza" && <Pizza variant={variant} />}
      {kind === "fries" && <Fries variant={variant} />}
      {kind === "drink" && <Drink variant={variant} />}
      {kind === "dessert" && <Dessert variant={variant} />}
    </div>
  );
}

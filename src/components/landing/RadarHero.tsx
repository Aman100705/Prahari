"use client";

import { useEffect, useState } from "react";

type Blip = { a: number; r: number; band: string; delay: number };

const BLIPS: Blip[] = [
  { a: 25, r: 0.62, band: "var(--color-critical)", delay: 0.2 },
  { a: 78, r: 0.4, band: "var(--color-high)", delay: 1.1 },
  { a: 140, r: 0.74, band: "var(--color-elevated)", delay: 0.6 },
  { a: 200, r: 0.52, band: "var(--color-critical)", delay: 1.8 },
  { a: 255, r: 0.3, band: "var(--color-guarded)", delay: 2.4 },
  { a: 310, r: 0.68, band: "var(--color-high)", delay: 0.9 },
  { a: 348, r: 0.46, band: "var(--color-elevated)", delay: 1.5 },
];

export function RadarHero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const C = 200;
  const R = 168;

  return (
    <div className="relative aspect-square w-full max-w-[440px]">
      <svg viewBox="0 0 400 400" className="h-full w-full">
        <defs>
          <radialGradient id="radar-fade" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#0d131c" />
            <stop offset="1" stopColor="#070a0f" />
          </radialGradient>
          <linearGradient id="sweep-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-beacon)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--color-beacon)" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        <circle cx={C} cy={C} r={R} fill="url(#radar-fade)" stroke="var(--color-line-strong)" />
        {[0.28, 0.52, 0.76, 1].map((f) => (
          <circle key={f} cx={C} cy={C} r={R * f} fill="none" stroke="var(--color-line)" strokeDasharray="2 4" />
        ))}
        {[0, 45, 90, 135].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={C - R * Math.cos(rad)}
              y1={C - R * Math.sin(rad)}
              x2={C + R * Math.cos(rad)}
              y2={C + R * Math.sin(rad)}
              stroke="var(--color-line)"
              strokeDasharray="2 4"
            />
          );
        })}

        {/* rotating sweep */}
        <g style={{ transformOrigin: "200px 200px" }} className="animate-sweep">
          <path d={`M${C},${C} L${C + R},${C} A${R},${R} 0 0 1 ${C + R * Math.cos(-0.9)},${C + R * Math.sin(-0.9)} Z`} fill="url(#sweep-grad)" />
          <line x1={C} y1={C} x2={C + R} y2={C} stroke="var(--color-beacon)" strokeWidth="1.5" strokeOpacity="0.7" />
        </g>

        {/* blips */}
        {mounted &&
          BLIPS.map((b, i) => {
            const rad = (b.a * Math.PI) / 180;
            const x = C + R * b.r * Math.cos(rad);
            const y = C + R * b.r * Math.sin(rad);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="10" fill={b.band} opacity="0.15">
                  <animate attributeName="r" values="4;14;4" dur="2.8s" begin={`${b.delay}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.28;0;0.28" dur="2.8s" begin={`${b.delay}s`} repeatCount="indefinite" />
                </circle>
                <circle cx={x} cy={y} r="3" fill={b.band} />
              </g>
            );
          })}

        {/* beacon core */}
        <circle cx={C} cy={C} r="6" fill="var(--color-beacon-bright)" />
        <circle cx={C} cy={C} r="6" fill="none" stroke="var(--color-beacon)" strokeOpacity="0.5">
          <animate attributeName="r" values="6;22;6" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* floating intercept card */}
      <div className="absolute -right-2 top-6 w-[188px] rounded-lg border border-line-strong bg-ink-800/90 p-3 shadow-2xl backdrop-blur-md animate-rise sm:-right-6">
        <div className="mb-1 flex items-center justify-between">
          <span className="eyebrow">Intercept</span>
          <span className="text-[10px] font-semibold text-critical">CRITICAL</span>
        </div>
        <div className="text-[13px] font-medium text-text">&quot;Digital arrest&quot; detected</div>
        <div className="mt-1 text-[11px] text-text-faint">Bengaluru · fake CBI · ₹4.2L at risk</div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink-600">
          <div className="h-full w-[94%] rounded-full bg-critical" />
        </div>
      </div>

      <div className="absolute -left-2 bottom-10 w-[176px] rounded-lg border border-line-strong bg-ink-800/90 p-3 shadow-2xl backdrop-blur-md animate-rise sm:-left-8" style={{ animationDelay: "0.3s" }}>
        <div className="mb-1 flex items-center justify-between">
          <span className="eyebrow">Dispatch</span>
          <span className="text-[10px] font-semibold text-safe">3m 40s</span>
        </div>
        <div className="text-[13px] font-medium text-text">Cyber cell notified</div>
        <div className="mt-1 text-[11px] text-text-faint">Signal → neutralisation</div>
      </div>
    </div>
  );
}

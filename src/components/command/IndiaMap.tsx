"use client";

import { useEffect, useState } from "react";
import { cities } from "@/lib/intel/data";
import type { City } from "@/lib/intel/types";

// Low-poly India silhouette (intentional facet style) on a 0..100 × 0..110 canvas.
const INDIA =
  "M40 3 L46 9 L53 13 L60 17 L67 20 L72 19 L80 17 L86 23 L82 28 L74 31 L77 35 L73 38 L70 40 L72 45 L69 49 L65 55 L61 62 L57 69 L55 76 L50 86 L45 76 L42 66 L38 58 L33 52 L29 47 L24 45 L20 40 L26 39 L30 41 L28 35 L31 28 L34 20 L37 12 Z";

const ROLE_COLOR: Record<City["role"], string> = {
  source: "var(--color-critical)",
  target: "var(--color-signal)",
  cashout: "var(--color-beacon)",
};

// Scam-flow arcs: source hubs → target metros.
const FLOWS: [string, string][] = [
  ["Jamtara", "Bengaluru"],
  ["Jamtara", "Delhi"],
  ["Nuh (Mewat)", "Mumbai"],
  ["Nuh (Mewat)", "Delhi"],
  ["Bharatpur", "Pune"],
  ["Deoghar", "Hyderabad"],
  ["Nuh (Mewat)", "Chennai"],
];

function arcPath(a: City, b: City) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - Math.hypot(b.x - a.x, b.y - a.y) * 0.32;
  return `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`;
}

export function IndiaMap({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (name: string | null) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const byName = new Map(cities.map((c) => [c.name, c]));

  return (
    <svg viewBox="12 0 82 92" className="h-full w-full" onClick={() => onSelect(null)}>
      <defs>
        <clipPath id="india-clip">
          <path d={INDIA} />
        </clipPath>
        <radialGradient id="map-halo" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="var(--color-signal)" stopOpacity="0.12" />
          <stop offset="1" stopColor="var(--color-signal)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* landmass */}
      <path d={INDIA} fill="var(--color-ink-700)" stroke="var(--color-line-strong)" strokeWidth="0.4" strokeLinejoin="round" />
      {/* interior grid clipped to landmass */}
      <g clipPath="url(#india-clip)">
        <rect x="12" y="0" width="82" height="92" fill="url(#map-halo)" />
        {Array.from({ length: 22 }).map((_, i) => (
          <line key={`v${i}`} x1={16 + i * 4} y1="0" x2={16 + i * 4} y2="92" stroke="var(--color-line)" strokeWidth="0.2" opacity="0.5" />
        ))}
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={`h${i}`} x1="12" y1={i * 4} x2="94" y2={i * 4} stroke="var(--color-line)" strokeWidth="0.2" opacity="0.5" />
        ))}
      </g>

      {/* flow arcs */}
      {mounted && (
        <g>
          {FLOWS.map(([s, t], i) => {
            const a = byName.get(s), b = byName.get(t);
            if (!a || !b) return null;
            const active = !selected || selected === s || selected === t;
            return (
              <path
                key={i}
                d={arcPath(a, b)}
                fill="none"
                stroke="var(--color-critical)"
                strokeWidth="0.35"
                strokeOpacity={active ? 0.5 : 0.08}
                strokeDasharray="1.5 2"
              >
                <animate attributeName="stroke-dashoffset" from="7" to="0" dur="1.3s" repeatCount="indefinite" />
              </path>
            );
          })}
        </g>
      )}

      {/* hotspots */}
      {cities.map((c) => {
        const isSel = selected === c.name;
        const r = 0.9 + c.intensity * 1.8;
        const color = ROLE_COLOR[c.role];
        return (
          <g
            key={c.name}
            style={{ cursor: "pointer" }}
            onClick={(e) => { e.stopPropagation(); onSelect(isSel ? null : c.name); }}
          >
            {/* heat halo */}
            <circle cx={c.x} cy={c.y} r={r * 3.4} fill={color} opacity={0.1 + c.intensity * 0.12} />
            {mounted && c.intensity > 0.8 && (
              <circle cx={c.x} cy={c.y} r={r} fill="none" stroke={color} strokeWidth="0.3">
                <animate attributeName="r" values={`${r};${r * 4};${r}`} dur="2.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0;0.7" dur="2.6s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={c.x} cy={c.y} r={r} fill={color} stroke={isSel ? "#fff" : "var(--color-canvas)"} strokeWidth={isSel ? 0.5 : 0.3} />
            {(c.intensity > 0.7 || isSel) && (
              <text x={c.x + r + 0.8} y={c.y + 1} style={{ fontSize: 2.2 }} className="pointer-events-none fill-text-muted font-mono">
                {c.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

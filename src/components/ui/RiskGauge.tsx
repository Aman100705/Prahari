"use client";

import { bandMeta } from "@/lib/intel/risk";
import type { RiskBand } from "@/lib/intel/types";

/** Semicircular risk gauge, 0..1, animated needle + banded arc. */
export function RiskGauge({ score, band, size = 220 }: { score: number; band: RiskBand; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 18;
  const startA = 180;
  const endA = 360;
  const meta = bandMeta[band];

  const polar = (deg: number, radius = r) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
  };
  const arc = (a0: number, a1: number, radius = r) => {
    const [x0, y0] = polar(a0, radius);
    const [x1, y1] = polar(a1, radius);
    const large = a1 - a0 > 180 ? 1 : 0;
    return `M${x0},${y0} A${radius},${radius} 0 ${large} 1 ${x1},${y1}`;
  };

  const needleA = startA + score * (endA - startA);
  const [nx, ny] = polar(needleA, r - 6);

  const segs: { from: number; to: number; color: string }[] = [
    { from: 0, to: 0.3, color: "var(--color-safe)" },
    { from: 0.3, to: 0.5, color: "var(--color-guarded)" },
    { from: 0.5, to: 0.68, color: "var(--color-elevated)" },
    { from: 0.68, to: 0.85, color: "var(--color-high)" },
    { from: 0.85, to: 1, color: "var(--color-critical)" },
  ];

  return (
    <div className="relative" style={{ width: size, height: size / 2 + 34 }}>
      <svg width={size} height={size / 2 + 12} viewBox={`0 ${cy - r - 12} ${size} ${r + 26}`}>
        {/* track */}
        <path d={arc(startA, endA)} fill="none" stroke="var(--color-line)" strokeWidth="10" strokeLinecap="round" />
        {/* coloured segments */}
        {segs.map((s, i) => (
          <path
            key={i}
            d={arc(startA + s.from * 180, startA + s.to * 180)}
            fill="none"
            stroke={s.color}
            strokeWidth="10"
            strokeLinecap="butt"
            opacity={score >= s.from ? 0.9 : 0.18}
            style={{ transition: "opacity 0.5s" }}
          />
        ))}
        {/* needle */}
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke={meta.color}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)" }}
        />
        <circle cx={cx} cy={cy} r="5" fill={meta.color} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <div className="tabular text-3xl font-semibold leading-none" style={{ color: meta.color }}>
          {Math.round(score * 100)}
          <span className="text-base text-text-faint">/100</span>
        </div>
        <div className="mt-1 text-[11px] font-medium uppercase tracking-wider" style={{ color: meta.color }}>
          {meta.label} risk
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { counterfeitFeatures } from "@/lib/intel/data";
import { Eyebrow } from "@/components/ui/primitives";
import { ScanIcon, AlertIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const STATUS_COLOR = { pass: "var(--color-safe)", warn: "var(--color-guarded)", fail: "var(--color-critical)" };

// Feature marker positions on the stylised note (0..100 × 0..46).
const MARKERS: Record<string, { x: number; y: number }> = {
  "sec-thread": { x: 40, y: 20 },
  intaglio: { x: 66, y: 22 },
  watermark: { x: 84, y: 24 },
  microtext: { x: 58, y: 14 },
  latent: { x: 74, y: 34 },
  serial: { x: 20, y: 8 },
};

export function CounterfeitPanel() {
  const [scanned, setScanned] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const fraudScore = counterfeitFeatures.reduce((s, f) => s + (f.status === "fail" ? f.weight : f.status === "warn" ? f.weight * 0.4 : 0), 0);
  const conf = Math.min(0.99, fraudScore);
  const fails = counterfeitFeatures.filter((f) => f.status === "fail").length;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      {/* Note viewer */}
      <div className="panel rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <Eyebrow>Specimen · ₹500 · on-device CV</Eyebrow>
          <span className="rounded bg-ink-700 px-2 py-0.5 font-mono text-[10px] text-text-faint">SN 8FF 452193</span>
        </div>

        <div className="relative aspect-[2/1] overflow-hidden rounded-xl border border-line-strong">
          {/* stylised note */}
          <svg viewBox="0 0 100 46" className="h-full w-full">
            <defs>
              <linearGradient id="note-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#3a3320" />
                <stop offset="1" stopColor="#2a2718" />
              </linearGradient>
            </defs>
            <rect width="100" height="46" fill="url(#note-bg)" />
            <rect x="2" y="2" width="96" height="42" rx="2" fill="none" stroke="#6b5e33" strokeWidth="0.4" strokeDasharray="1 1" />
            {/* portrait box */}
            <rect x="60" y="10" width="26" height="28" rx="1" fill="#4a4227" opacity="0.6" />
            <circle cx="73" cy="24" r="9" fill="#5c5230" opacity="0.7" />
            <text x="8" y="16" fill="#c9b978" style={{ fontSize: 6, fontWeight: 700 }}>500</text>
            <text x="8" y="40" fill="#9c8f55" style={{ fontSize: 2.4 }}>रिज़र्व बैंक ऑफ़ इंडिया</text>
            {/* security thread */}
            <rect x="38" y="4" width="0.8" height="38" fill="#7a6d3a" opacity="0.8" />

            {/* scan line */}
            {scanned && (
              <rect x="0" y="0" width="100" height="1.4" fill="var(--color-beacon)" opacity="0.8">
                <animate attributeName="y" values="0;44;0" dur="2.2s" repeatCount="indefinite" />
              </rect>
            )}

            {/* feature markers */}
            {scanned && counterfeitFeatures.map((f) => {
              const p = MARKERS[f.id];
              if (!p) return null;
              const col = STATUS_COLOR[f.status];
              const on = active === f.id;
              return (
                <g key={f.id} style={{ cursor: "pointer" }} onClick={() => setActive(on ? null : f.id)}>
                  <circle cx={p.x} cy={p.y} r={on ? 2.4 : 1.8} fill="none" stroke={col} strokeWidth="0.5" />
                  <circle cx={p.x} cy={p.y} r="0.7" fill={col} />
                </g>
              );
            })}
          </svg>

          {!scanned && (
            <div className="absolute inset-0 grid place-items-center bg-canvas/50 backdrop-blur-[1px]">
              <button onClick={() => setScanned(true)} className="flex items-center gap-2 rounded-lg bg-beacon px-4 py-2.5 text-[13px] font-semibold text-ink-900 transition-colors hover:bg-beacon-bright">
                <ScanIcon size={15} /> Run CV authentication
              </button>
            </div>
          )}
        </div>

        {scanned && (
          <div className="mt-4 rounded-xl border p-3.5" style={{ borderColor: "color-mix(in oklab, var(--color-critical) 30%, transparent)", background: "color-mix(in oklab, var(--color-critical) 8%, transparent)" }}>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[13px] font-semibold text-critical"><AlertIcon size={15} /> Counterfeit — FICN</span>
              <span className="tabular text-xl font-semibold text-critical">{Math.round(conf * 100)}%</span>
            </div>
            <p className="mt-1.5 text-[12px] text-text-muted">{fails} of 6 security features failed verification. Specimen matches Op. Garuda print signature. Recommend seizure + serial logging.</p>
          </div>
        )}
      </div>

      {/* Feature checklist */}
      <div className="panel rounded-2xl p-5">
        <Eyebrow>Security-feature verification</Eyebrow>
        <div className="mt-3 space-y-1.5">
          {counterfeitFeatures.map((f) => (
            <button
              key={f.id}
              onClick={() => setActive(active === f.id ? null : f.id)}
              className={cn("w-full rounded-lg border px-3 py-2.5 text-left transition-colors", active === f.id ? "border-line-strong bg-ink-600" : "border-line bg-ink-800 hover:border-line-strong")}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLOR[f.status] }} />
                  <span className="text-[13px] font-medium text-text">{f.name}</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: STATUS_COLOR[f.status] }}>{f.status}</span>
              </div>
              {active === f.id && (
                <div className="mt-2 grid grid-cols-1 gap-1 text-[11.5px] animate-rise">
                  <Row k="Region" v={f.region} />
                  <Row k="Expected" v={f.expected} />
                  <Row k="Observed" v={f.observed} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-16 shrink-0 text-text-faint">{k}</span>
      <span className="text-text-muted">{v}</span>
    </div>
  );
}

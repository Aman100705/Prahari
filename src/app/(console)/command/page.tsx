"use client";

import { useMemo, useState } from "react";
import { cities, liveSessions, topline, fmtINR, groupIN } from "@/lib/intel/data";
import { IndiaMap } from "@/components/command/IndiaMap";
import { CounterfeitPanel } from "@/components/command/CounterfeitPanel";
import { Eyebrow, LiveDot, RiskPill } from "@/components/ui/primitives";
import { MapIcon, ScanIcon, BoltIcon, AlertIcon } from "@/components/ui/icons";
import { bandMeta } from "@/lib/intel/risk";
import { cn } from "@/lib/cn";
import type { ScamSession } from "@/lib/intel/types";

const CHANNEL_LABEL: Record<ScamSession["channel"], string> = { whatsapp: "WhatsApp", voip: "VoIP call", sms: "SMS", upi: "UPI" };

export default function CommandPage() {
  const [tab, setTab] = useState<"ops" | "cash">("ops");
  const [selCity, setSelCity] = useState<string | null>(null);

  const priority = useMemo(
    () => [...cities].map((c) => ({ ...c, priority: c.intensity * 0.6 + (c.cases / 3000) * 0.4 })).sort((a, b) => b.priority - a.priority).slice(0, 6),
    [],
  );
  const selected = selCity ? cities.find((c) => c.name === selCity) : null;

  return (
    <div className="relative min-h-full">
      <div className="mx-auto max-w-[1500px] px-5 py-6 lg:px-8">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-beacon/30 bg-beacon/10 text-beacon"><MapIcon size={18} /></span>
              <Eyebrow>National fraud command · geospatial</Eyebrow>
            </div>
            <h1 className="font-display text-2xl font-semibold text-text">Prahari Command</h1>
            <p className="mt-1 max-w-xl text-[14px] text-text-muted">
              Live sessions, source hotspots and counterfeit seizures on one canvas — with enforcement prioritised for maximum disruption.
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-line bg-ink-800 p-1">
            <TabBtn on={tab === "ops"} onClick={() => setTab("ops")} icon={<MapIcon size={15} />}>Fraud operations</TabBtn>
            <TabBtn on={tab === "cash"} onClick={() => setTab("cash")} icon={<ScanIcon size={15} />}>Counterfeit lab</TabBtn>
          </div>
        </div>

        {/* Metric strip */}
        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard label="Active sessions" value={topline.activeSessions.toString()} accent="var(--color-signal)" live />
          <MetricCard label="Funds protected · today" value={fmtINR(topline.fundsProtectedToday)} accent="var(--color-beacon)" />
          <MetricCard label="Avg signal → dispatch" value={topline.avgSignalToDispatch} accent="var(--color-safe)" />
          <MetricCard label="Campaigns tracked" value={topline.campaignsTracked.toString()} accent="var(--color-violet)" />
        </div>

        {tab === "cash" ? (
          <CounterfeitPanel />
        ) : (
          <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
            {/* Map */}
            <section className="panel relative overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <span className="text-[13px] font-medium text-text">Threat surface · India</span>
                <div className="flex items-center gap-4">
                  <Legend color="var(--color-critical)" label="Source" />
                  <Legend color="var(--color-signal)" label="Target metro" />
                  <Legend color="var(--color-beacon)" label="Cash-out" />
                </div>
              </div>
              <div className="relative h-[540px] w-full">
                <IndiaMap selected={selCity} onSelect={setSelCity} />
                {selected && (
                  <div className="absolute bottom-4 left-4 w-64 rounded-xl border border-line-strong bg-ink-800/95 p-4 backdrop-blur-md animate-rise">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-text">{selected.name}</span>
                      <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase" style={{ color: selected.role === "source" ? "var(--color-critical)" : selected.role === "cashout" ? "var(--color-beacon)" : "var(--color-signal)", background: "var(--color-ink-600)" }}>{selected.role}</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-text-faint">{selected.state}</div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <MiniKV label="Cases (90d)" value={groupIN(selected.cases)} />
                      <MiniKV label="Heat index" value={`${Math.round(selected.intensity * 100)}`} />
                    </div>
                    <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-beacon px-3 py-2 text-[12px] font-semibold text-ink-900 transition-colors hover:bg-beacon-bright">
                      <BoltIcon size={13} /> Dispatch nearest cyber cell
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Right rail */}
            <aside className="flex flex-col gap-5">
              {/* Live feed */}
              <div className="panel flex flex-col rounded-2xl">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <Eyebrow>Live interception feed</Eyebrow>
                  <LiveDot label="Streaming" color="var(--color-critical)" />
                </div>
                <div className="max-h-[300px] space-y-2 overflow-y-auto p-3">
                  {liveSessions.map((s) => (
                    <div key={s.id} className="rounded-xl border border-line bg-ink-800 p-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <RiskPill band={s.band} size="sm" />
                          <span className="font-mono text-[11px] text-text-faint">{s.id}</span>
                        </span>
                        <span className="tabular text-[11px] text-text-faint">{s.elapsed}</span>
                      </div>
                      <div className="mt-2 text-[12.5px] text-text">{s.claimedAuthority} → {s.victimCity}</div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-text-faint">
                        <span>{CHANNEL_LABEL[s.channel]} · {s.ageGroup}</span>
                        <span className="text-elevated">{fmtINR(s.amountAtRisk)} at risk</span>
                      </div>
                      <div className="mt-1.5 text-[10.5px]" style={{ color: "var(--color-safe)" }}>✓ {s.interceptedAt}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enforcement priority */}
              <div className="panel rounded-2xl p-4">
                <Eyebrow>Enforcement priority queue</Eyebrow>
                <div className="mt-3 space-y-2">
                  {priority.map((c, i) => (
                    <button key={c.name} onClick={() => setSelCity(c.name)} className="flex w-full items-center gap-3 rounded-lg border border-line bg-ink-800 px-3 py-2 text-left transition-colors hover:border-line-strong">
                      <span className="tabular text-[12px] font-semibold text-beacon">{String(i + 1).padStart(2, "0")}</span>
                      <span className="h-2 w-2 rounded-full" style={{ background: c.role === "source" ? "var(--color-critical)" : c.role === "cashout" ? "var(--color-beacon)" : "var(--color-signal)" }} />
                      <span className="flex-1 truncate text-[12.5px] text-text">{c.name}</span>
                      <span className="tabular text-[11px] text-text-faint">{groupIN(c.cases)} cases</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function TabBtn({ on, onClick, icon, children }: { on: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("flex items-center gap-2 rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors", on ? "bg-ink-600 text-text" : "text-text-faint hover:text-text-muted")}>
      {icon} {children}
    </button>
  );
}

function MetricCard({ label, value, accent, live }: { label: string; value: string; accent: string; live?: boolean }) {
  return (
    <div className="panel rounded-xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-text-faint">{label}</span>
        {live && <LiveDot label="" color={accent} />}
      </div>
      <div className="tabular mt-1.5 text-xl font-semibold" style={{ color: accent }}>{value}</div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] text-text-muted">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} /> {label}
    </span>
  );
}

function MiniKV({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink-700 px-2.5 py-1.5">
      <div className="tabular text-[14px] font-semibold text-text">{value}</div>
      <div className="text-[10px] text-text-faint">{label}</div>
    </div>
  );
}

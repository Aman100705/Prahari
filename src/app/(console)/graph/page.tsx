"use client";

import { useMemo, useState } from "react";
import { campaigns, buildCampaignGraph, fmtINR } from "@/lib/intel/data";
import { buildDossier } from "@/lib/intel/dossier";
import { ForceGraph, KIND_STYLE } from "@/components/graph/ForceGraph";
import { Eyebrow, RiskPill, Divider } from "@/components/ui/primitives";
import { GraphIcon, DocIcon, NodeIcon, BoltIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { EntityKind } from "@/lib/intel/types";

const KIND_LABEL: Record<EntityKind, string> = {
  compound: "Compound", handler: "Handler", number: "Spoofed number", victim: "Victim", mule: "Mule account", wallet: "Crypto off-ramp",
};

export default function GraphPage() {
  const [campId, setCampId] = useState(campaigns[0].id);
  const [sel, setSel] = useState<string | null>(null);
  const [dossierOpen, setDossierOpen] = useState(false);

  const campaign = campaigns.find((c) => c.id === campId)!;
  const graph = useMemo(() => buildCampaignGraph(campId), [campId]);
  const nodeMap = useMemo(() => new Map(graph.nodes.map((n) => [n.id, n])), [graph]);
  const dossier = useMemo(() => buildDossier(campaign, graph.nodes, graph.edges), [campaign, graph]);

  const selNode = sel ? nodeMap.get(sel) : null;
  const connections = useMemo(() => {
    if (!sel) return [];
    return graph.edges
      .filter((e) => e.source === sel || e.target === sel)
      .map((e) => {
        const otherId = e.source === sel ? e.target : e.source;
        return { edge: e, other: nodeMap.get(otherId as string)! };
      })
      .filter((c) => c.other);
  }, [sel, graph, nodeMap]);

  const topActors = useMemo(
    () => [...graph.nodes].filter((n) => n.kind !== "victim").sort((a, b) => b.centrality - a.centrality).slice(0, 5),
    [graph],
  );

  const exposure = graph.nodes.filter((n) => n.kind === "victim").reduce((s, n) => s + (n.amount ?? 0), 0);

  return (
    <div className="relative min-h-full">
      <div className="mx-auto max-w-[1500px] px-5 py-6 lg:px-8">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-signal/30 bg-signal/10 text-signal"><GraphIcon size={18} /></span>
              <Eyebrow>Fraud-network intelligence · graph AI</Eyebrow>
            </div>
            <h1 className="font-display text-2xl font-semibold text-text">Prahari Graph</h1>
            <p className="mt-1 max-w-xl text-[14px] text-text-muted">
              Scattered complaints fused into one network via shared calling infrastructure, device fingerprints and mule-account convergence.
            </p>
          </div>
          <button
            onClick={() => setDossierOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-beacon px-4 py-2.5 text-[13px] font-semibold text-ink-900 transition-colors hover:bg-beacon-bright"
          >
            <DocIcon size={15} /> Generate intelligence package
          </button>
        </div>

        {/* Campaign selector */}
        <div className="mb-4 flex flex-wrap gap-2">
          {campaigns.map((c) => (
            <button
              key={c.id}
              onClick={() => { setCampId(c.id); setSel(null); }}
              className={cn(
                "group flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-all",
                c.id === campId ? "border-line-strong bg-ink-600" : "border-line bg-ink-800 hover:border-line-strong",
              )}
            >
              <RiskPill band={c.band} size="sm" />
              <div>
                <div className="text-[13px] font-medium text-text">{c.name}</div>
                <div className="text-[11px] text-text-faint">{c.victims > 0 ? `${c.victims} victims` : "currency"} · {fmtINR(c.exposure)}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
          {/* Graph canvas */}
          <section className="panel relative overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-medium text-text">{campaign.name} · network</span>
                <span className="tabular text-[12px] text-text-faint">{graph.nodes.length} entities · {graph.edges.length} links</span>
              </div>
              <div className="flex items-center gap-3">
                <MetricChip label="Traced exposure" value={fmtINR(exposure)} color="var(--color-elevated)" />
                <MetricChip label="Linkage conf." value={`${Math.round(campaign.confidence * 100)}%`} color="var(--color-signal)" />
              </div>
            </div>
            <div className="relative h-[560px] w-full bp-grid-fine">
              <ForceGraph nodes={graph.nodes} edges={graph.edges} selected={sel} onSelect={setSel} width={920} height={560} />
            </div>
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line px-5 py-2.5">
              {(Object.keys(KIND_STYLE) as EntityKind[]).map((k) => (
                <span key={k} className="flex items-center gap-1.5 text-[11px] text-text-muted">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: KIND_STYLE[k].color }} />
                  {KIND_LABEL[k]}
                </span>
              ))}
              <span className="ml-auto text-[11px] text-text-ghost">Hover to isolate · click to inspect</span>
            </div>
          </section>

          {/* Right rail */}
          <aside className="flex flex-col gap-5">
            {selNode ? (
              <div className="panel rounded-2xl p-5 animate-rise">
                <div className="mb-3 flex items-center justify-between">
                  <Eyebrow>Entity inspector</Eyebrow>
                  <button onClick={() => setSel(null)} className="text-[12px] text-text-faint hover:text-text">Close</button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `color-mix(in oklab, ${KIND_STYLE[selNode.kind].color} 15%, transparent)`, color: KIND_STYLE[selNode.kind].color }}>
                    <NodeIcon size={20} />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-mono text-[14px] font-medium text-text">{selNode.label}</div>
                    <div className="text-[12px]" style={{ color: KIND_STYLE[selNode.kind].color }}>{KIND_LABEL[selNode.kind]}{selNode.sub ? ` · ${selNode.sub}` : ""}</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MiniStat label="Ring confidence" value={`${Math.round(selNode.score * 100)}%`} />
                  <MiniStat label="Centrality" value={selNode.centrality.toFixed(2)} />
                  {selNode.amount ? <MiniStat label="Linked ₹" value={fmtINR(selNode.amount)} /> : <MiniStat label="Connections" value={String(connections.length)} />}
                  <MiniStat label="First seen" value={selNode.firstSeen.slice(5)} />
                </div>
                {selNode.flags && selNode.flags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selNode.flags.map((f) => (
                      <span key={f} className="rounded-md border border-line bg-ink-700 px-2 py-0.5 text-[10.5px] text-text-muted">{f}</span>
                    ))}
                  </div>
                )}
                <Divider className="my-4" />
                <Eyebrow>Connections · {connections.length}</Eyebrow>
                <div className="mt-2 max-h-52 space-y-1.5 overflow-y-auto pr-1">
                  {connections.map((c, i) => (
                    <button key={i} onClick={() => setSel(c.other.id)} className="flex w-full items-center justify-between rounded-lg border border-line bg-ink-800 px-2.5 py-2 text-left transition-colors hover:border-line-strong">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: KIND_STYLE[c.other.kind].color }} />
                        <span className="truncate font-mono text-[11.5px] text-text-muted">{c.other.label}</span>
                      </span>
                      <span className="text-[10px] uppercase tracking-wide text-text-ghost">{c.edge.kind}{c.edge.amount ? ` · ${fmtINR(c.edge.amount)}` : ""}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="panel rounded-2xl p-5">
                  <Eyebrow>Campaign brief</Eyebrow>
                  <h3 className="mt-2 font-display text-lg font-semibold text-text">{campaign.name}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-text-muted">{campaign.modus}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {campaign.states.map((s) => (
                      <span key={s} className="rounded-md border border-line bg-ink-700 px-2 py-0.5 text-[11px] text-text-muted">{s}</span>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <MiniStat label="Victims linked" value={campaign.victims > 0 ? String(campaign.victims) : "—"} />
                    <MiniStat label="Exposure" value={fmtINR(campaign.exposure)} />
                    <MiniStat label="Status" value={campaign.status} />
                    <MiniStat label="Detected" value={campaign.detected.slice(5)} />
                  </div>
                </div>

                <div className="panel rounded-2xl p-5">
                  <Eyebrow>Key actors · by centrality</Eyebrow>
                  <div className="mt-3 space-y-2.5">
                    {topActors.map((n) => (
                      <button key={n.id} onClick={() => setSel(n.id)} className="w-full text-left">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: KIND_STYLE[n.kind].color }} />
                            <span className="truncate font-mono text-[12px] text-text">{n.label}</span>
                          </span>
                          <span className="tabular text-[11px] text-text-faint">{n.centrality.toFixed(2)}</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-600">
                          <div className="h-full rounded-full" style={{ width: `${n.centrality * 100}%`, background: KIND_STYLE[n.kind].color }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>

      {/* Dossier drawer */}
      {dossierOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setDossierOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 h-full w-full max-w-[560px] overflow-y-auto border-l border-line-strong bg-ink-900 p-7 shadow-2xl animate-rise"
            onClick={(e) => e.stopPropagation()}
          >
            <DossierView dossier={dossier} onClose={() => setDossierOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function MetricChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      <span className="text-[11px] text-text-faint">{label}</span>
      <span className="tabular text-[12px] font-medium text-text">{value}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-ink-800 px-3 py-2">
      <div className="tabular text-[15px] font-semibold capitalize text-text">{value}</div>
      <div className="text-[11px] text-text-faint">{label}</div>
    </div>
  );
}

function DossierView({ dossier, onClose }: { dossier: ReturnType<typeof buildDossier>; onClose: () => void }) {
  return (
    <div>
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-beacon">
            <BoltIcon size={16} />
            <span className="eyebrow" style={{ color: "var(--color-beacon)" }}>Intelligence package · confidential</span>
          </div>
          <h2 className="mt-2 font-display text-xl font-semibold text-text">{dossier.campaign.name}</h2>
          <div className="mt-1 font-mono text-[12px] text-text-faint">Ref {dossier.ref} · generated {dossier.generated}</div>
        </div>
        <button onClick={onClose} className="rounded-lg border border-line bg-ink-700 px-3 py-1.5 text-[12px] text-text-muted hover:text-text">Close</button>
      </div>

      <Section title="Executive summary">
        <p className="text-[13px] leading-relaxed text-text-muted">{dossier.summary}</p>
      </Section>

      <Section title="Network composition">
        <div className="grid grid-cols-3 gap-2">
          {dossier.counts.map((c) => (
            <div key={c.kind} className="rounded-lg border border-line bg-ink-800 px-3 py-2">
              <div className="tabular text-lg font-semibold text-text">{c.n}</div>
              <div className="text-[11px] capitalize text-text-faint">{c.kind}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Money trail">
        <ol className="space-y-2">
          {dossier.moneyTrail.map((m, i) => (
            <li key={i} className="flex gap-3 text-[13px] text-text-muted">
              <span className="tabular text-beacon">{i + 1}.</span>
              <span>{m}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Key actors">
        <div className="space-y-2">
          {dossier.keyActors.map((a) => (
            <div key={a.label} className="rounded-lg border border-line bg-ink-800 p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12.5px] text-text">{a.label}</span>
                <span className="rounded bg-ink-600 px-1.5 py-0.5 text-[10px] capitalize text-text-muted">{a.kind}</span>
              </div>
              <p className="mt-1 text-[12px] leading-snug text-text-faint">{a.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Applicable statutes">
        <div className="space-y-1.5">
          {dossier.statutes.map((s) => (
            <div key={s.code} className="flex items-baseline gap-3 text-[12.5px]">
              <span className="shrink-0 font-mono text-beacon">{s.code}</span>
              <span className="text-text-muted">{s.title}</span>
            </div>
          ))}
        </div>
      </Section>

      <div className="mt-5 rounded-xl border border-line bg-ink-800 p-4">
        <div className="flex items-center justify-between">
          <span className="eyebrow">Chain of custody</span>
          <span className="rounded bg-safe/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-safe">Tamper-evident</span>
        </div>
        <p className="mt-2 text-[12px] text-text-muted">Every source event is content-addressed and append-only. Integrity digest:</p>
        <code className="mt-2 block break-all rounded-lg bg-ink-900 px-3 py-2 font-mono text-[11px] text-beacon">sha256:{dossier.integrityHash}…</code>
      </div>

      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-line-strong bg-ink-700 py-3 text-[13px] font-medium text-text transition-colors hover:bg-ink-600">
        <DocIcon size={15} /> Export signed PDF for FIR / NCRB submission
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="eyebrow mb-2">{title}</div>
      {children}
    </div>
  );
}

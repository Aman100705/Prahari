import type { Campaign, GraphEdge, GraphNode } from "./types";
import { fmtINR } from "./data";

export interface Dossier {
  ref: string;
  generated: string;
  campaign: Campaign;
  summary: string;
  counts: { kind: string; n: number }[];
  exposure: number;
  keyActors: { label: string; kind: string; centrality: number; note: string }[];
  moneyTrail: string[];
  statutes: { code: string; title: string }[];
  integrityHash: string;
}

// Deterministic pseudo-hash for chain-of-custody display (not cryptographic — demo).
function fauxHash(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const hex = (n: number) => (n >>> 0).toString(16).padStart(8, "0");
  return `${hex(h)}${hex(Math.imul(h, 2654435761))}${hex(Math.imul(h ^ 0x9e3779b9, 40503))}`.slice(0, 40);
}

export function buildDossier(campaign: Campaign, nodes: GraphNode[], edges: GraphEdge[]): Dossier {
  const byKind = new Map<string, number>();
  for (const n of nodes) byKind.set(n.kind, (byKind.get(n.kind) ?? 0) + 1);
  const counts = [...byKind.entries()].map(([kind, n]) => ({ kind, n }));

  const exposure = nodes.filter((n) => n.kind === "victim").reduce((s, n) => s + (n.amount ?? 0), 0);

  const keyActors = [...nodes]
    .filter((n) => n.kind !== "victim")
    .sort((a, b) => b.centrality - a.centrality)
    .slice(0, 4)
    .map((n) => ({
      label: n.label,
      kind: n.kind,
      centrality: n.centrality,
      note:
        n.kind === "compound"
          ? "Command node — controls handler cell and receives crypto off-ramp settlement."
          : n.kind === "handler"
          ? "Voice operator persona running the digital-arrest script across multiple lines."
          : n.kind === "mule"
          ? "High-throughput mule account — rapid funnel to crypto off-ramp."
          : n.kind === "wallet"
          ? "USDT off-ramp consolidating mule inflows for cross-border settlement."
          : "Spoofed calling line used for victim contact.",
    }));

  const muleTotal = nodes.filter((n) => n.kind === "mule").reduce((s, n) => s + (n.amount ?? 0), 0);

  const moneyTrail = [
    `${counts.find((c) => c.kind === "victim")?.n ?? 0} victims → ${counts.find((c) => c.kind === "mule")?.n ?? 0} mule accounts (${fmtINR(exposure)} traced inflow)`,
    `Mule layer → ${counts.find((c) => c.kind === "wallet")?.n ?? 0} crypto off-ramps (~${fmtINR(muleTotal)} consolidated)`,
    `Off-ramp → command compound (cross-border settlement, USDT)`,
  ];

  const statutes = [
    { code: "BNS §318 / §319", title: "Cheating and personation by fraud" },
    { code: "IT Act §66C / §66D", title: "Identity theft & cheating by personation using computer resource" },
    { code: "BNS §111", title: "Organised crime (syndicate operation)" },
    { code: "PMLA §3", title: "Money laundering — layering via mule & crypto off-ramp" },
  ];

  return {
    ref: `PRH/${campaign.id}/${campaign.detected.replace(/-/g, "")}`,
    generated: campaign.detected,
    campaign,
    summary: `${campaign.name} is an active ${campaign.modus.split("·")[0].trim()} operation linking ${nodes.length} entities across ${campaign.states.length} states. Prahari fused ${counts.find((c) => c.kind === "victim")?.n ?? 0} independent victim complaints into a single network via shared calling infrastructure, device fingerprints and mule-account convergence, with ${Math.round(campaign.confidence * 100)}% linkage confidence.`,
    counts,
    exposure,
    keyActors,
    moneyTrail,
    statutes,
    integrityHash: fauxHash(campaign.id + campaign.detected + nodes.length),
  };
}

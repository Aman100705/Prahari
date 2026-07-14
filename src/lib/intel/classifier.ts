import type { RiskBand, ScriptLine, ScriptMarker } from "./types";
import { scoreToBand } from "./risk";

export interface TriageResult {
  score: number;
  band: RiskBand;
  markers: ScriptMarker[];
  verdict: string;
  actions: RecommendedAction[];
}

export interface RecommendedAction {
  id: string;
  label: string;
  detail: string;
  channel: "victim" | "telecom" | "bank" | "police";
  urgency: "now" | "soon" | "advisory";
}

// The signature phrase-bank of the digital-arrest playbook. Each pattern maps to
// a weighted marker. This is the deterministic core; a Claude pass can refine it
// server-side, but the demo runs fully offline on these rules.
const PATTERNS: { rx: RegExp; marker: ScriptMarker }[] = [
  { rx: /\b(cbi|e\.?d\.?|enforcement directorate|customs|trai|narcotics|ncb|police|cyber cell)\b/i, marker: { id: "auth-impersonation", label: "Authority impersonation", weight: 0.22, rationale: "Claims to represent an agency — agencies never open contact over WhatsApp/phone." } },
  { rx: /digital arrest/i, marker: { id: "digital-arrest", label: "'Digital arrest' phrase", weight: 0.42, rationale: "No such legal concept exists in India — near-certain fraud." } },
  { rx: /\b(aadhaar|kyc|sim.*(block|misuse))\b/i, marker: { id: "aadhaar-hook", label: "Aadhaar / KYC hook", weight: 0.1, rationale: "Aadhaar-in-crime framing is a signature opener." } },
  { rx: /\b(parcel|courier|fedex|customs seized|drugs|mdma|narcotic)\b/i, marker: { id: "parcel-pretext", label: "Parcel / narcotics pretext", weight: 0.14, rationale: "Courier-drugs pretext is the dominant 2025-26 escalation vector." } },
  { rx: /\b(non.?bailable|arrest warrant|jail|imprison|criminal case)\b/i, marker: { id: "fear-nonbailable", label: "Legal fear induction", weight: 0.12, rationale: "Fear language engineered to shut down rational decision-making." } },
  { rx: /\b(do not (disconnect|hang ?up|tell|contact)|stay on|keep.*camera|don't inform)\b/i, marker: { id: "isolation", label: "Isolation / no-hangup coercion", weight: 0.18, rationale: "Continuous-call + no third-party contact is textbook hostage control." } },
  { rx: /\b(transfer|deposit|pay|send).*(verif|security|audit|clear|rbi|refund)/i, marker: { id: "verification-transfer", label: "'Verify by transferring funds'", weight: 0.38, rationale: "The core monetisation step — no such verification account exists." } },
  { rx: /\b(refund|return your money|get it back|within \d+ ?(hour|hr))\b/i, marker: { id: "refund-promise", label: "Refund-after-audit promise", weight: 0.1, rationale: "False reassurance to secure the first transfer." } },
  { rx: /\b(urgent|immediately|30 minutes|right now|last warning)\b/i, marker: { id: "urgency", label: "Manufactured urgency", weight: 0.08, rationale: "Time pressure to prevent the victim from verifying independently." } },
];

/** Accumulate score with diminishing returns so one strong marker can't max it alone. */
function combine(weights: number[]): number {
  // Noisy-OR style: 1 - Π(1 - w)
  return 1 - weights.reduce((acc, w) => acc * (1 - Math.min(0.95, Math.max(0, w))), 1);
}

export function analyzeMarkers(markers: ScriptMarker[]): TriageResult {
  const dedup = new Map<string, ScriptMarker>();
  for (const m of markers) if (!dedup.has(m.id)) dedup.set(m.id, m);
  const list = [...dedup.values()].sort((a, b) => b.weight - a.weight);
  const score = combine(list.map((m) => m.weight));
  const band = scoreToBand(score);
  return { score, band, markers: list, verdict: verdictFor(band, list.length), actions: actionsFor(band) };
}

export function analyzeText(text: string): TriageResult {
  const fired: ScriptMarker[] = [];
  for (const p of PATTERNS) if (p.rx.test(text)) fired.push(p.marker);
  return analyzeMarkers(fired);
}

export function analyzeTranscript(lines: ScriptLine[]): TriageResult {
  const markers = lines.flatMap((l) => l.markers ?? []);
  return analyzeMarkers(markers);
}

function verdictFor(band: RiskBand, n: number): string {
  switch (band) {
    case "critical":
      return `Active digital-arrest fraud in progress — ${n} independent indicators. This is not a real investigation. Do not transfer any money.`;
    case "high":
      return `Strong fraud pattern detected (${n} indicators). Treat as a scam and verify through official channels only.`;
    case "elevated":
      return `Multiple suspicious indicators (${n}). Proceed with caution and do not share OTPs or transfer funds.`;
    case "guarded":
      return `Some indicators present. Stay alert — legitimate agencies never demand money or secrecy.`;
    default:
      return `No strong fraud indicators detected in this message.`;
  }
}

function actionsFor(band: RiskBand): RecommendedAction[] {
  const base: RecommendedAction[] = [
    { id: "hangup", label: "Disconnect & do not pay", detail: "No Indian agency conducts 'digital arrests' or demands transfers.", channel: "victim", urgency: "now" },
    { id: "report1930", label: "Auto-file to 1930 / NCRB", detail: "Pre-filled complaint with call metadata attached.", channel: "police", urgency: "now" },
    { id: "telco", label: "Flag number to telecom + DoT", detail: "Spoofed CLI pushed to operator for real-time block.", channel: "telecom", urgency: "now" },
    { id: "bank", label: "Freeze suspected mule account", detail: "Beneficiary VPA/account escalated to bank fraud desk.", channel: "bank", urgency: "soon" },
    { id: "family", label: "Alert a trusted contact", detail: "Breaks the isolation the scammer depends on.", channel: "victim", urgency: "soon" },
  ];
  if (band === "critical" || band === "high") return base;
  if (band === "elevated") return base.filter((a) => a.urgency !== "soon" || a.id === "family");
  return [{ id: "watch", label: "Stay alert", detail: "Never share OTPs or transfer money to 'verify' anything.", channel: "victim", urgency: "advisory" }];
}

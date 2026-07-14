// Prahari — core domain model for the fraud-intelligence layer.

export type RiskBand = "safe" | "low" | "guarded" | "elevated" | "high" | "critical";

export type EntityKind =
  | "victim"
  | "number" // spoofed / VoIP calling line
  | "mule" // mule bank / UPI account
  | "handler" // human operator persona
  | "compound" // organised fraud compound / operation
  | "wallet"; // crypto off-ramp

export interface GraphNode {
  id: string;
  kind: EntityKind;
  label: string;
  sub?: string;
  /** 0..1 model confidence that this node is part of an active fraud ring */
  score: number;
  /** normalised betweenness/centrality within the campaign */
  centrality: number;
  city?: string;
  amount?: number; // ₹ exposure linked to this node
  firstSeen: string;
  lastSeen: string;
  cluster: string; // campaign id
  flags?: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
  kind: "calls" | "transfers" | "uses" | "controls" | "cashout" | "linked";
  weight: number;
  amount?: number;
  ts?: string;
}

export interface Campaign {
  id: string;
  name: string;
  modus: string;
  band: RiskBand;
  states: string[];
  victims: number;
  exposure: number; // ₹
  detected: string;
  confidence: number;
  status: "active" | "contained" | "monitoring";
}

export interface City {
  name: string;
  state: string;
  x: number; // 0..100 on the stylised India canvas
  y: number; // 0..100
  role: "source" | "target" | "cashout";
  intensity: number; // 0..1 hotspot weight
  cases: number;
}

export interface ScamSession {
  id: string;
  channel: "whatsapp" | "voip" | "sms" | "upi";
  band: RiskBand;
  victimCity: string;
  ageGroup: string;
  claimedAuthority: string;
  amountAtRisk: number;
  elapsed: string; // mm:ss on-call
  interceptedAt: string;
}

export interface ScriptLine {
  role: "caller" | "victim";
  text: string;
  /** pattern ids that fired on this line */
  markers?: ScriptMarker[];
}

export interface ScriptMarker {
  id: string;
  label: string;
  weight: number; // contribution to risk 0..1
  rationale: string;
}

export interface CounterfeitFeature {
  id: string;
  name: string;
  region: string; // where on the note
  expected: string;
  observed: string;
  status: "pass" | "fail" | "warn";
  weight: number;
}

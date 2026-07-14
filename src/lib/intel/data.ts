import type {
  Campaign,
  City,
  CounterfeitFeature,
  GraphEdge,
  GraphNode,
  ScamSession,
  ScriptLine,
} from "./types";

// Deterministic PRNG so the "live" data is stable across reloads and demos.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic Indian-system digit grouping (SSR-safe, no locale dependency). */
export const groupIN = (n: number): string => {
  const s = String(Math.round(n));
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;
};

export const fmtINR = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  if (n >= 1e3) return `₹${(n / 1e3).toFixed(0)}K`;
  return `₹${n}`;
};

// ————————————————————————————————————————————————————————————————
// Campaigns — organised fraud operations under active tracking
// ————————————————————————————————————————————————————————————————
export const campaigns: Campaign[] = [
  {
    id: "CHAKRAVYUH",
    name: "Op. Chakravyuh",
    modus: "Digital-arrest · fake CBI/ED/Customs · multi-day video hostage",
    band: "critical",
    states: ["Delhi", "Maharashtra", "Karnataka", "Telangana"],
    victims: 214,
    exposure: 486_00_000,
    detected: "2026-07-09",
    confidence: 0.94,
    status: "active",
  },
  {
    id: "HAWALA9",
    name: "Op. Hawala-9",
    modus: "Fake stock-tip groups · APK loaders · UPI mule cash-out",
    band: "high",
    states: ["Gujarat", "Rajasthan", "Maharashtra"],
    victims: 878,
    exposure: 132_00_000,
    detected: "2026-06-27",
    confidence: 0.88,
    status: "active",
  },
  {
    id: "GARUDA",
    name: "Op. Garuda",
    modus: "High-grade ₹500 FICN circulation via cash-heavy markets",
    band: "elevated",
    states: ["West Bengal", "Bihar", "Uttar Pradesh"],
    victims: 0,
    exposure: 27_40_000,
    detected: "2026-07-02",
    confidence: 0.81,
    status: "monitoring",
  },
  {
    id: "COURIER7",
    name: "Op. Courier-7",
    modus: "FedEx/'parcel-with-drugs' pretext · escalates to digital arrest",
    band: "high",
    states: ["Karnataka", "Tamil Nadu", "Delhi"],
    victims: 341,
    exposure: 71_00_000,
    detected: "2026-07-11",
    confidence: 0.9,
    status: "active",
  },
];

// ————————————————————————————————————————————————————————————————
// Geography — real Indian cyber-fraud hotspots on a stylised canvas
// ————————————————————————————————————————————————————————————————
export const cities: City[] = [
  { name: "Jamtara", state: "Jharkhand", x: 66, y: 44, role: "source", intensity: 0.98, cases: 1240 },
  { name: "Nuh (Mewat)", state: "Haryana", x: 46, y: 30, role: "source", intensity: 0.95, cases: 1103 },
  { name: "Bharatpur", state: "Rajasthan", x: 44, y: 33, role: "source", intensity: 0.9, cases: 964 },
  { name: "Deoghar", state: "Jharkhand", x: 67, y: 43, role: "source", intensity: 0.72, cases: 512 },
  { name: "Delhi", state: "Delhi", x: 47, y: 29, role: "target", intensity: 0.86, cases: 2210 },
  { name: "Mumbai", state: "Maharashtra", x: 33, y: 58, role: "target", intensity: 0.9, cases: 2870 },
  { name: "Bengaluru", state: "Karnataka", x: 44, y: 74, role: "target", intensity: 0.83, cases: 2410 },
  { name: "Hyderabad", state: "Telangana", x: 48, y: 62, role: "target", intensity: 0.7, cases: 1620 },
  { name: "Chennai", state: "Tamil Nadu", x: 52, y: 78, role: "target", intensity: 0.64, cases: 1180 },
  { name: "Pune", state: "Maharashtra", x: 36, y: 60, role: "target", intensity: 0.6, cases: 990 },
  { name: "Ahmedabad", state: "Gujarat", x: 33, y: 44, role: "target", intensity: 0.58, cases: 870 },
  { name: "Kolkata", state: "West Bengal", x: 70, y: 47, role: "cashout", intensity: 0.66, cases: 760 },
  { name: "Malda", state: "West Bengal", x: 70, y: 43, role: "cashout", intensity: 0.7, cases: 540 },
];

// ————————————————————————————————————————————————————————————————
// Live scam sessions — what Prahari Shield is intercepting right now
// ————————————————————————————————————————————————————————————————
export const liveSessions: ScamSession[] = [
  { id: "S-4471", channel: "whatsapp", band: "critical", victimCity: "Bengaluru", ageGroup: "68 · retired", claimedAuthority: "CBI Cyber Cell", amountAtRisk: 4_20_000, elapsed: "41:12", interceptedAt: "before transfer" },
  { id: "S-4470", channel: "voip", band: "high", victimCity: "Pune", ageGroup: "54 · teacher", claimedAuthority: "TRAI / Customs", amountAtRisk: 2_75_000, elapsed: "22:40", interceptedAt: "before transfer" },
  { id: "S-4468", channel: "whatsapp", band: "critical", victimCity: "Delhi", ageGroup: "71 · retired", claimedAuthority: "ED — Money Laundering", amountAtRisk: 11_00_000, elapsed: "1:12:05", interceptedAt: "1st transfer blocked" },
  { id: "S-4465", channel: "sms", band: "elevated", victimCity: "Chennai", ageGroup: "33 · IT", claimedAuthority: "Courier / FedEx", amountAtRisk: 88_000, elapsed: "06:18", interceptedAt: "pre-contact" },
  { id: "S-4463", channel: "upi", band: "high", victimCity: "Mumbai", ageGroup: "45 · trader", claimedAuthority: "Fake trading desk", amountAtRisk: 6_50_000, elapsed: "18:02", interceptedAt: "before transfer" },
];

// ————————————————————————————————————————————————————————————————
// The hero transcript — a real digital-arrest script, line by line,
// with the linguistic markers Prahari's classifier fires on.
// ————————————————————————————————————————————————————————————————
export const heroTranscript: ScriptLine[] = [
  { role: "caller", text: "Namaste. This is Inspector Rajeev Ranjan, CBI Cyber Crime Division, Delhi. Your Aadhaar number has been linked to a money-laundering case." , markers: [
    { id: "auth-impersonation", label: "Authority impersonation", weight: 0.22, rationale: "Claims to be CBI — agencies never place first contact by WhatsApp call." },
    { id: "aadhaar-hook", label: "Aadhaar / KYC hook", weight: 0.1, rationale: "Aadhaar-in-crime framing is a signature opener." },
  ]},
  { role: "victim", text: "What? I have not done anything like that." },
  { role: "caller", text: "A parcel in your name was seized at Mumbai airport containing illegal passports and 4 kg MDMA. This is a non-bailable offence.", markers: [
    { id: "parcel-pretext", label: "Parcel / narcotics pretext", weight: 0.14, rationale: "Courier-drugs pretext is the dominant escalation vector in 2025-26 cases." },
    { id: "fear-nonbailable", label: "Legal fear induction", weight: 0.12, rationale: "'Non-bailable' language engineered to spike fear and shut down reasoning." },
  ]},
  { role: "caller", text: "You are now under digital arrest. Do NOT disconnect this video call and do not contact anyone, or we will send a physical arrest team within 30 minutes.", markers: [
    { id: "digital-arrest", label: "'Digital arrest' phrase", weight: 0.42, rationale: "No such legal concept exists in India — a near-certain fraud indicator." },
    { id: "isolation", label: "Isolation / no-hangup coercion", weight: 0.18, rationale: "Demanding continuous video + no third-party contact is textbook hostage control." },
  ]},
  { role: "victim", text: "Please, I have a family, what should I do?" },
  { role: "caller", text: "To prove your innocence you must transfer your funds to this RBI 'verification account' for a security audit. It will be refunded in 2 hours.", markers: [
    { id: "verification-transfer", label: "'Verify by transferring funds'", weight: 0.38, rationale: "RBI/‘verification account’ never exists — the core monetisation step." },
    { id: "refund-promise", label: "Refund-after-audit promise", weight: 0.12, rationale: "False reassurance to secure the first transfer." },
  ]},
];

// ————————————————————————————————————————————————————————————————
// Counterfeit ₹500 — the CV feature checklist for a flagged note
// ————————————————————————————————————————————————————————————————
export const counterfeitFeatures: CounterfeitFeature[] = [
  { id: "sec-thread", name: "Windowed security thread", region: "Centre-left", expected: "Colour-shift green→blue, 'भारत RBI' micro-text", observed: "Static print, no colour shift", status: "fail", weight: 0.26 },
  { id: "intaglio", name: "Intaglio raised print", region: "Gandhi portrait", expected: "Tactile ridged ink profile", observed: "Flat offset print", status: "fail", weight: 0.2 },
  { id: "watermark", name: "Multi-tonal watermark", region: "Vertical band", expected: "Gandhi + electrotype 500", observed: "Simulated shadow, no tonal depth", status: "fail", weight: 0.18 },
  { id: "microtext", name: "Micro-lettering", region: "Near portrait", expected: "'RBI' + '500' legible @10x", observed: "Blurred at 10x", status: "warn", weight: 0.12 },
  { id: "latent", name: "Latent image", region: "Vertical strip", expected: "'500' at 45° tilt", observed: "Absent", status: "fail", weight: 0.12 },
  { id: "serial", name: "Serial ascending font", region: "Number panel", expected: "Left→right size gradient", observed: "Uniform — cloned serial", status: "fail", weight: 0.12, },
];

// ————————————————————————————————————————————————————————————————
// The fraud network graph for Op. Chakravyuh (hero campaign).
// Deterministically generated, structured like a real ring:
// handlers → calling numbers → victims → mule accounts → cash-out wallets.
// ————————————————————————————————————————————————————————————————
interface GraphShape {
  seed: number;
  compoundLabel: string;
  handlers: number;
  numbers: number;
  victims: number;
  mules: number;
  wallets: number;
}

const SHAPES: Record<string, GraphShape> = {
  CHAKRAVYUH: { seed: 73, compoundLabel: "Compound · Myawaddy", handlers: 4, numbers: 9, victims: 14, mules: 6, wallets: 3 },
  HAWALA9: { seed: 41, compoundLabel: "Desk · Ahmedabad ring", handlers: 3, numbers: 7, victims: 12, mules: 5, wallets: 2 },
  GARUDA: { seed: 19, compoundLabel: "Print cell · Malda", handlers: 2, numbers: 5, victims: 8, mules: 4, wallets: 2 },
  COURIER7: { seed: 57, compoundLabel: "Compound · Poipet", handlers: 3, numbers: 8, victims: 12, mules: 5, wallets: 3 },
};

/**
 * Deterministic fraud-network generator for a campaign, structured like a real ring:
 * compound → handlers → spoofed numbers → victims → mule accounts → crypto off-ramps.
 */
export function buildCampaignGraph(campaignId: string): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const shape = SHAPES[campaignId] ?? SHAPES.CHAKRAVYUH;
  const cluster = campaignId;
  const rnd = mulberry32(shape.seed);
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];
  const between = (a: number, b: number) => a + rnd() * (b - a);
  const iso = (d: number) => new Date(1751500000000 - d * 86400000).toISOString().slice(0, 10);
  const targetCities = ["Bengaluru", "Delhi", "Mumbai", "Pune", "Hyderabad", "Chennai"];

  nodes.push({
    id: "CMP-1", kind: "compound", label: shape.compoundLabel, sub: `Command node · Op. ${campaignId}`,
    score: 0.97, centrality: 1, city: "—", amount: 486_00_000, firstSeen: iso(120), lastSeen: iso(0),
    cluster, flags: ["cross-border", "kingpin", "crypto off-ramp"],
  });

  for (let h = 0; h < shape.handlers; h++) {
    const id = `HND-${h + 1}`;
    nodes.push({
      id, kind: "handler", label: `Handler "${pick(["Vikram", "Sana", "Rohit", "Adil", "Neha", "Imran"])}"`,
      sub: "Voice operator persona", score: between(0.78, 0.93), centrality: between(0.55, 0.8),
      firstSeen: iso(90), lastSeen: iso(0), cluster, flags: ["voip", "script-A"],
    });
    edges.push({ source: "CMP-1", target: id, kind: "controls", weight: 0.9 });
  }

  for (let n = 0; n < shape.numbers; n++) {
    const id = `NUM-${n + 1}`;
    nodes.push({
      id, kind: "number", label: `+91 ${Math.floor(between(70, 99))}${Math.floor(between(10000000, 99999999))}`,
      sub: "VoIP / spoofed CLI", score: between(0.6, 0.9), centrality: between(0.3, 0.55),
      firstSeen: iso(between(10, 60)), lastSeen: iso(0), cluster, flags: ["spoofed"],
    });
    edges.push({ source: `HND-${(n % shape.handlers) + 1}`, target: id, kind: "uses", weight: 0.7 });
  }

  for (let v = 0; v < shape.victims; v++) {
    const id = `VIC-${v + 1}`;
    const amt = Math.round(between(0.4, 12) * 1_00_000);
    nodes.push({
      id, kind: "victim", label: `Victim ${id.slice(4)}`, sub: pick(targetCities),
      score: 0.2, centrality: between(0.05, 0.2), city: pick(targetCities), amount: amt,
      firstSeen: iso(between(1, 25)), lastSeen: iso(0), cluster,
    });
    edges.push({ source: `NUM-${(v % shape.numbers) + 1}`, target: id, kind: "calls", weight: 0.5, amount: amt });
  }

  for (let m = 0; m < shape.mules; m++) {
    const id = `MUL-${m + 1}`;
    nodes.push({
      id, kind: "mule", label: `Mule A/C ••${Math.floor(between(1000, 9999))}`,
      sub: pick(["Kotak", "PNB", "Paytm PB", "HDFC", "IDFC"]), score: between(0.7, 0.92),
      centrality: between(0.4, 0.62), firstSeen: iso(between(5, 40)), lastSeen: iso(0),
      cluster, amount: Math.round(between(8, 60) * 1_00_000), flags: ["rapid-funnel"],
    });
  }
  for (let v = 0; v < shape.victims; v++) {
    const amt = nodes.find((n) => n.id === `VIC-${v + 1}`)!.amount!;
    edges.push({ source: `VIC-${v + 1}`, target: `MUL-${(v % shape.mules) + 1}`, kind: "transfers", weight: 0.8, amount: amt });
  }

  for (let w = 0; w < shape.wallets; w++) {
    const id = `WAL-${w + 1}`;
    nodes.push({
      id, kind: "wallet", label: `USDT ${["TRC20", "BEP20", "ERC20"][w % 3]} ••${Math.floor(between(100, 999))}`,
      sub: "Crypto off-ramp", score: between(0.82, 0.95), centrality: between(0.5, 0.7),
      firstSeen: iso(between(3, 30)), lastSeen: iso(0), cluster, flags: ["off-ramp"],
    });
    edges.push({ source: id, target: "CMP-1", kind: "cashout", weight: 0.85 });
  }
  for (let m = 0; m < shape.mules; m++) {
    edges.push({ source: `MUL-${m + 1}`, target: `WAL-${(m % shape.wallets) + 1}`, kind: "cashout", weight: 0.75 });
  }

  return { nodes, edges };
}

/** Hero network — Op. Chakravyuh. */
export function buildChakravyuhGraph() {
  return buildCampaignGraph("CHAKRAVYUH");
}

// ————————————————————————————————————————————————————————————————
// Top-line intelligence for the command header / landing stats
// ————————————————————————————————————————————————————————————————
export const topline = {
  activeSessions: 1287,
  interceptedToday: 342,
  fundsProtectedToday: 9_84_00_000,
  campaignsTracked: 47,
  avgSignalToDispatch: "3m 40s",
  falsePositiveRate: 0.006,
  languages: 12,
  agenciesLinked: 19,
};

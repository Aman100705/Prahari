import Link from "next/link";
import { Wordmark } from "@/components/brand/Logo";
import { RadarHero } from "@/components/landing/RadarHero";
import { Eyebrow, LiveDot } from "@/components/ui/primitives";
import { ShieldIcon, GraphIcon, MapIcon, ArrowIcon, BoltIcon } from "@/components/ui/icons";
import { topline, fmtINR } from "@/lib/intel/data";

const SURFACES = [
  {
    href: "/shield",
    step: "01",
    name: "Shield",
    tag: "For citizens · banks",
    Icon: ShieldIcon,
    accent: "var(--color-safe)",
    headline: "Stops the scam at the point of contact.",
    body: "A multilingual assistant that reads a live call or message, recognises the digital-arrest script as it unfolds, and delivers a verdict before a single rupee moves.",
  },
  {
    href: "/graph",
    step: "02",
    name: "Graph",
    tag: "For cyber police",
    Icon: GraphIcon,
    accent: "var(--color-signal)",
    headline: "Turns one report into the whole network.",
    body: "Every intercepted number, mule account and device fingerprint fuses into a live fraud-network graph — clustering scattered complaints into a single, court-admissible campaign.",
  },
  {
    href: "/command",
    step: "03",
    name: "Command",
    tag: "For agencies · MHA",
    Icon: MapIcon,
    accent: "var(--color-beacon)",
    headline: "Directs the response across the country.",
    body: "A geospatial war-room that maps live sessions, counterfeit seizures and hotspots — then prioritises where to deploy for maximum disruption, in near real time.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      {/* ambient grid */}
      <div className="pointer-events-none absolute inset-0 bp-grid vignette opacity-[0.5]" />
      <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-30 blur-[120px]" style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--color-beacon) 40%, transparent), transparent 70%)" }} />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Wordmark size={30} />
        <nav className="hidden items-center gap-8 text-[13px] text-text-muted md:flex">
          <a href="#gap" className="transition-colors hover:text-text">The gap</a>
          <a href="#surfaces" className="transition-colors hover:text-text">Platform</a>
          <a href="#impact" className="transition-colors hover:text-text">Impact</a>
          <a href="#stack" className="transition-colors hover:text-text">Technology</a>
        </nav>
        <Link
          href="/command"
          className="group flex items-center gap-1.5 rounded-lg border border-line-strong bg-ink-700 px-3.5 py-2 text-[13px] font-medium text-text transition-colors hover:border-beacon/50"
        >
          Enter console
          <ArrowIcon size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:pt-16">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-ink-800/60 px-3 py-1.5">
            <LiveDot label="Live" color="var(--color-critical)" />
            <span className="text-[12px] text-text-muted">
              ₹1,776 Cr lost to digital-arrest scams in 9 months — MHA, 2024
            </span>
          </div>

          <h1 className="font-display text-[clamp(2.4rem,5.5vw,4rem)] font-semibold leading-[1.04] tracking-tight text-text">
            The intelligence layer
            <br />
            between citizens and
            <br />
            <span className="relative text-beacon text-glow">organised digital fraud.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-text-muted md:text-base">
            India files 1.14M cybercrime complaints a year — and acts on them one victim at a time,
            after the money is gone. <span className="text-text">Prahari</span> fuses scam-call intelligence,
            fraud-network graphs and counterfeit detection into one real-time shield — shifting from
            reactive investigation to <span className="text-text">predictive neutralisation</span>.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/shield"
              className="group flex items-center gap-2 rounded-xl bg-beacon px-5 py-3 text-[14px] font-semibold text-ink-900 transition-all hover:bg-beacon-bright glow-beacon"
            >
              <BoltIcon size={16} />
              See a live interception
              <ArrowIcon size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/graph"
              className="flex items-center gap-2 rounded-xl border border-line-strong bg-ink-700/60 px-5 py-3 text-[14px] font-medium text-text transition-colors hover:border-line-strong hover:bg-ink-600"
            >
              Explore the fraud graph
            </Link>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
            <HeroStat value={topline.avgSignalToDispatch} label="Signal → dispatch" />
            <HeroStat value={`${(topline.falsePositiveRate * 100).toFixed(1)}%`} label="False-positive rate" />
            <HeroStat value={`${topline.languages}`} label="Indian languages" />
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <RadarHero />
        </div>
      </section>

      {/* The gap */}
      <section id="gap" className="relative z-10 border-y border-line bg-ink-900/40">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Eyebrow>The gap every problem statement names</Eyebrow>
          <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-tight text-text">
              &ldquo;The data exists. The intelligence layer to act on it does&nbsp;not.&rdquo;
            </h2>
            <div className="space-y-5 text-[15px] leading-relaxed text-text-muted">
              <p>
                Fraud is no longer opportunistic — it is <span className="text-text">industrialised</span>,
                run from cross-border compounds with spoofed numbers, AI voices and mule-account
                pipelines. Yet detection still happens at the <span className="text-text">point of complaint</span>,
                jurisdiction by jurisdiction, long after mass victimisation.
              </p>
              <p>
                The missing capability is convergence: financial-transaction intelligence,
                communication-network analysis, physical counterfeit detection and real-time
                coordination — fused into one picture. That is exactly the multi-source problem
                where AI is transformative, and exactly what Prahari is.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["Point-of-contact detection", "Cross-jurisdiction linking", "Court-admissible evidence", "Sub-1% false positives"].map((t) => (
                  <span key={t} className="rounded-full border border-line bg-ink-800 px-3 py-1.5 text-[12px] text-text-muted">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Surfaces */}
      <section id="surfaces" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="mb-3 flex items-center gap-3">
          <Eyebrow>One thread, three surfaces</Eyebrow>
          <div className="h-px flex-1 bg-line" />
        </div>
        <p className="mb-12 max-w-2xl font-display text-[clamp(1.4rem,2.6vw,2rem)] font-semibold leading-snug text-text">
          A single fraud campaign flows through Prahari from the victim&rsquo;s phone to the
          national command centre — <span className="text-beacon">signal to neutralisation in minutes</span>.
        </p>

        <div className="grid gap-5 lg:grid-cols-3">
          {SURFACES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-ink-700 to-ink-800 p-6 transition-all hover:border-line-strong hover:shadow-2xl"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity group-hover:opacity-100" style={{ background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)` }} />
              <div className="mb-5 flex items-center justify-between">
                <span
                  className="grid h-11 w-11 place-items-center rounded-xl border"
                  style={{ color: s.accent, borderColor: `color-mix(in oklab, ${s.accent} 35%, transparent)`, background: `color-mix(in oklab, ${s.accent} 10%, transparent)` }}
                >
                  <s.Icon size={22} />
                </span>
                <span className="tabular text-[13px] text-text-ghost">{s.step}</span>
              </div>
              <div className="mb-1 flex items-baseline gap-2">
                <h3 className="font-display text-lg font-semibold text-text">Prahari {s.name}</h3>
              </div>
              <div className="mb-4 text-[11px] uppercase tracking-wider" style={{ color: s.accent }}>{s.tag}</div>
              <p className="mb-3 text-[15px] font-medium text-text">{s.headline}</p>
              <p className="text-[13px] leading-relaxed text-text-muted">{s.body}</p>
              <div className="mt-5 flex items-center gap-1.5 text-[13px] font-medium transition-colors" style={{ color: s.accent }}>
                Open surface <ArrowIcon size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="relative z-10 border-y border-line bg-ink-900/40">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Eyebrow>Modelled impact at national scale</Eyebrow>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <BigStat value={fmtINR(topline.fundsProtectedToday)} label="Funds protected — today" sub="across intercepted sessions" accent="var(--color-beacon)" />
            <BigStat value={topline.interceptedToday.toString()} label="Live interceptions — today" sub="before any transfer" accent="var(--color-safe)" />
            <BigStat value={topline.campaignsTracked.toString()} label="Campaigns under tracking" sub="fused from scattered reports" accent="var(--color-signal)" />
            <BigStat value={`${topline.agenciesLinked}`} label="Agencies interoperating" sub="one shared intelligence fabric" accent="var(--color-violet)" />
          </div>
        </div>
      </section>

      {/* Tech */}
      <section id="stack" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow>Built like production, not a prototype</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold leading-tight text-text">
              A multi-agent core, wrapped in an interface fit for a national SOC.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-text-muted">
              Six specialised agents — triage, graph, geospatial, counterfeit, compliance and
              orchestration — reason together over a shared knowledge graph, every automated action
              fully audited for legal admissibility.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              "Next.js 16", "React 19", "TypeScript", "FastAPI", "Claude agents", "Knowledge Graph",
              "Graph AI", "Speech / NLP", "Computer Vision", "Neo4j", "Vector RAG", "OpenTelemetry",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2 rounded-lg border border-line bg-ink-800 px-3 py-2.5 text-[12px] text-text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-beacon/60" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-line-strong bg-gradient-to-br from-ink-600 to-ink-800 p-10 text-center md:p-16">
          <div className="pointer-events-none absolute inset-0 bp-grid-fine opacity-40" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full opacity-40 blur-[80px]" style={{ background: "radial-gradient(circle, var(--color-beacon), transparent 70%)" }} />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-tight text-text">
              See the scam stopped, the network mapped, the response dispatched.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/shield" className="flex items-center gap-2 rounded-xl bg-beacon px-6 py-3.5 text-[14px] font-semibold text-ink-900 transition-colors hover:bg-beacon-bright">
                Start the live demo <ArrowIcon size={15} />
              </Link>
              <Link href="/command" className="rounded-xl border border-line-strong bg-ink-700/60 px-6 py-3.5 text-[14px] font-medium text-text transition-colors hover:bg-ink-600">
                Open Command
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-[12px] text-text-faint md:flex-row">
          <Wordmark size={22} />
          <p>ET AI Hackathon 2026 · Problem Statement 6 — Digital Public Safety</p>
          <p>Prahari · प्रहरी — the sentinel</p>
        </div>
      </footer>
    </div>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="tabular text-xl font-semibold text-text">{value}</div>
      <div className="mt-1 text-[12px] text-text-faint">{label}</div>
    </div>
  );
}

function BigStat({ value, label, sub, accent }: { value: string; label: string; sub: string; accent: string }) {
  return (
    <div className="border-l-2 pl-4" style={{ borderColor: accent }}>
      <div className="tabular text-[28px] font-semibold leading-none" style={{ color: accent }}>{value}</div>
      <div className="mt-2 text-[14px] font-medium text-text">{label}</div>
      <div className="mt-0.5 text-[12px] text-text-faint">{sub}</div>
    </div>
  );
}

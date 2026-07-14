"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { heroTranscript } from "@/lib/intel/data";
import { analyzeMarkers, analyzeText, type TriageResult } from "@/lib/intel/classifier";
import { RiskGauge } from "@/components/ui/RiskGauge";
import { Eyebrow, LiveDot, RiskPill } from "@/components/ui/primitives";
import { bandMeta } from "@/lib/intel/risk";
import { AlertIcon, BoltIcon, ShieldIcon, PulseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const LANGS = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिन्दी" },
  { id: "ta", label: "தமிழ்" },
  { id: "kn", label: "ಕನ್ನಡ" },
  { id: "bn", label: "বাংলা" },
] as const;

const SAFE_LINE: Record<string, string> = {
  en: "Do not transfer money. No Indian agency conducts ‘digital arrests’.",
  hi: "पैसे ट्रांसफ़र न करें। कोई भी एजेंसी ‘डिजिटल अरेस्ट’ नहीं करती।",
  ta: "பணத்தை அனுப்ப வேண்டாம். எந்த அமைப்பும் ‘டிஜிட்டல் அரெஸ்ட்’ செய்யாது.",
  kn: "ಹಣ ವರ್ಗಾಯಿಸಬೇಡಿ. ಯಾವುದೇ ಸಂಸ್ಥೆ ‘ಡಿಜಿಟಲ್ ಅರೆಸ್ಟ್’ ಮಾಡುವುದಿಲ್ಲ.",
  bn: "টাকা পাঠাবেন না। কোনো সংস্থা ‘ডিজিটাল অ্যারেস্ট’ করে না।",
};

const CHANNEL_COLORS: Record<string, string> = {
  victim: "var(--color-safe)",
  police: "var(--color-signal)",
  telecom: "var(--color-violet)",
  bank: "var(--color-beacon)",
};

export default function ShieldPage() {
  const [revealed, setRevealed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [lang, setLang] = useState<string>("en");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visibleLines = heroTranscript.slice(0, revealed);
  const firedMarkers = useMemo(() => visibleLines.flatMap((l) => l.markers ?? []), [revealed]); // eslint-disable-line react-hooks/exhaustive-deps
  const result: TriageResult = useMemo(() => analyzeMarkers(firedMarkers), [firedMarkers]);
  const done = revealed >= heroTranscript.length;

  const step = useCallback(() => {
    setRevealed((r) => {
      if (r >= heroTranscript.length) {
        setPlaying(false);
        return r;
      }
      return r + 1;
    });
  }, []);

  useEffect(() => {
    if (!playing) return;
    timer.current = setTimeout(step, revealed === 0 ? 400 : 1700);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [playing, revealed, step]);

  // Hands-free mode for demos / captures: /shield?autoplay=1
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("autoplay")) {
      setPlaying(true);
    }
  }, []);

  const play = () => {
    if (done) setRevealed(0);
    setPlaying(true);
  };

  return (
    <div className="relative min-h-full bp-grid-fine">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 40% at 20% 0%, color-mix(in oklab, var(--color-safe) 8%, transparent), transparent 70%)" }} />
      <div className="relative mx-auto max-w-[1400px] px-5 py-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-safe/30 bg-safe/10 text-safe"><ShieldIcon size={18} /></span>
              <Eyebrow>Citizen protection · point-of-contact</Eyebrow>
            </div>
            <h1 className="font-display text-2xl font-semibold text-text">Prahari Shield</h1>
            <p className="mt-1 max-w-xl text-[14px] text-text-muted">
              Reads a live call or message, recognises the digital-arrest playbook as it unfolds, and returns a verdict — before a single rupee moves.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-line bg-ink-800 p-1">
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className={cn("rounded-md px-2.5 py-1.5 text-[12px] transition-colors", lang === l.id ? "bg-ink-600 text-text" : "text-text-faint hover:text-text-muted")}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button
              onClick={play}
              className="flex items-center gap-2 rounded-lg bg-beacon px-4 py-2.5 text-[13px] font-semibold text-ink-900 transition-colors hover:bg-beacon-bright"
            >
              <BoltIcon size={15} />
              {done ? "Replay interception" : playing ? "Intercepting…" : "Play live interception"}
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Call console */}
          <section className="panel flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-critical/15 text-critical">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a5 5 0 0 0-5 5v4a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5Zm7 9a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.9V22h2v-2.1A9 9 0 0 0 21 11h-2Z"/></svg>
                </span>
                <div>
                  <div className="flex items-center gap-2 text-[13px] font-medium text-text">Incoming WhatsApp video · +91 98••• ••432</div>
                  <div className="text-[11px] text-text-faint">Victim: 68 · retired · Bengaluru — flagged vulnerable</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="tabular text-[12px] text-text-muted">{done ? "41:12" : playing ? "on call" : "—"}</span>
                <LiveDot label={playing ? "Recording" : "Standby"} color={playing ? "var(--color-critical)" : "var(--color-text-faint)"} />
              </div>
            </div>

            <div className="flex min-h-[440px] flex-1 flex-col gap-3 overflow-y-auto p-5">
              {revealed === 0 && (
                <div className="m-auto max-w-xs text-center">
                  <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full border border-line bg-ink-700 text-text-faint"><PulseIcon size={22} /></span>
                  <p className="text-[13px] text-text-muted">Press <span className="text-text">Play live interception</span> to watch Prahari analyse the call in real time.</p>
                </div>
              )}
              {visibleLines.map((line, i) => (
                <div key={i} className={cn("flex animate-rise", line.role === "caller" ? "justify-start" : "justify-end")}>
                  <div className={cn("max-w-[82%]", line.role === "victim" && "text-right")}>
                    <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-wider text-text-faint" style={{ justifyContent: line.role === "victim" ? "flex-end" : "flex-start" }}>
                      {line.role === "caller" ? "Caller — claims CBI" : "Citizen"}
                    </div>
                    <div
                      className={cn(
                        "rounded-2xl border px-3.5 py-2.5 text-[13.5px] leading-relaxed",
                        line.role === "caller"
                          ? "rounded-tl-sm border-critical/25 bg-critical/[0.06] text-text"
                          : "rounded-tr-sm border-line bg-ink-700 text-text-muted",
                      )}
                    >
                      {line.text}
                    </div>
                    {line.markers && line.markers.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {line.markers.map((m) => (
                          <span key={m.id} className="inline-flex items-center gap-1 rounded-md border border-critical/25 bg-critical/[0.08] px-2 py-0.5 text-[10.5px] font-medium text-critical animate-rise">
                            <AlertIcon size={11} /> {m.label} · +{Math.round(m.weight * 100)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Analysis */}
          <section className="flex flex-col gap-5">
            <div className="panel rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <Eyebrow>Live risk assessment</Eyebrow>
                  <div className="mt-2"><RiskPill band={result.band} /></div>
                </div>
                <RiskGauge score={result.score} band={result.band} size={190} />
              </div>

              {/* Verdict */}
              <div
                className="mt-4 rounded-xl border p-3.5"
                style={{
                  borderColor: `color-mix(in oklab, ${bandMeta[result.band].color} 30%, transparent)`,
                  background: `color-mix(in oklab, ${bandMeta[result.band].color} 8%, transparent)`,
                }}
              >
                <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: bandMeta[result.band].color }}>
                  <AlertIcon size={14} /> Prahari verdict
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-text">{result.verdict}</p>
                {(result.band === "critical" || result.band === "high") && (
                  <p className="mt-2 rounded-lg bg-ink-900/60 px-3 py-2 text-[13px] font-medium" style={{ color: bandMeta[result.band].color }}>
                    {SAFE_LINE[lang]}
                  </p>
                )}
              </div>
            </div>

            {/* Signals */}
            <div className="panel rounded-2xl p-5">
              <div className="mb-3 flex items-center justify-between">
                <Eyebrow>Signals detected · {result.markers.length}</Eyebrow>
                <span className="text-[11px] text-text-faint">noisy-OR fusion</span>
              </div>
              {result.markers.length === 0 ? (
                <p className="py-4 text-center text-[13px] text-text-faint">No indicators yet — analysis begins on first caller line.</p>
              ) : (
                <ul className="space-y-2.5">
                  {result.markers.map((m) => (
                    <li key={m.id} className="animate-rise">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-text">{m.label}</span>
                        <span className="tabular text-[12px] text-critical">+{Math.round(m.weight * 100)}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-600">
                        <div className="h-full rounded-full" style={{ width: `${m.weight * 100}%`, background: "var(--color-critical)" }} />
                      </div>
                      <p className="mt-1 text-[11.5px] leading-snug text-text-faint">{m.rationale}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Actions */}
            {done && (
              <div className="panel rounded-2xl p-5 animate-rise">
                <Eyebrow>Orchestrated response</Eyebrow>
                <div className="mt-3 space-y-2">
                  {result.actions.map((a) => (
                    <div key={a.id} className="flex items-start gap-3 rounded-xl border border-line bg-ink-700/50 p-3">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md text-[10px] font-bold uppercase" style={{ color: CHANNEL_COLORS[a.channel], background: `color-mix(in oklab, ${CHANNEL_COLORS[a.channel]} 14%, transparent)` }}>
                        {a.channel[0]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium text-text">{a.label}</span>
                          {a.urgency === "now" && <span className="rounded bg-critical/15 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-critical">Now</span>}
                        </div>
                        <p className="text-[12px] text-text-faint">{a.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Try it yourself */}
        <TryItYourself />
      </div>
    </div>
  );
}

function TryItYourself() {
  const [text, setText] = useState("");
  const [res, setRes] = useState<TriageResult | null>(null);
  const samples = [
    "This is CBI. Your Aadhaar is linked to money laundering. You are under digital arrest — do not disconnect or contact anyone. Transfer funds to this RBI account to verify.",
    "Hi, are we still meeting for lunch tomorrow at 1pm?",
    "Your parcel with narcotics was seized at customs. Pay immediately to avoid a non-bailable arrest warrant.",
  ];
  const run = (t: string) => { setText(t); setRes(analyzeText(t)); };

  return (
    <section className="mt-6 panel rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <Eyebrow>Try the classifier · POST /api/triage</Eyebrow>
          <p className="mt-1 text-[13px] text-text-muted">Paste any suspicious message. The same engine runs on WhatsApp, IVR and SMS in 12 languages.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {samples.map((s, i) => (
            <button key={i} onClick={() => run(s)} className="rounded-md border border-line bg-ink-700 px-2.5 py-1.5 text-[11px] text-text-muted transition-colors hover:border-line-strong hover:text-text">
              {["Digital-arrest sample", "Benign sample", "Courier-scam sample"][i]}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-[1.4fr_1fr]">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a suspicious message or call transcript…"
          className="min-h-[92px] w-full resize-none rounded-xl border border-line bg-ink-900 px-3.5 py-3 text-[13px] text-text outline-none placeholder:text-text-ghost focus:border-beacon/50"
        />
        <div className="flex flex-col gap-2">
          <button onClick={() => setRes(analyzeText(text))} className="rounded-xl bg-ink-600 px-4 py-2.5 text-[13px] font-medium text-text transition-colors hover:bg-ink-500 disabled:opacity-40" disabled={!text.trim()}>
            Analyse message
          </button>
          {res && (
            <div className="flex-1 rounded-xl border p-3 animate-rise" style={{ borderColor: `color-mix(in oklab, ${bandMeta[res.band].color} 30%, transparent)`, background: `color-mix(in oklab, ${bandMeta[res.band].color} 8%, transparent)` }}>
              <div className="flex items-center justify-between">
                <RiskPill band={res.band} size="sm" />
                <span className="tabular text-lg font-semibold" style={{ color: bandMeta[res.band].color }}>{Math.round(res.score * 100)}/100</span>
              </div>
              <p className="mt-2 text-[12px] leading-snug text-text-muted">{res.markers.length} indicator{res.markers.length !== 1 ? "s" : ""}: {res.markers.map((m) => m.label).join(", ") || "none"}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

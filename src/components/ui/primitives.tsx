import { cn } from "@/lib/cn";
import { bandMeta } from "@/lib/intel/risk";
import type { RiskBand } from "@/lib/intel/types";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("eyebrow", className)}>{children}</div>;
}

export function LiveDot({ label = "Live", color = "var(--color-safe)" }: { label?: string; color?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-pulse-ring" style={{ background: color }} />
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: color }} />
      </span>
      <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color }}>{label}</span>
    </span>
  );
}

export function RiskPill({ band, size = "md" }: { band: RiskBand; size?: "sm" | "md" }) {
  const m = bandMeta[band];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium uppercase tracking-wide",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
      )}
      style={{
        color: m.color,
        borderColor: `color-mix(in oklab, ${m.color} 35%, transparent)`,
        background: `color-mix(in oklab, ${m.color} 12%, transparent)`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
      {m.label}
    </span>
  );
}

export function Stat({
  value,
  label,
  hint,
  accent,
  className,
}: {
  value: React.ReactNode;
  label: string;
  hint?: React.ReactNode;
  accent?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div
        className="tabular text-2xl font-semibold leading-none md:text-[28px]"
        style={{ color: accent ?? "var(--color-text)" }}
      >
        {value}
      </div>
      <div className="text-[13px] text-text-muted">{label}</div>
      {hint && <div className="text-[11px] text-text-faint">{hint}</div>}
    </div>
  );
}

/** Minimal, hand-drawn sparkline (area + line). */
export function Sparkline({
  data,
  width = 120,
  height = 34,
  color = "var(--color-beacon)",
  className,
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((d, i) => [i * step, height - ((d - min) / span) * (height - 4) - 2] as const);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const gid = `spark-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg width={width} height={height} className={className} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.4" fill={color} />
    </svg>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-line-strong bg-ink-700 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
      {children}
    </kbd>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-line", className)} />;
}

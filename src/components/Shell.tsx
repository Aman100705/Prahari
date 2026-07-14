"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Mark } from "./brand/Logo";
import { ShieldIcon, GraphIcon, MapIcon, ArrowIcon } from "./ui/icons";
import { LiveDot } from "./ui/primitives";
import { topline, fmtINR, groupIN } from "@/lib/intel/data";

const NAV = [
  { href: "/shield", label: "Shield", sub: "Citizen triage", Icon: ShieldIcon, accent: "var(--color-safe)" },
  { href: "/graph", label: "Graph", sub: "Network intel", Icon: GraphIcon, accent: "var(--color-signal)" },
  { href: "/command", label: "Command", sub: "Geo war-room", Icon: MapIcon, accent: "var(--color-beacon)" },
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const active = NAV.find((n) => path.startsWith(n.href));

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Left rail */}
      <aside className="sticky top-0 z-30 flex h-screen w-[68px] flex-col items-center border-r border-line bg-ink-900/80 py-4 backdrop-blur-xl xl:w-[232px] xl:items-stretch xl:px-3">
        <Link href="/" className="mb-6 flex items-center gap-2.5 px-1 xl:px-2">
          <Mark size={30} />
          <span className="hidden font-display text-[17px] font-semibold text-text xl:inline">Prahari</span>
        </Link>

        <div className="hidden px-2 xl:block">
          <div className="eyebrow mb-2">Surfaces</div>
        </div>
        <nav className="flex flex-1 flex-col gap-1.5">
          {NAV.map(({ href, label, sub, Icon, accent }) => {
            const on = path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors",
                  on ? "bg-ink-600" : "hover:bg-ink-700",
                )}
              >
                {on && (
                  <span
                    className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full"
                    style={{ background: accent }}
                  />
                )}
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-md border transition-colors"
                  style={{
                    color: on ? accent : "var(--color-text-muted)",
                    borderColor: on ? `color-mix(in oklab, ${accent} 40%, transparent)` : "var(--color-line)",
                    background: on ? `color-mix(in oklab, ${accent} 12%, transparent)` : "transparent",
                  }}
                >
                  <Icon size={18} />
                </span>
                <span className="hidden flex-col xl:flex">
                  <span className={cn("text-[13px] font-medium", on ? "text-text" : "text-text-muted")}>{label}</span>
                  <span className="text-[11px] text-text-faint">{sub}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden rounded-lg border border-line bg-ink-800 p-3 xl:block">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="eyebrow">System</span>
            <LiveDot label="Online" />
          </div>
          <div className="text-[11px] leading-relaxed text-text-faint">
            {topline.agenciesLinked} agencies · {topline.languages} languages
          </div>
        </div>
      </aside>

      {/* Content column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top status strip */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-line bg-canvas/80 px-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-text-faint">Prahari</span>
            <span className="text-text-ghost">/</span>
            <span className="font-medium text-text">{active?.label ?? "Console"}</span>
          </div>

          <div className="ml-auto hidden items-center gap-5 lg:flex">
            <Ticker label="Active sessions" value={groupIN(topline.activeSessions)} color="var(--color-signal)" />
            <span className="h-4 w-px bg-line" />
            <Ticker label="Intercepted today" value={String(topline.interceptedToday)} color="var(--color-safe)" />
            <span className="h-4 w-px bg-line" />
            <Ticker label="Funds protected" value={fmtINR(topline.fundsProtectedToday)} color="var(--color-beacon)" />
          </div>

          <Link
            href="/"
            className="ml-auto flex items-center gap-1.5 rounded-md border border-line bg-ink-700 px-3 py-1.5 text-[12px] text-text-muted transition-colors hover:border-line-strong hover:text-text lg:ml-4"
          >
            Overview <ArrowIcon size={13} />
          </Link>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

function Ticker({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full animate-live" style={{ background: color }} />
      <span className="text-[11px] text-text-faint">{label}</span>
      <span className="tabular text-[13px] font-medium text-text">{value}</span>
    </div>
  );
}

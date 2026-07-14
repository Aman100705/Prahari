"use client";

import { useEffect, useMemo, useState } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
} from "d3-force";
import type { EntityKind, GraphEdge, GraphNode } from "@/lib/intel/types";
import { cn } from "@/lib/cn";

const KIND_STYLE: Record<EntityKind, { color: string; r: number; ring?: boolean }> = {
  compound: { color: "var(--color-critical)", r: 20, ring: true },
  handler: { color: "var(--color-violet)", r: 12 },
  number: { color: "var(--color-signal)", r: 8 },
  victim: { color: "var(--color-text-faint)", r: 6 },
  mule: { color: "var(--color-elevated)", r: 11 },
  wallet: { color: "var(--color-beacon)", r: 11 },
};

const EDGE_STYLE: Record<GraphEdge["kind"], string> = {
  controls: "var(--color-critical)",
  uses: "var(--color-signal)",
  calls: "var(--color-text-ghost)",
  transfers: "var(--color-elevated)",
  cashout: "var(--color-beacon)",
  linked: "var(--color-line-strong)",
};

type SimNode = GraphNode & SimulationNodeDatum;

export function ForceGraph({
  nodes,
  edges,
  selected,
  onSelect,
  width = 900,
  height = 620,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  width?: number;
  height?: number;
}) {
  const [hover, setHover] = useState<string | null>(null);
  // d3-force uses Math.random() internally (jiggle), so the layout must be
  // computed client-side only — otherwise SSR and hydration disagree.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Run the simulation to a stable layout once (no animation jitter).
  const laid = useMemo(() => {
    if (!mounted) return null;
    const sim: SimNode[] = nodes.map((n) => ({ ...n }));
    const links = edges.map((e) => ({ ...e }));
    const s = forceSimulation(sim)
      .force("link", forceLink(links).id((d) => (d as SimNode).id).distance((l) => 60 + (1 - (l as GraphEdge).weight) * 60).strength(0.6))
      .force("charge", forceManyBody().strength((d) => -180 - (d as SimNode).centrality * 400))
      .force("center", forceCenter(width / 2, height / 2))
      .force("collide", forceCollide().radius((d) => KIND_STYLE[(d as SimNode).kind].r + 8))
      .stop();
    for (let i = 0; i < 340; i++) s.tick();
    // clamp within bounds
    const pad = 40;
    for (const n of sim) {
      n.x = Math.max(pad, Math.min(width - pad, n.x ?? width / 2));
      n.y = Math.max(pad, Math.min(height - pad, n.y ?? height / 2));
    }
    const pos = new Map(sim.map((n) => [n.id, n]));
    return { sim, pos };
  }, [mounted, nodes, edges, width, height]);

  const focus = hover ?? selected;
  const neighbors = useMemo(() => {
    if (!focus) return null;
    const set = new Set<string>([focus]);
    for (const e of edges) {
      const s = typeof e.source === "string" ? e.source : (e.source as SimNode).id;
      const t = typeof e.target === "string" ? e.target : (e.target as SimNode).id;
      if (s === focus) set.add(t);
      if (t === focus) set.add(s);
    }
    return set;
  }, [focus, edges]);

  const dim = (id: string) => (neighbors && !neighbors.has(id) ? 0.16 : 1);

  if (!laid) {
    return (
      <div className="grid h-full w-full place-items-center">
        <div className="flex flex-col items-center gap-3 text-text-faint">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-line-strong border-t-beacon" />
          <span className="text-[12px]">Resolving network topology…</span>
        </div>
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full select-none"
      onClick={() => onSelect(null)}
    >
      <defs>
        <radialGradient id="node-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* edges */}
      <g>
        {edges.map((e, i) => {
          const s = laid.pos.get(typeof e.source === "string" ? e.source : (e.source as SimNode).id);
          const t = laid.pos.get(typeof e.target === "string" ? e.target : (e.target as SimNode).id);
          if (!s || !t) return null;
          const active = neighbors && neighbors.has(s.id) && neighbors.has(t.id);
          return (
            <line
              key={i}
              x1={s.x} y1={s.y} x2={t.x} y2={t.y}
              stroke={EDGE_STYLE[e.kind]}
              strokeWidth={active ? 1.8 : 0.9}
              strokeOpacity={neighbors ? (active ? 0.75 : 0.06) : 0.28}
              style={{ transition: "stroke-opacity 0.25s, stroke-width 0.25s" }}
            />
          );
        })}
      </g>

      {/* nodes */}
      <g>
        {laid.sim.map((n) => {
          const st = KIND_STYLE[n.kind];
          const isSel = selected === n.id;
          const r = st.r * (0.85 + n.centrality * 0.5);
          return (
            <g
              key={n.id}
              transform={`translate(${n.x},${n.y})`}
              style={{ opacity: dim(n.id), transition: "opacity 0.25s", cursor: "pointer" }}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              onClick={(ev) => { ev.stopPropagation(); onSelect(n.id === selected ? null : n.id); }}
            >
              {st.ring && (
                <circle r={r + 8} fill="none" stroke={st.color} strokeOpacity="0.4" strokeDasharray="3 4">
                  <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="24s" repeatCount="indefinite" />
                </circle>
              )}
              {(isSel || hover === n.id) && <circle r={r + 10} fill="url(#node-glow)" />}
              <circle
                r={r}
                fill={st.color}
                fillOpacity={n.kind === "victim" ? 0.5 : 0.9}
                stroke={isSel ? "#fff" : "var(--color-canvas)"}
                strokeWidth={isSel ? 2 : 1.5}
              />
              {(st.r >= 11 || isSel || hover === n.id) && (
                <text
                  y={r + 12}
                  textAnchor="middle"
                  className={cn("pointer-events-none font-mono", isSel ? "fill-text" : "fill-text-faint")}
                  style={{ fontSize: 9.5 }}
                >
                  {n.label.length > 20 ? n.label.slice(0, 19) + "…" : n.label}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export { KIND_STYLE, EDGE_STYLE };

import type { RiskBand } from "./types";

export const BANDS: RiskBand[] = ["safe", "low", "guarded", "elevated", "high", "critical"];

export const bandMeta: Record<RiskBand, { label: string; color: string; text: string }> = {
  safe: { label: "Safe", color: "var(--color-safe)", text: "No fraud indicators" },
  low: { label: "Low", color: "var(--color-low)", text: "Weak signals only" },
  guarded: { label: "Guarded", color: "var(--color-guarded)", text: "Some indicators present" },
  elevated: { label: "Elevated", color: "var(--color-elevated)", text: "Multiple indicators" },
  high: { label: "High", color: "var(--color-high)", text: "Strong fraud pattern" },
  critical: { label: "Critical", color: "var(--color-critical)", text: "Active fraud — intervene now" },
};

export function scoreToBand(score: number): RiskBand {
  if (score >= 0.85) return "critical";
  if (score >= 0.68) return "high";
  if (score >= 0.5) return "elevated";
  if (score >= 0.3) return "guarded";
  if (score >= 0.12) return "low";
  return "safe";
}

export const bandColor = (b: RiskBand) => bandMeta[b].color;

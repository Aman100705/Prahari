import { cn } from "@/lib/cn";

/**
 * Prahari mark — a sentinel.
 * A shield silhouette housing three radar arcs that emanate from a beacon core:
 * the watchtower lamp, always scanning.
 */
export function Mark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="prahari-shield" x1="24" y1="3" x2="24" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1d2b3a" />
          <stop offset="1" stopColor="#0b111a" />
        </linearGradient>
        <radialGradient id="prahari-core" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#ffc35c" />
          <stop offset="1" stopColor="#eba53b" />
        </radialGradient>
      </defs>
      {/* shield */}
      <path
        d="M24 3.5 8 9.2v13.6c0 10 6.7 18.1 16 21.7 9.3-3.6 16-11.7 16-21.7V9.2L24 3.5Z"
        fill="url(#prahari-shield)"
        stroke="#26384a"
        strokeWidth="1.2"
      />
      {/* radar arcs */}
      <path d="M24 33a11 11 0 0 0 0-22" stroke="#eba53b" strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M24 29a7 7 0 0 0 0-14" stroke="#eba53b" strokeOpacity="0.6" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M24 25.2a3.2 3.2 0 0 0 0-6.4" stroke="#ffc35c" strokeWidth="1.8" strokeLinecap="round" />
      {/* beacon core */}
      <circle cx="24" cy="22" r="2.6" fill="url(#prahari-core)" />
    </svg>
  );
}

export function Wordmark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Mark size={size} />
      <span
        className="font-display font-semibold tracking-tight text-text"
        style={{ fontSize: size * 0.66 }}
      >
        Prahari
      </span>
    </div>
  );
}

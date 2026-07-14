/* Hand-drawn 1.6px-stroke icon set — consistent geometry, no icon library. */
type P = { size?: number; className?: string };
const base = (size = 18, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
});

export const ShieldIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M12 3 5 5.5v6c0 4.5 3 8.2 7 9.5 4-1.3 7-5 7-9.5v-6L12 3Z" />
    <path d="M9.2 12.2 11 14l4-4.2" />
  </svg>
);

export const GraphIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}>
    <circle cx="6" cy="7" r="2.2" />
    <circle cx="18" cy="6" r="2.2" />
    <circle cx="17" cy="17" r="2.2" />
    <circle cx="7" cy="17" r="2.2" />
    <path d="M8 8.2 15.6 6.6M8.2 15.6 15.4 7.6M8.7 16.3l6.4.4M6.6 9v6" />
  </svg>
);

export const MapIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M12 21c4-4.5 6-7.6 6-10.5A6 6 0 0 0 6 10.5C6 13.4 8 16.5 12 21Z" />
    <circle cx="12" cy="10.4" r="2.1" />
  </svg>
);

export const ScanIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
    <path d="M4 12h16" />
  </svg>
);

export const PulseIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M3 12h4l2-6 4 12 2-6h6" />
  </svg>
);

export const AlertIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M12 4 3 20h18L12 4Z" />
    <path d="M12 10v4M12 17h.01" />
  </svg>
);

export const BoltIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M13 3 5 13h5l-1 8 8-10h-5l1-8Z" />
  </svg>
);

export const ArrowIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const SearchIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}>
    <circle cx="11" cy="11" r="6" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export const DocIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M6 3h8l4 4v14H6V3Z" />
    <path d="M14 3v4h4M9 13h6M9 16.5h6" />
  </svg>
);

export const NodeIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="12" r="8" strokeOpacity="0.4" />
  </svg>
);

export const GlobeIcon = ({ size, className }: P) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="12" r="8" />
    <path d="M4 12h16M12 4c2.5 2.2 2.5 13.8 0 16M12 4c-2.5 2.2-2.5 13.8 0 16" />
  </svg>
);

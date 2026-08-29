import type { JSX } from "react";

type IconProps = { size?: number; strokeWidth?: number };

function base(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
}

/** الجوهرة — العلامة القديمة (تُستخدم في مكتبة الأيقونات) */
export function Gem({ size = 24 }: Readonly<{ size?: number }>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id="gemGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="48%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="gemLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M6 3h12l4 6-10 12L2 9z" fill="url(#gemGrad)" />
      <path d="M6 3h12l4 6H2z" fill="url(#gemLight)" />
    </svg>
  );
}

/** مكتبة الأيقونات القابلة للاختيار في لوحة التحكم */
export const ICONS: Record<string, (p: IconProps) => JSX.Element> = {
  globe: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="2.5" y="4" width="19" height="15" rx="3" />
      <path d="M2.5 8.5h19" />
      <circle cx="5.6" cy="6.2" r="0.4" fill="currentColor" />
      <circle cx="7.8" cy="6.2" r="0.4" fill="currentColor" />
    </svg>
  ),
  qr: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <path d="M14 14h3v3h-3zM19 14h2v2h-2zM14 19h2v2h-2zM18 18h3v3h-3z" />
    </svg>
  ),
  sign: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3" y="5" width="18" height="9" rx="2.5" />
      <path d="M8 14v5M16 14v5M5 19h14" />
    </svg>
  ),
  brochure: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3 4.5 9 3v18l-6 1.5zM9 3l6 1.5V22.5L9 21M15 4.5 21 3v18l-6 1.5" />
    </svg>
  ),
  gift: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M12 8v13" />
      <path d="M12 8s-1.5-5-4.5-5A2.5 2.5 0 0 0 5 5.5C5 7.5 8 8 12 8zM12 8s1.5-5 4.5-5A2.5 2.5 0 0 1 19 5.5C19 7.5 16 8 12 8z" />
    </svg>
  ),
  sparkles: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
    </svg>
  ),
  percent: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M19 5 5 19" />
      <circle cx="7" cy="7" r="2.6" />
      <circle cx="17" cy="17" r="2.6" />
    </svg>
  ),
  rocket: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 15c-2-1-3-2-4-4 1.5-4.5 5-8 10-8 .5 5-2.5 8.5-6 10z" />
      <path d="M9 12l-4.5 1.5L7 10M12 15l-1.5 4.5L14 17M14.5 9.5h.01" />
      <path d="M5.5 18.5c-1 1-1.5 2.5-1.5 2.5s1.5-.5 2.5-1.5" />
    </svg>
  ),
  crown: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3 8l4 4 5-6 5 6 4-4-1.5 10.5h-15z" />
      <path d="M5 21.5h14" />
    </svg>
  ),
  star: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 3l2.7 5.6 6.3.9-4.5 4.4 1 6.1-5.5-2.9L6.5 20l1-6.1L3 9.5l6.3-.9z" />
    </svg>
  ),
  bolt: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
    </svg>
  ),
  tag: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3 11V4a1 1 0 0 1 1-1h7l10 10-8 8z" />
      <circle cx="7.5" cy="7.5" r="1.3" />
    </svg>
  ),
  palette: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 21a9 9 0 1 1 9-9c0 2.5-2 3-3.5 3H15a2 2 0 0 0-1.5 3.3c.6.7.2 2.7-1.5 2.7z" />
      <circle cx="7.5" cy="11.5" r="1" />
      <circle cx="10.5" cy="7.5" r="1" />
      <circle cx="15" cy="8" r="1" />
    </svg>
  ),
  camera: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  ),
  chat: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M21 12a8 8 0 0 1-11.6 7.2L4 21l1.8-5.4A8 8 0 1 1 21 12z" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
    </svg>
  ),
  shield: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 2.5 20 6v6c0 5-3.5 8.5-8 9.5-4.5-1-8-4.5-8-9.5V6z" />
      <path d="m9 12 2 2 4-4.5" />
    </svg>
  ),
  chart: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16v-5M12 16V8M16 16v-3M20 16V6" />
    </svg>
  ),
  heart: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 20.5C7 17 3.5 13.7 3.5 9.8 3.5 7.2 5.5 5 8.2 5c1.6 0 3 .8 3.8 2 0.8-1.2 2.2-2 3.8-2 2.7 0 4.7 2.2 4.7 4.8 0 3.9-3.5 7.2-8.5 10.7z" />
    </svg>
  ),
  calendar: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  ),
  clock: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
  diamond: ({ size = 26, strokeWidth = 1.8 }) => (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M6 3h12l4 6-10 12L2 9z" />
      <path d="M2 9h20M9 3l3 6 3-6M12 21 9 9M12 21l3-12" />
    </svg>
  ),
};

export const ICON_NAMES = Object.keys(ICONS);

export function Icon({
  name,
  size = 26,
  strokeWidth = 1.8,
}: Readonly<{
  name: string;
  size?: number;
  strokeWidth?: number;
}>) {
  const Cmp = ICONS[name] ?? ICONS.sparkles;
  return <Cmp size={size} strokeWidth={strokeWidth} />;
}

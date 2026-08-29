/** شعار الموقع — قمة صاعدة داخل درع متدرج */

export function LogoMark({ size = 42 }: { size?: number }) {
  return (
    <span
      style={{
        display: "inline-grid",
        placeItems: "center",
        borderRadius: size * 0.3,
        boxShadow: "0 10px 26px -8px rgba(56, 189, 248, 0.45)",
        lineHeight: 0,
        flex: "none",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="55%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="logoShine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#logoGrad)" />
        <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#logoShine)" />
        {/* القمة الصاعدة */}
        <path
          d="M13.5 34.5 L24 13.5 L34.5 34.5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* نقطة الاتصال */}
        <circle cx="24" cy="30" r="3.4" fill="#FFFFFF" />
      </svg>
    </span>
  );
}

export function LogoFull({ name, size = 42 }: { name: string; size?: number }) {
  const [first, ...rest] = name.split(" ");
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <LogoMark size={size} />
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25, textAlign: "start" }}>
        <span style={{ fontWeight: 900, fontSize: size * 0.5, color: "var(--ink)", whiteSpace: "nowrap" }}>
          {first}{" "}
          {rest.length > 0 && (
            <span className="grad-text" style={{ fontWeight: 800 }}>{rest.join(" ")}</span>
          )}
        </span>
      </span>
    </span>
  );
}

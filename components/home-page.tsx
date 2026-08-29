import { getContent, waLink, discountedPrice, type Lang } from "@/lib/content";
import Splash from "@/components/splash";
import { Icon } from "@/components/icons";
import { LogoMark, LogoFull } from "@/components/logo";
import RevealObserver from "@/components/reveal";
import WaveBg from "@/components/wave-bg";
import ChatWidget from "@/components/chat-widget";
import SiteNav from "@/components/site-nav";

const TILE_GRADS = [
  "linear-gradient(135deg, #38bdf8, #2563eb)",
  "linear-gradient(135deg, #818cf8, #4f46e5)",
  "linear-gradient(135deg, #22d3ee, #0891b2)",
  "linear-gradient(135deg, #60a5fa, #1d4ed8)",
  "linear-gradient(135deg, #a78bfa, #6d28d9)",
  "linear-gradient(135deg, #34d399, #059669)",
];

const L = {
  ar: {
    wa: "مرحبًا، أرغب في الاستفسار عن خدماتكم التقنية.",
    quickLinks: "روابط سريعة",
    contactUs: "تواصل معنا",
    whatsappLabel: "واتساب",
    waOffer: (t: string) => `مرحبًا، أرغب في الاستفادة من ${t}.`,
    waPackage: (t: string) => `مرحبًا، أرغب في طلب باقة ${t}.`,
    langLabel: "EN",
    langHref: "/en",
    mockTitle1: "موقع",
    mockTitle2: "نشاطك التجاري",
    mockBtn: "اطلب عبر واتساب",
    serviceCta: "اطلب الخدمة",
    waService: (t: string) => `مرحبًا، أرغب في خدمة ${t}.`,
    arrow: "←",
  },
  en: {
    wa: "Hello, I would like to ask about your services.",
    quickLinks: "Quick links",
    contactUs: "Contact us",
    whatsappLabel: "WhatsApp",
    waOffer: (t: string) => `Hello, I am interested in the "${t}" offer.`,
    waPackage: (t: string) => `Hello, I would like to order the "${t}" package.`,
    langLabel: "عربي",
    langHref: "/",
    mockTitle1: "Your business",
    mockTitle2: "website",
    mockBtn: "Order on WhatsApp",
    serviceCta: "Request service",
    waService: (t: string) => `Hello, I am interested in the "${t}" service.`,
    arrow: "→",
  },
};

export default async function HomePage({ lang = "ar" }: { lang?: Lang }) {
  const c = await getContent(lang);
  const t = L[lang];
  const wa = waLink(c.settings.whatsapp, t.wa);
  const activeOffers = c.offers.filter((o) => o.active);
  const realPortfolio = c.portfolio.filter((p) => p.url || p.image);

  const ribbonItems = [...c.services.map((s) => s.title), c.settings.tagline];

  return (
    <div dir={lang === "en" ? "ltr" : "rtl"} lang={lang}>
      <Splash siteName={c.settings.siteName} />
      <RevealObserver />

      {/* نسيج حبيبي فوق الصفحة كاملة — ملمس الهوية */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          pointerEvents: "none",
          opacity: 0.035,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='140' height='140' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* شريط الإعلان */}
      {c.settings.announcement.enabled && c.settings.announcement.text && (
        <div style={{ background: "var(--accent-dim)", borderBottom: "1px solid rgba(56,189,248,0.25)", color: "var(--ink-2)", textAlign: "center", fontSize: 13, fontWeight: 500, padding: "9px 16px" }}>
          <span style={{ color: "var(--accent)", marginInlineEnd: 8 }}>●</span>
          {c.settings.announcement.text}
        </div>
      )}

      {/* شريط التنقل */}
      <SiteNav siteName={c.settings.siteName} labels={c.ui.nav} waHref={wa} langHref={t.langHref} langLabel={t.langLabel} />

      {/* الواجهة الرئيسية — موجات متدفقة بملء الشاشة */}
      <header id="top" style={{ position: "relative", overflow: "hidden", minHeight: "clamp(560px, 94svh, 920px)", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse 90% 70% at 50% 0%, #0a1f33 0%, #05090f 65%)" }}>
        <WaveBg />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 52% 42% at 50% 44%, rgba(5,9,15,0.42), transparent 74%)", pointerEvents: "none" }} aria-hidden />
        <div className="container" style={{ position: "relative", padding: "70px 5vw 110px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 24 }}>
          <span className="eyebrow reveal">
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }} />
            {c.settings.tagline}
          </span>
          <h1 className="h-display reveal d1" style={{ fontSize: "clamp(40px, 7.5vw, 88px)", lineHeight: 1.25 }}>
            {c.ui.hero.titleLine}
            <br />
            <span className="grad-text">{c.ui.hero.titleGrad}</span>
          </h1>
          <p className="lede reveal d2" style={{ margin: "0 auto", maxWidth: "60ch" }}>{c.settings.description}</p>
          <div className="reveal d2" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <a className="btn btn-accent" href={wa} target="_blank" rel="noopener">{c.ui.hero.ctaPrimary}</a>
            <a className="btn btn-ghost" href="#services">{c.ui.hero.ctaSecondary}</a>
          </div>
          {c.stats.length > 0 && (
            <div className="reveal d3" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(c.stats.length, 4)}, 1fr)`, background: "rgba(10,25,40,0.55)", backdropFilter: "blur(10px)", border: "1px solid rgba(56,189,248,0.18)", borderRadius: 18, overflow: "hidden", marginTop: 12, width: "fit-content", maxWidth: "100%" }}>
              {c.stats.map((s, i) => (
                <div key={s.id} style={{ padding: "18px 30px", textAlign: "center", borderInlineStart: i > 0 ? "1px solid rgba(56,189,248,0.14)" : "none", whiteSpace: "nowrap" }}>
                  <div className="num" style={{ fontSize: 30, fontWeight: 700, color: "var(--accent)", lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* شريط الهوية المتحرك */}
      <div className="ribbon" aria-hidden>
        <div className="ribbon-track">
          {[...ribbonItems, ...ribbonItems, ...ribbonItems].map((t, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 46 }}>
              {t}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 19 12 5l8 14" />
                <circle cx="12" cy="16" r="2.2" fill="#fff" stroke="none" />
              </svg>
            </span>
          ))}
        </div>
      </div>

      {/* الخدمات */}
      <section className="section section-raised" id="services">
        <div className="aurora" aria-hidden />
        <div className="container">
          <div className="sec-head" data-ghost="01">
            <span className="eyebrow reveal">{c.ui.sections.services.eyebrow}</span>
            <h2 className="h-section reveal">{c.ui.sections.services.title}</h2>
            {c.ui.sections.services.subtitle && <p className="lede reveal d1">{c.ui.sections.services.subtitle}</p>}
          </div>
          <div className="svc-grid">
            {c.services.map((s, i) => (
              <div key={s.id} className={`card reveal d${(i % 3) + 1} ${i === 0 ? "svc-featured" : ""}`} style={{ gap: 14 }}>
                <span className="watermark" aria-hidden>
                  <Icon name={s.icon} size={i === 0 ? 160 : 110} strokeWidth={1.1} />
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div className="svc-icon tile-anim" style={{ margin: 0, width: i === 0 ? 74 : 56, height: i === 0 ? 74 : 56, backgroundImage: TILE_GRADS[i % TILE_GRADS.length], boxShadow: `0 12px 26px -10px ${["rgba(56,189,248,.5)", "rgba(129,140,248,.5)", "rgba(34,211,238,.5)", "rgba(96,165,250,.5)", "rgba(167,139,250,.5)", "rgba(52,211,153,.5)"][i % 6]}, inset 0 1px 0 rgba(255,255,255,.35)` }}>
                    <Icon name={s.icon} size={i === 0 ? 34 : 26} strokeWidth={2} />
                  </div>
                  <h3 style={{ fontSize: i === 0 ? 28 : 21 }}>{s.title}</h3>
                </div>
                <p style={{ flex: 1, fontSize: i === 0 ? 16.5 : 15, maxWidth: i === 0 ? "56ch" : undefined }}>{s.description}</p>
                <a className="card-link" href={waLink(c.settings.whatsapp, t.waService(s.title))} target="_blank" rel="noopener">
                  {t.serviceCta}
                  <span className="card-link-arrow">{t.arrow}</span>
                </a>
              </div>
            ))}
          </div>
          <style>{`
            .svc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; width: 100%; }
            .svc-featured { grid-column: span 2; background: linear-gradient(135deg, rgba(56,189,248,0.1) 0%, var(--surface) 55%) !important; }
            @media (max-width: 940px) { .svc-grid { grid-template-columns: repeat(2, 1fr); } .svc-featured { grid-column: span 2; } }
            @media (max-width: 620px) { .svc-grid { grid-template-columns: 1fr; } .svc-featured { grid-column: span 1; } }
          `}</style>
        </div>
      </section>

      {/* شركاء النجاح */}
      {c.clients.length > 0 && (
        <section className="section" id="clients">
          <div className="container">
            <div className="sec-head center" data-ghost="02">
              <span className="eyebrow reveal">{c.ui.sections.clients.eyebrow}</span>
              <h2 className="h-section reveal">{c.ui.sections.clients.title}</h2>
            </div>
            <div className="logo-strip reveal d1" aria-label="شعارات شركائنا">
              <div className="logo-track">
                {[...c.clients, ...c.clients].map((cl, i) => (
                  <span key={`${cl.id}-${i}`} className="logo-chip" aria-hidden={i >= c.clients.length}>
                    {cl.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cl.logo} alt={cl.name} style={{ height: 52, maxWidth: 170, objectFit: "contain" }} />
                    ) : (
                      <span className="font-display" style={{ fontSize: 17, fontWeight: 700, color: "var(--ink-2)" }}>{cl.name}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <style>{`
              .logo-strip { width: 100%; overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
              .logo-track { display: inline-flex; align-items: stretch; gap: 22px; padding: 12px 22px; animation: marquee-rtl 36s linear infinite; will-change: transform; }
              .logo-strip:hover .logo-track { animation-play-state: paused; }
              .logo-chip { display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; min-width: 190px; min-height: 92px; padding: 16px 30px; background: #fff; border: 1px solid var(--border); border-radius: 16px; transition: transform .2s ease, box-shadow .2s ease; }
              .logo-chip:hover { transform: translateY(-4px); box-shadow: 0 14px 30px -14px var(--accent-glow); }
            `}</style>
          </div>
        </section>
      )}

      {/* العروض */}
      {activeOffers.length > 0 && (
        <section className="section section-raised" id="offers">
        <div className="aurora" aria-hidden />
          <div className="container">
            <div className="sec-head" data-ghost="03">
              <span className="eyebrow reveal">{c.ui.sections.offers.eyebrow}</span>
              <h2 className="h-section reveal">{c.ui.sections.offers.title}</h2>
            </div>
            <div className="grid-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 460px))" }}>
              {activeOffers.map((o, i) => (
                <div key={o.id} className={`card reveal d${(i % 2) + 1}`} style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
                  <div className="svc-icon grad-bg tile-anim" style={{ margin: 0, flex: "none", width: 62, height: 62 }}>
                    <Icon name={o.icon} size={28} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: 18 }}>{o.title}</h3>
                      {o.badge && (
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", padding: "3px 12px", borderRadius: 999, background: "var(--grad)", whiteSpace: "nowrap" }}>
                          {o.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13.5 }}>{o.description}</p>
                    <a className="card-link" href={waLink(c.settings.whatsapp, t.waOffer(o.title))} target="_blank" rel="noopener">
                      {c.ui.buttons.offer}
                      <span className="card-link-arrow">{t.arrow}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* آلية العمل */}
      <section className="section">
        <div className="container">
          <div className="sec-head" data-ghost="04">
            <span className="eyebrow reveal">{c.ui.sections.steps.eyebrow}</span>
            <h2 className="h-section reveal">{c.ui.sections.steps.title}</h2>
          </div>
          <div className="grid-3" style={{ marginTop: 30 }}>
            {c.ui.steps.map((s, i) => (
              <div key={i} className={`card reveal d${(i % 3) + 1} step-card`}>
                <span className="num step-badge tile-anim" style={{ backgroundImage: TILE_GRADS[i % TILE_GRADS.length] }}>
                  {i + 1}
                </span>
                <h3 style={{ marginTop: 10 }}>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الأسعار */}
      <section className="section section-raised" id="pricing">
        <div className="aurora" aria-hidden />
        <div className="container">
          <div className="sec-head" data-ghost="05">
            <span className="eyebrow reveal">{c.ui.sections.pricing.eyebrow}</span>
            <h2 className="h-section reveal">{c.ui.sections.pricing.title}</h2>
          </div>
          <div className="grid-center" style={{ alignItems: "stretch" }}>
            {c.packages.map((p, i) => (
              <div
                key={p.id}
                className={`card reveal d${(i % 2) + 1}`}
                style={{ alignItems: "stretch", textAlign: "start", padding: 0, gap: 0, marginTop: 14, ...(p.featured ? { border: "1.5px solid transparent", background: "linear-gradient(var(--surface), var(--surface)) padding-box, var(--grad) border-box", boxShadow: "0 24px 60px -24px rgba(37,99,235,.45)" } : {}) }}
              >
                {p.featured && p.badgeText && (
                  <span style={{ position: "absolute", top: -13, insetInlineStart: "50%", transform: "translateX(50%)", fontSize: 12, fontWeight: 700, color: "#ffffff", padding: "4px 18px", borderRadius: 999, background: "var(--grad)", whiteSpace: "nowrap", zIndex: 2 }}>
                    {p.badgeText}
                  </span>
                )}
                <div style={{ padding: "28px 26px 18px", borderBottom: "1px solid var(--hairline)" }}>
                  {(() => {
                    const final = discountedPrice(p.price, p.discount);
                    return (
                      <>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                          <h3 style={{ fontSize: 15.5, color: "var(--ink-2)", fontWeight: 700 }}>{p.title}</h3>
                          {final && (
                            <span className="num" style={{ fontSize: 12.5, fontWeight: 800, color: "#04231a", background: "linear-gradient(135deg, #5ef0c0, #34d399)", padding: "3px 12px", borderRadius: 999, whiteSpace: "nowrap", direction: "ltr" }}>
                              -{p.discount}%
                            </span>
                          )}
                        </div>
                        {final && (
                          <div className="num" dir="ltr" style={{ textAlign: "start", fontSize: 19, fontWeight: 600, color: "var(--ink-3)", textDecoration: "line-through", textDecorationColor: "var(--danger)", textDecorationThickness: 2, lineHeight: 1.3 }}>
                            {p.price}
                          </div>
                        )}
                        <div className="num" dir="ltr" style={{ display: "flex", alignItems: "baseline", gap: 8, lineHeight: 1.1, justifyContent: "flex-start" }}>
                          <span className="grad-text" style={{ fontSize: 46, fontWeight: 700 }}>{final ?? p.price}</span>
                          <small style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-3)" }}>{p.unit}</small>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <ul style={{ listStyle: "none", padding: "20px 26px", margin: 0, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                  {p.features.map((f, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 14, color: "var(--ink-2)" }}>
                      <span className="feat-check">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div style={{ padding: "0 26px 26px" }}>
                  <a className={`btn ${p.featured ? "btn-accent" : "btn-ghost"}`} href={waLink(c.settings.whatsapp, t.waPackage(p.title))} target="_blank" rel="noopener" style={{ width: "100%" }}>
                    {c.ui.buttons.package}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الأعمال */}
      {realPortfolio.length > 0 && (
        <section className="section" id="portfolio">
          <div className="container">
            <div className="sec-head" data-ghost="06">
              <span className="eyebrow reveal">{c.ui.sections.portfolio.eyebrow}</span>
              <h2 className="h-section reveal">{c.ui.sections.portfolio.title}</h2>
            </div>
            <div className="grid-center">
              {realPortfolio.map((p, i) => (
                <a key={p.id} href={p.url || "#"} target={p.url ? "_blank" : undefined} rel="noopener" className={`card reveal d${(i % 2) + 1}`} style={{ textDecoration: "none", color: "inherit", padding: 0, overflow: "hidden" }}>
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", aspectRatio: "16/10", background: "var(--grad)", display: "grid", placeItems: "center", color: "#ffffff", fontWeight: 700 }} className="font-display">
                      {p.title}
                    </div>
                  )}
                  <div style={{ padding: "14px 20px 20px" }}>
                    <h3 style={{ fontSize: 16 }}>{p.title}</h3>
                    <p style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{p.category}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* آراء العملاء */}
      {c.testimonials.length > 0 && (
        <section className="section section-raised" id="testimonials">
        <div className="aurora" aria-hidden />
          <div className="container">
            <div className="sec-head" data-ghost="07">
              <span className="eyebrow reveal">{c.ui.sections.testimonials.eyebrow}</span>
              <h2 className="h-section reveal">{c.ui.sections.testimonials.title}</h2>
            </div>
            <div className="grid-center">
              {c.testimonials.map((ts, i) => (
                <div key={ts.id} className={`card reveal d${(i % 2) + 1}`}>
                  <span aria-hidden style={{ position: "absolute", top: 8, insetInlineEnd: 20, fontSize: 58, lineHeight: 1, color: "var(--accent)", opacity: 0.14, fontFamily: "serif" }}>❝</span>
                  <div style={{ color: "var(--accent)", fontSize: 15, letterSpacing: 3, direction: "ltr" }}>
                    {"★".repeat(Math.min(5, Math.max(1, ts.rating)))}
                  </div>
                  <p style={{ fontSize: 14.5, color: "var(--ink-2)", flex: 1 }}>&ldquo;{ts.text}&rdquo;</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="num" style={{ width: 42, height: 42, borderRadius: "50%", display: "grid", placeItems: "center", backgroundImage: TILE_GRADS[i % TILE_GRADS.length], color: "#fff", fontWeight: 800, fontSize: 16, flex: "none" }}>
                      {ts.name.trim().charAt(0) || "؟"}
                    </span>
                    <span>
                      <span style={{ display: "block", fontWeight: 700, fontSize: 14 }}>{ts.name}</span>
                      <span style={{ display: "block", fontSize: 12.5, color: "var(--ink-3)" }}>{ts.role}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* الأسئلة الشائعة */}
      <section className="section" id="faq">
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="sec-head center" data-ghost="08">
            <span className="eyebrow reveal">{c.ui.sections.faq.eyebrow}</span>
            <h2 className="h-section reveal">{c.ui.sections.faq.title}</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {c.faq.map((f, i) => (
              <details key={f.id} className={`reveal d${(i % 3) + 1} faq-item`}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <style>{`
            .faq-item { background: var(--surface); border-radius: 14px; border: 1px solid var(--border); padding: 16px 22px; text-align: start; width: 100%; transition: border-color .2s ease; }
            .faq-item:hover { border-color: rgba(56,189,248,0.5); }
            .faq-item summary { font-weight: 700; font-size: 17px; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 12px; color: var(--ink); }
            .faq-item summary::-webkit-details-marker { display: none; }
            .faq-item summary::after { content: "+"; font-size: 19px; color: var(--accent); transition: transform .25s ease; }
            .faq-item[open] summary::after { transform: rotate(45deg); }
            .faq-item p { margin-top: 10px; font-size: 14px; color: var(--ink-2); }
          `}</style>
        </div>
      </section>

      {/* الختام — بخلفية متحركة */}
      <section id="contact" style={{ position: "relative", overflow: "hidden", background: "radial-gradient(ellipse 70% 80% at 50% 100%, #14335a 0%, var(--bg) 70%)", borderTop: "1px solid var(--hairline)", padding: "84px 5vw" }}>
        <WaveBg opacity={0.45} />
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 20 }}>
          <span className="reveal"><LogoMark size={58} /></span>
          <h2 className="h-display reveal d1" style={{ fontSize: "clamp(26px, 4.5vw, 44px)" }}>
            {c.ui.cta.title} <span className="grad-text">{c.ui.cta.titleGrad}</span>
          </h2>
          <p className="lede reveal d2" style={{ margin: "0 auto" }}>
            {c.ui.cta.desc}
          </p>
          <div className="reveal d3" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <a className="btn btn-accent" href={wa} target="_blank" rel="noopener">{c.ui.cta.btnWhatsapp}</a>
            {c.settings.phone && (
              <a className="btn btn-ghost" href={`tel:+${c.settings.phone}`}>
                <span className="num" style={{ direction: "ltr" }}>+{c.settings.phone}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* التذييل الغني */}
      <footer style={{ background: "var(--bg-raised)", borderTop: "1px solid var(--hairline)" }}>
        <div className="container" style={{ padding: "56px 5vw 28px" }}>
          <div className="footer-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
              <LogoFull name={c.settings.siteName} size={44} />
              <p style={{ fontSize: 13.5, color: "var(--ink-2)", maxWidth: "36ch", lineHeight: 1.9 }}>
                {c.settings.description}
              </p>
            </div>
            <div className="footer-col">
              <h4>{t.quickLinks}</h4>
              <a href="#services">{c.ui.nav.services}</a>
              <a href="#pricing">{c.ui.nav.pricing}</a>
              <a href="#clients">{c.ui.nav.clients}</a>
              <a href="#faq">{c.ui.nav.faq}</a>
            </div>
            <div className="footer-col">
              <h4>{t.contactUs}</h4>
              <a href={wa} target="_blank" rel="noopener">{t.whatsappLabel}: <span className="num" style={{ direction: "ltr", display: "inline-block" }}>+{c.settings.whatsapp}</span></a>
              {c.settings.email && (
                <a href={`mailto:${c.settings.email}`}><span style={{ direction: "ltr", display: "inline-block" }}>{c.settings.email}</span></a>
              )}
              <span style={{ color: "var(--ink-2)", fontSize: 13.5 }}>{c.settings.city}</span>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--hairline)", marginTop: 40, paddingTop: 20, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", fontSize: 12.5, color: "var(--ink-3)" }}>
            <span>{c.settings.siteName} © 2026 — {c.ui.footer.rights}</span>
            <span>{c.ui.footer.tagline}</span>
          </div>
        </div>
        <style>{`
          .footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 40px; text-align: start; }
          .footer-col { display: flex; flex-direction: column; gap: 11px; }
          .footer-col h4 { font-size: 15px; font-weight: 800; color: var(--ink); margin-bottom: 4px; }
          .footer-col a { text-decoration: none; color: var(--ink-2); font-size: 13.5px; transition: color .2s ease; }
          .footer-col a:hover { color: var(--accent); }
          @media (max-width: 760px) { .footer-grid { grid-template-columns: 1fr; gap: 30px; } }
        `}</style>
      </footer>

      {/* المساعد الذكي */}
      <ChatWidget siteName={c.settings.siteName} />

      {/* زر واتساب العائم */}
      <a
        href={wa}
        target="_blank"
        rel="noopener"
        aria-label="تواصل معنا عبر واتساب"
        style={{ position: "fixed", bottom: 22, insetInlineStart: 22, zIndex: 60, width: 54, height: 54, borderRadius: "50%", background: "#25D366", display: "grid", placeItems: "center", boxShadow: "0 10px 26px -8px rgba(37, 211, 102, 0.55)" }}
      >
        <svg width="27" height="27" viewBox="0 0 24 24" fill="#fff" aria-hidden>
          <path d="M12.04 2c-5.5 0-9.96 4.45-9.96 9.94 0 1.75.46 3.46 1.34 4.97L2 22l5.23-1.37a9.98 9.98 0 0 0 4.8 1.22h.01c5.5 0 9.96-4.45 9.96-9.94A9.9 9.9 0 0 0 12.04 2zm5.83 14.17c-.25.7-1.44 1.33-2 1.42-.51.08-1.16.11-1.87-.12-.43-.14-.99-.32-1.7-.63-3-1.29-4.95-4.3-5.1-4.5-.15-.2-1.22-1.62-1.22-3.1 0-1.47.77-2.19 1.05-2.49.27-.3.6-.37.8-.37h.57c.18 0 .43-.07.67.51.25.6.85 2.07.92 2.22.08.15.13.33.03.53-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.75 1.24 1.62 2 1.11.99 2.05 1.3 2.34 1.44.29.15.46.13.63-.07.17-.2.72-.84.92-1.13.2-.3.39-.24.66-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.34.07.13.07.72-.18 1.41z" />
        </svg>
      </a>
    </div>
  );
}

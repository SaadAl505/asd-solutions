"use client";

import { useEffect, useState } from "react";
import { LogoFull } from "@/components/logo";

type NavLabels = { services: string; pricing: string; clients: string; faq: string; cta: string };

export default function SiteNav({
  siteName,
  labels,
  waHref,
  langHref,
  langLabel,
}: {
  siteName: string;
  labels: NavLabels;
  waHref: string;
  langHref?: string;
  langLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#services", label: labels.services },
    { href: "#pricing", label: labels.pricing },
    { href: "#clients", label: labels.clients },
    { href: "#faq", label: labels.faq },
  ];

  return (
    <nav className={`site-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <a href="#top" style={{ textDecoration: "none" }} aria-label={siteName}>
          <LogoFull name={siteName} size={46} />
        </a>

        <div className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-item" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {langHref && langLabel && (
            <a className="nav-lang" href={langHref} aria-label="تبديل اللغة">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden>
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
              </svg>
              {langLabel}
            </a>
          )}
          <a className="btn btn-accent nav-cta" href={waHref} target="_blank" rel="noopener">
            {labels.cta}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </a>
          <button
            type="button"
            className="nav-burger"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="nav-mobile">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-mobile-item" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a className="btn btn-accent" href={waHref} target="_blank" rel="noopener" style={{ width: "100%" }}>
            {labels.cta}
          </a>
        </div>
      )}

      <style>{`
        .site-nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(12, 34, 56, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid transparent;
          transition: background .25s ease, border-color .25s ease, box-shadow .25s ease;
        }
        .site-nav.scrolled {
          background: rgba(12, 34, 56, 0.88);
          border-bottom-color: var(--hairline);
          box-shadow: 0 14px 34px -20px rgba(0,0,0,.55);
        }
        .site-nav::after {
          content: ""; position: absolute; bottom: -1px; inset-inline: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(56,189,248,.45), transparent);
          opacity: 0; transition: opacity .25s ease;
        }
        .site-nav.scrolled::after { opacity: 1; }
        .nav-inner {
          max-width: 1320px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          gap: 20px; padding: 15px 5vw;
        }
        .nav-links {
          display: flex; align-items: center; gap: 34px;
          position: absolute; left: 50%; transform: translateX(-50%);
        }
        .nav-item {
          position: relative;
          text-decoration: none; color: var(--ink-2);
          font-size: 15.5px; font-weight: 700;
          padding: 6px 2px;
          transition: color .2s ease;
        }
        .nav-item::after {
          content: ""; position: absolute; bottom: 0; inset-inline-start: 0;
          width: 100%; height: 2.5px; border-radius: 99px;
          background: var(--grad);
          transform: scaleX(0); transform-origin: center;
          transition: transform .25s ease;
        }
        .nav-item:hover { color: var(--ink); }
        .nav-item:hover::after { transform: scaleX(1); }
        .nav-cta { padding: 11px 24px; font-size: 14.5px; }
        .nav-lang {
          display: inline-flex; align-items: center; gap: 7px;
          text-decoration: none; color: var(--ink-2);
          font-size: 13.5px; font-weight: 700;
          border: 1px solid var(--border-strong); border-radius: 999px;
          padding: 8px 16px;
          transition: color .2s ease, border-color .2s ease;
        }
        .nav-lang:hover { color: var(--accent); border-color: var(--accent); }
        .nav-burger {
          display: none; border: 1px solid var(--border-strong); background: transparent;
          color: var(--ink); border-radius: 11px; width: 44px; height: 44px;
          place-items: center; cursor: pointer;
        }
        .nav-mobile {
          display: flex; flex-direction: column; gap: 6px;
          padding: 10px 5vw 18px;
          background: rgba(12, 34, 56, 0.97);
          border-bottom: 1px solid var(--hairline);
          animation: nav-drop .22s ease;
        }
        @keyframes nav-drop { from { opacity: 0; transform: translateY(-8px); } }
        .nav-mobile-item {
          text-decoration: none; color: var(--ink);
          font-size: 16px; font-weight: 700;
          padding: 13px 6px;
          border-bottom: 1px solid var(--hairline);
        }
        @media (max-width: 1020px) {
          .nav-links { display: none; }
          .nav-burger { display: grid; }
        }
        @media (max-width: 560px) {
          .nav-cta { display: none; }
        }
      `}</style>
    </nav>
  );
}

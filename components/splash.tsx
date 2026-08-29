"use client";

import { useEffect, useState } from "react";

/** شاشة الافتتاح — الشعار يُرسم ثم تتلاشى (بأسلوب SCAI) */
export default function Splash({ siteName }: { siteName: string }) {
  const [phase, setPhase] = useState<"show" | "fade" | "gone">("show");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t1 = setTimeout(() => setPhase("fade"), reduced ? 300 : 1600);
    const t2 = setTimeout(() => setPhase("gone"), reduced ? 500 : 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className="splash" data-fade={phase === "fade"} aria-hidden>
      <div className="splash-inner">
        <svg width="96" height="96" viewBox="0 0 48 48" className="splash-logo">
          <defs>
            <linearGradient id="spGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="55%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          <rect className="splash-box" x="2" y="2" width="44" height="44" rx="14" fill="url(#spGrad)" />
          <path
            className="splash-peak"
            d="M13.5 34.5 L24 13.5 L34.5 34.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle className="splash-dot" cx="24" cy="30" r="3.4" fill="#FFFFFF" />
        </svg>
        <div className="splash-name">{siteName}</div>
        <div className="splash-bar"><i /></div>
      </div>

      <style>{`
        .splash {
          position: fixed; inset: 0; z-index: 999;
          display: grid; place-items: center;
          background: radial-gradient(ellipse 70% 55% at 50% 40%, #14335a 0%, #0c2238 70%);
          transition: opacity .6s ease, visibility .6s ease;
        }
        .splash[data-fade="true"] { opacity: 0; visibility: hidden; }
        .splash-inner { display: flex; flex-direction: column; align-items: center; gap: 18px; }
        .splash-logo {
          filter: drop-shadow(0 18px 40px rgba(56, 189, 248, .45));
        }
        .splash-box {
          transform-origin: center;
          animation: sp-box .55s cubic-bezier(.16,1,.3,1) both;
        }
        .splash-peak {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: sp-draw .8s ease-out .45s forwards;
        }
        .splash-dot {
          opacity: 0;
          transform-origin: center;
          animation: sp-pop .35s cubic-bezier(.34,1.56,.64,1) 1.15s forwards;
        }
        .splash-name {
          font-weight: 900; font-size: 22px; color: #f2f7fc;
          opacity: 0; animation: sp-fade .5s ease .9s forwards;
        }
        .splash-bar {
          width: 120px; height: 3px; border-radius: 99px;
          background: rgba(56,189,248,.18); overflow: hidden;
          opacity: 0; animation: sp-fade .4s ease 1s forwards;
        }
        .splash-bar i {
          display: block; height: 100%; width: 45%;
          border-radius: 99px;
          background: linear-gradient(90deg, #38bdf8, #2563eb);
          animation: sp-load 1.1s ease-in-out .9s infinite;
        }
        @keyframes sp-box { from { transform: scale(.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes sp-draw { to { stroke-dashoffset: 0; } }
        @keyframes sp-pop { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
        @keyframes sp-fade { to { opacity: 1; } }
        @keyframes sp-load { 0% { margin-inline-start: -50%; } 100% { margin-inline-start: 110%; } }
        @media (prefers-reduced-motion: reduce) {
          .splash-box, .splash-peak, .splash-dot, .splash-name, .splash-bar { animation: none !important; opacity: 1; stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

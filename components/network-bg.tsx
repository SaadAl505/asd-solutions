"use client";

import { useEffect, useRef } from "react";

/** عشوائية آمنة للتأثيرات البصرية */
function rand(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 2 ** 32;
}

/** خلفية شبكة نقاط متصلة متحركة (بأسلوب مواقع التقنية) */
export default function NetworkBackground({ opacity = 0.55 }: Readonly<{ opacity?: number }>) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;

    type P = { x: number; y: number; vx: number; vy: number };
    let pts: P[] = [];

    function resize() {
      if (!canvas || !ctx) return;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(90, Math.floor((w * h) / 16000));
      pts = Array.from({ length: n }, () => ({
        x: rand() * w,
        y: rand() * h,
        vx: (rand() - 0.5) * 0.35,
        vy: (rand() - 0.5) * 0.35,
      }));
    }

    const LINK = 130;

    function moveParticles() {
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
    }

    function drawLinks(c2d: CanvasRenderingContext2D) {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const a = (1 - Math.sqrt(d2) / LINK) * 0.13;
            c2d.strokeStyle = `rgba(56, 189, 248, ${a})`;
            c2d.beginPath();
            c2d.moveTo(pts[i].x, pts[i].y);
            c2d.lineTo(pts[j].x, pts[j].y);
            c2d.stroke();
          }
        }
      }
    }

    function drawDots(c2d: CanvasRenderingContext2D) {
      c2d.fillStyle = "rgba(125, 211, 252, 0.55)";
      for (const p of pts) {
        c2d.beginPath();
        c2d.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        c2d.fill();
      }
    }

    function draw(move: boolean) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      if (move) moveParticles();
      drawLinks(ctx);
      drawDots(ctx);
    }

    function loop() {
      draw(true);
      raf = requestAnimationFrame(loop);
    }

    resize();
    if (reduced) {
      draw(false);
    } else {
      loop();
    }

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      tabIndex={-1}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, pointerEvents: "none" }}
    />
  );
}

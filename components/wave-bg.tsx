"use client";

import { useEffect, useRef } from "react";

/** موجات جسيمات متدفقة سينمائية — بأسلوب HUMAIN/SCAI */
export default function WaveBg({ opacity = 1 }: { opacity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;

    function resize() {
      if (!canvas || !ctx) return;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // تدرج الألوان عبر العمق: تيل → سماوي → أزرق
    const PALETTE = [
      [45, 212, 191],
      [56, 189, 248],
      [37, 99, 235],
    ];

    function colorAt(f: number): [number, number, number] {
      const x = Math.min(0.9999, Math.max(0, f)) * (PALETTE.length - 1);
      const i = Math.floor(x);
      const k = x - i;
      const a = PALETTE[i];
      const b = PALETTE[i + 1];
      return [
        a[0] + (b[0] - a[0]) * k,
        a[1] + (b[1] - a[1]) * k,
        a[2] + (b[2] - a[2]) * k,
      ];
    }

    function waveY(x: number, r: number, amp: number): number {
      return (
        Math.sin(x * 0.0022 + t * 0.5 + r * 0.5) * amp * 0.55 +
        Math.sin(x * 0.0048 - t * 0.3 + r * 1.1) * amp * 0.3 +
        Math.sin(x * 0.01 + t * 0.7 + r * 0.28) * amp * 0.15
      );
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      const ROWS = 44;
      const STEP = 12;
      const horizon = h * 0.12;

      for (let r = 0; r < ROWS; r++) {
        const depth = r / (ROWS - 1); // 0 بعيد → 1 قريب
        const baseY = horizon + Math.pow(depth, 1.4) * (h - horizon) * 1.02;
        const amp = 34 + depth * 150;

        // موجة نابضة: القمم أكثر توهجًا
        const crest = 0.55 + 0.45 * Math.sin(t * 0.6 + r * 0.9);
        const [cr, cg, cb] = colorAt(depth * 0.8 + 0.1 * Math.sin(r + t * 0.2));
        const lineAlpha = (0.07 + depth * 0.3) * crest;

        // الخيط المتصل
        ctx.beginPath();
        for (let x = -30; x <= w + 30; x += STEP) {
          const y = baseY + waveY(x, r, amp);
          if (x === -30) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${cr | 0}, ${cg | 0}, ${cb | 0}, ${lineAlpha})`;
        ctx.lineWidth = 0.8 + depth * 1.1;
        ctx.stroke();

        // نقاط متوهجة متناثرة فوق الخيط
        for (let x = ((r * 37) % 60) - 30; x <= w + 30; x += STEP * 5) {
          const y = baseY + waveY(x, r, amp);
          const dotAlpha = (0.25 + depth * 0.55) * (0.5 + 0.5 * Math.sin(x * 0.02 + t * 1.4 + r));
          ctx.fillStyle = `rgba(${Math.min(255, cr + 60) | 0}, ${Math.min(255, cg + 50) | 0}, ${Math.min(255, cb + 40) | 0}, ${dotAlpha})`;
          const size = 1.2 + depth * 1.8;
          ctx.fillRect(x, y - size / 2, size, size);
        }
      }
    }

    function loop() {
      t += 0.012;
      draw();
      raf = requestAnimationFrame(loop);
    }

    resize();
    if (reduced) {
      t = 2;
      draw();
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
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, pointerEvents: "none" }}
    />
  );
}

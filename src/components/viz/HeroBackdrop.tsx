"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic hero backdrop (Canvas 2D): a synthwave perspective grid floor that
 * scrolls toward the viewer, a pulsing reactor "sun" on the horizon with scan
 * bands, and rising embers. Pointer position gently steers the vanishing point
 * for a parallax, camera-like feel.
 */
export default function HeroBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Rising embers
    const embers = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.4,
      s: Math.random() * 0.0016 + 0.0004,
      hue: Math.random() < 0.5 ? "232,196,121" : "219,146,89",
      a: Math.random() * 0.6 + 0.2,
    }));

    let raf = 0;
    let t = 0;
    const pointer = { x: 0.5, tx: 0.5 };

    const onMove = (e: PointerEvent) => {
      pointer.tx = e.clientX / window.innerWidth;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const draw = () => {
      t += 1;
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      ctx.clearRect(0, 0, W, H);

      const horizon = H * 0.52;
      const vpx = W * (0.5 + (pointer.x - 0.5) * 0.18); // vanishing point x

      /* ---- Reactor sun ---- */
      const sunR = Math.min(W, H) * 0.26;
      const sunY = horizon - sunR * 0.15;
      const pulse = reduce ? 0 : Math.sin(t * 0.03) * 0.06;
      const sunGrad = ctx.createRadialGradient(vpx, sunY, 0, vpx, sunY, sunR * (1 + pulse));
      sunGrad.addColorStop(0, "rgba(219,146,89,0.55)");
      sunGrad.addColorStop(0.45, "rgba(192,132,58,0.35)");
      sunGrad.addColorStop(0.75, "rgba(232,196,121,0.15)");
      sunGrad.addColorStop(1, "rgba(232,196,121,0)");
      ctx.save();
      ctx.beginPath();
      ctx.arc(vpx, sunY, sunR * (1 + pulse), 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.fill();
      // scan bands across the lower half of the sun
      ctx.globalCompositeOperation = "destination-out";
      for (let i = 0; i < 7; i++) {
        const by = sunY + (i / 7) * sunR - (t * 0.4) % (sunR / 7);
        if (by > sunY) {
          ctx.fillRect(vpx - sunR, by, sunR * 2, Math.max(1.5, (i / 7) * 6));
        }
      }
      ctx.restore();

      /* ---- Perspective grid floor ---- */
      const gridDepth = 22;
      const speed = reduce ? 0 : (t * 0.6) % 1;

      // Horizontal receding lines (denser toward horizon)
      for (let i = 0; i < gridDepth; i++) {
        const p = (i + speed) / gridDepth; // 0 at horizon → 1 near viewer
        const y = horizon + Math.pow(p, 2.4) * (H - horizon);
        const alpha = (1 - p) * 0.5 + 0.05;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.strokeStyle = `rgba(232,196,121,${alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Vertical lines converging to vanishing point
      const cols = 18;
      for (let i = -cols; i <= cols; i++) {
        const fx = vpx + (i / cols) * W * 0.5; // x at horizon (near vp)
        const bx = vpx + (i / cols) * W * 2.4; // x at bottom (spread out)
        const grad = ctx.createLinearGradient(fx, horizon, bx, H);
        grad.addColorStop(0, "rgba(192,132,58,0.05)");
        grad.addColorStop(1, "rgba(192,132,58,0.45)");
        ctx.beginPath();
        ctx.moveTo(fx, horizon);
        ctx.lineTo(bx, H);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Horizon glow line
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      ctx.lineTo(W, horizon);
      ctx.strokeStyle = "rgba(232,196,121,0.8)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(232,196,121,0.9)";
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.shadowBlur = 0;

      /* ---- Rising embers (upper half) ---- */
      for (const e of embers) {
        if (!reduce) {
          e.y -= e.s;
          if (e.y < 0) {
            e.y = 1;
            e.x = Math.random();
          }
        }
        const ex = e.x * W;
        const ey = e.y * horizon;
        ctx.beginPath();
        ctx.arc(ex, ey, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${e.hue},${e.a})`;
        ctx.fill();
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    if (reduce) draw();
    else raf = requestAnimationFrame(draw);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* fade the grid into the page at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#04040b] to-transparent" />
    </div>
  );
}

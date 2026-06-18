"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Capability radar (Canvas 2D). Seven QA disciplines plotted as a self-rated
 * proficiency polygon that animates outward + rotates subtly the first time it
 * enters view. Hovering a node is reflected by the legend on the side.
 */

export type Axis = { label: string; value: number; count: number };

export default function CapabilityRadar({ axes }: { axes: Axis[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = axes.length;

    let size = 0;
    let dpr = 1;
    let cx = 0;
    let cy = 0;
    let R = 0;

    const layout = () => {
      const rect = wrap.getBoundingClientRect();
      size = Math.min(rect.width, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = size / 2;
      cy = size / 2;
      R = size * 0.34;
    };
    layout();

    let progress = 0; // 0→1 reveal
    let started = reduce ? false : false;
    let raf = 0;
    let t = 0;
    let hoverIdx = -1;

    const angleFor = (i: number) => -Math.PI / 2 + (i / N) * Math.PI * 2;

    const point = (i: number, radius: number) => {
      const a = angleFor(i);
      return { x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius };
    };

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, size, size);

      // rotating subtle base
      const rot = reduce ? 0 : Math.sin(t * 0.004) * 0.04;

      // grid rings
      for (let ring = 1; ring <= 4; ring++) {
        const rr = (R * ring) / 4;
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const a = angleFor(i) + rot;
          const x = cx + Math.cos(a) * rr;
          const y = cy + Math.sin(a) * rr;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(255,255,255,${0.04 + ring * 0.012})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // spokes + labels
      for (let i = 0; i < N; i++) {
        const a = angleFor(i) + rot;
        const ox = cx + Math.cos(a) * R;
        const oy = cy + Math.sin(a) * R;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ox, oy);
        ctx.strokeStyle =
          hoverIdx === i ? "rgba(232,196,121,0.5)" : "rgba(255,255,255,0.07)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // label
        const lx = cx + Math.cos(a) * (R + 22);
        const ly = cy + Math.sin(a) * (R + 22);
        ctx.font = "600 10px var(--font-mono, monospace)";
        ctx.fillStyle =
          hoverIdx === i ? "rgba(232,196,121,1)" : "rgba(232,234,246,0.6)";
        ctx.textAlign =
          Math.abs(Math.cos(a)) < 0.3 ? "center" : Math.cos(a) > 0 ? "left" : "right";
        ctx.textBaseline = "middle";
        ctx.fillText(axes[i].label.toUpperCase(), lx, ly);
      }

      // value polygon
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const idx = i % N;
        const a = angleFor(idx) + rot;
        const v = axes[idx].value * progress;
        const x = cx + Math.cos(a) * R * v;
        const y = cy + Math.sin(a) * R * v;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, cy - R, 0, cy + R);
      grad.addColorStop(0, "rgba(232,196,121,0.35)");
      grad.addColorStop(1, "rgba(192,132,58,0.28)");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "rgba(232,196,121,0.9)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // vertices
      for (let i = 0; i < N; i++) {
        const a = angleFor(i) + rot;
        const v = axes[i].value * progress;
        const x = cx + Math.cos(a) * R * v;
        const y = cy + Math.sin(a) * R * v;
        const pulse = hoverIdx === i ? 5.5 : 3.2;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 12);
        g.addColorStop(0, "rgba(219,146,89,0.9)");
        g.addColorStop(1, "rgba(219,146,89,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.beginPath();
        ctx.arc(x, y, pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      if (progress < 1) progress = Math.min(1, progress + 0.02);
      if (!reduce) raf = requestAnimationFrame(draw);
      else if (progress < 1) raf = requestAnimationFrame(draw);
    };

    const begin = () => {
      if (started) return;
      started = true;
      progress = reduce ? 1 : 0;
      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          begin();
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(wrap);

    // hover detection
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let best = -1;
      let bestD = 26;
      for (let i = 0; i < N; i++) {
        const p = point(i, R * axes[i].value);
        const d = Math.hypot(mx - p.x, my - p.y);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      hoverIdx = best;
      setHover(best === -1 ? null : best);
    };
    const onLeave = () => {
      hoverIdx = -1;
      setHover(null);
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const onResize = () => {
      layout();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [axes]);

  return (
    <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-4">
      <div
        ref={wrapRef}
        className="relative aspect-square w-full max-w-[440px] flex-shrink-0"
      >
        <canvas ref={canvasRef} className="absolute inset-0 m-auto" />
      </div>

      {/* Legend */}
      <ul className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-col">
        {axes.map((a, i) => (
          <li
            key={a.label}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 transition-all ${
              hover === i
                ? "border-cyan-400/50 bg-cyan-400/10"
                : "border-white/8 bg-white/[0.02]"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg,#22d3ee,#8b5cf6)",
                  boxShadow: hover === i ? "0 0 10px #22d3ee" : "none",
                }}
              />
              <span className="font-mono text-xs uppercase tracking-wider text-white/75">
                {a.label}
              </span>
            </span>
            <span className="font-mono text-xs text-white/40">
              {a.count} tools
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

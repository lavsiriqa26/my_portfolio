"use client";

import { useEffect, useRef } from "react";

/**
 * Hero orbital system (Canvas 2D).
 *
 * Lavanya's core stack rides three slowly-counter-rotating elliptical orbits
 * that ring the headline, each tech a glowing gold satellite trailing a short
 * comet tail. The whole system tilts gently with the pointer for parallax. A
 * soft central veil + a vertical-band fade keep satellites and their labels out
 * of the way of the name, so it reads as a premium "engineering ecosystem"
 * rather than clutter.
 */

type Sat = { orbit: number; a: number; label: string };

const ORBITS = [
  { rx: 0.3, ry: 0.27, speed: 0.16, tilt: -0.18 },
  { rx: 0.42, ry: 0.37, speed: -0.11, tilt: 0.12 },
  { rx: 0.54, ry: 0.47, speed: 0.075, tilt: -0.06 },
];

// Lavanya's real QA-automation stack, grouped by ring and spaced evenly so the
// satellites never bunch together. Inner = core automation, middle = API /
// performance / mobile, outer = CI/CD · management · AI.
const ORBIT_TOOLS = [
  ["SELENIUM", "PLAYWRIGHT", "TESTNG", "CUCUMBER"],
  ["REST ASSURED", "POSTMAN", "JMETER", "SOAPUI", "SEETEST"],
  ["AZURE DEVOPS", "JENKINS", "MAVEN", "GIT", "JIRA", "AI / LLM"],
];
const PHASE = [0.4, 0.0, 0.7];

const SATS: Sat[] = ORBIT_TOOLS.flatMap((tools, orbit) =>
  tools.map((label, i) => ({
    orbit,
    a: PHASE[orbit] + (i / tools.length) * Math.PI * 2,
    label,
  }))
);

export default function HeroOrbit() {
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
    let cx = 0;
    let cy = 0;
    let compact = false;

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
      cx = W / 2;
      cy = H / 2;
      compact = W < 640;
    };
    resize();

    const GOLD = "232,196,121";
    const GOLD_HI = "244,217,143";

    let raf = 0;
    let t = 0;
    const pointer = { x: 0.5, tx: 0.5, y: 0.5, ty: 0.5 };

    const onMove = (e: PointerEvent) => {
      pointer.tx = e.clientX / window.innerWidth;
      pointer.ty = e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // position of a satellite on its (tilted) elliptical orbit
    const satPos = (s: Sat, time: number, tiltBoost: number) => {
      const o = ORBITS[s.orbit];
      const rx = o.rx * W;
      const ry = o.ry * H * 0.5;
      const ang = s.a + time * o.speed;
      const lx = rx * Math.cos(ang);
      const ly = ry * Math.sin(ang);
      const tilt = o.tilt + tiltBoost;
      const x = cx + lx * Math.cos(tilt) - ly * Math.sin(tilt);
      const y = cy + lx * Math.sin(tilt) + ly * Math.cos(tilt);
      return { x, y, ang };
    };

    // fade only the satellites that pass over the headline's box; ones out to
    // the sides (beside the name, not on top of it) stay fully lit + labeled.
    const nameVis = (x: number, y: number) => {
      const dx = Math.abs(x - cx) / (W * 0.33);
      const dy = Math.abs(y - cy) / (H * 0.15);
      const m = Math.max(dx, dy);
      return Math.max(0.12, Math.min(1, (m - 0.85) / 0.45));
    };

    const draw = () => {
      t += reduce ? 0 : 1;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      const tiltBoost = (pointer.x - 0.5) * 0.12;
      const shiftY = (pointer.y - 0.5) * 14;

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(0, shiftY);

      // ---- orbit rings (soft glow) ----
      ctx.shadowColor = `rgba(${GOLD},0.5)`;
      ctx.shadowBlur = 10;
      for (const o of ORBITS) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, o.rx * W, o.ry * H * 0.5, o.tilt + tiltBoost, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${GOLD},0.24)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // ---- central core glow ----
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.16);
      core.addColorStop(0, `rgba(${GOLD},0.14)`);
      core.addColorStop(1, `rgba(${GOLD},0)`);
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, W * 0.16, 0, Math.PI * 2);
      ctx.fill();

      // ---- satellites ----
      const time = t * 0.01;
      for (const s of SATS) {
        const { x, y } = satPos(s, time, tiltBoost);
        const vis = nameVis(x, y);

        // short comet trail (a few sampled positions behind the satellite)
        if (!reduce) {
          for (let k = 1; k <= 6; k++) {
            const tp = satPos(s, time - k * 0.06, tiltBoost);
            const tv = nameVis(tp.x, tp.y) * (1 - k / 7);
            ctx.beginPath();
            ctx.arc(tp.x, tp.y, 2.4 * (1 - k / 8), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${GOLD},${0.22 * tv})`;
            ctx.fill();
          }
        }

        // glow halo
        const halo = ctx.createRadialGradient(x, y, 0, x, y, 32);
        halo.addColorStop(0, `rgba(${GOLD},${0.6 * vis})`);
        halo.addColorStop(1, `rgba(${GOLD},0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, 32, 0, Math.PI * 2);
        ctx.fill();

        // core dot
        ctx.beginPath();
        ctx.arc(x, y, 4.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD_HI},${0.6 + 0.4 * vis})`;
        ctx.fill();

        // label (hidden on compact screens)
        if (!compact) {
          const right = x >= cx;
          ctx.font = "600 11px var(--font-mono, monospace)";
          ctx.textAlign = right ? "left" : "right";
          ctx.textBaseline = "middle";
          ctx.fillStyle = `rgba(${GOLD_HI},${Math.max(0.25, vis)})`;
          ctx.shadowColor = "rgba(10,8,7,0.9)";
          ctx.shadowBlur = 6;
          ctx.fillText(s.label, x + (right ? 12 : -12), y);
          ctx.shadowBlur = 0;
        }
      }

      ctx.restore();

      // ---- central readability veil ----
      const veil = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.36);
      veil.addColorStop(0, "rgba(10,8,7,0.42)");
      veil.addColorStop(0.5, "rgba(10,8,7,0.16)");
      veil.addColorStop(1, "rgba(10,8,7,0)");
      ctx.fillStyle = veil;
      ctx.fillRect(0, 0, W, H);

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
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}

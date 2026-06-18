"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Live automation-pipeline visualization (Canvas 2D).
 *
 * A continuous stream of "test packets" flows left→right through Lavanya's real
 * QA stack — commit → CI build → Selenium → Playwright → API suite → reports →
 * deploy. Packets pulse the node they reach; a small fraction "fail" (amber) and
 * loop back for a retry. A live HUD tallies executed / passed counts. This is the
 * portfolio's core "visualization about the work."
 */

type NodeDef = { id: string; label: string; glyph: string };

const NODES: NodeDef[] = [
  { id: "commit", label: "Commit", glyph: "⌥" },
  { id: "build", label: "CI Build", glyph: "⚙" },
  { id: "selenium", label: "Selenium", glyph: "◉" },
  { id: "playwright", label: "Playwright", glyph: "▶" },
  { id: "api", label: "API Suite", glyph: "⇄" },
  { id: "report", label: "Reports", glyph: "▤" },
  { id: "deploy", label: "Deploy", glyph: "🚀" },
];

export default function PipelineCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [executed, setExecuted] = useState(0);
  const [passed, setPassed] = useState(0);
  const counts = useRef({ executed: 0, passed: 0 });

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

    // Node screen positions (computed on resize), normalized layout in an S-curve
    type Node = NodeDef & { x: number; y: number; pulse: number };
    let nodes: Node[] = [];

    const layout = () => {
      const rect = wrap.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const n = NODES.length;
      const padX = Math.max(40, W * 0.06);
      const usableW = W - padX * 2;
      nodes = NODES.map((nd, i) => {
        const t = n === 1 ? 0 : i / (n - 1);
        const x = padX + usableW * t;
        // gentle vertical wave
        const y = H / 2 + Math.sin(t * Math.PI * 2) * (H * 0.16);
        return { ...nd, x, y, pulse: 0 };
      });
    };
    layout();

    const colors = {
      cyan: "232,196,121",
      violet: "192,132,58",
      magenta: "219,146,89",
      amber: "251,191,36",
      green: "52,211,153",
    };

    // Packets travel along an edge index (from node i → i+1) with progress p∈[0,1]
    type Packet = {
      seg: number;
      p: number;
      speed: number;
      fail: boolean;
      retry: boolean;
      hue: string;
    };
    const packets: Packet[] = [];

    const spawn = () => {
      const fail = Math.random() < 0.12;
      packets.push({
        seg: 0,
        p: 0,
        speed: 0.0026 + Math.random() * 0.0022,
        fail,
        retry: false,
        hue: fail ? colors.amber : Math.random() < 0.5 ? colors.cyan : colors.violet,
      });
    };

    // edge curve point: quadratic-ish using midpoint control for a smooth arc
    const edgePoint = (a: Node, b: Node, p: number) => {
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2 - 26; // arc lift
      const x = (1 - p) * (1 - p) * a.x + 2 * (1 - p) * p * mx + p * p * b.x;
      const y = (1 - p) * (1 - p) * a.y + 2 * (1 - p) * p * my + p * p * b.y;
      return { x, y };
    };

    let raf = 0;
    let t = 0;
    let spawnAcc = 0;

    const drawEdge = (a: Node, b: Node) => {
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2 - 26;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(mx, my, b.x, b.y);
      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      // animated dash glow
      ctx.save();
      ctx.setLineDash([2, 14]);
      ctx.lineDashOffset = -t * 0.06;
      ctx.strokeStyle = "rgba(232,196,121,0.35)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.restore();
    };

    const drawNode = (nd: Node) => {
      const r = 5 + nd.pulse * 9;
      // glow
      const g = ctx.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, 34 + nd.pulse * 26);
      g.addColorStop(0, `rgba(${colors.cyan},${0.18 + nd.pulse * 0.4})`);
      g.addColorStop(1, "rgba(232,196,121,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(nd.x, nd.y, 34 + nd.pulse * 26, 0, Math.PI * 2);
      ctx.fill();
      // core ring
      ctx.beginPath();
      ctx.arc(nd.x, nd.y, r + 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${colors.violet},${0.5 + nd.pulse * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // core dot
      ctx.beginPath();
      ctx.arc(nd.x, nd.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colors.cyan},${0.85})`;
      ctx.fill();
      // label
      ctx.font =
        "600 11px var(--font-mono, ui-monospace), monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(232,234,246,0.78)";
      ctx.fillText(nd.label.toUpperCase(), nd.x, nd.y + 30);
      ctx.font = "13px system-ui";
      ctx.fillStyle = "rgba(232,234,246,0.5)";
      ctx.fillText(nd.glyph, nd.x, nd.y - 20);
    };

    const frame = () => {
      t += 1;
      ctx.clearRect(0, 0, W, H);

      // edges
      for (let i = 0; i < nodes.length - 1; i++) drawEdge(nodes[i], nodes[i + 1]);

      // spawn packets on a cadence
      spawnAcc += 1;
      if (spawnAcc > 26) {
        spawnAcc = 0;
        spawn();
      }

      // packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const pk = packets[i];
        pk.p += pk.speed * 16;
        const b = nodes[pk.seg + 1];
        if (!b) {
          packets.splice(i, 1);
          continue;
        }
        if (pk.p >= 1) {
          pk.p = 0;
          // node b reached → pulse it
          b.pulse = 1;
          // a failing packet bounces back one segment once, then turns green
          if (pk.fail && !pk.retry && pk.seg >= 2) {
            pk.retry = true;
            pk.fail = false;
            pk.hue = colors.green;
            pk.seg = Math.max(0, pk.seg - 1);
          } else {
            pk.seg += 1;
          }
          if (pk.seg >= nodes.length - 1) {
            // completed pipeline
            counts.current.executed += 1;
            if (!pk.retry) counts.current.passed += 1;
            else counts.current.passed += 1;
            packets.splice(i, 1);
            continue;
          }
        }
        const pos = edgePoint(nodes[pk.seg], nodes[pk.seg + 1], pk.p);
        // trail
        const trail = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 10);
        trail.addColorStop(0, `rgba(${pk.hue},0.95)`);
        trail.addColorStop(1, `rgba(${pk.hue},0)`);
        ctx.fillStyle = trail;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${pk.hue},1)`;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // nodes + decay pulse
      for (const nd of nodes) {
        drawNode(nd);
        nd.pulse *= 0.92;
      }

      raf = requestAnimationFrame(frame);
    };

    if (reduce) {
      for (let i = 0; i < nodes.length - 1; i++) drawEdge(nodes[i], nodes[i + 1]);
      nodes.forEach(drawNode);
    } else {
      raf = requestAnimationFrame(frame);
    }

    // Sync HUD counters at a calm cadence (not every frame)
    const hud = setInterval(() => {
      setExecuted(counts.current.executed);
      setPassed(counts.current.passed);
    }, 200);

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(hud);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const passRate = executed > 0 ? ((passed / executed) * 100).toFixed(1) : "100.0";

  return (
    <div className="glass holo-border relative overflow-hidden rounded-3xl">
      {/* HUD bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-5 py-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 anim-pulse-ring" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          PIPELINE&nbsp;//&nbsp;LIVE
        </div>
        <div className="flex items-center gap-5 text-white/55">
          <span>
            EXEC{" "}
            <span className="tabular-nums text-cyan-300">
              {executed.toLocaleString()}
            </span>
          </span>
          <span>
            PASS{" "}
            <span className="tabular-nums text-violet-300">
              {passed.toLocaleString()}
            </span>
          </span>
          <span>
            RATE <span className="tabular-nums text-emerald-300">{passRate}%</span>
          </span>
        </div>
      </div>

      {/* Canvas stage */}
      <div ref={wrapRef} className="relative h-[300px] w-full sm:h-[360px]">
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>
    </div>
  );
}

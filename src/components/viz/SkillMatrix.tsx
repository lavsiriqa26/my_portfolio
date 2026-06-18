"use client";

import { useEffect, useRef, useState } from "react";
import { SKILLS } from "@/constants";
import type { Skill } from "@/types";

/**
 * Skill Matrix — a premium bento grid.
 *
 * One tall "signature" tile carries an animated gold proficiency dial for the
 * strongest discipline; the remaining disciplines sit in compact tiles with
 * thin gold meters. Numbers count up and meters/dials fill the first time the
 * grid scrolls into view. Hovering a tile lifts it and warms its tool chips.
 */

type Cat = {
  key: Skill["category"];
  label: string;
  value: number;
  blurb: string;
};

const CATS: Cat[] = [
  { key: "automation", label: "Automation", value: 0.97, blurb: "Core engine" },
  { key: "frameworks", label: "Frameworks", value: 0.9, blurb: "Architecture" },
  { key: "api", label: "API Testing", value: 0.86, blurb: "Contracts & services" },
  { key: "management", label: "Test Mgmt", value: 0.9, blurb: "Governance" },
  { key: "devops", label: "DevOps / CI", value: 0.85, blurb: "Delivery" },
  { key: "ai", label: "AI Testing", value: 0.82, blurb: "Augmented QA" },
  { key: "languages", label: "Languages", value: 0.8, blurb: "Foundations" },
];

const toolsFor = (k: Skill["category"]) =>
  SKILLS.filter((s) => s.category === k).map((s) => s.name);

/** Drives a 0→1 eased progress value once `active` flips true. */
function useProgress(active: boolean) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setP(1);
      return;
    }
    let raf = 0;
    let start = 0;
    const dur = 1500;
    const tick = (t: number) => {
      if (!start) start = t;
      const x = Math.min(1, (t - start) / dur);
      setP(x === 1 ? 1 : 1 - Math.pow(2, -10 * x)); // easeOutExpo
      if (x < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return p;
}

/* ---------- Signature dial tile ---------- */
function FeaturedTile({ cat, p }: { cat: Cat; p: number }) {
  const tools = toolsFor(cat.key);
  const R = 84;
  const C = 2 * Math.PI * R;
  const dash = C * cat.value * p;

  return (
    <div className="group glass holo-border relative flex flex-col items-center overflow-hidden rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-1 lg:row-span-3 lg:justify-center">
      <span className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(232,196,121,0.2),transparent_70%)] opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">
        Signature Discipline
      </p>

      <div className="relative h-[220px] w-[220px]">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id="dialGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f4d98f" />
              <stop offset="55%" stopColor="#e8c479" />
              <stop offset="100%" stopColor="#c0843a" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="url(#dialGold)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${C}`}
            style={{ filter: "drop-shadow(0 0 10px rgba(232,196,121,0.55))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-5xl font-bold text-holo">
            {Math.round(cat.value * 100 * p)}
          </span>
          <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            Mastery
          </span>
        </div>
      </div>

      <h3 className="mt-6 font-display text-2xl font-bold text-white">
        {cat.label}
      </h3>
      <p className="mt-1 font-mono text-xs text-white/35">
        {tools.length} tools · {cat.blurb}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {tools.map((t) => (
          <span
            key={t}
            className="rounded-full border border-cyan-400/15 bg-cyan-400/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/55 transition-colors group-hover:border-cyan-400/30 group-hover:text-cyan-300/80"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Compact meter tile ---------- */
function MeterTile({ cat, p, delay }: { cat: Cat; p: number; delay: number }) {
  const tools = toolsFor(cat.key);
  // each tile's fill lags slightly for a cascade feel
  const local = Math.max(0, Math.min(1, (p - delay) / (1 - delay || 1)));

  return (
    <div className="group glass holo-border relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 lg:min-h-[164px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-white">
            {cat.label}
          </h3>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-white/30">
            {tools.length} tools · {cat.blurb}
          </p>
        </div>
        <span className="font-display text-3xl font-bold leading-none text-holo tabular-nums">
          {Math.round(cat.value * 100 * local)}
        </span>
      </div>

      {/* gold meter */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${cat.value * local * 100}%`,
            background: "linear-gradient(90deg,#cda04e,#e8c479,#f4d98f)",
            boxShadow: "0 0 10px rgba(232,196,121,0.5)",
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tools.slice(0, 4).map((t) => (
          <span
            key={t}
            className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/40 transition-colors group-hover:text-white/60"
          >
            {t}
          </span>
        ))}
        {tools.length > 4 && (
          <span className="px-1 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan-300/60">
            +{tools.length - 4}
          </span>
        )}
      </div>
    </div>
  );
}

export default function SkillMatrix() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const p = useProgress(active);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [featured, ...rest] = CATS;

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3"
    >
      <FeaturedTile cat={featured} p={p} />
      {rest.map((c, i) => (
        <MeterTile key={c.key} cat={c} p={p} delay={i * 0.06} />
      ))}
    </div>
  );
}

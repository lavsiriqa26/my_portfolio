"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "@/components/viz/CountUp";
import Magnetic from "@/components/fx/Magnetic";
import HeroOrbit from "@/components/viz/HeroOrbit";

function useDecrypt(text: string, speed = 30) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*<>[]{}/\\";
    let frame = 0;
    const total = text.length;
    let raf = 0;
    let last = 0;
    const run = (t: number) => {
      if (t - last >= speed) {
        last = t;
        const revealed = Math.floor(frame / 2);
        let s = "";
        for (let i = 0; i < total; i++) {
          if (i < revealed || text[i] === " ") s += text[i];
          else s += chars[(Math.random() * chars.length) | 0];
        }
        setOut(s);
        frame++;
        if (revealed >= total) {
          setOut(text);
          return;
        }
      }
      raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [text, speed]);
  return out;
}

export default function Hero() {
  const name = useDecrypt("Lavanya S");
  const role = "QA Automation Engineer";

  const go = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24"
    >
      <HeroOrbit />
      <div className="hero-stagger relative z-10 mx-auto w-full max-w-5xl text-center">
        {/* Status badge */}
        <div className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2.5 rounded-full glass holo-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 anim-pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for Opportunities · Atlanta, GA
          </span>
        </div>

        {/* Name */}
        <div>
          <h1 className="font-display text-[12vw] font-bold leading-[0.85] tracking-tighter text-white sm:text-[10vw] md:text-[7.5rem]">
            <span
              data-text={name}
              className="glitch text-holo text-glow-violet inline-block pb-[0.18em]"
            >
              {name}
            </span>
          </h1>
        </div>

        {/* Role typewriter */}
        <div>
          <p className="mt-6 font-mono text-sm uppercase tracking-[0.3em] text-cyan-300 sm:text-lg md:text-xl">
            <span className="text-white/20">{"// "}</span>
            {role}
            <span className="caret text-fuchsia-400">▋</span>
          </p>
        </div>

        {/* Stats strip */}
        <div>
          <div className="mx-auto mt-14 flex max-w-3xl flex-wrap items-stretch justify-center gap-px overflow-hidden rounded-2xl glass holo-border">
            {[
              { to: 14, suffix: "+", label: "Years" },
              { to: 35, suffix: "+", label: "Tools" },
              { to: 4, suffix: "", label: "Enterprises" },
              { to: 3, suffix: "", label: "Domains" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex-1 px-5 py-6 transition-colors hover:bg-white/[0.04]"
              >
                <CountUp
                  to={s.to}
                  suffix={s.suffix}
                  className="block text-holo font-display text-4xl font-bold sm:text-5xl"
                />
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Magnetic>
            <button
              onClick={() => go("#systems")}
              className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 px-10 py-4 font-mono text-sm font-semibold uppercase tracking-wider text-[#0a0807] shadow-lg shadow-violet-500/40 transition-transform hover:scale-[1.03] sm:w-auto"
            >
              <span className="relative z-10">Explore My Work</span>
              <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </Magnetic>
          <Magnetic>
            <button
              onClick={() => go("#contact")}
              className="w-full rounded-full glass holo-border px-10 py-4 font-mono text-sm font-semibold uppercase tracking-wider text-white/90 transition-colors hover:text-cyan-300 sm:w-auto"
            >
              Get In Touch
            </button>
          </Magnetic>
        </div>

        {/* Scroll cue */}
        <div>
          <button
            onClick={() => go("#systems")}
            className="mt-16 inline-block text-white/30 transition-colors hover:text-cyan-300"
            aria-label="Scroll down"
          >
            <span className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
              <span className="h-2.5 w-1 animate-bounce rounded-full bg-cyan-300" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

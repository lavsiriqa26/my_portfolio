"use client";

import { useEffect, useRef } from "react";
import { EXPERIENCE } from "@/constants";
import SectionHeading from "@/components/ui/SectionHeading";

const COLOR_MAP: Record<string, { ring: string; bg: string; text: string; glow: string }> = {
  cyan: {
    ring: "ring-cyan-400/40",
    bg: "bg-cyan-400/10",
    text: "text-cyan-300",
    glow: "rgba(232,196,121,0.4)",
  },
  violet: {
    ring: "ring-violet-400/40",
    bg: "bg-violet-400/10",
    text: "text-violet-300",
    glow: "rgba(192,132,58,0.4)",
  },
  fuchsia: {
    ring: "ring-fuchsia-400/40",
    bg: "bg-fuchsia-400/10",
    text: "text-fuchsia-300",
    glow: "rgba(219,146,89,0.4)",
  },
  emerald: {
    ring: "ring-emerald-400/40",
    bg: "bg-emerald-400/10",
    text: "text-emerald-300",
    glow: "rgba(52,211,153,0.4)",
  },
  rose: {
    ring: "ring-rose-400/40",
    bg: "bg-rose-400/10",
    text: "text-rose-300",
    glow: "rgba(251,113,133,0.4)",
  },
};

function Card({
  exp,
  index,
}: {
  exp: (typeof EXPERIENCE)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const colors = COLOR_MAP[exp.color] ?? COLOR_MAP.cyan;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.style.transitionDelay = `${index * 120}ms`;
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index]);

  return (
    <div ref={ref} className="card-enter group relative">
      {/* Connecting line to next card */}
      {index < EXPERIENCE.length - 1 && (
        <div className="absolute left-1/2 top-full z-0 h-12 w-px -translate-x-1/2 bg-gradient-to-b from-white/10 to-transparent sm:h-16" />
      )}

      <div
        className="card-glow relative overflow-hidden rounded-3xl p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg sm:p-9"
        style={{ "--border-angle": "0deg" } as React.CSSProperties}
        data-cursor
      >
        {/* Glow orb */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
          style={{ background: colors.glow }}
        />

        {/* Top row: domain + period */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-lg px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${colors.bg} ${colors.text} ring-1 ${colors.ring}`}
            >
              {exp.domain}
            </span>
            {exp.current && (
              <span className="rounded-lg bg-emerald-400/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-400/30">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Now
              </span>
            )}
          </div>
          <span className="font-mono text-xs text-white/30">{exp.period}</span>
        </div>

        {/* Role + Company */}
        <h3 className="mt-5 font-display text-2xl font-bold text-white sm:text-3xl">
          {exp.role}
        </h3>
        <p className="mt-1.5 text-base">
          {exp.url ? (
            <a
              href={exp.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              className={`group/link inline-flex items-center gap-1 font-semibold ${colors.text} transition-opacity hover:opacity-80`}
            >
              {exp.company}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-3.5 w-3.5 opacity-50 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
          ) : (
            <span className={`font-semibold ${colors.text}`}>{exp.company}</span>
          )}
          <span className="text-white/25"> · </span>
          <span className="text-white/35">{exp.location}</span>
        </p>

        {/* Tech pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {exp.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/50 transition-colors group-hover:border-white/10 group-hover:text-white/65"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading index="03" kicker="Career" title="Journey" />

        <div className="flex flex-col gap-12 sm:gap-16">
          {EXPERIENCE.map((exp, i) => (
            <Card key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

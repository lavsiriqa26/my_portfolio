import Reveal from "@/components/fx/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import PipelineCanvas from "@/components/viz/PipelineCanvas";
import CountUp from "@/components/viz/CountUp";

const IMPACT = [
  { to: 60, suffix: "%", label: "Faster Regression", tint: "text-cyan-300" },
  { to: 100, suffix: "%", label: "Doc Validation", tint: "text-violet-300" },
  { to: 9, suffix: "", label: "Automation Stacks", tint: "text-fuchsia-300" },
  { to: 24, suffix: "/7", label: "CI Coverage", tint: "text-emerald-300" },
];

export default function Systems() {
  return (
    <section id="systems" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="01" kicker="Live Systems" title="The Pipeline" />

        <Reveal>
          <PipelineCanvas />
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {IMPACT.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 80}
              className="glass holo-border rounded-2xl p-6 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <CountUp
                to={s.to}
                suffix={s.suffix}
                className={`block font-display text-4xl font-bold sm:text-5xl ${s.tint}`}
              />
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

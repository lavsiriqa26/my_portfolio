import { EDUCATION } from "@/constants";
import Reveal from "@/components/fx/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Education() {
  return (
    <section id="education" className="relative px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeading index="04" kicker="Foundation" title="Education" />

        <div className="flex flex-col gap-6">
          {EDUCATION.map((edu, i) => (
            <Reveal
              key={edu.id}
              delay={i * 90}
              className="group glass holo-border rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-5">
                  <span className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/15 to-violet-500/15 ring-1 ring-white/10">
                    <span className="bg-gradient-to-br from-cyan-300 to-violet-300 bg-clip-text font-display text-3xl font-bold text-transparent">
                      {edu.degree.charAt(0)}
                    </span>
                    <span className="absolute inset-0 rounded-2xl bg-cyan-400/0 blur-xl transition-colors group-hover:bg-cyan-400/20" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                      {edu.degree}
                    </h3>
                    <p className="mt-1.5 text-sm font-medium text-cyan-300">
                      {edu.institution}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-white/35">
                      {edu.location}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs whitespace-nowrap text-white/35">
                  {edu.period}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

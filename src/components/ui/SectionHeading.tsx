"use client";

import SplitText from "@/components/fx/SplitText";
import Reveal from "@/components/fx/Reveal";

export default function SectionHeading({
  index,
  kicker,
  title,
}: {
  index: string;
  kicker: string;
  title: string;
}) {
  return (
    <div className="mb-16 sm:mb-20">
      <Reveal>
        <div className="mb-4 flex items-center justify-center gap-3 font-mono text-xs tracking-[0.3em] text-cyan-300/60">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400/60" />
          <span className="uppercase">
            <span className="text-fuchsia-400/80">{index}</span> {"//"} {kicker}
          </span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400/60" />
        </div>
      </Reveal>
      <div className="text-center">
        <SplitText
          text={title}
          as="h2"
          className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl"
          charDelay={30}
        />
      </div>
    </div>
  );
}

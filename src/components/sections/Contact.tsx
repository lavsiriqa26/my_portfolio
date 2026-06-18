"use client";

import { SOCIAL_LINKS } from "@/constants";
import Reveal from "@/components/fx/Reveal";
import SplitText from "@/components/fx/SplitText";
import Magnetic from "@/components/fx/Magnetic";

export default function Contact() {
  return (
    <section id="contact" className="relative px-6 py-32">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/60">
            <span className="text-white/20">[05]</span> Connect
          </p>
        </Reveal>

        <SplitText
          text="Let's Build Together"
          as="h2"
          className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-8xl"
          charDelay={25}
        />

        <Reveal delay={200}>
          <p className="mx-auto mt-8 max-w-lg text-lg text-white/45">
            Open to QA leadership, automation architecture, and AI-driven
            testing opportunities.
          </p>
        </Reveal>

        {/* Primary CTA */}
        <Reveal delay={300} className="mt-12">
          <Magnetic>
            <a
              href="mailto:lavanyasirimalla@gmail.com"
              className="group relative inline-block overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 px-12 py-5 font-mono text-base font-semibold uppercase tracking-wider text-[#0a0807] shadow-lg shadow-violet-500/30 transition-transform hover:scale-[1.03]"
            >
              <span className="relative z-10">Say Hello</span>
              <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-700 group-hover:translate-x-full" />
            </a>
          </Magnetic>
        </Reveal>

        {/* Direct links */}
        <Reveal delay={400} className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href="tel:+14706956058"
            className="glass holo-border rounded-full px-6 py-3 font-mono text-sm text-white/50 transition-colors hover:text-cyan-300"
          >
            +1 (470) 695-6058
          </a>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="glass holo-border rounded-full px-6 py-3 font-mono text-sm text-white/50 transition-colors hover:text-cyan-300"
            >
              {link.label}
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

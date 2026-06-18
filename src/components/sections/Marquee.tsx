import { ALL_TECH } from "@/constants";

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div
        className={reverse ? "marquee-track-reverse" : "marquee-track"}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="mx-3 whitespace-nowrap rounded-full border border-white/[0.06] bg-white/[0.02] px-5 py-2 font-mono text-xs uppercase tracking-wider text-white/40 transition-colors hover:border-cyan-400/30 hover:text-cyan-300/70 sm:mx-4 sm:px-6 sm:text-sm"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  const mid = Math.ceil(ALL_TECH.length / 2);
  const row1 = ALL_TECH.slice(0, mid);
  const row2 = ALL_TECH.slice(mid);

  return (
    <section className="relative py-16 sm:py-20">
      <div className="section-divider mb-12" />
      <div className="flex flex-col gap-4">
        <MarqueeRow items={row1} />
        <MarqueeRow items={row2} reverse />
      </div>
      <div className="section-divider mt-12" />
    </section>
  );
}

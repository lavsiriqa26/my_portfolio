import Reveal from "@/components/fx/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillMatrix from "@/components/viz/SkillMatrix";

export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="02" kicker="Capabilities" title="Skill Matrix" />

        <Reveal>
          <SkillMatrix />
        </Reveal>
      </div>
    </section>
  );
}

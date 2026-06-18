import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Systems from "@/components/sections/Systems";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Systems />
      <Skills />
      <Experience />
      <Education />
      <Contact />
    </>
  );
}

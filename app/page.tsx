import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Experience } from "@/components/experience";
import { Skills } from "@/components/skills";
import { Certifications } from "@/components/certifications";
import { Education } from "@/components/education";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />

        {/* Section dividers with blue accent gradient line */}
        <div className="section-line mx-auto max-w-5xl" />

        <Projects />

        <div className="section-line mx-auto max-w-5xl" />

        <Experience />

        <div className="section-line mx-auto max-w-5xl" />

        <Skills />

        <div className="section-line mx-auto max-w-5xl" />

        <Certifications />

        <div className="section-line mx-auto max-w-5xl" />

        <Education />

        <div className="section-line mx-auto max-w-5xl" />

        <Contact />
      </main>

      <Footer />
    </>
  );
}

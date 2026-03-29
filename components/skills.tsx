"use client";

import { motion } from "framer-motion";
import { DATA } from "@/data/resume";
import { SectionHeading } from "./section-heading";
import { Code2, Bot, Wrench, Languages } from "lucide-react";

const skillCategories = [
  {
    key: "technical" as const,
    label: "Languages & Programming",
    icon: <Code2 className="w-4 h-4" />,
  },
  {
    key: "ai" as const,
    label: "AI Tools",
    icon: <Bot className="w-4 h-4" />,
  },
  {
    key: "tools" as const,
    label: "Developer Tools & Platforms",
    icon: <Wrench className="w-4 h-4" />,
  },
  {
    key: "languages" as const,
    label: "Languages",
    icon: <Languages className="w-4 h-4" />,
  },
];

export function Skills() {
  return (
    <section id="skills" className="relative px-6 md:px-12 py-24">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="Skills"
          subtitle="Technologies and tools I work with."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="rounded-xl border border-border bg-card/30 p-6 hover:bg-card/50 transition-all duration-300"
            >
              {/* Category header */}
              <div className="flex items-center gap-2.5 mb-5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                  {category.icon}
                </div>
                <h3 className="text-sm font-semibold text-foreground tracking-wide">
                  {category.label}
                </h3>
              </div>

              {/* Skill pills */}
              <div className="flex flex-wrap gap-2">
                {DATA.skills[category.key].map((skill, j) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.1 + j * 0.03,
                    }}
                    viewport={{ once: true }}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { DATA } from "@/data/resume";
import { SectionHeading } from "./section-heading";
import { Briefcase, MapPin, Calendar } from "lucide-react";

export function Experience() {
  return (
    <section id="experience" className="relative px-6 md:px-12 py-24">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="Experience"
          subtitle="Where I've applied my skills in the real world."
        />

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] md:left-[23px] top-0 bottom-0 w-px bg-border" />

          {DATA.experience.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative pl-12 md:pl-16 pb-12 last:pb-0"
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-[14px] md:left-[18px] top-1 w-[12px] h-[12px] rounded-full ${
                  i === 0
                    ? "bg-primary timeline-dot-active"
                    : "bg-muted-foreground/30 timeline-dot"
                }`}
              />

              {/* Card */}
              <div className="rounded-xl border border-border bg-card/30 p-6 hover:bg-card/60 hover:border-border transition-all duration-300 glow-card">
                {/* Role + Company */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {exp.role}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-primary" />
                      {exp.company}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {exp.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.period}
                    </span>
                  </div>
                </div>

                {/* Description bullets */}
                <ul className="space-y-3">
                  {exp.description.map((bullet, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-[7px] shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

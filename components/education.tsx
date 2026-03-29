"use client";

import { motion } from "framer-motion";
import { DATA } from "@/data/resume";
import { SectionHeading } from "./section-heading";
import { GraduationCap, MapPin, Calendar, BookOpen } from "lucide-react";

export function Education() {
  return (
    <section className="relative px-6 md:px-12 py-24">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="Education"
          subtitle="Academic foundation and notable achievements."
        />

        <div className="grid gap-6">
          {DATA.education.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
              className="rounded-xl border border-border bg-card/30 p-6 hover:bg-card/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {edu.degree}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      {edu.institution}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {edu.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {edu.period}
                    </span>
                  </div>

                  {edu.details.length > 0 && (
                    <ul className="space-y-2">
                      {edu.details.map((detail, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-[7px] shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { DATA } from "@/data/resume";
import { SectionHeading } from "./section-heading";
import { Award, ShieldCheck } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "Data Analytics": <Award className="w-4 h-4" />,
  "AI & Networking": <ShieldCheck className="w-4 h-4" />,
};

export function Certifications() {
  return (
    <section className="relative px-6 md:px-12 py-24">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="Certifications"
          subtitle="Professional credentials and completed specializations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DATA.certifications.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
              className="rounded-xl border border-border bg-card/30 p-6"
            >
              {/* Category header */}
              <div className="flex items-center gap-2.5 mb-5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                  {categoryIcons[group.category]}
                </div>
                <h3 className="text-sm font-semibold text-foreground tracking-wide">
                  {group.category}
                </h3>
              </div>

              {/* Cert items */}
              <ul className="space-y-3">
                {group.items.map((cert, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 + j * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-[7px] shrink-0" />
                    <div>
                      <p className="text-sm text-foreground font-medium leading-snug">
                        {cert.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {cert.issuer}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { DATA } from "@/data/resume";
import { SectionHeading } from "./section-heading";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

export function Contact() {
  return (
    <section id="contact" className="relative px-6 md:px-12 py-24">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="Get in Touch"
          subtitle="Let's build something great together."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-2xl border border-border bg-card/30 p-8 md:p-12 overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-glow">
              Let&apos;s work together
              <span className="text-primary">.</span>
            </h3>
            <p className="text-muted-foreground max-w-xl mb-8 leading-relaxed">
              I&apos;m open to freelance opportunities, internships, and full-time roles
              in software engineering. If you have a project or idea you&apos;d like
              to discuss, feel free to reach out.
            </p>

            {/* Contact links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <a
                href={`mailto:${DATA.email}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-background/50 p-4 hover:border-primary/50 hover:bg-card transition-all duration-300"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                    {DATA.email}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto transition-colors" />
              </a>

              <a
                href={`tel:${DATA.phone}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-background/50 p-4 hover:border-primary/50 hover:bg-card transition-all duration-300"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                    Phone
                  </p>
                  <p className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                    {DATA.phone}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto transition-colors" />
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase">
                Also on
              </span>
              <a
                href={DATA.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors animated-underline"
              >
                <GithubIcon className="w-4 h-4" />
                GitHub
              </a>
              <a
                href={DATA.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors animated-underline"
              >
                <LinkedinIcon className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

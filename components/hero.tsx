"use client";

import { motion } from "framer-motion";
import { DATA } from "@/data/resume";
import { ArrowRight, Download, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6 },
  },
};

export function Hero() {
  return (
    <section
      id="about"
      className="relative flex min-h-[100svh] flex-col justify-center px-6 md:px-12 pt-24 pb-16 overflow-hidden"
    >
      {/* Blue radial glow — brand kit signature */}
      <div className="glow-hero absolute inset-0 pointer-events-none" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250,250,250,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(250,250,250,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto w-full z-10"
      >
        {/* Greeting */}
        <motion.p
          variants={item}
          className="text-primary font-mono mb-6 text-sm md:text-base tracking-wide"
        >
          Hi, my name is
        </motion.p>

        {/* Name — Large, bold, with glow */}
        <motion.h1
          variants={item}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground mb-4 text-glow"
        >
          {DATA.name}
          <span className="text-primary">.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          variants={item}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-muted-foreground mb-8"
        >
          I build scalable systems.
        </motion.h2>

        {/* About paragraph */}
        <motion.p
          variants={item}
          className="max-w-2xl text-base md:text-lg text-muted-foreground mb-12 leading-relaxed"
        >
          {DATA.about}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={item} className="flex flex-wrap items-center gap-4 mb-16">
          <a
            href="#projects"
            className="group inline-flex h-12 items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(74,158,255,0.3)] hover:scale-[1.02] gap-2"
          >
            View Projects
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href={DATA.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-card/50 px-6 font-medium transition-all duration-300 hover:border-primary/50 hover:bg-card gap-2"
          >
            Resume
            <Download className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={item}
          className="flex items-center gap-5 pt-8 border-t border-border/30"
        >
          <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase mr-2">
            Find me on
          </span>
          <a
            href={DATA.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-200"
            aria-label="GitHub"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href={DATA.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a
            href={`mailto:${DATA.email}`}
            className="text-muted-foreground hover:text-primary transition-colors duration-200"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-muted-foreground/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

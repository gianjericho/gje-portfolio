"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  title,
  subtitle,
  align = "left",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`mb-16 ${align === "center" ? "text-center" : ""}`}
    >
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
        {title}
        <span className="text-primary">.</span>
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-2xl">
          {subtitle}
        </p>
      )}
      <div className="mt-4 w-12 h-[2px] bg-gradient-to-r from-primary to-accent rounded-full" />
    </motion.div>
  );
}

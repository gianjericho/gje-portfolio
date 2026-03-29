"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DATA } from "@/data/resume";
import { SectionHeading } from "./section-heading";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  Smartphone,
} from "lucide-react";
import { GithubIcon } from "@/components/icons";

type Category = "all" | "web" | "mobile";

const categoryIcons: Record<string, React.ReactNode> = {
  web: <Globe className="w-3.5 h-3.5" />,
  mobile: <Smartphone className="w-3.5 h-3.5" />,
};

export function Projects() {
  const [filter, setFilter] = useState<Category>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories: { label: string; value: Category }[] = [
    { label: "All", value: "all" },
    { label: "Web", value: "web" },
    { label: "Mobile", value: "mobile" },
  ];

  const filteredProjects =
    filter === "all"
      ? DATA.projects
      : DATA.projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative px-6 md:px-12 py-24">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="Projects"
          subtitle="Real-world systems I've designed, built, and deployed."
        />

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === cat.value
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(74,158,255,0.2)]"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Project Cards */}
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => {
              const isExpanded = expandedId === project.id;

              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="group relative rounded-xl border border-border bg-card/50 p-6 md:p-8 glow-card transition-all duration-300"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                        {categoryIcons[project.category]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                          {project.category} Application
                        </span>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-2">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                        aria-label={`View ${project.title} on GitHub`}
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
                          aria-label={`View ${project.title} live demo`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Expandable details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                          {project.longDescription}
                        </p>

                        {/* Key Features */}
                        <div className="mb-4">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-primary mb-3">
                            Key Features
                          </h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {project.highlights.map((highlight, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-muted/50 text-muted-foreground border border-border/50 font-mono text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Expand toggle */}
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : project.id)
                    }
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent transition-colors font-medium"
                  >
                    {isExpanded ? (
                      <>
                        Show Less <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Read More <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

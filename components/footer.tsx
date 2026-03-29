import { DATA } from "@/data/resume";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="relative px-6 md:px-12 py-12 border-t border-border/50">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left — Branding */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-sm font-bold text-foreground tracking-tight">
            {DATA.initials}
            <span className="text-primary">.</span>
          </span>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {DATA.name}. All rights reserved.
          </p>
        </div>

        {/* Center — Built with */}
        <p className="text-xs text-muted-foreground/60">
          Built with Next.js, Tailwind CSS & Framer Motion
        </p>

        {/* Right — Social */}
        <div className="flex items-center gap-4">
          <a
            href={DATA.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href={DATA.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${DATA.email}`}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

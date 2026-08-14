// ============================================================================
// MODULAR DATA LAYER — Single Source of Truth
// ============================================================================
// Content is now managed by Decap CMS via data/resume.json
// ============================================================================

import rawData from "./resume.json";

export type Project = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  category: "web" | "mobile" | "iot" | "automation" | "media";
  highlights: string[];
};

export type Experience = {
  company: string;
  location: string;
  role: string;
  period: string;
  description: string[];
};

export type Education = {
  institution: string;
  location: string;
  degree: string;
  period: string;
  details: string[];
};

export type CertificationCategory = {
  category: string;
  items: { name: string; issuer: string }[];
};

export type ResumeData = {
  name: string;
  initials: string;
  title: string;
  location: string;
  locationLink: string;
  about: string;
  summary: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  youtube: string;
  resumeUrl: string;
  navLinks: { label: string; href: string }[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skills: {
    technical: string[];
    ai: string[];
    tools: string[];
    languages: string[];
    media: string[];
  };
  certifications: CertificationCategory[];
};

export const DATA: ResumeData = rawData as ResumeData;

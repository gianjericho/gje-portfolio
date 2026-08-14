import type { ResumeData } from "../../data/resume";

export const MAX_PROJECT_HIGHLIGHTS = 2;

export type ResumePdfData = {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  youtube: string;
  summary: string;
  experience: {
    company: string;
    location: string;
    role: string;
    period: string;
    description: string[];
  }[];
  projects: { title: string; techStack: string[]; highlights: string[] }[];
  education: { institution: string; degree: string; period: string }[];
  skills: { label: string; items: string[] }[];
  certificationsLine: string;
};

const SKILL_GROUPS: { key: keyof ResumeData["skills"]; label: string }[] = [
  { key: "technical", label: "Languages & Programming" },
  { key: "tools", label: "Developer Tools & Platforms" },
  { key: "ai", label: "AI Tools" },
  { key: "media", label: "Content & Media" },
  { key: "languages", label: "Spoken Languages" },
];

function requireText(value: string | undefined, field: string): string {
  if (!value || value.trim() === "") {
    throw new Error(`resume.json is missing a required field: ${field}`);
  }
  return value;
}

export function select(data: ResumeData): ResumePdfData {
  requireText(data.name, "name");
  requireText(data.title, "title");
  requireText(data.location, "location");
  requireText(data.email, "email");
  requireText(data.phone, "phone");
  requireText(data.github, "github");
  requireText(data.linkedin, "linkedin");
  requireText(data.youtube, "youtube");
  requireText(data.summary, "summary");
  if (!data.experience || data.experience.length === 0) {
    throw new Error("resume.json is missing a required field: experience");
  }

  return {
    name: data.name,
    title: data.title,
    location: data.location,
    email: data.email,
    phone: data.phone,
    github: data.github,
    linkedin: data.linkedin,
    youtube: data.youtube,
    summary: data.summary,
    experience: data.experience.map((e) => ({
      company: e.company,
      location: e.location,
      role: e.role,
      period: e.period,
      description: [...e.description],
    })),
    projects: data.projects
      .filter((p) => p.featured)
      .map((p) => ({
        title: p.title,
        techStack: [...p.techStack],
        highlights: p.highlights.slice(0, MAX_PROJECT_HIGHLIGHTS),
      })),
    education: data.education.map((e) => ({
      institution: e.institution,
      degree: e.degree,
      period: e.period,
    })),
    // `?? 0` guards against malformed JSON surviving the unchecked `rawData as
    // ResumeData` cast in data/resume.ts — not required by strict mode itself,
    // since keyof ResumeData["skills"] only resolves to non-optional string[]
    // properties, but a defensive runtime guard against bad data.
    skills: SKILL_GROUPS.filter((g) => (data.skills[g.key]?.length ?? 0) > 0).map((g) => ({
      label: g.label,
      items: [...data.skills[g.key]],
    })),
    certificationsLine: data.certifications
      .flatMap((c) => c.items.map((i) => i.name))
      .join(" · "),
  };
}

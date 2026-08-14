import type { ResumeData } from "../../data/resume";

export const MAX_PROJECT_HIGHLIGHTS = 2;

// react-pdf renders Helvetica/Helvetica-Bold under WinAnsiEncoding (roughly
// Windows-1252) with no embedded font. Any character outside that single-byte
// encoding gets silently remapped by react-pdf to whatever WinAnsi glyph
// happens to share the low byte of its code point — e.g. the arrow "→"
// (U+2192) becomes byte 0x92, which WinAnsi defines as a curly closing quote
// ("'"), not an arrow. This is invisible on the live site (real browsers use
// Unicode-capable fonts) and only breaks the generated PDF, so the fix lives
// here rather than in resume.json's authored text.
//
// EXPLICIT_SUBSTITUTIONS covers specific characters worth a deliberate ASCII
// equivalent rather than a generic drop. SAFE_EXTENDED_CHARS is the set of
// non-ASCII characters WinAnsiEncoding *does* support (curly quotes, en/em
// dash, ellipsis, bullet, trademark, and the Latin-1 Supplement block used by
// accented Latin letters) — anything outside ASCII and outside this set gets
// replaced with "?" as a last resort so unanticipated symbols never silently
// turn into the wrong glyph again.
const EXPLICIT_SUBSTITUTIONS: Record<string, string> = {
  "→": "->", // →
  "←": "<-", // ←
  "↔": "<->", // ↔
  "⇒": "=>", // ⇒
  "⇐": "<=", // ⇐
  "⇔": "<=>", // ⇔
  "−": "-", // − minus sign
};

const SAFE_EXTENDED_CHARS = new Set([
  "‘", // '
  "’", // '
  "‚", // ‚
  "“", // "
  "”", // "
  "„", // „
  "–", // – en dash
  "—", // — em dash
  "†", // †
  "‡", // ‡
  "•", // • bullet
  "…", // … ellipsis
  "‰", // ‰
  "‹", // ‹
  "›", // ›
  "™", // ™
  "Œ", // Œ
  "œ", // œ
  "Š", // Š
  "š", // š
  "Ÿ", // Ÿ
  "Ž", // Ž
  "ž", // ž
  "ƒ", // ƒ
  "ˆ", // ˆ
  "˜", // ˜
  "€", // €
]);

function isWinAnsiSafe(char: string): boolean {
  const code = char.codePointAt(0)!;
  if (code >= 0x20 && code <= 0x7e) return true; // printable ASCII
  if (code === 0x09 || code === 0x0a || code === 0x0d) return true; // tab/newline
  if (code >= 0xa0 && code <= 0xff) return true; // Latin-1 Supplement
  return SAFE_EXTENDED_CHARS.has(char);
}

/**
 * Sanitizes a string for react-pdf's non-embedded, WinAnsi-encoded standard
 * fonts. Applies known-good ASCII substitutions first, then replaces any
 * remaining WinAnsi-unsafe character with "?" so an unanticipated symbol
 * fails loudly and visibly rather than silently rendering as the wrong
 * glyph.
 */
export function toPdfSafe(text: string): string {
  let result = "";
  for (const char of text) {
    if (EXPLICIT_SUBSTITUTIONS[char]) {
      result += EXPLICIT_SUBSTITUTIONS[char];
    } else if (isWinAnsiSafe(char)) {
      result += char;
    } else {
      result += "?";
    }
  }
  return result;
}

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
    name: toPdfSafe(data.name),
    title: toPdfSafe(data.title),
    location: toPdfSafe(data.location),
    email: toPdfSafe(data.email),
    phone: toPdfSafe(data.phone),
    github: toPdfSafe(data.github),
    linkedin: toPdfSafe(data.linkedin),
    youtube: toPdfSafe(data.youtube),
    summary: toPdfSafe(data.summary),
    experience: data.experience.map((e) => ({
      company: toPdfSafe(e.company),
      location: toPdfSafe(e.location),
      role: toPdfSafe(e.role),
      period: toPdfSafe(e.period),
      description: e.description.map(toPdfSafe),
    })),
    projects: data.projects
      .filter((p) => p.featured)
      .map((p) => ({
        title: toPdfSafe(p.title),
        techStack: p.techStack.map(toPdfSafe),
        highlights: p.highlights.slice(0, MAX_PROJECT_HIGHLIGHTS).map(toPdfSafe),
      })),
    education: data.education.map((e) => ({
      institution: toPdfSafe(e.institution),
      degree: toPdfSafe(e.degree),
      period: toPdfSafe(e.period),
    })),
    // `?? 0` guards against malformed JSON surviving the unchecked `rawData as
    // ResumeData` cast in data/resume.ts — not required by strict mode itself,
    // since keyof ResumeData["skills"] only resolves to non-optional string[]
    // properties, but a defensive runtime guard against bad data.
    skills: SKILL_GROUPS.filter((g) => (data.skills[g.key]?.length ?? 0) > 0).map((g) => ({
      label: toPdfSafe(g.label),
      items: data.skills[g.key].map(toPdfSafe),
    })),
    certificationsLine: toPdfSafe(
      data.certifications.flatMap((c) => c.items.map((i) => i.name)).join(" · "),
    ),
  };
}

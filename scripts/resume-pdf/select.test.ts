import test from "node:test";
import assert from "node:assert/strict";
import { DATA, type ResumeData } from "../../data/resume";
import { select, MAX_PROJECT_HIGHLIGHTS, toPdfSafe } from "./select";

function fixture(overrides: Partial<ResumeData> = {}): ResumeData {
  return {
    name: "Test Person",
    initials: "TP",
    title: "Engineer",
    location: "Somewhere",
    locationLink: "https://example.com",
    about: "about text",
    summary: "summary text",
    email: "test@example.com",
    phone: "+10000000000",
    github: "https://github.com/test",
    linkedin: "https://linkedin.com/in/test",
    youtube: "https://youtube.com/@test",
    resumeUrl: "/Resume.pdf",
    navLinks: [],
    projects: [
      {
        id: "featured-one",
        title: "Featured One",
        description: "short",
        longDescription: "long",
        techStack: ["A"],
        githubUrl: "",
        liveUrl: "",
        featured: true,
        category: "web",
        highlights: ["h1", "h2", "h3", "h4", "h5"],
      },
      {
        id: "hidden-one",
        title: "Hidden One",
        description: "short",
        longDescription: "long",
        techStack: ["B"],
        githubUrl: "",
        liveUrl: "",
        featured: false,
        category: "media",
        highlights: ["h1"],
      },
    ],
    experience: [
      { company: "Newest", location: "R", role: "Role", period: "2026", description: ["a"] },
      { company: "Oldest", location: "R", role: "Role", period: "2024", description: ["b"] },
    ],
    education: [
      { institution: "Uni", location: "L", degree: "BS", period: "2026", details: ["d"] },
    ],
    skills: {
      technical: ["TypeScript"],
      ai: ["Claude API"],
      tools: ["Vercel"],
      languages: ["English"],
      media: ["CapCut"],
    },
    certifications: [
      { category: "Cat A", items: [{ name: "Cert One", issuer: "X" }] },
      { category: "Cat B", items: [{ name: "Cert Two", issuer: "Y" }] },
    ],
    ...overrides,
  };
}

test("keeps only featured projects", () => {
  const result = select(fixture());
  assert.deepEqual(result.projects.map((p) => p.title), ["Featured One"]);
});

test("caps project highlights", () => {
  const result = select(fixture());
  assert.equal(result.projects[0].highlights.length, MAX_PROJECT_HIGHLIGHTS);
  assert.deepEqual(result.projects[0].highlights, ["h1", "h2"]);
});

test("drops long descriptions from projects", () => {
  const result = select(fixture());
  assert.ok(!("longDescription" in result.projects[0]));
});

test("flattens every certification into one line", () => {
  const result = select(fixture());
  assert.equal(result.certificationsLine, "Cert One · Cert Two");
});

test("preserves experience order", () => {
  const result = select(fixture());
  assert.deepEqual(result.experience.map((e) => e.company), ["Newest", "Oldest"]);
});

test("labels skill groups in a fixed order and omits empty ones", () => {
  const result = select(
    fixture({
      skills: {
        technical: ["TypeScript"],
        ai: ["Claude API"],
        tools: [],
        languages: ["English"],
        media: ["CapCut"],
      },
    }),
  );
  assert.deepEqual(result.skills, [
    { label: "Languages & Programming", items: ["TypeScript"] },
    { label: "AI Tools", items: ["Claude API"] },
    { label: "Content & Media", items: ["CapCut"] },
    { label: "Spoken Languages", items: ["English"] },
  ]);
});

test("throws when the name is missing", () => {
  assert.throws(
    () => select(fixture({ name: "" })),
    /name/,
    "a bad CMS edit must fail the build, not ship a broken resume",
  );
});

test("throws when the email is missing", () => {
  assert.throws(() => select(fixture({ email: "   " })), /email/);
});

test("throws when there is no experience", () => {
  assert.throws(() => select(fixture({ experience: [] })), /experience/);
});

test("throws when the title is missing", () => {
  assert.throws(() => select(fixture({ title: "" })), /title/);
});

test("throws when the summary is missing", () => {
  assert.throws(() => select(fixture({ summary: "   " })), /summary/);
});

test("returns copies, not aliases into the input", () => {
  const input = fixture();
  const result = select(input);
  result.experience[0].description.push("mutated");
  result.projects[0].techStack.push("mutated");
  result.skills[0].items.push("mutated");
  assert.deepEqual(input.experience[0].description, ["a"]);
  assert.deepEqual(input.projects[0].techStack, ["A"]);
  assert.deepEqual(input.skills.technical, ["TypeScript"]);
});

test("every real employer survives curation", () => {
  const companies = select(DATA).experience.map((e) => e.company).join(" ");
  for (const employer of ["Jonathan & Cyber", "EagleRev", "Wiser", "CONVERGE ICT"]) {
    assert.ok(companies.includes(employer), `curation dropped ${employer}`);
  }
});

test("toPdfSafe replaces arrows react-pdf's non-embedded fonts can't render", () => {
  const input = "a hook → context → twist → payoff";
  const output = toPdfSafe(input);
  assert.ok(!output.includes("→"), "arrow character must not survive");
  assert.equal(output, "a hook -> context -> twist -> payoff");
});

test("toPdfSafe leaves WinAnsi-safe punctuation untouched", () => {
  // em dash, en dash, curly quotes, and the middle dot are all representable
  // in react-pdf's default WinAnsiEncoding and must not be substituted.
  const input = "em—dash en–dash ‘curly’ “quotes” middle·dot";
  assert.equal(toPdfSafe(input), input);
});

test("toPdfSafe falls back to a visible placeholder for unanticipated symbols", () => {
  assert.equal(toPdfSafe("emoji 🚀 rocket"), "emoji ? rocket");
});

test("select() sanitizes arrows out of project highlights end to end", () => {
  const result = select(
    fixture({
      projects: [
        {
          id: "arrow-project",
          title: "Arrow Project",
          description: "short",
          longDescription: "long",
          techStack: ["A"],
          githubUrl: "",
          liveUrl: "",
          featured: true,
          category: "web",
          highlights: ["hook → context → twist → payoff", "h2"],
        },
      ],
    }),
  );
  const rendered = result.projects[0].highlights.join(" ");
  assert.ok(!rendered.includes("→"), "arrow must not reach the PDF layer");
  assert.ok(rendered.includes("->"), "arrow should be substituted with an ASCII arrow");
});

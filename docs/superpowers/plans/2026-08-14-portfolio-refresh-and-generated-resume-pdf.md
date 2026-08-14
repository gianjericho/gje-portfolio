# Portfolio Refresh + Generated Resume PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the stale content in `data/resume.json` and make `public/Resume.pdf` a build artifact generated from that same file, removing Google Docs from the workflow.

**Architecture:** `data/resume.json` stays the single source of truth. A `prebuild` script reads it, narrows it to one page through a pure curation function, renders it with `@react-pdf/renderer`, and writes `public/Resume.pdf` before `next build` collects the `public/` directory. No headless browser, no running server, no CI step.

**Tech Stack:** Next.js 16.2.1, React 19.2.4, TypeScript 5, Tailwind 4, `@react-pdf/renderer`, `tsx`, `node:test`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-14-portfolio-refresh-and-generated-resume-pdf-design.md`
- Node v24.14.0, npm 11.9.0. Node 24 runs `.ts` natively but **not** `.tsx` — `tsx` is required for the JSX document file and is used uniformly for all scripts and tests.
- `tsconfig.json` already sets `resolveJsonModule: true`, `strict: true`, `jsx: "react-jsx"`, and `include: ["**/*.ts", "**/*.tsx"]`. New files under `scripts/` are type-checked automatically with no tsconfig change.
- This repo has **no existing test infrastructure**. Task 1 introduces `node:test` via `tsx`. No React testing library is added — UI changes are verified by `tsc`, `lint`, and manual browser check, and the plan says so explicitly where that applies.
- `@react-pdf/renderer` and `tsx` are `devDependencies`. Vercel installs devDependencies during builds, so `prebuild` works on deploy.
- Never introduce metrics for the YouTube channel (subscribers, views, monetization status). Explicitly out of scope per the spec.
- Exact channel URL: `https://www.youtube.com/@yourdailykawaii`
- Exact Lead-Gen repo URL: `https://github.com/gianjericho/Lead-Gen`

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `package.json` | Adds `tsx`, `@react-pdf/renderer`, `test`, `resume`, `prebuild` scripts | 1, 7 |
| `data/resume.ts` | Type definitions — gains `media` category, `youtube`, `skills.media`; drops `avatarUrl` | 1 |
| `data/resume.json` | All content | 1, 2, 4 |
| `data/resume.test.ts` | Data-integrity invariants that guard against CMS corruption and content drift | 1, 2, 4 |
| `components/icons.tsx` | Hand-rolled brand SVGs — gains `YoutubeIcon` | 3 |
| `components/hero.tsx` | Social row | 3 |
| `components/footer.tsx` | Social row | 3 |
| `components/contact.tsx` | Social row | 3 |
| `components/projects.tsx` | Category union, icons, filter buttons, display labels, conditional GitHub link | 4 |
| `components/skills.tsx` | Skill group list — gains Content & Media | 4 |
| `public/admin/config.yml` | Sveltia CMS schema | 5 |
| `scripts/resume-pdf/select.ts` | Pure curation: `ResumeData` → one-page `ResumePdfData`. No PDF or filesystem knowledge. | 6 |
| `scripts/resume-pdf/select.test.ts` | Curation unit tests | 6 |
| `scripts/resume-pdf/document.tsx` | React-PDF component tree for the A4 layout. No filesystem knowledge. | 7 |
| `scripts/generate-resume-pdf.tsx` | Entry point: read → select → render → verify page count | 7 |
| `scripts/resume-pdf/generate.test.ts` | Generator smoke test | 7 |
| `.gitignore` | Ignores the derived `public/Resume.pdf` | 7 |

**Deviation from spec, deliberate:** the spec's generator smoke test asserts extracted PDF text contains employer names. Text extraction needs `pdf-parse` (unmaintained, known debug-mode file-read bug) or `pdfjs-dist` (~10MB devDependency that slows every Vercel install). The real risk — content silently dropped during curation — is covered better and more cheaply by asserting employer coverage on the `select()` output (Task 6, Step 9), combined with the page-count assertion on the real PDF (Task 7). Text extraction is dropped.

---

### Task 1: Test infrastructure and schema foundation

Introduces the test runner, then makes the three schema additions and one removal. Nothing renders differently yet — this task exists so later tasks have types and a test harness to build on.

**Files:**
- Modify: `package.json`
- Modify: `data/resume.ts:9-68`
- Modify: `data/resume.json:9` (remove `avatarUrl`), `:13` (add `youtube` after `linkedin`), `:239-276` (add `media` skills group)
- Test: `data/resume.test.ts` (create)

**Interfaces:**
- Consumes: nothing — first task
- Produces:
  - `Project.category` union: `"web" | "mobile" | "iot" | "automation" | "media"`
  - `ResumeData.youtube: string`
  - `ResumeData.skills: { technical: string[]; ai: string[]; tools: string[]; languages: string[]; media: string[] }`
  - `ResumeData` no longer has `avatarUrl`
  - `npm test` runs `node --import tsx --test` over `data/*.test.ts` and `scripts/resume-pdf/*.test.ts`

- [ ] **Step 1: Install the test toolchain**

```bash
npm install --save-dev tsx
```

- [ ] **Step 2: Add the test script**

In `package.json`, add to `"scripts"` (keep the existing four entries):

```json
"test": "node --import tsx --test \"data/*.test.ts\" \"scripts/resume-pdf/*.test.ts\""
```

- [ ] **Step 3: Write the failing test**

Create `data/resume.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { DATA } from "./resume";

test("youtube channel is a first-class social link", () => {
  assert.equal(DATA.youtube, "https://www.youtube.com/@yourdailykawaii");
});

test("media skills group is populated", () => {
  assert.ok(Array.isArray(DATA.skills.media));
  assert.ok(DATA.skills.media.length > 0, "expected at least one media skill");
});

test("no dead avatarUrl reference", () => {
  assert.ok(
    !("avatarUrl" in DATA),
    "avatarUrl points at a nonexistent file and is consumed by no component",
  );
});

test("every project category is one of the five valid values", () => {
  const valid = new Set(["web", "mobile", "iot", "automation", "media"]);
  for (const project of DATA.projects) {
    assert.ok(
      valid.has(project.category),
      `project "${project.id}" has invalid category "${project.category}"`,
    );
  }
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL. The first two tests fail because `DATA.youtube` is `undefined` and `DATA.skills.media` is `undefined`. TypeScript errors on those property accesses are also expected at this point.

- [ ] **Step 5: Update the types**

In `data/resume.ts`, change the `Project` category union (line 18):

```ts
  category: "web" | "mobile" | "iot" | "automation" | "media";
```

In the `ResumeData` type, delete the `avatarUrl: string;` line (line 51), add `youtube` immediately after `linkedin` (line 55), and add `media` to the skills object (lines 61-66) so those parts read:

```ts
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
```

- [ ] **Step 6: Update the data**

In `data/resume.json`, delete the `"avatarUrl"` line entirely, and add `"youtube"` immediately after `"linkedin"`:

```json
  "linkedin": "https://www.linkedin.com/in/gian-espino-7a1270167",
  "youtube": "https://www.youtube.com/@yourdailykawaii",
  "resumeUrl": "/Resume.pdf",
```

Add a `"media"` array to the `"skills"` object, after `"languages"`:

```json
    "languages": [
      "English",
      "Tagalog"
    ],
    "media": [
      "Short-Form Video Production",
      "Retention Editing",
      "Scriptwriting & Hooks",
      "Sound Design",
      "AI Voiceover (ElevenLabs)",
      "YouTube Shorts Strategy"
    ]
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 4/4.

- [ ] **Step 8: Verify types still compile**

Run: `npx tsc --noEmit`
Expected: no output. If `avatarUrl` is referenced anywhere, this surfaces it — a grep confirmed no component consumes it, so no errors are expected.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json data/resume.ts data/resume.json data/resume.test.ts
git commit -m "feat: add youtube and media skills to resume schema, drop dead avatarUrl

Introduces node:test via tsx as the project's first test harness, with
data-integrity tests that guard against CMS schema corruption."
```

---

### Task 2: Correct the experience, education, and summary content

The factual corrections. Pure data plus the tests that lock them in.

**Files:**
- Modify: `data/resume.json:8` (summary), `:155` (Lead-Gen URL), `:168-215` (experience), `:221` (education period), `:239-276` (skills additions)
- Test: `data/resume.test.ts` (extend)

**Interfaces:**
- Consumes: `ResumeData` type and `npm test` from Task 1
- Produces: an `experience` array of five entries in reverse-chronological order — Jonathan & Cyber, EagleRev, Wiser, CONVERGE ICT, College of Engineering and Information Technology

- [ ] **Step 1: Write the failing tests**

Append to `data/resume.test.ts`:

```ts
test("EagleRev is its own employer, not a tool in someone else's bullet", () => {
  const eagleRev = DATA.experience.find((e) => e.company.startsWith("EagleRev"));
  assert.ok(eagleRev, "expected an EagleRev experience entry");
  assert.equal(eagleRev.location, "United States");
  assert.equal(eagleRev.period, "June 2026");
  assert.ok(eagleRev.description.length >= 3);

  const wiser = DATA.experience.find((e) => e.company.startsWith("Wiser"));
  assert.ok(wiser, "expected a Wiser experience entry");
  for (const bullet of wiser.description) {
    assert.ok(
      !bullet.includes("EagleRev"),
      "EagleRev was a separate employer and must not appear as one of Gian's tools",
    );
  }
});

test("Wiser engagement is closed out at June 2026", () => {
  const wiser = DATA.experience.find((e) => e.company.startsWith("Wiser"));
  assert.equal(wiser?.period, "July 2025 – June 2026");
});

test("exactly one engagement is ongoing", () => {
  const ongoing = DATA.experience.filter((e) => e.period.includes("Present"));
  assert.equal(ongoing.length, 1, "only Jonathan & Cyber should be marked Present");
  assert.ok(ongoing[0].company.startsWith("Jonathan & Cyber"));
});

test("the CYBEREYE engagement reflects its real scope", () => {
  const current = DATA.experience.find((e) => e.company.startsWith("Jonathan & Cyber"));
  assert.ok(current, "expected a Jonathan & Cyber experience entry");
  assert.equal(current.period, "July 2026 – Present");
  assert.ok(
    current.description.length >= 5,
    "four bullets undersold a month of production security work",
  );
});

test("the degree is complete, not expected", () => {
  const university = DATA.education.find((e) =>
    e.institution === "Cavite State University",
  );
  assert.equal(university?.period, "June 2026");
  assert.ok(
    !DATA.summary.includes("Currently completing"),
    "summary must not describe an unfinished degree",
  );
});

test("the lead-gen project links to its real repository", () => {
  const leadGen = DATA.projects.find((p) => p.id === "b2b-lead-gen-automation");
  assert.equal(leadGen?.githubUrl, "https://github.com/gianjericho/Lead-Gen");
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL. Six new failures — no EagleRev entry exists, Wiser says `July 2025 – Present`, two entries would match `Present`, Jonathan & Cyber has four bullets, education says `Expected June 2026`, and the Lead-Gen URL is a bare profile.

- [ ] **Step 3: Rewrite the summary**

Replace `data/resume.json` line 8:

```json
  "summary": "I hold a BS in Computer Engineering from Cavite State University and have shipped production systems that process thousands of requests. I bridge the gap between engineering theory and practical field deployment, working across full-stack web development, mobile apps, cloud security integrations, and embedded IoT.",
```

- [ ] **Step 4: Expand the Jonathan & Cyber entry**

Replace the first object in the `"experience"` array (lines 169-180) with:

```json
    {
      "company": "Jonathan & Cyber (Remote)",
      "location": "Remote",
      "role": "Contract Full-Stack Software Engineer",
      "period": "July 2026 – Present",
      "description": [
        "Built the multi-cloud posture layer for a multi-tenant security platform, wiring AWS Security Hub/GuardDuty, Azure Defender for Cloud, and GCP Security Command Center into a tenant-scoped findings pipeline.",
        "Shipped the platform's first outbound integration — SIEM forwarding that pushes findings into customer-owned Splunk (HEC) and Microsoft Sentinel (Logs Ingestion API) instances.",
        "Delivered a vendor risk intelligence module covering supply chain mapping, compliance mentions, breach monitoring, scheduled re-scans, and risk-score history.",
        "Built phishing simulation with real delivery and open-tracking through scoped Microsoft Graph permissions, after diagnosing and abandoning a blocked third-party mail provider.",
        "Integrated Monday.com bi-directionally on production with per-customer field visibility controls, syncing engagement work plans into the customer-facing portal.",
        "Found and fixed a silent SSL certificate-expiry defect affecting every live customer, authored the Postgres migrations, closed a row-level security gap, and promoted releases through GitHub Actions CI on a Next.js/Supabase/Vercel stack."
      ]
    },
```

- [ ] **Step 5: Insert the EagleRev entry**

Insert this object immediately after the Jonathan & Cyber object and before the Wiser object, keeping the array reverse-chronological:

```json
    {
      "company": "EagleRev (Remote)",
      "location": "United States",
      "role": "Client Communications and Outreach Specialist",
      "period": "June 2026",
      "description": [
        "Served as the guide and primary point of contact for EagleRev's clients, walking them through LinkedIn outreach operations, campaign setup, and account questions.",
        "Managed LinkedIn account health across a multi-profile browser fleet (GoLogin, AdsPower), triaging disconnected, restricted, and credit-exhausted accounts.",
        "Built targeted prospect lists in Sales Navigator and manually qualified them to protect sender accounts from platform restriction.",
        "Ran end-to-end campaign QA — variable mapping against source CSVs, message previews, and send scheduling — before release."
      ]
    },
```

- [ ] **Step 6: Close out the Wiser entry**

In the Wiser object, change the period and rewrite the second bullet so EagleRev no longer appears as one of Gian's tools:

```json
      "period": "July 2025 – June 2026",
      "description": [
        "Execute B2B lead generation and data enrichment using Apollo.io, Prospeo, and LinkedIn Sales Navigator.",
        "Orchestrate LinkedIn outreach campaigns and account health checks using Gendo AI and multi-profile browsers (GoLogin/AdsPower).",
        "Architected Claude API workflows to automate personalized outreach and lead qualification.",
        "Managed executive prospecting and CRM data verification for global outreach campaigns."
      ]
```

- [ ] **Step 7: Mark the degree complete**

Change `data/resume.json` line 221:

```json
      "period": "June 2026",
```

- [ ] **Step 8: Fix the Lead-Gen repository URL**

Change `data/resume.json` line 155:

```json
      "githubUrl": "https://github.com/gianjericho/Lead-Gen",
```

- [ ] **Step 9: Add the CYBEREYE stack to skills**

In the `"skills"` object, extend `"ai"` and `"tools"`. Leave `"technical"` and `"languages"` unchanged:

```json
    "ai": [
      "OpenClaw",
      "Antigravity",
      "Claude Code",
      "Gemini",
      "Claude API",
      "ElevenLabs"
    ],
```

Append to the `"tools"` array, after `"Supabase"`:

```json
      "Vercel",
      "PostgreSQL / Row-Level Security",
      "GitHub Actions",
      "Microsoft Graph API",
      "Monday.com API",
      "Splunk",
      "Wazuh"
```

- [ ] **Step 10: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 10/10.

- [ ] **Step 11: Verify the JSON is well-formed and types compile**

Run: `node -e "JSON.parse(require('fs').readFileSync('data/resume.json','utf8')); console.log('valid json')" && npx tsc --noEmit`
Expected: `valid json`, then no tsc output.

- [ ] **Step 12: Commit**

```bash
git add data/resume.json data/resume.test.ts
git commit -m "fix: correct experience history and mark degree complete

Splits EagleRev into its own US-based employer entry (June 2026), closes
out Wiser at June 2026, expands the ongoing CYBEREYE engagement from four
bullets to its real scope, and points the lead-gen project at its repo."
```

---

### Task 3: YouTube social link

Adds the brand icon and renders it in all three social rows.

**Files:**
- Modify: `components/icons.tsx` (append)
- Modify: `components/hero.tsx:115-131`
- Modify: `components/footer.tsx:27-43`
- Modify: `components/contact.tsx:83-99`

**Interfaces:**
- Consumes: `DATA.youtube` from Task 1
- Produces: `YoutubeIcon({ className }: { className?: string })` exported from `components/icons.tsx`

**Verification note:** this task has no automated test. The repo has no React testing library and adding one is scope creep for three anchor tags. Verified by `tsc`, `lint`, and a browser check in Step 6.

- [ ] **Step 1: Add the YoutubeIcon**

Append to `components/icons.tsx`, matching the existing hand-rolled style (`viewBox="0 0 24 24"`, `fill="currentColor"`, default `w-5 h-5`):

```tsx
export function YoutubeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
```

- [ ] **Step 2: Add the icon to the hero social row**

In `components/hero.tsx`, extend the import on line 17-ish to include `YoutubeIcon`:

```tsx
import { GithubIcon, LinkedinIcon, YoutubeIcon } from "@/components/icons";
```

(If the existing import lists only some of these, keep the ones already there and add `YoutubeIcon`.)

Insert this anchor immediately after the LinkedIn anchor (which closes at line ~131), before the `mailto:` anchor:

```tsx
          <a
            href={DATA.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-200"
            aria-label="YouTube"
          >
            <YoutubeIcon className="w-5 h-5" />
          </a>
```

- [ ] **Step 3: Add the icon to the footer social row**

In `components/footer.tsx`, add `YoutubeIcon` to the `@/components/icons` import, then insert after the LinkedIn anchor (closes at line ~43), before the Email anchor. Note the smaller `w-4 h-4` sizing the footer uses:

```tsx
          <a
            href={DATA.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="YouTube"
          >
            <YoutubeIcon className="w-4 h-4" />
          </a>
```

- [ ] **Step 4: Add the icon to the contact social row**

In `components/contact.tsx`, add `YoutubeIcon` to the `@/components/icons` import, then insert after the LinkedIn anchor (closes at line ~99). This row uses labelled links:

```tsx
              <a
                href={DATA.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors animated-underline"
              >
                <YoutubeIcon className="w-4 h-4" />
                YouTube
              </a>
```

- [ ] **Step 5: Verify it compiles and lints**

Run: `npx tsc --noEmit && npm run lint`
Expected: no tsc output, no lint errors.

- [ ] **Step 6: Verify in the browser**

Run: `npm run dev`
Open `http://localhost:3000`. Confirm a YouTube icon appears in three places — the hero's "Find me on" row, the footer's right-hand social group, and the contact section's "Also on" row — and that each one opens `https://www.youtube.com/@yourdailykawaii` in a new tab.

- [ ] **Step 7: Commit**

```bash
git add components/icons.tsx components/hero.tsx components/footer.tsx components/contact.tsx
git commit -m "feat: render YouTube channel in hero, footer, and contact social rows"
```

---

### Task 4: Media category and the Your Daily Kawaii project

Adds the fifth project category end to end, the project entry itself, and the Content & Media skills group. Also fixes two latent UI bugs the new entry exposes: the hardcoded "Application" suffix on the category badge, and the unconditionally rendered GitHub link.

**Files:**
- Modify: `components/projects.tsx:8-43` and `:98`, `:105-113`
- Modify: `components/skills.tsx:6`, `:8-29`
- Modify: `data/resume.json` (append to `projects`)
- Test: `data/resume.test.ts` (extend)

**Interfaces:**
- Consumes: `Project.category` union including `"media"` and `DATA.skills.media` from Task 1
- Produces: `categoryLabels: Record<Exclude<Category, "all">, string>` in `components/projects.tsx`; a project with `id: "your-daily-kawaii"` in the data

- [ ] **Step 1: Write the failing test**

Append to `data/resume.test.ts`:

```ts
test("the YouTube channel is a featured media project with no repo link", () => {
  const channel = DATA.projects.find((p) => p.id === "your-daily-kawaii");
  assert.ok(channel, "expected a your-daily-kawaii project entry");
  assert.equal(channel.category, "media");
  assert.equal(channel.liveUrl, "https://www.youtube.com/@yourdailykawaii");
  assert.equal(channel.githubUrl, "", "yt-automation is unrelated to this channel");
  assert.equal(channel.featured, true);
  assert.ok(channel.highlights.length >= 4);
});

test("no project cites channel growth metrics", () => {
  const channel = DATA.projects.find((p) => p.id === "your-daily-kawaii");
  const text = [
    channel?.description ?? "",
    channel?.longDescription ?? "",
    ...(channel?.highlights ?? []),
  ].join(" ");
  for (const term of ["subscriber", "monetized", "views"]) {
    assert.ok(
      !text.toLowerCase().includes(term),
      `metrics go stale in JSON and are out of scope, found "${term}"`,
    );
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL with "expected a your-daily-kawaii project entry".

- [ ] **Step 3: Add the project entry**

Append to the `"projects"` array in `data/resume.json`, after the `b2b-lead-gen-automation` object:

```json
    {
      "id": "your-daily-kawaii",
      "title": "Your Daily Kawaii — YouTube Shorts Channel",
      "description": "A faceless short-form video channel built on a retention-first production pipeline, from sourcing and scripting through editing and analytics.",
      "longDescription": "An independently operated YouTube Shorts channel where every upload runs through a repeatable pipeline: sourcing raw footage traced back to original posters, scripting on a hook–context–twist–payoff structure, AI voiceover synthesis, and retention-focused editing. Performance is iterated against view-versus-swipe-away and average-view-duration signals rather than vanity counts, and every upload is transformed enough to stay clear of YouTube's reused-content and inauthentic-content policies.",
      "techStack": [
        "CapCut",
        "ElevenLabs",
        "Google AI Studio",
        "Cobalt.tools",
        "YouTube Studio"
      ],
      "githubUrl": "",
      "liveUrl": "https://www.youtube.com/@yourdailykawaii",
      "featured": true,
      "category": "media",
      "highlights": [
        "Retention-first scripting on a hook → context → twist → payoff structure",
        "Editing for retention: dead-air removal, centered auto-captions, sound design, and dynamic framing",
        "AI voiceover synthesis via ElevenLabs with ideation support from Google AI Studio",
        "Iteration driven by view-versus-swipe-away and average-view-duration signals",
        "Rights-safe source transformation to stay within monetization policy"
      ]
    }
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, 12/12. The category-validity test from Task 1 also now exercises `"media"`.

- [ ] **Step 5: Add media support to the projects component**

In `components/projects.tsx`, add `Video` to the lucide import (lines 8-16):

```tsx
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  Smartphone,
  Cpu,
  Workflow,
  Video,
} from "lucide-react";
```

Extend the `Category` union (line 19):

```tsx
type Category = "all" | "web" | "mobile" | "iot" | "automation" | "media";
```

Extend `categoryIcons` and add `categoryLabels` right after it (replacing lines 21-26):

```tsx
const categoryIcons: Record<string, React.ReactNode> = {
  web: <Globe className="w-3.5 h-3.5" />,
  mobile: <Smartphone className="w-3.5 h-3.5" />,
  iot: <Cpu className="w-3.5 h-3.5" />,
  automation: <Workflow className="w-3.5 h-3.5" />,
  media: <Video className="w-3.5 h-3.5" />,
};

const categoryLabels: Record<Exclude<Category, "all">, string> = {
  web: "Web Application",
  mobile: "Mobile Application",
  iot: "IoT System",
  automation: "Automation Pipeline",
  media: "Media Project",
};
```

Add the filter button (inside the `categories` array, lines 32-38):

```tsx
    { label: "Media", value: "media" },
```

- [ ] **Step 6: Fix the hardcoded badge suffix**

Line 98 currently renders `{project.category} Application`, which would read "media Application". Replace it:

```tsx
                          {categoryLabels[project.category]}
```

- [ ] **Step 7: Guard the GitHub link**

The GitHub anchor (lines 105-113) renders unconditionally, so the new entry's empty `githubUrl` would produce a link to nowhere. Wrap it the same way `liveUrl` already is:

```tsx
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                          aria-label={`View ${project.title} on GitHub`}
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
```

- [ ] **Step 8: Add the Content & Media skills group**

In `components/skills.tsx`, add `Video` to the lucide import (line 6):

```tsx
import { Code2, Bot, Wrench, Languages, Video } from "lucide-react";
```

Append to the `skillCategories` array (after the `languages` entry, line 28):

```tsx
  {
    key: "media" as const,
    label: "Content & Media",
    icon: <Video className="w-4 h-4" />,
  },
```

- [ ] **Step 9: Verify it compiles and lints**

Run: `npx tsc --noEmit && npm run lint`
Expected: no output from either. If `tsc` complains that `categoryLabels[project.category]` cannot be indexed, the `Project.category` union in `data/resume.ts` is missing `"media"` — recheck Task 1, Step 5.

- [ ] **Step 10: Verify in the browser**

Run: `npm run dev`
Open `http://localhost:3000` and confirm:
- The projects filter row shows a sixth button, "Media", and clicking it shows only the Your Daily Kawaii card
- That card shows a video icon and the badge reads "Media Project", not "media Application"
- That card has **no** GitHub icon, only the external-link icon pointing at the channel
- Every other card still shows its GitHub icon and a correct badge ("Web Application", "IoT System", "Automation Pipeline", "Mobile Application")
- The skills section shows a fifth group, "Content & Media"

- [ ] **Step 11: Commit**

```bash
git add data/resume.json data/resume.test.ts components/projects.tsx components/skills.tsx
git commit -m "feat: add Your Daily Kawaii as a media project

Introduces the media project category end to end and fixes two bugs the
new entry exposed: the hardcoded 'Application' badge suffix, and a GitHub
link that rendered even when githubUrl was empty."
```

---

### Task 5: Sync the Sveltia CMS schema

The CMS schema has drifted from the data it edits. Beyond adding this work's new fields, it carries two pre-existing bugs: the category select omits `iot` and `automation`, so saving either of those projects through the CMS corrupts its category; and `navLinks` is undeclared entirely, so a CMS save can strip the navbar's configuration out of `resume.json`.

**Files:**
- Modify: `public/admin/config.yml`

**Interfaces:**
- Consumes: the final `data/resume.json` shape from Tasks 1, 2, and 4
- Produces: nothing consumed by later tasks

**Verification note:** no automated test. Sveltia CMS requires GitHub OAuth and a browser; verified manually in Step 6.

- [ ] **Step 1: Remove the dead avatar field**

Delete this line from the top-level fields:

```yaml
          - {label: "Avatar URL", name: "avatarUrl", widget: "string"}
```

- [ ] **Step 2: Add the YouTube field**

After the LinkedIn field, add:

```yaml
          - {label: "YouTube", name: "youtube", widget: "string"}
```

- [ ] **Step 3: Fix the project category select**

Replace the project `Category` field so all five values are selectable:

```yaml
              - {label: "Category", name: "category", widget: "select", options: ["web", "mobile", "iot", "automation", "media"]}
```

- [ ] **Step 4: Add the media skills list**

In the Skills object fields, after Languages:

```yaml
              - {label: "Content & Media", name: "media", widget: "list"}
```

- [ ] **Step 5: Declare navLinks so saves stop stripping it**

`navLinks` exists in `data/resume.json` but is absent from this config, which risks the CMS dropping it on save. Add it as the last top-level field group, after Certifications:

```yaml
          # Nav Links Array
          - label: "Nav Links"
            name: "navLinks"
            widget: "list"
            fields:
              - {label: "Label", name: "label", widget: "string"}
              - {label: "Href", name: "href", widget: "string"}
```

- [ ] **Step 6: Verify the round-trip**

Run: `npm run dev`, then open `http://localhost:3000/admin` and authenticate.

Open the Kaong Wine System project and confirm its category shows `iot` rather than a blank or reset select. Do the same for the Lead-Gen project (`automation`) and Your Daily Kawaii (`media`). Save without changing anything, then run `git diff data/resume.json` and confirm the only changes are formatting — specifically that `navLinks` is still present and no project category changed.

If the diff shows `navLinks` removed or a category altered, stop and recheck Steps 3 and 5 before committing.

- [ ] **Step 7: Commit**

```bash
git add public/admin/config.yml
git commit -m "fix: sync CMS schema with resume data shape

Adds youtube, media skills, and navLinks fields. Fixes a live bug where
the category select offered only web and mobile, corrupting iot and
automation projects on save."
```

---

### Task 6: The curation function

The pure core of the PDF pipeline. Takes the full dataset and narrows it to what fits one page. No PDF knowledge, no filesystem access — which is what makes "what goes on the resume" testable without rendering anything.

**Files:**
- Create: `scripts/resume-pdf/select.ts`
- Test: `scripts/resume-pdf/select.test.ts`

**Interfaces:**
- Consumes: `ResumeData`, `Project`, `Experience`, `Education` types from `data/resume.ts`
- Produces, relied on by Task 7:

```ts
export const MAX_PROJECT_HIGHLIGHTS = 3;

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
  experience: { company: string; location: string; role: string; period: string; description: string[] }[];
  projects: { title: string; techStack: string[]; highlights: string[] }[];
  education: { institution: string; degree: string; period: string }[];
  skills: { label: string; items: string[] }[];
  certificationsLine: string;
};

export function select(data: ResumeData): ResumePdfData;
```

- [ ] **Step 1: Write the failing tests**

Create `scripts/resume-pdf/select.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { DATA, type ResumeData } from "../../data/resume";
import { select, MAX_PROJECT_HIGHLIGHTS } from "./select";

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
  assert.deepEqual(result.projects[0].highlights, ["h1", "h2", "h3"]);
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

test("every real employer survives curation", () => {
  const companies = select(DATA).experience.map((e) => e.company).join(" ");
  for (const employer of ["Jonathan & Cyber", "EagleRev", "Wiser", "CONVERGE ICT"]) {
    assert.ok(companies.includes(employer), `curation dropped ${employer}`);
  }
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './select'`.

- [ ] **Step 3: Write the implementation**

Create `scripts/resume-pdf/select.ts`:

```ts
import type { ResumeData } from "../../data/resume";

export const MAX_PROJECT_HIGHLIGHTS = 3;

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
  requireText(data.email, "email");
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
      description: e.description,
    })),
    projects: data.projects
      .filter((p) => p.featured)
      .map((p) => ({
        title: p.title,
        techStack: p.techStack,
        highlights: p.highlights.slice(0, MAX_PROJECT_HIGHLIGHTS),
      })),
    education: data.education.map((e) => ({
      institution: e.institution,
      degree: e.degree,
      period: e.period,
    })),
    skills: SKILL_GROUPS.filter((g) => (data.skills[g.key]?.length ?? 0) > 0).map((g) => ({
      label: g.label,
      items: data.skills[g.key],
    })),
    certificationsLine: data.certifications
      .flatMap((c) => c.items.map((i) => i.name))
      .join(" · "),
  };
}
```

Note on the skill-group order test: the expected output in Step 1 lists Languages & Programming, AI Tools, Content & Media, Spoken Languages — because `tools` was empty in that fixture and got filtered out. `SKILL_GROUPS` declares `tools` second; the assertion still holds.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 22/22 (12 data-integrity plus 10 curation).

- [ ] **Step 5: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add scripts/resume-pdf/select.ts scripts/resume-pdf/select.test.ts
git commit -m "feat: add pure curation function narrowing resume data to one page

Featured projects only, highlights capped at three, certifications
flattened to a single line. Throws on missing required fields so a bad
CMS edit fails the build instead of shipping a broken resume."
```

---

### Task 7: Render the PDF and wire it into the build

The layout, the entry point, the page-count guard, and the `prebuild` hook that makes regeneration automatic. Also removes the stale committed PDFs this whole plan exists to stop producing.

**Files:**
- Create: `scripts/resume-pdf/document.tsx`
- Create: `scripts/generate-resume-pdf.tsx`
- Test: `scripts/resume-pdf/generate.test.ts`
- Modify: `package.json`
- Modify: `.gitignore`
- Delete: `Resume.pdf` (repo root), `public/Resume.pdf` (the stale committed copy)

**Interfaces:**
- Consumes: `select`, `ResumePdfData` from Task 6
- Produces:
  - `ResumeDocument({ data }: { data: ResumePdfData })` exported from `scripts/resume-pdf/document.tsx`
  - `countPages(pdf: Buffer): number` exported from `scripts/generate-resume-pdf.tsx`
  - `public/Resume.pdf` as a build artifact

- [ ] **Step 1: Install the renderer**

```bash
npm install --save-dev @react-pdf/renderer
```

- [ ] **Step 2: Write the failing test**

Create `scripts/resume-pdf/generate.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { countPages } from "../generate-resume-pdf";

test("countPages counts page objects without counting the page tree", () => {
  const fake = Buffer.from("/Type /Pages /Type /Page /Type /Page");
  assert.equal(countPages(fake), 2);
});

test("the generator writes a single-page PDF", () => {
  execFileSync("node", ["--import", "tsx", "scripts/generate-resume-pdf.tsx"], {
    stdio: "inherit",
  });
  const pdf = readFileSync("public/Resume.pdf");
  assert.ok(pdf.subarray(0, 5).toString() === "%PDF-", "output is not a PDF");
  assert.ok(pdf.length > 10_000, `PDF is suspiciously small: ${pdf.length} bytes`);
  assert.equal(countPages(pdf), 1, "the resume must fit on one page");
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '../generate-resume-pdf'`.

- [ ] **Step 4: Write the document layout**

Create `scripts/resume-pdf/document.tsx`. Single-column A4, echoing the site's typography without importing Tailwind.

Two react-pdf constraints shape this file: it supports only a flexbox CSS subset (no grid, no reliable `gap`, so spacing uses margins), and only the standard PDF fonts are available unregistered. Weight and emphasis therefore come from `Helvetica-Bold` as an explicit `fontFamily` — do not add `fontStyle: "italic"` or `fontWeight` values, which throw at render time without a registered font family.

```tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import type { ResumePdfData } from "./select";

const COLORS = {
  text: "#1a1a1a",
  muted: "#5c5c5c",
  rule: "#d4d4d4",
  accent: "#0f172a",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 8.5,
    lineHeight: 1.4,
    color: COLORS.text,
  },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold", color: COLORS.accent },
  title: { fontSize: 10, color: COLORS.muted, marginTop: 2 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4, color: COLORS.muted },
  contactItem: { marginRight: 8 },
  sectionHeading: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    color: COLORS.accent,
    marginTop: 12,
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.rule,
  },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  entryCompany: { fontFamily: "Helvetica-Bold" },
  entryPeriod: { color: COLORS.muted },
  entryRole: { color: COLORS.muted, marginBottom: 2 },
  bulletRow: { flexDirection: "row", marginTop: 1.5, paddingRight: 4 },
  bulletMark: { width: 8, color: COLORS.muted },
  bulletText: { flex: 1 },
  skillRow: { flexDirection: "row", marginTop: 2 },
  skillLabel: { width: 110, fontFamily: "Helvetica-Bold" },
  skillItems: { flex: 1, color: COLORS.muted },
  certLine: { color: COLORS.muted, marginTop: 2 },
});

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletMark}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

export function ResumeDocument({ data }: { data: ResumePdfData }) {
  return (
    <Document title={`${data.name} — Resume`} author={data.name}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.contactRow}>
          <Text style={styles.contactItem}>{data.location}</Text>
          <Text style={styles.contactItem}>·</Text>
          <Link style={styles.contactItem} src={`mailto:${data.email}`}>{data.email}</Link>
          <Text style={styles.contactItem}>·</Text>
          <Text style={styles.contactItem}>{data.phone}</Text>
          <Text style={styles.contactItem}>·</Text>
          <Link style={styles.contactItem} src={data.github}>
            {data.github.replace("https://", "")}
          </Link>
          <Text style={styles.contactItem}>·</Text>
          <Link style={styles.contactItem} src={data.linkedin}>LinkedIn</Link>
          <Text style={styles.contactItem}>·</Text>
          <Link style={styles.contactItem} src={data.youtube}>YouTube</Link>
        </View>

        <Text style={styles.sectionHeading}>SUMMARY</Text>
        <Text>{data.summary}</Text>

        <Text style={styles.sectionHeading}>EXPERIENCE</Text>
        {data.experience.map((entry) => (
          <View key={`${entry.company}-${entry.period}`} wrap={false}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryCompany}>
                {entry.company} — {entry.location}
              </Text>
              <Text style={styles.entryPeriod}>{entry.period}</Text>
            </View>
            <Text style={styles.entryRole}>{entry.role}</Text>
            {entry.description.map((bullet, i) => (
              <Bullet key={i}>{bullet}</Bullet>
            ))}
          </View>
        ))}

        <Text style={styles.sectionHeading}>SELECTED PROJECTS</Text>
        {data.projects.map((project) => (
          <View key={project.title} wrap={false}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryCompany}>{project.title}</Text>
            </View>
            <Text style={styles.entryRole}>{project.techStack.join(" · ")}</Text>
            {project.highlights.map((highlight, i) => (
              <Bullet key={i}>{highlight}</Bullet>
            ))}
          </View>
        ))}

        <Text style={styles.sectionHeading}>EDUCATION</Text>
        {data.education.map((entry) => (
          <View key={entry.institution} style={styles.entryHeader}>
            <Text>
              <Text style={styles.entryCompany}>{entry.institution}</Text> — {entry.degree}
            </Text>
            <Text style={styles.entryPeriod}>{entry.period}</Text>
          </View>
        ))}

        <Text style={styles.sectionHeading}>SKILLS</Text>
        {data.skills.map((group) => (
          <View key={group.label} style={styles.skillRow}>
            <Text style={styles.skillLabel}>{group.label}</Text>
            <Text style={styles.skillItems}>{group.items.join(" · ")}</Text>
          </View>
        ))}

        <Text style={styles.sectionHeading}>CERTIFICATIONS</Text>
        <Text style={styles.certLine}>{data.certificationsLine}</Text>
      </Page>
    </Document>
  );
}
```

- [ ] **Step 5: Write the generator entry point**

Create `scripts/generate-resume-pdf.tsx`:

```tsx
import React from "react";
import { renderToFile } from "@react-pdf/renderer";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { DATA } from "../data/resume";
import { select } from "./resume-pdf/select";
import { ResumeDocument } from "./resume-pdf/document";

const OUTPUT = resolve(process.cwd(), "public/Resume.pdf");

/**
 * Counts page objects in a rendered PDF. The negative lookahead matters:
 * the page tree is `/Type /Pages` and must not be counted as a page.
 */
export function countPages(pdf: Buffer): number {
  return (pdf.toString("latin1").match(/\/Type\s*\/Page(?![s])/g) ?? []).length;
}

async function main() {
  const data = select(DATA);
  await renderToFile(<ResumeDocument data={data} />, OUTPUT);

  const pages = countPages(readFileSync(OUTPUT));
  if (pages !== 1) {
    console.warn(
      `[resume-pdf] warning: rendered ${pages} pages, expected 1. ` +
        `Trim bullet copy in data/resume.json or lower MAX_PROJECT_HIGHLIGHTS.`,
    );
  }
  console.log(`[resume-pdf] wrote public/Resume.pdf (${pages} page${pages === 1 ? "" : "s"})`);
}

if (process.argv[1]?.endsWith("generate-resume-pdf.tsx")) {
  main().catch((error) => {
    console.error("[resume-pdf] generation failed:", error);
    process.exit(1);
  });
}
```

The `process.argv[1]` guard means importing `countPages` from the test does not trigger a render.

- [ ] **Step 6: Wire it into the build**

Add to `"scripts"` in `package.json`:

```json
"prebuild": "tsx scripts/generate-resume-pdf.tsx",
"predev": "tsx scripts/generate-resume-pdf.tsx",
"resume": "tsx scripts/generate-resume-pdf.tsx"
```

`npm` runs `prebuild` automatically before `build`, and Vercel's default build command is `npm run build`, so deploys regenerate the PDF with no extra configuration.

`predev` exists because Step 9 gitignores the generated PDF. Without it, a fresh clone running `npm run dev` would 404 on the resume download link — the file would not exist until someone ran a build.

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 24/24. If the single-page assertion fails, open the generated PDF, find what overflowed, and either trim bullet copy in `data/resume.json` or reduce `MAX_PROJECT_HIGHLIGHTS` in `scripts/resume-pdf/select.ts`. Do not weaken the assertion.

- [ ] **Step 8: Inspect the PDF by eye**

Run: `npm run resume && open public/Resume.pdf`

Confirm: one page, nothing clipped mid-sentence, all five employers present with EagleRev as its own entry, education reads "June 2026", and the contact line's email, GitHub, LinkedIn, and YouTube links are clickable.

- [ ] **Step 9: Remove the stale committed PDFs**

Both copies are tracked in git (`git ls-files | grep -i resume.pdf` confirms) and both are now obsolete — the root file was never served, and `public/Resume.pdf` is regenerated on every build and dev start.

```bash
git rm Resume.pdf
git rm --cached public/Resume.pdf
```

`git rm` on the root file deletes it from disk and stages the removal. `--cached` on the public file stages the removal but leaves the generated file on disk, so the dev server keeps working.

Add to `.gitignore`, under the `# next.js` block:

```
# generated resume (rebuilt by prebuild from data/resume.json)
/public/Resume.pdf
```

- [ ] **Step 10: Verify the full build from clean**

```bash
rm -f public/Resume.pdf && npm run build
```

Expected: the `prebuild` step logs `[resume-pdf] wrote public/Resume.pdf (1 page)`, `next build` then succeeds, and `public/Resume.pdf` exists again. This is the check that the deploy path works — if `prebuild` does not run here, it will not run on Vercel.

- [ ] **Step 11: Verify the download link end to end**

Run: `npm run dev`, then click the Resume button in both the navbar and the hero. Confirm both serve the freshly generated PDF at `/Resume.pdf`.

- [ ] **Step 12: Commit**

The two PDF removals were already staged by `git rm` in Step 9.

```bash
git add package.json package-lock.json .gitignore scripts/resume-pdf/document.tsx scripts/generate-resume-pdf.tsx scripts/resume-pdf/generate.test.ts
git commit -m "feat: generate Resume.pdf from resume.json in a prebuild step

Replaces the manual Google Docs export loop. @react-pdf/renderer needs no
browser and no running server, so prebuild writes public/Resume.pdf before
next build collects public/ — which is what makes this work on Vercel.
Warns in build logs if the resume spills past one page.

Deletes both stale committed PDFs and gitignores the generated one; the
site had been serving a 10 May copy while a newer 28 May file sat unused
at the repo root."
```

---

## Final Verification

Run after all seven tasks:

- [ ] `npm test` — 24 passing
- [ ] `npx tsc --noEmit` — clean
- [ ] `npm run lint` — clean
- [ ] `rm -f public/Resume.pdf && npm run build` — regenerates the PDF, build succeeds
- [ ] `git status` — clean tree; `public/Resume.pdf` shows as ignored, not untracked
- [ ] Open `public/Resume.pdf` — one page, five employers, EagleRev separate, degree complete
- [ ] `npm run dev` — Media filter works, Your Daily Kawaii card has no GitHub icon, YouTube icon in hero/footer/contact, Content & Media skills group renders
- [ ] `/admin` — open an `iot` project, save, confirm `git diff data/resume.json` shows no category change and `navLinks` intact

## Out of Scope

Recorded here so it does not get silently absorbed into this work:

- `ePortfolio.md` (untracked) carries the same two staleness bugs — "UK-Based Tech Firm (Remote)" in Section 5 and "Expected June 2026" in Section 4. It is an academic document with its own lifecycle; fix separately.
- The Obsidian vault contradicts itself on whether "Daresh" is Gian's alias (`wiki/cybereye-summary.md`) or a distinct teammate (`wiki/index.md:20`). A vault lint concern, not a portfolio one.
- Repos in the vault with no portfolio entry: `ai-hosting-bridge`, `vercel-outreach-bridge-`, `yt-automation`, `TMJ-PracticalTask`. Adding them is a separate content decision.

# Portfolio Content Refresh + Generated Resume PDF

**Date:** 2026-08-14
**Status:** Approved design, pending implementation plan

## Problem

Two problems, one root cause.

**Content drift.** `data/resume.json` is the single source of truth for the site, but it has fallen behind reality:

- EagleRev is modeled as a *tool* inside a Wiser bullet. It is actually a separate US-based employer (communications / client-guide role with outreach and leadgen, June 2026, one month).
- Wiser reads `July 2025 – Present`. That engagement ended June 2026.
- The Jonathan & Cyber (CYBEREYE) engagement is four bullets dated `July 2026`. The work is ongoing and an order of magnitude larger than described — cloud posture connectors, outbound SIEM forwarding, vendor risk intelligence, phishing simulation, Monday.com integration.
- `summary` and `education.period` still describe an unfinished degree. It is August 2026.
- Dead and wrong references: `avatarUrl` points at a file that does not exist, and the lead-gen project's `githubUrl` points at a bare profile instead of its repo.

**A manual PDF loop.** The downloadable resume is authored in Google Docs, exported by hand, copied into the repo, and wired up in code. Every content change means repeating all four steps. Evidence that the loop is failing: `public/Resume.pdf` (the file the site actually serves) is dated 10 May, while an unserved copy at the repo root is dated 28 May. The site has been handing clients a stale resume for three months.

The root cause is that resume content lives in two places. The fix is to make the PDF a build artifact of `data/resume.json`.

## Goals

1. `data/resume.json` becomes the only place resume content is authored.
2. `public/Resume.pdf` regenerates automatically on every build, so a Sveltia CMS edit updates the page and the downloadable file in one commit.
3. Google Docs leaves the workflow entirely.
4. Correct the content drift listed above, and add the YouTube Shorts channel as a portfolio project.

## Non-goals

- No visual redesign of the website. Only the sections whose schema changes get touched.
- No HTML `/resume` route. The deliverable is a downloadable file.
- No CI-side PDF generation. A prebuild step covers it.
- No changes to `ePortfolio.md`. It is an untracked academic document with its own lifecycle. (It carries the same two staleness bugs — "UK-Based Tech Firm" and "Expected June 2026" — and should be fixed separately.)

---

## Part 1 — Schema changes

Three schema additions unlock the content work. They come first because Part 2 edits depend on them.

### `data/resume.ts`

| Change | Reason |
|---|---|
| `Project.category` union gains `"media"` | The YouTube channel is neither web, mobile, iot, nor automation |
| `ResumeData` gains `youtube: string` | Channel becomes a first-class social link |
| `ResumeData.skills` gains `media: string[]` | Short-form video skills do not belong under "Developer Tools & Platforms" |
| `ResumeData` drops `avatarUrl` | No component consumes it and the target file does not exist |

### `components/projects.tsx`

- `Category` union (line 19) gains `"media"`
- `categoryIcons` (lines 21-26) gains a `media` entry using lucide's `Video`
- `categories` filter array (lines 32-38) gains `{ label: "Media", value: "media" }`

Note: the card renders `{project.category} Application` (line 98). "media Application" is wrong. Replace the hardcoded suffix with a `categoryLabels: Record<Category, string>` map — `web: "Web Application"`, `mobile: "Mobile Application"`, `iot: "IoT System"`, `automation: "Automation Pipeline"`, `media: "Media Project"` — so the badge reads correctly for every category and the raw enum value never reaches the UI.

### `components/skills.tsx`

`skillCategories` (lines 8-29) gains a `media` entry labelled "Content & Media" with lucide's `Video` icon.

### Social link rendering

`youtube` renders alongside `github` and `linkedin` at three call sites:

- `components/hero.tsx:116,125`
- `components/footer.tsx:28,37`
- `components/contact.tsx:84,93`

`components/navbar.tsx` needs no change — it renders only the resume link (lines 67, 112), no social icons.

`components/icons.tsx` exports only `GithubIcon` and `LinkedinIcon`. Add a `YoutubeIcon` in the same hand-rolled SVG style rather than mixing in a lucide import, so the social row stays visually consistent.

### `public/admin/config.yml`

- Project `category` select options: `["web", "mobile", "iot", "automation", "media"]` — currently `["web", "mobile"]` only, which means editing the existing IoT and automation projects through the CMS silently corrupts their category. This is a live bug independent of this work.
- Add a `YouTube` string field to the top-level fields
- Add a `media` list field under the skills group
- Remove the `Avatar URL` field

---

## Part 2 — Content corrections

All in `data/resume.json`.

### Experience

**Jonathan & Cyber (Remote)** — period `July 2026` → `July 2026 – Present`. Replace the four bullets with five or six drawn from the Obsidian vault's session and meeting record (`wiki/index.md` and the pages it catalogs), covering:

- Multi-tenant cloud posture connectors: AWS Security Hub / GuardDuty, Azure Defender for Cloud, GCP Security Command Center
- The platform's first outbound integration: SIEM forwarding to customer-owned Splunk (HEC) and Microsoft Sentinel (Logs Ingestion API)
- Vendor risk intelligence buildout — supply chain mapping, compliance mentions, breach monitoring, scheduled re-scans, risk-score history
- Phishing simulation with real delivery and open-tracking via scoped Microsoft Graph
- Bi-directional Monday.com integration on production with per-customer field visibility
- SSL/TLS scanning, including a silent certificate-expiry defect affecting every live customer
- Postgres/Supabase migrations, row-level security, and production promotion through GitHub Actions CI

Bullets must be specific and outcome-shaped, not a technology list.

**EagleRev (Remote)** — new entry. United States, `June 2026`, one month. Role reflects communications and client guidance rather than engineering. Content sourced from `Efforts/Client EagleRev.md`: guiding EagleRev's clients through LinkedIn outreach operations, LinkedIn account health and connection management, Sales Navigator prospect list building with manual qualification, campaign variable QA and send scheduling, multi-profile browser operations (GoLogin / AdsPower).

Ordering note: EagleRev (June 2026) is chronologically between Wiser's end and Jonathan & Cyber's start. Place it so the array stays in reverse-chronological order.

**Wiser (Remote)** — period `July 2025 – Present` → `July 2025 – June 2026`. Rewrite the second bullet so EagleRev is no longer named as a tool in Gian's own toolchain; it was a separate employer.

### Education

`Cavite State University` period `Expected June 2026` → `June 2026`.

### Summary

Rewrite so it reads as a graduate. Current text opens "Currently completing my BS in Computer Engineering at Cavite State University".

### Projects

**New entry — Your Daily Kawaii**

| Field | Value |
|---|---|
| `id` | `your-daily-kawaii` |
| `category` | `media` |
| `liveUrl` | `https://www.youtube.com/@yourdailykawaii` |
| `githubUrl` | empty — `yt-automation` is unrelated to this channel |
| `featured` | `true` |
| `techStack` | CapCut, ElevenLabs, Google AI Studio, Cobalt.tools / SaveTT, YouTube Studio |

Highlights describe the production pipeline, drawn from `Efforts/Youtube Automation.md`:

- Retention-first scripting on a hook → context → twist → payoff structure
- Editing for retention: dead-air removal, centered auto-captions, sound design, dynamic framing
- AI voiceover synthesis via ElevenLabs
- Analytics iteration against view-vs-swipe-away and average-view-duration targets
- Rights-safe source transformation to stay clear of reused-content demonetization

No subscriber, view, or monetization figures. They go stale in a JSON file and require manual updates — explicitly out of scope.

**Existing entry — `b2b-lead-gen-automation`**: `githubUrl` → `https://github.com/gianjericho/Lead-Gen`.

### Skills

New `media` group: short-form video production, retention editing, scriptwriting, sound design, AI voiceover, YouTube Shorts strategy.

Additions to existing groups from the CYBEREYE stack: Vercel, PostgreSQL / row-level security, GitHub Actions, Microsoft Graph API, Monday.com API, Splunk, Wazuh, Anthropic Claude API.

---

## Part 3 — Generated resume PDF

### Mechanism

`@react-pdf/renderer` in a `prebuild` script. Not a headless browser.

The rejected alternative was Playwright rendering a print-styled route. It fails twice on Vercel: the build needs a ~300MB Chromium download, and anything written to `public/` after `next build` is not picked up by the deploy. `@react-pdf/renderer` is pure JavaScript, needs no browser and no running server, and a `prebuild` hook writes the file *before* `next build` collects `public/` — which is what makes "automatic on every build" actually true rather than aspirational.

### Units

Three units with one purpose each.

| Unit | Does | Depends on | Knows nothing about |
|---|---|---|---|
| `scripts/resume-pdf/select.ts` | Pure function `select(data: ResumeData): ResumePdfData`. Narrows the full dataset to one page: featured projects only, top 3 highlights each, certifications flattened to a single line, long descriptions dropped. | `ResumeData` type from `data/resume.ts` | PDFs, React, the filesystem |
| `scripts/resume-pdf/document.tsx` | React-PDF component tree for a single-column A4 layout. Typography chosen to echo the site. | `ResumePdfData` type | Where data came from, where output goes |
| `scripts/generate-resume-pdf.tsx` | Entry point: read JSON, `select()`, `renderToFile()` to `public/Resume.pdf`, verify the result. | both above | Layout details, curation rules |

The boundary that matters: curation is a pure function, so "what goes on the resume" is testable without rendering anything.

`tsx` as a dev dependency so the scripts can be TypeScript and import `data/resume.ts` types directly. Both `@react-pdf/renderer` and `tsx` are dev dependencies; Vercel installs dev dependencies during builds.

### `package.json`

```json
"prebuild": "tsx scripts/generate-resume-pdf.tsx",
"resume": "tsx scripts/generate-resume-pdf.tsx"
```

`prebuild` runs automatically before `next build`. `resume` is the same script for local preview.

### Data flow

```
Sveltia CMS edit
  → commit to main (data/resume.json)
    → Vercel build
      → prebuild: select() → document → public/Resume.pdf
        → next build (collects public/)
          → deploy
            → download button (DATA.resumeUrl) serves the fresh PDF
```

### Error handling

- `select()` throws when a required field is missing or empty — `name`, `email`, `experience`. A bad CMS edit fails the build loudly instead of deploying a broken resume.
- After writing, the script counts `/Type /Page` occurrences in the output buffer and **warns** if the result exceeded one page. A warning, not a failure: an overflowing resume is still a usable resume, and a hard failure would block an unrelated deploy. It surfaces in build logs.

### Housekeeping

- Delete the stale root `Resume.pdf` (the 28 May copy that was never promoted to `public/`).
- Add `public/Resume.pdf` to `.gitignore`. It is fully derived and rebuilt on every deploy, so tracking it invites exactly the drift this work exists to eliminate.

### Testing

TDD. Tests for `select()` before it exists, using `node:test`:

- Curates to featured projects only
- Caps highlights at 3 per project
- Flattens all certification categories into one line
- Throws on missing `name`
- Throws on empty `experience`
- Preserves experience ordering

Then a generator smoke test:

- The file is written to `public/Resume.pdf` and is non-trivial in size
- Page count is exactly 1
- Extracted text contains `EagleRev`, `Jonathan & Cyber`, and `Wiser`

That last assertion is the important one. It catches the failure mode where the layout renders successfully but silently drops or clips content — which a size check and a page count would both pass.

## Verification

Beyond the automated tests:

1. `npm run build` succeeds and emits a fresh `public/Resume.pdf`
2. Open the PDF: one page, no clipped text, all four employers present including EagleRev as its own entry
3. `npm run dev`: Media appears in the project filter, the Your Daily Kawaii card renders with a working channel link, the YouTube icon appears in hero / footer / contact, and the Content & Media skills group renders
4. Load `/admin`: open an IoT project and confirm its category survives a save round-trip (the current `config.yml` bug)
5. `tsc --noEmit` and `npm run lint` clean

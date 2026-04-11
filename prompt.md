# 🧠 Persistent Memory — GJE Portfolio

> **Purpose:** This file serves as the single source of truth and context anchor for building Gian Jericho Espino's professional portfolio website. All design decisions, data mappings, and technical choices are documented here to prevent context drift.

---

## 1. Project Goal

Build a **high-end, interactive, and performant portfolio website** for **Gian Jericho Espino**, a Computer Engineering professional. The site must showcase technical expertise, project work, and professional experience in a way that is visually striking, modern, and recruiter/employer-friendly.

**Target Audience:** Recruiters, hiring managers, potential collaborators, and fellow engineers.
**Deployment Target:** Vercel (optimized for edge delivery and serverless functions).

---

## 2. Brand Identity (Analyzed from `brandkittemplate.png`)

### Visual Reference
The brand kit follows the **"Halo AI Studio"** dark-mode template — a premium, editorial-grade aesthetic with:
- Deep near-black backgrounds
- Soft blue glow/halo effects as the primary accent
- Clean white typography on dark surfaces
- Rounded pill-shaped navigation buttons
- Card-based layouts with subtle elevation
- Minimal use of color — monochrome + a single cool-blue accent

### Color Palette

| Token            | Hex       | Usage                                  |
| ---------------- | --------- | -------------------------------------- |
| `--background`   | `#0A0A0F` | Primary page background (near-black)   |
| `--foreground`   | `#FAFAFA` | Primary text (near-white)              |
| `--card`         | `#111118` | Card / elevated surfaces               |
| `--card-hover`   | `#1A1A24` | Card hover state                       |
| `--muted`        | `#737380` | Secondary text / subtle labels         |
| `--border`       | `#1E1E2A` | Borders / dividers                     |
| `--primary`      | `#4A9EFF` | Primary accent (soft blue glow)        |
| `--primary-glow` | `#4A9EFF33` | Glow/halo effect (blue at 20% opacity) |
| `--accent`       | `#6BB5FF` | Lighter accent for hover/highlights    |

### Typography

| Role       | Font Family       | Weight        | Source       |
| ---------- | ----------------- | ------------- | ------------ |
| Headings   | Inter              | Bold (700)    | Google Fonts / next/font |
| Body       | Inter              | Regular (400) | Google Fonts / next/font |
| Mono/Code  | JetBrains Mono     | Regular (400) | Google Fonts / next/font |

### Visual Vibe
- **Style:** Dark-mode-first, monochrome + blue accent, editorial/studio aesthetic
- **Mood:** Premium, confident, technically sharp, nocturnal
- **Key Effects:** Blue halo/glow radials, glassmorphism on navbar, smooth fade animations
- **Inspiration:** Halo AI Studio template — clean dark surfaces, crisp typography, glow accents

---

## 3. Technical Stack

| Layer        | Technology          | Rationale                                        |
| ------------ | ------------------- | ------------------------------------------------ |
| Framework    | Next.js (App Router)| SSR/SSG, file-based routing, Vercel-native       |
| Styling      | Tailwind CSS v4     | Utility-first, CSS-based config, high performance|
| Components   | shadcn/ui           | Accessible, composable, professional feel        |
| Animations   | Framer Motion       | Declarative, performant scroll/enter animations  |
| Icons        | Lucide React        | Consistent, lightweight icon set                 |
| Data Layer   | `data/resume.ts`    | Central modular data — update once, reflect everywhere |
| Deployment   | Vercel              | Zero-config Next.js hosting                      |

### Key Technical Decisions
- **App Router** over Pages Router for modern React Server Components support.
- **Tailwind CSS v4** as explicitly requested by the user, utilizing the new CSS-based configuration in `app/globals.css`.
- **Modular Data Strategy:** All resume content, project data, skills, and experience are stored in a central `data/resume.ts` file. UI components consume this data — no hardcoded content in JSX.
- **shadcn/ui** components will be installed incrementally (only what's needed).

---

## 4. Site Architecture & Sitemap

```
/
├── Hero Section
│   ├── Name: "Gian Jericho Espino"
│   ├── Title: "Computer Engineering Student & Full-Stack Developer"
│   ├── Animated blue-glow intro (Framer Motion)
│   ├── CTA buttons (Resume download, Contact)
│   └── Social links (GitHub, LinkedIn, Email)
│
├── Projects Gallery (Interactive)
│   ├── Mountaintop Dispatch Manager (featured)
│   ├── JO App - Job Order Mobile App (featured)
│   ├── Filterable by category
│   ├── Tech stack badges, GitHub + live demo links
│   └── Data source: data/resume.ts → projects[]
│
├── Experience Timeline
│   ├── Mountaintop Cable TV Networks (July 2025 – March 2026)
│   ├── College of Engineering - Committee Member (Sept 2024 – June 2025)
│   ├── Scroll-triggered slide animations
│   └── Data source: data/resume.ts → experience[]
│
├── Skills Section
│   ├── Technical: Dart, Python, C++, C, Java, HTML, CSS
│   ├── AI Tools: OpenClaw, Antigravity, Claude Code, Gemini
│   ├── Tools & IDE: Git/GitHub, VS Code, PyCharm, etc.
│   ├── Languages: English, Tagalog
│   └── Data source: data/resume.ts → skills[]
│
├── Certifications
│   ├── Data Analytics certs (CISCO, Udemy, Cognitive Class, Analytics Vidhya)
│   ├── AI & Networking certs (CISCO)
│   └── Data source: data/resume.ts → certifications[]
│
├── Education
│   ├── Cavite State University — BS Computer Engineering (Expected June 2026)
│   ├── Tagaytay City Science National High School (July 2022)
│   └── Data source: data/resume.ts → education[]
│
├── Contact Section
│   ├── Email: gianjerichoz@gmail.com
│   ├── Phone: +639108733830
│   ├── Social links
│   └── Footer with copyright
│
└── Layout
    ├── Navbar (sticky, glassmorphism, pill-shaped links)
    ├── Dark mode by default (monochrome + blue accent)
    └── Responsive (mobile-first)
```

---

## 5. Resume Content (Extracted from `Resume.pdf`)

### Personal Info
- **Name:** Gian Jericho Z. Espino
- **Location:** Pasong Langka, Silang 4118, Cavite, Philippines
- **Email:** gianjerichoz@gmail.com
- **Phone:** +639108733830
- **GitHub:** https://github.com/gianjericho

### Education
1. **Cavite State University** — Indang, Cavite
   - BS Computer Engineering — Expected June 2026
   - Thesis: Design and Development of an Automated Kaong Wine Brewing System
   - Specialized Data Analytics as Electives

2. **Tagaytay City Science National High School** — Tagaytay City, Cavite
   - Graduate with Honors — July 2022
   - Robotics Club Member, Radio Broadcasting Technical Support

### Experience
1. **Mountaintop Cable TV Networks** — Tagaytay City, Cavite
   - Role: Customer Service Representative & Assistant Warehouse Custodian
   - Period: July 2025 – March 2026
   - Highlights:
     - Resolved technical inquiries for up to 30 customers daily
     - Developed automated ticketing system (Google Forms + Apps Script), processing 4,200+ requests
     - Managed telecom hardware tracking, generating 50+ reports with 100% accuracy
     - Built Mountaintop-Dispatch-Manager and Job Order Mobile App

2. **College of Engineering and Information Technology** — Indang, Cavite
   - Role: Committee Member, Operations and Implementation
   - Period: September 2024 – June 2025
   - Highlights:
     - Facilitated technical setups for college-wide engineering events
     - Coordinated with student teams and faculty for departmental operations

### Skills
- **Technical:** Dart, Python, C++, C, Java, HTML, CSS
- **AI Tools:** OpenClaw, Antigravity, Claude Code, Gemini
- **Languages:** English, Tagalog
- **Tools & IDE:** Git/GitHub, VS Code, PyCharm, Jupyter Notebook, Google Apps Script, Google Workspace, Microsoft Office, Salesforce, OBS Studio, Firebase

### Certifications
**Data Analytics:**
- CISCO Networking Academy: Data Analytics Essentials
- CISCO Networking Academy: Introduction to Data Science
- Udemy: Deep Learning Specialization: Advanced AI
- Cognitive Class: Deep Learning with TensorFlow
- Analytics Vidhya: Natural Language Processing Using Deep Learning

**AI & Networking:**
- CISCO Networking Academy: AI Fundamentals With IBM Skills Build
- CISCO Networking Academy: Networking Basics
- CISCO Networking Academy: Cyber Threat Management
- CISCO Networking Academy: Network Defense

---

## 6. GitHub Projects (Extracted from project docs)

### Project 1: Mountaintop Dispatch Manager
- **GitHub:** https://github.com/gianjericho/Mountaintop-Dispatch-Manager
- **Live Demo:** https://mountaintop-dispatch-manager.netlify.app/
- **Category:** Web Application
- **Featured:** Yes
- **Description:** An enterprise-grade, real-time web application for streamlining field service operations, triaging incoming tickets, and tracking team performance with RBAC and Bi-Directional syncing.
- **Key Features:**
  - Role-Based Access Control (RBAC) with row-level security
  - Bi-Directional Google Sheets Sync via Apps Script
  - Advanced Analytics Dashboard (team efficiency, area completion rates)
  - Real-Time Data Sync (Supabase WebSockets)
  - Smart Triage Inbox for ticket approval
  - Spreadsheet-Style Bulk Dispatch
- **Tech Stack:** HTML5, Vanilla JavaScript (ES6+), Tailwind CSS, Supabase (PostgreSQL, Realtime, Auth), Google Apps Script, Cypress (E2E), Netlify, FontAwesome 6
- **Architecture:** Decoupled Jamstack, RLS enforced at PostgreSQL level

### Project 2: JO App (Job Order App)
- **GitHub:** https://github.com/gianjericho/jo_app
- **Category:** Mobile Application
- **Featured:** Yes
- **Description:** A Flutter-based mobile application designed for telecommunications field technicians to manage job orders, view client locations on Google Maps, and check NAP box port availability.
- **Key Features:**
  - Assigned installation job list with client details
  - Interactive Google Maps with client location pins
  - NAP box map with port availability info
  - Technician and Admin views
  - REST API integration for real-time data
- **Tech Stack:** Flutter (Dart), google_maps_flutter, HTTP package, REST API backend, Android API 20+
- **Architecture:** Mobile companion to the Dispatch Manager web system

---

## 7. Design Tokens (Tailwind Config)

```javascript
const colors = {
  background: "#0A0A0F",
  foreground: "#FAFAFA",
  card: "#111118",
  "card-hover": "#1A1A24",
  muted: "#737380",
  "muted-foreground": "#A1A1AA",
  border: "#1E1E2A",
  primary: "#4A9EFF",
  "primary-glow": "rgba(74, 158, 255, 0.2)",
  accent: "#6BB5FF",
  destructive: "#FF4A4A",
  ring: "#4A9EFF",
};
```

---

## 8. Animation Strategy (Framer Motion)

| Element          | Animation                        | Trigger        |
| ---------------- | -------------------------------- | -------------- |
| Hero text        | Staggered fade-up + blue glow    | Page load      |
| Hero subtitle    | Typewriter or fade-in            | Page load (delayed) |
| Project cards    | Scale + fade on hover            | Hover          |
| Timeline items   | Slide-in from left/right         | Scroll (inView)|
| Skill badges     | Pop-in with stagger              | Scroll (inView)|
| Cert cards       | Fade-up with stagger             | Scroll (inView)|
| Section headers  | Fade-up with blur                | Scroll (inView)|
| Navbar           | Backdrop blur on scroll          | Scroll         |
| Page transitions | Fade + slide                     | Route change   |

---

## 9. Performance & SEO Checklist

- [ ] Lighthouse score > 95 on all categories
- [ ] Proper `<title>` and `<meta>` tags per section
- [ ] Open Graph / Twitter Card meta tags
- [ ] Semantic HTML5 elements throughout
- [ ] `next/image` for optimized image loading
- [ ] `next/font` for optimized font loading (Inter, JetBrains Mono)
- [ ] Lazy loading for below-the-fold content
- [ ] Accessible (WCAG 2.1 AA compliant)
- [ ] Sitemap generation
- [ ] robots.txt

---

## 10. File Structure (Planned)

```
GJE_Portfolio/
├── app/
│   ├── layout.tsx          # Root layout (fonts, theme, navbar)
│   ├── page.tsx            # Home page (all sections)
│   ├── globals.css         # Tailwind base + custom styles
│   └── favicon.ico
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── hero.tsx
│   ├── projects.tsx
│   ├── experience.tsx
│   ├── skills.tsx
│   ├── certifications.tsx
│   ├── education.tsx
│   ├── contact.tsx
│   ├── navbar.tsx
│   └── footer.tsx
├── data/
│   └── resume.ts           # Central data file (modular)
├── lib/
│   └── utils.ts            # shadcn/ui utility (cn function)
├── public/
│   ├── images/
│   └── resume.pdf          # Downloadable resume
├── prompt.md               # This file (persistent memory)
├── app/globals.css         # Tailwind v4 configuration & base styles
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 11. Change Log

| Date       | Change                                               |
| ---------- | ---------------------------------------------------- |
| 2026-03-29 | Initial prompt.md created with full scaffold          |
| 2026-03-29 | Brand kit analyzed, resume extracted, projects mapped |
| 2026-04-07 | Updated for Tailwind CSS v4 and hidden via .gitignore |

// ============================================================================
// MODULAR DATA LAYER — Single Source of Truth
// ============================================================================
// Update this file to change any content on the portfolio.
// No UI component code changes needed.
// ============================================================================

export const DATA = {
  name: "Gian Jericho Espino",
  initials: "GJE",
  title: "Computer Engineering Student & Full-Stack Developer",
  location: "Cavite, Philippines",
  locationLink: "https://www.google.com/maps/place/Cavite",
  about:
    "A Computer Engineering student who builds enterprise-grade web and mobile applications. I specialize in transforming real-world operational bottlenecks into automated, scalable software solutions — from real-time dispatch systems to field technician mobile apps.",
  summary:
    "Currently completing my BS in Computer Engineering at Cavite State University, I've already shipped production systems that process thousands of requests. I bridge the gap between engineering theory and practical field deployment, with a focus on full-stack web development, mobile apps, and data analytics.",
  avatarUrl: "/images/avatar.jpg",
  email: "gianjerichoz@gmail.com",
  phone: "+639108733830",
  github: "https://github.com/gianjericho",
  linkedin: "https://www.linkedin.com/in/gian-espino-7a1270167", // done, i input the correct link already
  resumeUrl: "/Resume.pdf",

  // ===========================================================================
  // NAVIGATION
  // ===========================================================================
  navLinks: [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],

  // ===========================================================================
  // PROJECTS
  // ===========================================================================
  projects: [
    {
      id: "dispatch-manager",
      title: "Dispatch Manager",
      description:
        "An enterprise-grade, real-time web application for streamlining field service operations, triaging incoming tickets, and tracking team performance.",
      longDescription:
        "Engineered for Mountaintop Cable TV Networks, this system replaced manual spreadsheet-based dispatch workflows with a real-time platform. Features include Role-Based Access Control with PostgreSQL Row-Level Security, bi-directional Google Sheets sync via Apps Script, advanced analytics dashboards, and spreadsheet-style bulk ticket creation.",
      techStack: [
        "JavaScript",
        "Tailwind CSS",
        "Supabase",
        "PostgreSQL",
        "Google Apps Script",
        "Cypress",
        "Netlify",
      ],
      githubUrl: "https://github.com/gianjericho/Mountaintop-Dispatch-Manager",
      liveUrl: "https://mountaintop-dispatch-manager.netlify.app/",
      featured: true,
      category: "web" as const,
      highlights: [
        "Role-Based Access Control (RBAC) with row-level security",
        "Bi-Directional Google Sheets Sync via Apps Script",
        "Advanced Analytics Dashboard with team efficiency metrics",
        "Real-Time Data Sync powered by Supabase WebSockets",
        "Smart Triage Inbox for ticket approval workflows",
        "Spreadsheet-Style Bulk Dispatch for rapid ticket creation",
      ],
    },
    {
      id: "jo-app",
      title: "JO App — Job Order Mobile",
      description:
        "A Flutter-based mobile application designed for telecommunications field technicians to manage job orders and locate clients via Google Maps.",
      longDescription:
        "The technician-facing companion to the Dispatch Manager. Field technicians view assigned installation jobs, pinpoint client addresses on interactive Google Maps, and check nearby Network Access Point (NAP) box port availability — all from a clean, mobile-optimized interface.",
      techStack: [
        "Flutter",
        "Dart",
        "Google Maps API",
        "REST API",
        "Firebase",
      ],
      githubUrl: "https://github.com/gianjericho/jo_app",
      liveUrl: "",
      featured: true,
      category: "mobile" as const,
      highlights: [
        "Interactive Google Maps with client location pins",
        "NAP box map with real-time port availability",
        "Technician and Admin role-based views",
        "REST API integration for live data sync",
        "Clean bottom-navigation mobile UI",
      ],
    },
    {
      id: "slr-ticket-monitoring",
      title: "SLR Ticket Monitoring System",
      description:
        "A premium Google Apps Script (GAS) solution for managing and monitoring service tickets across multiple municipalities.",
      longDescription:
        "Provides a streamlined interface for data entry, real-time validation, and automated reporting within Google Sheets. Features dynamic HTML/CSS sidebars, real-time dashboards for performance tracking, duplicate SF ticket prevention, and Salesforce integration to sync external data imports.",
      techStack: [
        "Google Apps Script",
        "HTML5",
        "CSS3",
        "JavaScript",
        "Google Sheets",
        "Supabase"
      ],
      githubUrl: "https://github.com/gianjericho/ticket-monitoring",
      liveUrl: "",
      featured: true,
      category: "web" as const,
      highlights: [
        "Dynamic custom HTML/CSS sidebars for data entry",
        "Real-time Dashboard tracking performance and outages",
        "Automated duplicate prevention for SF Tickets",
        "Multi-Sheet Synchronization mapping to municipalities",
        "Salesforce Integration for easy ticket import"
      ],
    },
    {
      id: "job-tracker",
      title: "Job Tracker",
      description:
        "A sleek, modern Flutter application offering a centralized dashboard to track work hours and monitor production goals.",
      longDescription:
        "Built with Flutter, Firebase, and Material 3, the app provides a centralized dashboard for dynamic progress bars, a smart calendar for daily logs, and effortless logging sheets. Secure real-time data sync is powered by Firebase Authentication and Cloud Firestore, complemented by an auto-update checker.",
      techStack: [
        "Flutter",
        "Dart",
        "Firebase",
        "Provider"
      ],
      githubUrl: "https://github.com/gianjericho/job-tracker",
      liveUrl: "",
      featured: true,
      category: "mobile" as const,
      highlights: [
        "Centralized Dashboard with customized dynamic progress bars",
        "Smart Calendar view for daily logs management",
        "Secure real-time data sync via Firebase Auth and Firestore",
        "Effortless quick-access hour logging functionality",
        "Auto-Update checker connected to Firestore config"
      ],
    },
  ],

  // ===========================================================================
  // EXPERIENCE
  // ===========================================================================
  experience: [
    {
      company: "Mountaintop Cable TV Networks",
      location: "Tagaytay City, Cavite",
      role: "Customer Service Representative & Asst. Warehouse Custodian",
      period: "July 2025 – April 2026",
      description: [
        "Resolved technical inquiries and managed service requests for up to 30 customers daily, identifying operational bottlenecks to inform custom software solutions.",
        "Developed and deployed an automated ticketing system using Google Forms and Apps Script, successfully processing over 4,200 requests and eliminating manual data entry.",
        "Managed tracking for telecom hardware, generating over 50 comprehensive reports and ensuring 100% accurate logging of equipment dispatched to field technicians.",
        "Conceptualized and built the Mountaintop-Dispatch-Manager and Job Order Mobile App based on direct field and warehouse operational needs.",
      ],
    },
    {
      company: "College of Engineering and Information Technology",
      location: "Indang, Cavite",
      role: "Committee Member, Operations and Implementation",
      period: "September 2024 – June 2025",
      description: [
        "Facilitated technical setups and managed operational logistics for college-wide engineering events and activities.",
        "Coordinated with student teams and faculty to ensure the smooth execution of departmental operations and technical implementations.",
      ],
    },
  ],

  // ===========================================================================
  // EDUCATION
  // ===========================================================================
  education: [
    {
      institution: "Cavite State University",
      location: "Indang, Cavite",
      degree: "Bachelor of Science in Computer Engineering",
      period: "Expected June 2026",
      details: [
        "Thesis: Design and Development of an Automated Kaong Wine Brewing System",
        "Specialized Data Analytics as Electives",
      ],
    },
    {
      institution: "Tagaytay City Science National High School",
      location: "Tagaytay City, Cavite",
      degree: "High School Diploma",
      period: "July 2022",
      details: [
        "Graduate with Honors",
        "Robotics Club Member",
        "Radio Broadcasting Technical Support",
      ],
    },
  ],

  // ===========================================================================
  // SKILLS
  // ===========================================================================
  skills: {
    technical: [
      "Dart",
      "Python",
      "C++",
      "C",
      "Java",
      "JavaScript",
      "HTML",
      "CSS",
      "SQL",
    ],
    ai: ["OpenClaw", "Antigravity", "Claude Code", "Gemini"],
    tools: [
      "Git / GitHub",
      "VS Code",
      "PyCharm",
      "Jupyter Notebook",
      "Google Apps Script",
      "Google Workspace",
      "Microsoft Office",
      "Salesforce",
      "OBS Studio",
      "Firebase",
      "Supabase",
    ],
    languages: ["English", "Tagalog"],
  },

  // ===========================================================================
  // CERTIFICATIONS
  // ===========================================================================
  certifications: [
    {
      category: "Data Analytics",
      items: [
        {
          name: "Data Analytics Essentials",
          issuer: "CISCO Networking Academy",
        },
        {
          name: "Introduction to Data Science",
          issuer: "CISCO Networking Academy",
        },
        {
          name: "Deep Learning Specialization: Advanced AI",
          issuer: "Udemy",
        },
        {
          name: "Deep Learning with TensorFlow",
          issuer: "Cognitive Class",
        },
        {
          name: "Natural Language Processing Using Deep Learning",
          issuer: "Analytics Vidhya",
        },
      ],
    },
    {
      category: "AI & Networking",
      items: [
        {
          name: "AI Fundamentals With IBM Skills Build",
          issuer: "CISCO Networking Academy",
        },
        {
          name: "Networking Basics",
          issuer: "CISCO Networking Academy",
        },
        {
          name: "Cyber Threat Management",
          issuer: "CISCO Networking Academy",
        },
        {
          name: "Network Defense",
          issuer: "CISCO Networking Academy",
        },
      ],
    },
  ],
} as const;

// Type exports for consuming components
export type Project = (typeof DATA.projects)[number];
export type Experience = (typeof DATA.experience)[number];
export type Education = (typeof DATA.education)[number];
export type CertificationCategory = (typeof DATA.certifications)[number];

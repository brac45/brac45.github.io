// ─── Site Configuration (src/siteConfig.ts) ───────────────────────
// This is the SINGLE SOURCE OF TRUTH for all personal data displayed
// on the website. Every component reads from this file.
//
// To update your site, just edit the values below — you should NOT
// need to modify any component code (App.tsx, AboutPage.tsx, etc.).
//
// The "export" keyword makes this object available to other files
// via: import { siteConfig } from "../siteConfig";
//
// Structure:
//   - Personal info (name, title, affiliation, etc.)
//   - Links (email, scholar, github, etc.) — leave "" to hide an icon
//   - Bio paragraphs — [text](url) syntax auto-links names/orgs

// ─── Type Definitions ──────────────────────────────────────────────
// TypeScript `interface` defines the SHAPE of an object — which properties
// it must have and what type each property is. Think of it as a contract:
// any object claiming to be a `ResearchArea` MUST have title, description,
// and icon, all as strings. If you misspell a property or pass a number
// where a string is expected, TypeScript catches the mistake at compile time
// (before the code ever runs in a browser).
//
// `export` makes these interfaces available to other files. This lets
// components like ResearchPage.tsx import and use the same type definitions,
// ensuring consistency across the entire codebase.
// NewsItem defines the shape of each news entry.
// Unlike publications or projects (which have rich markdown bodies),
// news items are short one-liners — so they live here instead of
// in separate .md files. Just add/remove objects from the array below.
export interface NewsItem {
  date: string;      // ISO date string, e.g. "2025-05-27"
  title: string;     // Short news headline
  link?: string;     // Optional URL — if present, the title becomes clickable
}

// SiteConfig is the "master" interface for the entire config object.
// This is composition — a core TypeScript pattern for managing complex data shapes.
export interface SiteConfig {
  name: string;
  shortName: string;
  title: string;
  affiliation: string;
  profileImage: string;
  email: string;
  scholar: string;
  github: string;
  linkedin: string;
  cvUrl: string;
  bio: string[];              // Array of paragraph strings
  footnote: string;
  news: NewsItem[];           // Short news items — newest first
}

// The `: SiteConfig` annotation after the variable name tells TypeScript:
// "This object must conform to the SiteConfig interface."
// If any required property is missing or has the wrong type, you'll get
// a red squiggly error in your editor immediately — no need to run the app.
export const siteConfig: SiteConfig = {
  name: "Michael (Jong Ho) Lee",
  shortName: "Michael Lee",
  title: "PhD Candidate",
  affiliation: "Human-Computer Interaction Lab\nUniversity of Maryland, College Park",
  profileImage: "/images/profile.png",

  // Links — leave empty string to hide
  email: "jlee29@umd.edu",
  scholar: "https://scholar.google.com/citations?user=k9JbI3wAAAAJ&hl=en",
  github: "https://github.com/brac45",
  linkedin: "https://www.linkedin.com/in/leejongho92/",
  cvUrl: "/files/jongholee_fullcv.pdf",

  // Bio paragraphs — each string becomes a <p> tag
  // Wrap names/orgs in [text](url) markdown-style to auto-link them
  bio: [
    `I'm currently a Ph.D. candidate at the [University of Maryland, College Park](https://ischool.umd.edu/) (UMD), and a member of the [Human-Computer Interaction Lab (HCIL)](https://hcil.umd.edu/). I'm advised by [Dr. Stephanie Valencia](https://stephanie-valencia.com/), where I research and build AI-powered computer-mediated communication technology for people with aphasia.`,
    `My work encompasses HCI research methods, software development, and computational approaches to analyzing and modeling user behavior. I currently work in the intersection of computing accessibility and Human-AI Interaction, where my doctoral research focuses on the development of user-programmable AI workflows to support communication for people with language disabilities.`,
    `I was fortunate to have worked with [Dr. Eun Kyoung Choe](https://terpconnect.umd.edu/~choe/) and [Dr. Ivan Lee](https://groups.cs.umass.edu/ahha/team/) in examining how self-tracking tools can support goal-setting in stroke rehabilitation. I've also worked with [Dr. Daniel Epstein](https://depstein.net/) and the members of the [Personal Informatics Everyday (PIE) lab](https://depstein.net/pielab) at UC Irvine on various self-tracking technology research.`,
    `I completed my M.S. in Computer Science at the [University of California, Irvine](https://cs.ics.uci.edu/), and B.S. in Computer Science and Engineering at [Chung-Ang University](https://neweng.cau.ac.kr/index.do), Seoul, South Korea.`,
  ],

  footnote:
    "Aphasia is a language impairment that affects a person's ability to understand and produce language, usually caused by damage to the language portion of the brain.",

  // News items — just add new entries at the top. Sorted by date descending when displayed.
  news: [
    {
      date: "2026-03-02",
      title: "New paper on co-designing user-programmable AI AAC tools for aphasia is accepted to CHI'26!",
      link: "/pubs/lee-codesign-diy-aac-aphasia-chi26.pdf"
    },
    {
      date: "2025-10-27",
      title: "Participating in ACM ASSETS 2025 Doctoral Consortium.",
    },
    {
      date: "2025-07-05",
      title: "New paper on AI-driven design probes for AAC and people with aphasia.",
      link: "https://dl.acm.org/doi/full/10.1145/3715336.3735736",
    },
    {
      date: "2025-05-27",
      title: "UX Researcher internship at Microsoft.",
    },
  ],
};

# brac45.github.io

Personal academic website for Jong Ho Lee — built with Vite + React, deployed on GitHub Pages.

## Project Structure

```
├── src/
│   ├── content/              ← YOUR CONTENT (markdown files)
│   │   ├── publications/     ← One .md file per paper
│   │   ├── news/             ← One .md file per news item
│   │   ├── projects/         ← One .md file per tinkering project
│   │   └── index.js          ← Content loader (don't edit)
│   ├── components/           ← Reusable UI components
│   │   ├── NavBar.jsx
│   │   └── UI.jsx
│   ├── pages/                ← Page components
│   │   ├── AboutPage.jsx
│   │   ├── ResearchPage.jsx
│   │   ├── PublicationsPage.jsx
│   │   ├── TinkeringPage.jsx
│   │   └── CVPage.jsx
│   ├── siteConfig.js         ← YOUR INFO (bio, links, CV, research areas)
│   ├── App.jsx               ← Main app shell
│   ├── main.jsx              ← Entry point
│   └── styles.css            ← Global styles
├── public/                   ← Static assets (images, PDF CV, etc.)
├── .github/workflows/
│   └── deploy.yml            ← Auto-deploy on push to main
├── index.html
├── vite.config.js
└── package.json
```

## How to Update Content

### Add a new publication

Create a file in `src/content/publications/`, e.g. `2026-assets-my-paper.md`:

```markdown
---
title: "My Paper Title"
authors: "Jong Ho Lee, Co-Author Name"
venue: "ACM ASSETS 2026"
year: 2026
order: 1
type: conference          # or "poster"
tags:
  - Accessibility
  - AI
pdf: "https://link-to-paper.pdf"
doi: "https://doi.org/..."
---

Optional abstract or description shown on detail view.
```

### Add a news item

Create a file in `src/content/news/`, e.g. `2026-01-some-news.md`:

```markdown
---
date: 2026-01-15
title: "Short title shown in the news feed"
link: "https://optional-external-link.com"
---

Optional longer description.
```

### Add a project

Create a file in `src/content/projects/`, e.g. `my-project.md`:

```markdown
---
title: "Project Name"
order: 3
image: "https://url-to-image.jpg"
link: "https://project-page-or-repo.com"
---

Short description of the project.
```

### Update your bio, links, CV, or research areas

Edit `src/siteConfig.js` — everything is in one place.

## Development

```bash
npm install
npm run dev       # Start dev server at localhost:5173
npm run build     # Build for production
npm run preview   # Preview production build
```

## Deployment

Pushes to `main` automatically build and deploy via GitHub Actions.

### First-time setup

1. Go to your repo **Settings → Pages**
2. Under "Build and deployment", set Source to **GitHub Actions**
3. Push to `main` — the site will deploy automatically

### Custom domain

1. Add a `CNAME` file in `public/` with your domain (e.g. `jongholee.com`)
2. Configure DNS with your domain provider (A records or CNAME to `brac45.github.io`)
3. In repo Settings → Pages, add your custom domain

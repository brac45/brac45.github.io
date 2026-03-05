// ─── AboutPage.tsx — Home Page (Two-Column Layout) ─────────────────
// This is the main landing page. It uses a two-column layout:
//   LEFT (25%):  Sticky profile sidebar (photo, name, title, social icons)
//   RIGHT (75%): Stacked content cards (About Me, Experience, News, Publications)
//
// On mobile (<768px), CSS overrides collapse this into a single column.
//
// This file defines several smaller "sub-components" that are only used here,
// so they live in this file rather than in a separate file. In React, it's
// common to define helper components next to where they're used.

import { siteConfig } from "../siteConfig";
import { getNews, getPublications, type NewsItem as NewsItemType } from "../content";
// TYPESCRIPT CONCEPT: `type` import with rename (`as`)
//   `type NewsItem as NewsItemType` does two things:
//   1. `type` marks this as a type-only import (erased at runtime)
//   2. `as NewsItemType` renames it to avoid confusion with any local
//      variable or component that might also be called "NewsItem"
//   The original name `NewsItem` from content/index.ts becomes `NewsItemType` here.
import { FadeIn, Card, CardHeader, CardBody, palette, parseBioLinks } from "../components/UI";

// ─── Data fetching (runs once at module load time) ─────────────────
// These calls happen when this file is first imported. Because Vite's
// import.meta.glob uses { eager: true }, all markdown data is already
// available synchronously — no loading spinner needed.
const news = getNews();                          // All news items, sorted newest first
const selectedPubs = getPublications().slice(0, 4); // First 4 publications for the preview

// ─── ProfileSidebar — Left Column Card ─────────────────────────────
// Shows the profile photo, name, title, affiliation, email, and social icons.
// Uses position: sticky so it stays visible while scrolling the right column.
function ProfileSidebar() {
  const cfg = siteConfig;
  return (
    // top: 80 means "stick 80px from the top of the viewport" (below the 56px navbar + gap)
    <div>
      <Card>
        <CardBody style={{ padding: "24px 20px 16px", textAlign: "center" }}> {/* 4px-grid spacing: 24 top, 20 sides, 16 bottom */}
          {/* Profile image — only rendered if profileImage URL exists in siteConfig.
              The && operator is a React pattern: if the left side is falsy,
              React renders nothing; if truthy, it renders the right side. */}
          {cfg.profileImage && (
            <img
              src={cfg.profileImage}
              alt={cfg.name}
              className="profile-portrait" // CSS class for mobile: makes it circular and smaller
              style={{
                width: "100%",
                borderRadius: 8,   // 4px-grid (8 = 4×2) — subtle rounded corners
                marginBottom: 16,  // 4px-grid (16 = 4×4) — space below photo
              }}
            />
          )}

          {/* Name, title, affiliation — font sizes follow the typographic scale */}
          <h4 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", color: palette.text }}> {/* 18px heading, 8px bottom margin (4px grid) */}
            {cfg.name}
          </h4>
          <div style={{ fontSize: 14, color: palette.textSoft, marginBottom: 4 }}> {/* 14px = small body text; 4px = min grid unit */}
            {cfg.title}
          </div>
          <div style={{ fontSize: 13, color: palette.textSoft, marginBottom: 12 }}> {/* 13px caption; 12px = 4×3 spacing */}
            {cfg.affiliation}
          </div>

          {/* Email displayed with @ replaced by (at) for basic spam protection */}
          {cfg.email && (
            <div style={{ fontSize: 13, marginBottom: 12 }}> {/* 13px caption; 12px = 4×3 spacing */}
              <a
                href={`mailto:${cfg.email}`}
                style={{
                  fontFamily: "monospace",  // Monospace font for email (visual convention)
                  color: palette.accent,
                  textDecoration: "none",
                }}
              >
                {cfg.email.replace("@", "(at)")}
              </a>
            </div>
          )}

          {/* Social media links — stacked vertically with label + icon */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
            {cfg.linkedin && (
              <a href={cfg.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: palette.accent, textDecoration: "none" }}>
                LinkedIn <i className="fab fa-linkedin" />
              </a>
            )}
            {cfg.scholar && (
              <a href={cfg.scholar} target="_blank" rel="noopener noreferrer" style={{ color: palette.accent, textDecoration: "none" }}>
                Google Scholar <i className="fab fa-google-scholar" />
              </a>
            )}
            {cfg.github && (
              <a href={cfg.github} target="_blank" rel="noopener noreferrer" style={{ color: palette.accent, textDecoration: "none" }}>
                Github <i className="fab fa-github" />
              </a>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// ─── AboutCard — Bio Text Card ─────────────────────────────────────
function AboutCard() {
  const cfg = siteConfig;
  return (
    <Card>
      <CardBody style={{ padding: 24 }}> {/* 4px-grid (24 = 4×6) — comfortable inner padding */}
        <h3 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 16px", color: palette.text }}> {/* 18px heading; 16px = 4×4 bottom margin */}
          Hello!
        </h3>
        {/* cfg.bio is an array of paragraph strings from siteConfig.ts.
            .map() creates a <p> element for each paragraph.
            parseBioLinks() converts [text](url) markdown links into <a> tags. */}
        {cfg.bio.map((para, i) => (
          <p
            key={i}  // Index as key is fine here since bio paragraphs don't reorder
            style={{
              fontSize: 15,         // Typographic scale: standard body text
              lineHeight: 1.75,  // 1.75× font size for comfortable reading (wide spacing)
              color: palette.text,
              margin: "0 0 14px",    // ~14px ≈ 3.5× grid; slightly tighter than 16px for paragraph flow
            }}
          >
            {parseBioLinks(para)}
          </p>
        ))}
        {/* CV link — Font Awesome file icon + clickable text */}
        {cfg.cvUrl && (
          <a
            href={cfg.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 14, color: palette.accent, textDecoration: "none" }}
          >
            <i className="fas fa-file-alt" /> Curriculum Vitae
          </a>
        )}
        {/* Optional footnote — displayed at the bottom of the About Me card */}
        {cfg.footnote && (
          <p
            style={{
              fontSize: 12,
              color: palette.textSoft,
              marginTop: 16,
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            Note: {cfg.footnote}
          </p>
        )}
      </CardBody>
    </Card>
  );
}

// ─── NewsCard — Chronological News List ─────────────────────────────
// Displays news items as a simple stacked list: date line, then title line.
function NewsCard() {
  if (news.length === 0) return null;

  return (
    <div className="card" style={{ marginBottom: 16, borderRadius: "0.8rem", overflow: "hidden" }}>
      <CardHeader>
        <i className="fas fa-rss" style={{ marginRight: 6 }} /> News
      </CardHeader>
      <div style={{ padding: "8px 16px" }}>
        {news.map((item, i) => (
          <div
            key={i}
            style={{
              padding: "6px 0",
              borderTop: i > 0 ? `1px solid ${palette.border}` : "none",
            }}
          >
            {/* Date line */}
            <div style={{ fontSize: 11, color: palette.textSoft, fontStyle: "italic", marginBottom: 2 }}>
              {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
            {/* Title — optionally wrapped in a link */}
            <div style={{ fontSize: 12, color: palette.text, lineHeight: 1.4 }}>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: palette.accent, textDecoration: "none" }}
                >
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SelectedPublicationsCard — Publication Preview ─────────────────
// Shows the top 4 publications with a "view all" link to the full Publications page.
//
// Props:
//   onNav: Callback to navigate to another page (passed down from App.tsx → AboutPage)
function SelectedPublicationsCard({ onNav }: { onNav: (page: string) => void }) {
  if (selectedPubs.length === 0) return null;

  return (
    <div className="card" style={{ marginBottom: 16, borderRadius: "0.8rem", overflow: "hidden" }}> {/* 16px = 4×4; 0.8rem ≈ 12.8px rounded corners */}
      <CardHeader>
        <i className="fas fa-star" style={{ marginRight: 6}} /> Selected Publications{" "}
      </CardHeader>
      {/* List of publication entries, separated by bottom borders */}
      {selectedPubs.map((pub, i) => (
        <div
          key={pub.slug}
          style={{
            display: "flex",
            gap: 16,       // 4px-grid (4×4) spacing between elements
            padding: 16,   // 4px-grid (4×4) inner padding
            // Border between items, but not after the last one
            borderBottom: i < selectedPubs.length - 1 ? `1px solid ${palette.border}` : "none",
          }}
        >
          <div style={{ flex: 1 }}>
            <h5 style={{ fontSize: 15, fontWeight: 400, margin: "0 0 4px", lineHeight: 1.4, color: palette.text }}> {/* 15px body; 4px min grid; 1.4× line height */}
              {pub.title}
            </h5>
            <p style={{ fontSize: 13, color: palette.textSoft, margin: "0 0 3px" }}>{pub.authors}</p>
            <p style={{ fontSize: 13, color: palette.textSoft, margin: "0 0 6px" }}>
              <em>{pub.venue}</em>
            </p>
            {/* Show a truncated preview of the markdown body content if available */}
            {pub.content && (
              <p style={{ fontSize: 13, color: palette.textSoft, margin: "0 0 6px" }}>
                {pub.content.trim().slice(0, 150)}
                {pub.content.trim().length > 150 ? "…" : ""}
              </p>
            )}
            {/* Paper link */}
            <div style={{ fontSize: 13, color: palette.textSoft }}>
              {pub.pdf && (
                <a
                  href={pub.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: palette.accent, textDecoration: "none", marginRight: 8 }}
                >
                  [Paper]
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
      {/* Footer link to full publications page */}
      <div style={{ padding: "12px 16px", textAlign: "right" }}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNav("Publications");
          }}
          style={{ fontSize: 13, color: palette.accent, textDecoration: "none" }}
        >
          All publications <i className="fas fa-angle-double-right" />
        </a>
      </div>
    </div>
  );
}

// ─── AboutPage (Default Export) — Assembles the Full Page ──────────
// Composes all the above sub-components into a two-column responsive layout.
//
// Props:
//   onNav: Navigation callback, forwarded to SelectedPublicationsCard
export default function AboutPage({ onNav }: { onNav: (page: string) => void }) {
  return (
    <div
      className="two-col-layout"  // CSS class for mobile override (→ flex-direction: column)
      style={{
        display: "flex",        // Side-by-side layout
        gap: 24,                // 4px-grid (24 = 4×6) gap between columns
        alignItems: "flex-start", // Top-align columns (important for sticky sidebar)
      }}
    >
      {/* Left sidebar — 25% width on desktop, 100% on mobile (via CSS override) */}
      <div className="sidebar-col" style={{ width: "25%", flexShrink: 0 }}>
        <FadeIn>
          <ProfileSidebar />
        </FadeIn>
        <FadeIn delay={0.05}>
          <div style={{ marginTop: 16 }}> {/* 16px = 4×4 gap between profile and news cards */}
            <NewsCard />
          </div>
        </FadeIn>
      </div>

      {/* Right content column — takes the remaining 75% of space.
          minWidth: 0 prevents flex children from overflowing when content is wide. */}
      <div className="main-col" style={{ flex: 1, minWidth: 0 }}>
        {/* Each FadeIn wrapper adds a staggered scroll-in animation.
            delay values (0, 0.05, 0.1) make cards appear sequentially. */}
        <FadeIn>
          <AboutCard />
        </FadeIn>
        <FadeIn delay={0.1}>
          <SelectedPublicationsCard onNav={onNav} />
        </FadeIn>
      </div>
    </div>
  );
}

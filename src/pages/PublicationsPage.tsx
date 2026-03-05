// ─── PublicationsPage.tsx — All Publications Grouped by Year ─────
// This page lists every publication, organized into year sections.
// A sticky sidebar on the right lets users jump to a specific year.
// On mobile (<768px), the sidebar is hidden via the CSS class "desktop-nav".

import { useState } from "react";
import { siteConfig } from "../siteConfig";
// TYPESCRIPT CONCEPT: `type` import
//   `type Publication` is only used in type annotations (`: Publication`),
//   never as a runtime value, so the `type` keyword keeps it out of the
//   final JavaScript bundle — a minor optimization.
import { getPublications, type Publication } from "../content";
import { FadeIn, palette } from "../components/UI";

// Fetch all publications once at module load time.
// Because import.meta.glob uses { eager: true }, this is synchronous.
const publications = getPublications();

// ─── PubItem — Single Publication Entry ────────────────────────────
// Renders one publication inside a card. Shows title, authors, venue,
// optional body text, paper link, and tags.
//
// Props:
//   pub:    Publication object (from frontmatter + content)
//   isLast: Boolean — if true, omit the bottom border (visual polish)
function PubItem({ pub, isLast }: { pub: Publication; isLast: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: 16,
        // Show a divider line between items, but not after the last one
        borderBottom: isLast ? "none" : `1px solid ${palette.border}`,
      }}
    >
      <div style={{ flex: 1 }}>
        <h5 style={{ fontSize: 15, fontWeight: 400, margin: "0 0 4px", lineHeight: 1.45, color: palette.text }}>
          {pub.title}
        </h5>
        <p style={{ fontSize: 13, color: palette.textSoft, margin: "0 0 3px" }}>{pub.authors}</p>
        <p style={{ fontSize: 13, color: palette.textSoft, margin: "0 0 6px" }}>
          {/* <em> renders italic — convention for venue names */}
          <em>{pub.venue}</em>
        </p>
        {/* Show markdown body content if it exists and isn't empty */}
        {pub.content && pub.content.trim() && (
          <p style={{ fontSize: 13, color: palette.textSoft, margin: "0 0 6px" }}>
            {pub.content.trim()}
          </p>
        )}
        {/* Links and tags row */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 13 }}>
          {pub.pdf && (
            <a
              href={pub.pdf}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: palette.accent, textDecoration: "none" }}
            >
              [Paper]
            </a>
          )}
          {/* (pub.tags || []) is a safety pattern: if pub.tags is undefined,
              use an empty array so .map() doesn't crash. */}
          {(pub.tags || []).map((t, i) => (
            <span
              key={i}
              style={{
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: 4,
                background: palette.tag,
                color: palette.textSoft,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PublicationsPage (Default Export) ─────────────────────────────
export default function PublicationsPage() {
  const allPubs = publications;

  // Extract unique years from publication dates and sort descending.
  // String(p.date).slice(0, 4) extracts the year portion whether the date
  // is "2016" (year-only) or "2024-11-21" (full ISO date).
  // new Set() removes duplicates; the spread [...] converts it back to an array.
  const years = [...new Set(allPubs.map((p) => String(p.date).slice(0, 4)))].sort((a, b) => Number(b) - Number(a));

  return (
    <div style={{ display: "flex", gap: 24 }}>
      {/* ── Main content column ────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Google Scholar link at the top */}
        <FadeIn>
          <p style={{ fontSize: 14, color: palette.textSoft, margin: "0 0 24px" }}>
            You can view up-to-date publications on my {" "}
            <a
              href={siteConfig.scholar}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: palette.accent, textDecoration: "none" }}
            >
              Google Scholar
            </a>
          </p>
        </FadeIn>

        {/* Render one section per year. Each section has:
            - An <h2> year heading with an id (used as anchor for sidebar links)
            - A card containing all publications from that year */}
        {years.map((year) => {
          const yearPubs = allPubs.filter((p) => String(p.date).slice(0, 4) === year);
          return (
            // id={`year-${year}`} creates an anchor like "year-2025" that
            // the sidebar links can scroll to.
            <div key={year} id={`year-${year}`}>
              <FadeIn>
                <h2 style={{ fontSize: 24, fontWeight: 700, paddingTop: 16, marginBottom: 12, color: palette.text }}>
                  {year}
                </h2>
              </FadeIn>
              <FadeIn>
                <div
                  className="card"
                  style={{
                    borderRadius: "0.8rem",  // 0.8rem ≈ 12.8px — modern rounded card corners
                    overflow: "hidden",
                    marginBottom: 16,        // 4px-grid (16 = 4×4)
                  }}
                >
                  {yearPubs.map((pub, i) => (
                    <PubItem key={pub.slug} pub={pub} isLast={i === yearPubs.length - 1} />
                  ))}
                </div>
              </FadeIn>
            </div>
          );
        })}
      </div>
    </div>
  );
}

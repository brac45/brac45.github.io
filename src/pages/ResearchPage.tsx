// ─── ResearchPage.tsx — Research Areas as Individual Cards ────────
// Displays research area cards loaded from src/content/research/*.md.
// Each card is a clickable link with an optional cover image, matching
// the Tinkering page card style.

import { getResearchItems, type ResearchItem } from "../content";
import { FadeIn, SectionHeader, palette } from "../components/UI";

// Load research data once at module load time (synchronous, eager glob)
const researchItems = getResearchItems();

// ─── ResearchCard — Single Research Area Card ──────────────────────
// Follows the same pattern as TinkerCard: the entire card is a clickable
// <a> tag with hover lift effect and optional cover image.
function ResearchCard({ item }: { item: ResearchItem }) {
  // If there's no link, render a non-clickable <div> instead of <a>
  const Tag = item.link ? "a" : "div";
  const linkProps = item.link
    ? { href: item.link, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Tag
      {...linkProps}
      className="card"
      style={{
        display: "block",
        textDecoration: "none",
        borderRadius: "0.8rem",         // 0.8rem ≈ 12.8px — matches .card CSS class
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: item.link ? "pointer" : "default",
      }}
      onMouseEnter={(e) => {
        if (item.link) {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)";
        }
      }}
      onMouseLeave={(e) => {
        if (item.link) {
          (e.currentTarget as HTMLElement).style.transform = "none";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
        }
      }}
    >
      {/* Optional cover image */}
      {item.image && (
        <div style={{ width: "100%", height: 180, overflow: "hidden", background: "#e9ecef" }}>
          <img
            src={item.image}
            alt={item.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}
      {/* Card text content */}
      <div style={{ padding: "16px 20px" }}> {/* 4px-grid: 16 = 4×4, 20 = 4×5 */}
        {/* Unicode icon from frontmatter, if provided */}
        {item.icon && (
          <span style={{ fontSize: 24, display: "block", marginBottom: 8, opacity: 0.7 }}>
            {item.icon}
          </span>
        )}
        <h5 style={{ fontSize: 15, fontWeight: 700, color: palette.text, margin: "0 0 6px", lineHeight: 1.4 }}>
          {item.title}
        </h5>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: palette.textSoft, margin: 0 }}>
          {item.content.trim()}
        </p>
      </div>
    </Tag>
  );
}

// ─── ResearchPage (Default Export) ─────────────────────────────────
export default function ResearchPage() {
  return (
    <div>
      <FadeIn>
        <SectionHeader title="Research" />
        <p style={{ fontSize: 15, lineHeight: 1.75, color: palette.textSoft, margin: "0 0 24px" }}>
          You can find my research projects, both academic and personal, here. My interests across various topics in HCI research, to building novel software tools.
        </p>
      </FadeIn>

      {/* CSS Grid layout: cards auto-fill, each at least 300px wide.
          delay={0.08 * i} staggers the FadeIn animation. */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {/* 300px min = card width matching Tinkering page; gap 20 = 4×5 grid spacing */}
        {researchItems.map((item, i) => (
          <FadeIn key={item.slug} delay={0.08 * i}>
            <ResearchCard item={item} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

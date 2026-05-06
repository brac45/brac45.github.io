// ─── TinkeringPage.tsx — Project Showcase Grid ────────────────────
// Displays side project cards loaded from src/content/projects/*.md.
// Each card is a clickable link that lifts on hover for a subtle 3D effect.

import { getProjects, type Project } from "../content";
// `type Project` is a type-only import — used for the TinkerCard prop annotation below,
// then erased at compile time. See PublicationsPage.tsx for a fuller explanation.
import { FadeIn, SectionHeader, palette } from "../components/UI";

// Load project data once at module load time (synchronous, eager glob)
const projects = getProjects();

// ─── TinkerCard — Single Project Card ──────────────────────────────
// The entire card is wrapped in an <a> tag so clicking anywhere navigates.
//
// Hover effect technique:
//   Instead of CSS :hover (which isn't available with inline styles),
//   we use onMouseEnter/onMouseLeave event handlers to directly modify
//   the element's style. e.currentTarget refers to the <a> element itself.
//   The "transition" property on the <a> makes the change animate smoothly.
function TinkerCard({ project }: { project: Project }) {
  return (
    <a
      href={project.link}
      target="_blank"           // Open in new tab
      rel="noopener noreferrer" // Security: prevents the new page from accessing window.opener
      className="card"          // Gets white background + shadow from styles.css
      style={{
        display: "block",       // <a> is normally inline; block makes it fill its grid cell
        textDecoration: "none", // Remove default link underline
        borderRadius: "0.8rem",         // 0.8rem ≈ 12.8px — modern rounded card corners (matches .card CSS class)
        overflow: "hidden",     // Clips the image corners to the card's rounded border
        transition: "transform 0.2s, box-shadow 0.2s", // Animate hover changes over 0.2s
      }}
      onMouseEnter={(e) => {
        // Lift the card up 2px and increase shadow on hover
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        // Reset to default position and shadow when mouse leaves
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
      }}
    >
      {/* Optional cover image — uses objectFit: cover to fill the area
          without distorting the image's aspect ratio */}
      {project.image && (
        <div style={{ width: "100%", height: 360, overflow: "hidden", background: "#cecece" }}> {/* 180px = thumbnail height for consistent card proportions */}
          <img
            src={project.image}
            alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}
      {/* Card text content — title and description from markdown body */}
      <div style={{ padding: "16px 20px" }}> {/* 4px-grid: 16 = 4×4, 20 = 4×5 */}
        <h5 style={{ fontSize: 15, fontWeight: 700, color: palette.text, margin: "0 0 6px", lineHeight: 1.4 }}>
          {project.title}
        </h5>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: palette.textSoft, margin: 0 }}>
          {project.content.trim()}
        </p>
      </div>
    </a>
  );
}

// ─── TinkeringPage (Default Export) ────────────────────────────────
export default function TinkeringPage() {
  return (
    <div>
      <FadeIn>
        <SectionHeader title="Tinkering" />
        <p style={{ fontSize: 15, lineHeight: 1.75, color: palette.textSoft, margin: "0 0 24px"}}>
          A collection of various small projects and tidbits I worked on.
        </p>
      </FadeIn>

      {/* CSS Grid layout: cards auto-fill, each at least 300px wide.
          delay={0.08 * i} staggers the FadeIn animation so cards appear
          one after another instead of all at once. */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {/* 300px min = wider cards for image-heavy projects; gap 20 = 4×5 grid spacing */}
        {projects.map((project, i) => (
          <FadeIn key={project.slug} delay={0.08 * i}>
            <TinkerCard project={project} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

// ─── App.tsx — Root Application Component ─────────────────────────
// This is the top-level React component. It controls:
//   1. Which page is currently visible (via a simple state variable)
//   2. The overall page shell (navbar + content area + footer)
//
// NAVIGATION APPROACH:
//   Instead of a routing library (like react-router), this app uses a single
//   state variable `page` to track which page to show. When a user clicks a
//   nav link, we just update that string. A switch statement then picks the
//   right component to render. This is simpler for a small site with no
//   deep-linking or browser back-button needs.

import { useState } from "react";           // React hook to manage component state
import NavBar from "./components/NavBar";    // The dark top navigation bar
import AboutPage from "./pages/AboutPage";   // Home page (two-column layout)
import ResearchPage from "./pages/ResearchPage";
import PublicationsPage from "./pages/PublicationsPage";
import TinkeringPage from "./pages/TinkeringPage";
import { palette } from "./components/UI";   // Shared color tokens

export default function App() {
  // useState("About") creates a state variable called `page` with initial value "About".
  // `setPage` is the function to update it. When setPage is called, React re-renders
  // this component with the new value, which causes a different page to display.
  const [page, setPage] = useState("About");

  // navigate() is a helper we pass down to child components (NavBar, AboutPage).
  // When called, it: (1) updates the page state, (2) smooth-scrolls to the top.
  const navigate = (p: string) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Decide which page component to render based on the current `page` state.
  // Each <PageComponent /> is JSX — it looks like HTML but is actually a
  // function call that returns React elements.
  let content;
  switch (page) {
    case "Research":
      content = <ResearchPage />;
      break;
    case "Publications":
      content = <PublicationsPage />;
      break;
    case "Tinkering":
      content = <TinkeringPage />;
      break;
    default:
      // AboutPage receives `onNav` as a prop so its "view all publications"
      // link can trigger navigation to the Publications page.
      content = <AboutPage onNav={navigate} />;
  }

  // The return value is JSX — React's syntax for describing UI.
  // It looks like HTML but has some differences:
  //   - Use `style={{ ... }}` (double braces: outer = JSX expression, inner = JS object)
  //   - Use camelCase for CSS properties (e.g., maxWidth instead of max-width)
  //   - Use `className` instead of `class`
  //   - Use `{expression}` to embed JavaScript values
  return (
    <>
      {/* <> ... </> is a "Fragment" — groups elements without adding an extra DOM node */}
      <NavBar active={page} onNav={navigate} />
      <main
        style={{
          maxWidth: 1140,          // Max content width in pixels (matches Bootstrap container-lg)
          margin: "0 auto",        // Center horizontally
          padding: "24px 16px 40px", // 4px-grid spacing: 24 top, 16 sides, 40 bottom
          minHeight: "100vh",      // At least full viewport height
        }}
      >
        {/* Render whichever page component was selected above */}
        {content}
      </main>

      {/* Footer — full-width dark bar matching the navbar style.
          Placed OUTSIDE <main> so it spans the entire viewport width,
          not constrained by maxWidth: 1140. The inner <div> mirrors
          the navbar's centered container for consistent alignment. */}
      <footer
        style={{
          background: palette.dark,       // Same dark gray as the navbar
          color: palette.darkText,        // White text on dark background
          fontSize: 13,                // Typographic scale: smallest readable body text
          marginTop: 0,
        }}
      >
        <div
          style={{
            maxWidth: 1140,               // Match the content area width
            margin: "0 auto",             // Center horizontally
            padding: "16px 16px",         // 4px-grid spacing (16 = 4×4)
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left side: "Last updated" with auto-formatted current date */}
          <span style={{ fontStyle: "italic", opacity: 0.7 }}> {/* 0.7 opacity dims secondary text on dark bg */}
            Last updated: {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </span>
          {/* Right side: copyright with auto-updated year */}
          <span style={{ opacity: 0.7 }}> {/* 0.7 matches the "Last updated" opacity */}
            © {new Date().getFullYear()} Jong Ho Lee
          </span>
        </div>
      </footer>
    </>
  );
}

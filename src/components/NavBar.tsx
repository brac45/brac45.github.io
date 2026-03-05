// ─── NavBar.tsx — Dark Top Navigation Bar ─────────────────────────
// A fixed-position dark navbar at the top of the page.
// On desktop: shows all nav items horizontally.
// On mobile (<768px): hides nav items and shows a hamburger "Menu" button
//   that toggles a vertical dropdown menu.
//
// Props (passed from App.tsx):
//   active: String name of the currently active page (e.g., "About")
//   onNav:  Callback function to call when a nav item is clicked,
//           which updates the page state in App.tsx.

import { useState, useEffect } from "react";
import { palette } from "./UI";
import { siteConfig } from "../siteConfig";

// The list of pages shown in the navbar. Order here = order displayed.
const NAV_ITEMS = ["About", "Research", "Publications", "Tinkering"];

// TYPESCRIPT CONCEPT: Named interface for props
//   For components with multiple or complex props, defining a named interface
//   is cleaner than inline types. It also lets you export the interface if
//   other files need to reference the same prop shape.
//
//   `(page: string) => void` is a FUNCTION TYPE annotation:
//   - `(page: string)` = the function takes one string parameter
//   - `=> void` = the function returns nothing (void)
//   This tells TypeScript that `onNav` must be called with a string argument.
interface NavBarProps {
  active: string;
  onNav: (page: string) => void;
}

export default function NavBar({ active, onNav }: NavBarProps) {
  // State to track whether the mobile dropdown menu is open or closed.
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      style={{
        position: "fixed",     // Stays at top even when scrolling
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,           // Ensures navbar appears above all other content
        background: palette.dark, // Dark gray (#343a40)
        opacity: 0.95,         // Slightly transparent for a subtle see-through effect
        boxShadow: "0 .125rem .25rem rgba(0,0,0,.075)", // Subtle bottom shadow
      }}
    >
      {/* Inner container — maxWidth matches the main content area for alignment */}
      <div
        style={{
          maxWidth: 1140,              // Bootstrap "container-lg" max width (px)
          margin: "0 auto",        // Center horizontally
          padding: "0 16px",          // 4px-grid horizontal padding (16 = 4×4)
          display: "flex",         // Horizontal layout
          alignItems: "center",    // Vertically center items
          justifyContent: "space-between", // Push name left, nav items right
          height: 56,                  // Bootstrap default navbar height (px); body padding-top matches this
        }}
      >
        {/* Site name (left side) — clicking navigates to About/home page */}
        <button
          onClick={() => onNav("About")}
          style={{
            background: "none",
            border: "none",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            fontSize: 26,
            fontWeight: 700,
            color: palette.darkText,  // White text on dark bg
            cursor: "pointer",
            padding: 0,
          }}
        >
          {/* Pulls the short name from siteConfig.ts so it's easy to change */}
          {siteConfig.shortName}
        </button>

        {/* Desktop nav links (right side) — hidden on mobile via CSS class */}
        {/* The className "desktop-nav" is targeted by a @media query in styles.css
            that sets display:none on screens narrower than 768px. */}
        <div style={{ display: "flex", gap: 0 }} className="desktop-nav">
          {/* .map() iterates over the NAV_ITEMS array and creates a <button> for each.
              This is how you render lists in React — map an array to JSX elements.
              The `key` prop is required by React to efficiently track list items. */}
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => onNav(item)}   // Tell App.tsx to switch to this page
              style={{
                background: "none",
                border: "none",
                padding: "8px 12px",
                fontSize: 18,
                // Active page gets bold white text; inactive pages get dimmer text
                fontWeight: active === item ? 700 : 700,
                color: active === item ? "#fff" : "rgba(255,255,255,0.6)",
                cursor: "pointer",
                transition: "color 0.2s", // Smooth color transition
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Mobile menu toggle button — hidden on desktop via CSS class.
            "mobile-menu-btn" starts with display:none and only shows at ≤768px. */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)} // Toggle open/closed
          className="mobile-menu-btn"
          style={{
            display: "none",       // Hidden by default; CSS @media overrides on mobile
            background: "none",
            border: "none",
            fontSize: 28,
            cursor: "pointer",
            color: "rgba(255,255,255,0.6)",
            padding: "8px 12px",
          }}
        >
          {/* Font Awesome hamburger icon (three horizontal lines) */}
          <i className="fas fa-bars" />
        </button>
      </div>

      {/* Mobile dropdown menu — only rendered when mobileOpen is true.
          This is "conditional rendering" in React: {condition && <JSX>}
          renders the JSX only when condition is truthy. */}
      {mobileOpen && (
        <div
          className="mobile-nav"
          style={{
            background: palette.dark,
            borderTop: "1px solid rgba(255,255,255,0.1)", // Subtle separator
            padding: "8px 16px 16px",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => {
                onNav(item);             // Navigate to the page
                setMobileOpen(false);    // Close the mobile menu after clicking
              }}
              style={{
                display: "block",    // Stack buttons vertically (block = full width)
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "8px 12px",
                fontSize: 14,
                fontWeight: active === item ? 700 : 400,
                color: active === item ? "#fff" : "rgba(255,255,255,0.6)",
                cursor: "pointer",
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

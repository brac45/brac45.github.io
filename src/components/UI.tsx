// ─── UI.tsx — Shared UI Primitives & Design Tokens ────────────────
// This file contains reusable building blocks used across all pages:
//   - palette:       Color constants (design tokens) so colors are consistent everywhere
//   - FadeIn:        Scroll-triggered fade-in animation wrapper
//   - Card/Header/Body: White card containers (matching the academic-homepage style)
//   - LinkPill:      Rounded pill-shaped external link buttons
//   - SectionHeader: Consistent page title styling
//   - parseBioLinks: Converts [text](url) markdown syntax in strings to clickable links

import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from "react";
// useState:  Manages reactive state (e.g., hover state, visibility)
// useEffect: Runs side effects after render (e.g., setting up observers)
// useRef:    Creates a mutable reference to a DOM element without causing re-renders
//
// TYPESCRIPT CONCEPT: `type` imports from React
//   `type ReactNode` and `type CSSProperties` are TypeScript-only imports —
//   they're erased at compile time and don't add any code to the bundle.
//   - ReactNode: The type for "anything React can render" (strings, numbers,
//     JSX elements, arrays, null, etc.). Used to type `children` props.
//   - CSSProperties: The type for React inline style objects. Ensures you
//     only use valid CSS property names (e.g., `fontSize` not `font-size`)
//     and valid values (e.g., numbers or strings where appropriate).

// ─── Design Tokens (Color Palette) ────────────────────────────────
// Centralizing colors here means we only change them in one place
// to update the entire site's look.
// Sourced from a Coolors palette (see src/palette.scss for the full export):
//   ghost-white (#e8e9f3), silver (#cecece), pale-slate (#a6a6a8),
//   shadow-grey (#272635), frosted-blue (#b1e5f2)
// Some tokens are derived shades to meet WCAG AA contrast requirements.
const palette = {
  text: "#272635",            // Primary text — shadow-grey (~14:1 contrast on white)
  textSoft: "#272635",        // Secondary/muted text — pale-slate (~3:1 on white)
  accent: "#2b7a8c",          // Links, active states — darkened frosted-blue (~5:1 on white)
  accentSoft: "rgba(177,229,242,0.15)", // Faint hover background — frosted-blue @ 15% opacity
  border: "#d9d9d9",          // Card & section borders — light grey
  tag: "#d6f0f7",             // Tag/badge background — lightened frosted-blue
  dark: "#272635",            // Navbar background — shadow-grey
  darkText: "#e8e9f3",        // Text on dark backgrounds — ghost-white
};

// Named export: other files import this as `import { palette } from "./UI"`
export { palette };

// ─── FadeIn Component ──────────────────────────────────────────────
// Wraps any content and makes it fade in + slide up when scrolled into view.
//
// Props:
//   children: The JSX content to wrap (React passes nested elements as `children`)
//   delay:    Seconds to wait before starting the animation (for staggering effects)
//
// How it works:
//   1. useRef creates a reference to the wrapper <div> so we can observe it.
//   2. IntersectionObserver is a browser API that fires a callback when an
//      element enters/exits the viewport. We use threshold: 0.1 meaning
//      "trigger when at least 10% of the element is visible."
//   3. When visible becomes true, CSS transition animates opacity (0→1) and
//      transform (12px down → 0), creating the fade-in-up effect.
//   4. The cleanup function (return () => obs.disconnect()) runs when the
//      component is removed from the page, preventing memory leaks.
// TYPESCRIPT CONCEPT: Inline prop types
//   Instead of defining a separate `interface FadeInProps { ... }`, we can
//   type props directly in the function signature using an inline object type:
//   `{ children: ReactNode; delay?: number }`. This is convenient for simple
//   components with few props. For components with many props or props reused
//   elsewhere, a named interface (like NavBarProps) is cleaner.
//
// TYPESCRIPT CONCEPT: Generic useRef<HTMLDivElement>
//   `useRef<HTMLDivElement>(null)` uses a GENERIC type parameter to tell
//   TypeScript: "This ref will point to an HTMLDivElement (a <div>)."
//   Without the generic, TypeScript wouldn't know what `.current` is,
//   so you couldn't pass it to IntersectionObserver.observe() safely.
export function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);      // Will hold a reference to the DOM node
  const [visible, setVisible] = useState(false); // Tracks if element has been seen

  useEffect(() => {
    // Create an observer that watches for the element entering the viewport
    const obs = new IntersectionObserver(
      ([entry]) => {
        // entry.isIntersecting is true when the element is visible on screen
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }  // Trigger when 10% visible
    );
    if (ref.current) obs.observe(ref.current); // Start watching our div
    return () => obs.disconnect();              // Cleanup: stop watching on unmount
  }, []); // Empty dependency array [] means this effect runs once on mount

  return (
    <div
      ref={ref}  // Attach the ref so IntersectionObserver can watch this DOM node
      style={{
        // When visible=false: transparent and shifted 12px down
        // When visible=true: fully opaque at normal position
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",  // 12px = 4×3 grid — subtle entry slide distance
        // CSS transition animates the change over 0.5s with the specified delay
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`, // 0.5s = smooth, perceptible animation duration
      }}
    >
      {children}
    </div>
  );
}

// ─── Card Components ───────────────────────────────────────────────
// These create the white rounded-corner container look from academic-homepage.
// The CSS class "card" (defined in styles.css) provides shadow & border-radius.
// We split Card into Card + CardHeader + CardBody for flexible composition.

// Card: The outer white container. Uses the .card CSS class for shadow/radius,
// plus any additional inline styles passed via the `style` prop.
// The ...style syntax is the JavaScript "spread operator" — it merges the
// passed-in style object into the base styles.
// Card, CardHeader, CardBody all use the same inline prop pattern:
//   `{ children: ReactNode; style?: CSSProperties }`
// The `?` on style makes it optional — callers can write <Card> without
// passing a style prop, and it defaults to {} via the `= {}` default value.
export function Card({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className="card"
      style={{
        padding: 0,
        marginBottom: 16,
        ...style,       // Merge any extra styles from the parent
      }}
    >
      {children}
    </div>
  );
}

// CardHeader: A bold heading row at the top of a card, separated by a bottom border.
export function CardHeader({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <h6
      style={{
        padding: "12px 16px",      // 4px-grid: 12 = 4×3, 16 = 4×4
        margin: 0,
        borderBottom: `1px solid ${palette.border}`,
        fontWeight: 700,
        fontSize: 18,              // Typographic scale: small heading
        ...style,
      }}
    >
      {children}
    </h6>
  );
}

// CardBody: The padded content area inside a card.
export function CardBody({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ padding: 16, ...style }}> {/* 16px = 4×4 — standard card body padding */}
      {children}
    </div>
  );
}

// ─── LinkPill Component ────────────────────────────────────────────
// A small rounded button that links to an external URL (email, GitHub, etc.).
// Changes color and background on hover using React state (not CSS :hover,
// because we're using inline styles which don't support pseudo-selectors).
export function LinkPill({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"            // Open in new tab
      rel="noopener noreferrer"  // Security: prevents the new page from accessing window.opener
      onMouseEnter={() => setHovered(true)}   // Track hover state for styling
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        fontSize: 13,                   // Typographic scale: caption/small text
        color: hovered ? palette.accent : palette.textSoft,
        textDecoration: "none",
        padding: "6px 14px",             // 4px-grid-adjacent: compact pill padding
        borderRadius: 20,         // Fully rounded "pill" shape
        border: `1px solid ${hovered ? palette.accent : palette.border}`,
        transition: "all 0.2s",   // Smooth color/border change
        background: hovered ? palette.accentSoft : "transparent",
        whiteSpace: "nowrap",     // Prevent text wrapping inside pill
      }}
    >
      {label} ↗
    </a>
  );
}

// ─── SectionHeader Component ───────────────────────────────────────
// Used at the top of each page to render a large, bold title.
export function SectionHeader({ title }: { title: string }) {
  return (
    <h2
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        fontSize: 28,              // Typographic scale: page title (largest heading)
        fontWeight: 700,
        color: palette.text,
        margin: "0 0 20px",        // 4px-grid (20 = 4×5) bottom margin
      }}
    >
      {title}
    </h2>
  );
}

// ─── parseBioLinks() — Inline Markdown Link Parser ─────────────────
// The bio text in siteConfig.ts contains markdown-style links like:
//   "I work at the [HCIL](https://hcil.umd.edu/) lab."
//
// This function converts those into clickable React <a> elements.
// It uses a regex to find all [text](url) patterns and builds an array
// of alternating plain-text strings and <a> elements.
//
// Why not just use dangerouslySetInnerHTML?
//   That would work but opens XSS (cross-site scripting) risks.
//   This approach is safer because we only create controlled <a> tags.
// TYPESCRIPT CONCEPT: Return type `(string | React.JSX.Element)[]`
//   The `|` is a UNION TYPE — it means "either a string OR a React.JSX.Element".
//   The `[]` suffix means "an array of those". So the return type is:
//   "an array where each item is either a plain string or a React element."
//   React can render this array directly — it knows how to handle mixed
//   arrays of strings and elements.
//
//   `React.JSX.Element` is the type for a JSX expression like <a>...</a>.
//   We use `React.JSX.Element` (namespaced) because the global `JSX`
//   namespace isn't available by default in modern React + TypeScript.
export function parseBioLinks(text: string): (string | React.JSX.Element)[] {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g; // Matches [link text](url)
  const parts: (string | React.JSX.Element)[] = []; // Will hold a mix of strings and React <a> elements
  let lastIndex = 0;      // Tracks where unprocessed text starts
  // `RegExpExecArray | null` — another union type. regex.exec() returns
  // either a match object (RegExpExecArray) or null when no more matches.
  let match: RegExpExecArray | null;
  let key = 0;            // React requires a unique `key` prop for list items

  // regex.exec() finds each match one at a time. Returns null when done.
  while ((match = regex.exec(text)) !== null) {
    // Push any plain text between the last match and this one
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Push a React <a> element for the link
    // match[1] = link text (inside []), match[2] = URL (inside ())
    parts.push(
      <a
        key={key++}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: palette.accent,
          textDecoration: "none",
        }}
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length; // Move past this match
  }
  // Push any remaining plain text after the last link
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts; // React can render an array of strings and elements directly
}

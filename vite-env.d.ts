/// <reference types="vite/client" />
// ^^^ This "triple-slash directive" tells TypeScript to include Vite's
// built-in type definitions. This gives us types for Vite-specific features
// like import.meta.glob, import.meta.env, and CSS/asset module imports.

// TYPESCRIPT CONCEPT: Ambient module declarations (`declare module`)
//   TypeScript needs to know the shape of every import. When you write
//   `import data from "./my-file.md"`, TypeScript has no idea what a .md
//   file exports — it only understands .ts/.tsx/.js/.jsx by default.
//
//   `declare module "*.md"` tells TypeScript: "Any import matching *.md
//   will have this shape." The `*` is a wildcard matching any filename.
//   This is called an AMBIENT declaration because it describes something
//   that exists at runtime (our Vite plugin creates these exports) but
//   isn't directly written in TypeScript.
//
//   Without this file, every .md import would show a red squiggly error:
//   "Cannot find module './publications/2024-imwut-goaltrack.md'"
declare module "*.md" {
  export const frontmatter: Record<string, unknown>;
  export const content: string;
  const defaultExport: { frontmatter: Record<string, unknown>; content: string };
  export default defaultExport;
}

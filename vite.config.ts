// ─── Vite Configuration ────────────────────────────────────────────
// Vite is the build tool for this project. It does two things:
//   1. DEV MODE (npm run dev):  Starts a local server with hot-module replacement
//      (HMR), so changes appear instantly in the browser without a full reload.
//   2. BUILD MODE (npm run build): Bundles all JS/CSS/assets into optimized
//      static files in the dist/ folder, ready for deployment.
//
// This config file tells Vite which plugins to use and how to behave.

// TYPESCRIPT CONCEPT: `type` imports
//   `type Plugin` is imported with the `type` keyword, which tells TypeScript:
//   "I only need this for type-checking — don't include it in the output JS."
//   This is an optimization: regular imports become real JavaScript code,
//   but `type` imports are erased completely during compilation.
//   Use `type` for interfaces, type aliases, and anything only used in
//   type annotations (`: Plugin`), never as a runtime value.
import { defineConfig, type Plugin } from "vite"; // Helper to get type-checking for config options
import react from "@vitejs/plugin-react"; // Official React plugin — enables JSX and fast refresh
import { readFileSync } from "fs";     // Node.js built-in to read files from disk
import matter from "gray-matter";      // Library that parses YAML frontmatter from .md files

// ─── Custom Vite Plugin: Markdown Importer ─────────────────────────
// This plugin lets us `import` .md files directly in our TS/TSX code.
// Without this, Vite wouldn't know what to do with .md imports.
//
// How it works:
//   1. Vite calls transform() for every file it encounters during the build.
//   2. We check if the file ends in ".md" — if not, we skip it (return null).
//   3. For .md files, we read the raw text and use gray-matter to split it into:
//      - data:    the YAML frontmatter (title, authors, year, etc.) as a JS object
//      - content: the markdown body text as a raw string
//   4. We return valid JavaScript that exports these as { frontmatter, content }.
//
// EXAMPLE: If a file contains:
//   ---
//   title: "My Paper"
//   year: 2024
//   ---
//   This is the description.
//
// Then importing it gives you:
//   { frontmatter: { title: "My Paper", year: 2024 }, content: "This is the description.\n" }
// TYPESCRIPT CONCEPT: Return type annotation (`: Plugin`)
//   Adding `: Plugin` after the function name tells TypeScript this function
//   must return an object matching Vite's Plugin interface. If the returned
//   object is missing required properties (like `name`), TypeScript flags it.
//
// TYPESCRIPT CONCEPT: Parameter type annotations
//   `_src: string, id: string` tells TypeScript that both parameters are strings.
//   The underscore prefix `_src` is a convention meaning "I'm not using this
//   parameter" — it signals intent to other developers and avoids lint warnings.
function markdownPlugin(): Plugin {
  return {
    name: "vite-plugin-markdown",   // Plugin name (shows up in error messages)
    transform(_src: string, id: string) { // Called for every imported file; id = file path
      if (!id.endsWith(".md")) return null;  // Only process .md files
      const raw = readFileSync(id, "utf-8"); // Read the file's raw text content
      const { data, content } = matter(raw); // Parse frontmatter (data) + body (content)
      return {
        // Return valid JS module code that exports the parsed data.
        // JSON.stringify safely converts the objects to strings for embedding in JS.
        code: `export const frontmatter = ${JSON.stringify(data)};
export const content = ${JSON.stringify(content)};
export default { frontmatter, content };`,
        map: null,  // No source map needed for this simple transform
      };
    },
  };
}

// ─── Export the final Vite config ──────────────────────────────────
export default defineConfig({
  plugins: [
    react(),           // Enables JSX syntax and React Fast Refresh (instant updates)
    markdownPlugin(),  // Our custom plugin to import .md files as data
  ],
  // "base" sets the public URL path prefix.
  // "/" works for username.github.io repos (the site is at the root).
  // If deploying to a project repo, use "/<repo-name>/" instead.
  base: "/",
});

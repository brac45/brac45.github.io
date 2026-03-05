// ─── Content Loader (src/content/index.ts) ─────────────────────────
// This file is the bridge between markdown content files and React components.
// It uses Vite's import.meta.glob to discover and load all .md files at
// BUILD TIME (not at runtime in the browser).
//
// How it works:
//   1. import.meta.glob("./publications/*.md", { eager: true }) tells Vite:
//      "Find every .md file in ./publications/ and import them NOW (eagerly)."
//   2. Vite replaces this at build time with a plain JavaScript object like:
//      { "./publications/2024-imwut-goaltrack.md": { frontmatter: {...}, content: "..." }, ... }
//   3. Our custom markdownPlugin in vite.config.ts transforms each .md file
//      so that `frontmatter` contains the YAML metadata and `content` contains
//      the markdown body text.
//   4. loadEntries() converts that object into a clean array of data objects.
//
// To add content:
//   - New publication → create a .md file in src/content/publications/
//   - New news item   → create a .md file in src/content/news/
//   - New project     → create a .md file in src/content/projects/
//   The glob pattern will automatically pick it up on next build/dev reload.

// ─── Type Definitions ──────────────────────────────────────────────
//
// TYPESCRIPT CONCEPT: `interface` vs `type`
//   Both define object shapes. `interface` is preferred for object types
//   because it's extendable (see `extends` below). `type` is better for
//   unions, intersections, and aliases of primitive types.

// Shape of a markdown module after our custom Vite plugin transforms it.
// `Record<string, unknown>` is a TypeScript utility type meaning:
//   "an object with string keys and values of unknown type."
// `unknown` is the type-safe version of `any` — you can assign anything
// to it, but you must narrow/check the type before using it.
interface MarkdownModule {
  frontmatter: Record<string, unknown>;
  content: string;
}

// Base content entry — all content types share these fields.
// `[key: string]: unknown` is an INDEX SIGNATURE — it tells TypeScript:
//   "This object can also have any other string-keyed properties."
// We need this because markdown frontmatter can contain arbitrary fields
// that we don't know about at compile time.
export interface ContentEntry {
  slug: string;
  content: string;
  [key: string]: unknown;  // Allow arbitrary frontmatter fields
}

// TYPESCRIPT CONCEPT: `extends`
//   `Publication extends ContentEntry` means Publication INHERITS all fields
//   from ContentEntry (slug, content, [key: string]) AND adds its own.
//   This avoids repeating slug/content in every interface.
//
// TYPESCRIPT CONCEPT: Optional properties (`?`)
//   `order?: number` means this property may or may not exist on the object.
//   Without `?`, TypeScript would require it on every publication.
//   This matches reality — not every .md file includes an `order` field.
export interface Publication extends ContentEntry {
  title: string;
  authors: string;
  venue: string;
  date: string;
  type?: string;    // Optional — e.g., "conference", "journal"
  tags?: string[];  // Optional — array of tag strings like ["HCI", "AI"]
  pdf?: string;     // Optional — URL to the paper PDF
}

export interface Project extends ContentEntry {
  title: string;
  order?: number;
  link?: string;
  image?: string;
}

export interface ResearchItem extends ContentEntry {
  title: string;
  order?: number;
  icon?: string;
  link?: string;
  image?: string;
}

// ─── Eager glob imports ────────────────────────────────────────────
// { eager: true } means "import immediately" (synchronous).
// Without eager, these would return Promises and need await/async.
// TYPESCRIPT CONCEPT: Generics (`<MarkdownModule>`)
//   import.meta.glob is a GENERIC function — it can return different types
//   depending on what you put inside the angle brackets `<>`.
//   Writing `import.meta.glob<MarkdownModule>(...)` tells TypeScript:
//   "The values in the returned object will be MarkdownModule shaped."
//   Without `<MarkdownModule>`, TypeScript would type them as `unknown`
//   and you'd get errors trying to access `.frontmatter` or `.content`.
const pubModules = import.meta.glob<MarkdownModule>("./publications/*.md", { eager: true });
const projectModules = import.meta.glob<MarkdownModule>("./projects/*.md", { eager: true });
const researchModules = import.meta.glob<MarkdownModule>("./research/*.md", { eager: true });

// ─── loadEntries() — Convert glob results to a usable array ───────
// Input:  { "./publications/2024-imwut-goaltrack.md": { frontmatter: {...}, content: "..." }, ... }
// Output: [{ slug: "2024-imwut-goaltrack", title: "...", date: "2024", content: "...", ... }, ...]
//
// Steps:
//   1. Object.entries() converts the object to [key, value] pairs
//   2. For each pair, extract the filename as a "slug" (URL-friendly ID)
//   3. Spread (...) the frontmatter fields into the result object
//   4. Attach the markdown body as "content"
// TYPESCRIPT CONCEPT: Parameter & return type annotations
//   `modules: Record<string, MarkdownModule>` types the input parameter.
//   `Record<string, MarkdownModule>` means "object with string keys → MarkdownModule values".
//   `: ContentEntry[]` after the parentheses types the return value.
//   This way, any code calling loadEntries() knows exactly what it gets back.
function loadEntries(modules: Record<string, MarkdownModule>): ContentEntry[] {
  return Object.entries(modules).map(([path, mod]) => {
    // TYPESCRIPT CONCEPT: Non-null assertion (`!`)
    //   `.pop()` can theoretically return `undefined` (if the array is empty),
    //   so TypeScript types it as `string | undefined`. The `!` operator tells
    //   TypeScript: "I guarantee this won't be undefined — trust me."
    //   Use sparingly — if you're wrong, you get a runtime error.
    //   Here it's safe because we know the path always contains "/".
    const slug = path.split("/").pop()!.replace(".md", "");
    return {
      slug,                  // URL-friendly identifier
      ...mod.frontmatter,    // Spread all YAML fields (title, authors, year, venue, etc.)
      content: mod.content,  // Raw markdown body text
    };
  });
}

// ─── Exported getter functions ─────────────────────────────────────
// Each function loads entries and sorts them appropriately.
// Components call these to get the data they need.

// Publications: sorted by date descending (newest first).
// TYPESCRIPT CONCEPT: Return type annotation + type assertion (`as`)
//   `: Publication[]` tells callers exactly what type they'll receive.
//   `(loadEntries(pubModules) as Publication[])` is a TYPE ASSERTION —
//   it tells TypeScript: "I know loadEntries returns ContentEntry[], but
//   I'm confident these specific entries are actually Publication objects."
//   This is needed because loadEntries() is generic (handles all content types)
//   but getPublications() knows it's specifically dealing with publications.
//   Unlike a type cast in other languages, this does NOT change the data at runtime —
//   it only affects TypeScript's compile-time understanding.
// Sorting uses new Date() to handle both year-only ("2016") and full date
// ("2024-11-21") formats — new Date("2016") → Jan 1 2016, which still
// sorts correctly relative to other dates.
export function getPublications(): Publication[] {
  return (loadEntries(pubModules) as Publication[]).sort(
    (a, b) => new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime()
  );
}

// News: now loaded from siteConfig.ts instead of markdown files.
// Sorted by date descending (newest first).
// Re-exported here so consuming code doesn't need to know the data source changed.
import { siteConfig, type NewsItem } from "../siteConfig";
export type { NewsItem };

export function getNews(): NewsItem[] {
  return [...siteConfig.news].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Projects: sorted by order field ascending (lower number = shown first).
export function getProjects(): Project[] {
  return (loadEntries(projectModules) as Project[]).sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
}

// Research items: sorted by order field ascending (lower number = shown first).
export function getResearchItems(): ResearchItem[] {
  return (loadEntries(researchModules) as ResearchItem[]).sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
}

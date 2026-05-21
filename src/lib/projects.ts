import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";

const projectsDirectory = path.join(process.cwd(), "content/projects");

export type ProjectType = "extension" | "webapp" | "tool" | "other";

/** What's literally in the markdown frontmatter. All fields except
 *  title, slug, day, date, type, summary are optional. */
export interface ProjectFrontmatter {
  title: string;
  slug: string;
  day: number;
  date: string;
  type: ProjectType;
  summary: string;
  tags?: string[];
  stack?: string[];

  // Optional visuals / metadata
  image?: string;
  featured?: boolean;

  // Type-specific optional fields
  chromeStoreId?: string;

  // Override the derived action button (rare)
  actionUrl?: string;
  actionLabel?: string;

  // Optional social/media links for the project page
  tiktokUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
}

/** Project as it appears AFTER derivation — actionUrl and actionLabel
 *  are always present here, filled in from type+slug if not overridden.
 *  contentHtml is the rendered markdown body, empty string if no body. */
export interface Project extends Omit<ProjectFrontmatter, "actionUrl" | "actionLabel" | "tags" | "stack"> {
  tags: string[];
  stack: string[];
  actionUrl: string;
  actionLabel: string;
  /** The app's live subdomain URL, if applicable (webapps only) */
  appUrl?: string;
  /** Rendered HTML from the markdown body. Empty string if no body content. */
  contentHtml: string;
}

/** Legacy alias — kept for backwards compatibility with anything still importing it. */
export type ProjectWithContent = Project;

/* ──────────────────────────────────────────────────────────────────
   Derivation — turns frontmatter into a Project with defaults filled.
   ────────────────────────────────────────────────────────────────── */

function deriveProject(fm: ProjectFrontmatter, contentHtml: string): Project {
  const { actionUrl: override, actionLabel: overrideLabel, ...rest } = fm;

  let derivedUrl: string | undefined;
  let derivedLabel = "View project";
  let appUrl: string | undefined;

  switch (fm.type) {
    case "webapp":
      appUrl = `https://${fm.slug}.casefoster.ai`;
      derivedUrl = appUrl;
      derivedLabel = "Open app";
      break;
    case "extension":
      if (fm.chromeStoreId) {
        derivedUrl = `https://chromewebstore.google.com/detail/${fm.chromeStoreId}`;
      }
      derivedLabel = "Install on Chrome";
      break;
    case "tool":
      derivedLabel = "Try it";
      break;
    case "other":
      derivedLabel = "View project";
      break;
  }

  return {
    ...rest,
    tags: fm.tags ?? [],
    stack: fm.stack ?? [],
    actionUrl: override ?? derivedUrl ?? "#",
    actionLabel: overrideLabel ?? derivedLabel,
    appUrl,
    contentHtml,
  };
}

/* ──────────────────────────────────────────────────────────────────
   Readers
   ────────────────────────────────────────────────────────────────── */

export function getAllProjectSlugs(): string[] {
  if (!fs.existsSync(projectsDirectory)) return [];
  return fs
    .readdirSync(projectsDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
}

function readProjectFile(slug: string): { fm: ProjectFrontmatter; content: string } | null {
  const fullPath = path.join(projectsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Ensure slug on the frontmatter matches the filename.
  // The file is the source of truth — we overwrite any slug in the frontmatter.
  const fm = { ...(data as ProjectFrontmatter), slug };
  return { fm, content };
}

/** Render the markdown body to HTML. Returns empty string if body is empty. */
async function renderBody(content: string): Promise<string> {
  const trimmed = content.trim();
  if (!trimmed) return "";
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(trimmed);
  return processed.toString();
}

/** Primary loader. Async because it renders the markdown body to HTML. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const file = readProjectFile(slug);
  if (!file) return null;
  const contentHtml = await renderBody(file.content);
  return deriveProject(file.fm, contentHtml);
}

/** Legacy alias — same as getProjectBySlug now. Kept for backwards compatibility. */
export async function getProjectWithHtml(slug: string): Promise<Project | null> {
  return getProjectBySlug(slug);
}

/** Loads all projects. Async because each project renders its body. */
export async function getAllProjects(): Promise<Project[]> {
  const slugs = getAllProjectSlugs();
  const projects = await Promise.all(slugs.map((slug) => getProjectBySlug(slug)));
  return projects
    .filter((p): p is Project => p !== null)
    .sort((a, b) => b.day - a.day);
}

export async function getFeaturedProject(): Promise<Project | null> {
  const all = await getAllProjects();
  return all.find((p) => p.featured) ?? all[0] ?? null;
}

export async function getCurrentDay(): Promise<number> {
  const all = await getAllProjects();
  if (all.length === 0) return 0;
  return Math.max(...all.map((p) => p.day));
}
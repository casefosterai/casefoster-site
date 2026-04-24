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
 *  are always present here, filled in from type+slug if not overridden. */
export interface Project extends Omit<ProjectFrontmatter, "actionUrl" | "actionLabel"> {
  actionUrl: string;
  actionLabel: string;
  /** The app's live subdomain URL, if applicable (webapps only) */
  appUrl?: string;
}

export interface ProjectWithContent extends Project {
  contentHtml: string;
}

/* ──────────────────────────────────────────────────────────────────
   Derivation — turns frontmatter into a Project with defaults filled.
   ────────────────────────────────────────────────────────────────── */

function deriveProject(fm: ProjectFrontmatter): Project {
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

export function getProjectBySlug(slug: string): Project | null {
  const file = readProjectFile(slug);
  if (!file) return null;
  return deriveProject(file.fm);
}

export async function getProjectWithHtml(slug: string): Promise<ProjectWithContent | null> {
  const file = readProjectFile(slug);
  if (!file) return null;

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(file.content);

  return {
    ...deriveProject(file.fm),
    contentHtml: processed.toString(),
  };
}

export function getAllProjects(): Project[] {
  const slugs = getAllProjectSlugs();
  const projects = slugs
    .map((slug) => getProjectBySlug(slug))
    .filter((p): p is Project => p !== null)
    .sort((a, b) => b.day - a.day);
  return projects;
}

export function getFeaturedProject(): Project | null {
  const all = getAllProjects();
  return all.find((p) => p.featured) ?? all[0] ?? null;
}

export function getCurrentDay(): number {
  const all = getAllProjects();
  if (all.length === 0) return 0;
  return Math.max(...all.map((p) => p.day));
}

import { getAllProjects } from "@/lib/projects";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

const typeLabels: Record<string, string> = {
  extension: "Chrome Extension",
  webapp: "Web App",
  tool: "Tool",
  other: "Project",
};

export function GET() {
  const projects = getAllProjects();

  const body = `# ${SITE.name}

> ${SITE.description}

Case Foster builds one new AI-powered tool, extension, or app every day, publishes it on this site free to use, and documents the process publicly on TikTok, YouTube, Instagram, and Twitter. Each project below is a working, free-to-use tool.

## Projects

${projects
  .map(
    (p) =>
      `- [${p.title}](${SITE.url}/${p.slug}): ${p.summary} (${typeLabels[p.type]}, day ${p.day})`
  )
  .join("\n")}

## About

- [About Case Foster](${SITE.url}/about): Who Case is and why this project exists.

## Elsewhere

- Twitter: ${SITE.social.twitter}
- TikTok: ${SITE.social.tiktok}
- YouTube: ${SITE.social.youtube}
- Instagram: ${SITE.social.instagram}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

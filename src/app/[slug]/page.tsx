import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllProjectSlugs,
  getProjectBySlug,
} from "@/lib/projects";
import { SITE } from "@/lib/site";

type Params = { params: { slug: string } };

const TYPE_LABELS: Record<string, string> = {
  extension: "Chrome Extension",
  webapp: "Web App",
  tool: "Tool",
  other: "Project",
};

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};

  const url = `${SITE.url}/${project.slug}`;

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      title: project.title,
      description: project.summary,
      url,
      type: "article",
      publishedTime: project.date,
      authors: [SITE.author],
      tags: project.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
    },
  };
}

export default function ProjectPage({ params }: Params) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.summary,
    applicationCategory:
      project.type === "extension" ? "BrowserApplication" : "WebApplication",
    operatingSystem: project.type === "extension" ? "Chrome" : "Any",
    url: `${SITE.url}/${project.slug}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: SITE.author,
      url: SITE.url,
    },
    datePublished: project.date,
    keywords: project.tags.join(", "),
  };

  const mediaLinks = [
    project.tiktokUrl && { label: "TikTok", url: project.tiktokUrl },
    project.youtubeUrl && { label: "YouTube", url: project.youtubeUrl },
    project.twitterUrl && { label: "Twitter", url: project.twitterUrl },
    project.githubUrl && { label: "GitHub", url: project.githubUrl },
  ].filter(Boolean) as Array<{ label: string; url: string }>;

  // External action URL opens in new tab; everything starting with / is internal
  const isExternal = project.actionUrl.startsWith("http");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* Back link */}
        <div className="mx-auto max-w-4xl px-6 pt-8">
          <Link href="/" className="mono-label text-mute hover:text-ink transition-colors">
            ← Back to casefoster.ai
          </Link>
        </div>

        {/* Hero */}
        <section>
          <div className="mx-auto max-w-4xl px-6 pt-10 md:pt-16 pb-10 md:pb-14">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
              {/* Logo */}
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="aspect-square w-full bg-white border border-ink flex items-center justify-center overflow-hidden p-8">
                  {project.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="display text-7xl text-ink">
                      {String(project.day).padStart(2, "0")}
                    </span>
                  )}
                </div>
              </div>

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-4 mono-label text-mute">
                  <span className="tabular">
                    Day {String(project.day).padStart(3, "0")}
                  </span>
                  <span>/</span>
                  <span>{TYPE_LABELS[project.type] ?? "Project"}</span>
                </div>

                <h1 className="detail-title text-ink mb-6">
                  {project.title}
                </h1>

                <p className="mono-label text-ink mb-8 max-w-xl leading-relaxed">
                  {project.summary}
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={project.actionUrl}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    className="btn-pill"
                  >
                    {project.actionLabel}
                    <span className="arrow">→</span>
                  </a>
                  {mediaLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-pill"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meta strip */}
        <section>
          <div className="mx-auto max-w-4xl px-6 pb-20">
            <div className="border-t border-ink/15 pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mono-label text-mute mb-3">Built with</div>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span key={item} className="meta-pill">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="mono-label text-mute mb-3">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.length > 0 ? (
                    project.tags.map((tag) => (
                      <span key={tag} className="meta-pill">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-mute">—</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

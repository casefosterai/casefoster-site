"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";
import type { Project } from "@/lib/projects";

type Props = {
  day: number;
  total: number;
  projects: Project[];
};

const INITIAL_VISIBLE = 5;
const LOAD_INCREMENT = 5;

export default function HomeExperience({ day, total, projects }: Props) {
  return (
    <div className="relative">
      <Section1 day={day} total={total} />
      <Section2 projects={projects} />
      <ProgressTimeline />
    </div>
  );
}

/* -------------------------------------------------------------------- */

function Section1({ day, total }: { day: number; total: number }) {
  return (
    <section className="hero-section">
      <div className="w-full max-w-6xl flex flex-col items-center">
        <h1
          className="display text-ink text-center"
          style={{ fontSize: "clamp(56px, 11vw, 180px)" }}
        >
          CASEFOSTER<span className="text-mute">.AI</span>
        </h1>

        <div className="w-full max-w-2xl border-t border-ink/15 my-10 md:my-14" />

        <div className="flex items-center gap-6 md:gap-10 flex-wrap justify-center mono-label text-ink">
          <span className="flex items-center gap-2.5">
            <span className="live-dot is-active" aria-hidden />
            <span>Live</span>
          </span>
          <span className="text-mute">/</span>
          <span className="tabular">Day {String(day).padStart(3, "0")}</span>
          <span className="text-mute">/</span>
          <span className="tabular">
            Project{total === 1 ? "" : "s"} {String(total).padStart(3, "0")}
          </span>
          <span className="text-mute">/</span>
          <span className="flex items-center gap-2">
            <span className="text-base">∞</span>
            <span>Remaining</span>
          </span>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- */

function Section2({ projects }: { projects: Project[] }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const visible = projects.slice(0, visibleCount);
  const hasMore = projects.length > visibleCount;

  return (
    <section className="page2-section">
      <div className="w-full max-w-3xl mx-auto px-6 pt-10 md:pt-14 pb-10">
        <h2 className="project-list-heading text-center">Recent projects</h2>

        {projects.length === 0 ? (
          <p className="mono-label text-mute text-center py-12">
            No projects yet. Check back soon.
          </p>
        ) : (
          <>
            <ul className="project-list w-full">
              {visible.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className="project-row group">
                    <span className="project-row-day">
                      {String(p.day).padStart(3, "0")}
                    </span>
                    <span className="project-row-title">{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() =>
                    setVisibleCount((c) =>
                      Math.min(c + LOAD_INCREMENT, projects.length)
                    )
                  }
                  className="btn-pill"
                >
                  Load more
                  <span className="arrow">↓</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="w-full max-w-xl mx-auto px-6 py-16 md:py-24">
        <p className="mono-label text-mute mb-6 text-center">
          Get notified when a new project drops
        </p>
        <SignupForm />
      </div>

      <footer className="w-full border-t border-ink/15 mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 mono-label">
          <div className="flex items-center gap-6 md:gap-10 flex-wrap justify-center">
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="hover:text-mute transition-colors"
            >
              Instagram
            </a>
            <span className="text-mute">/</span>
            <a
              href={SITE.social.tiktok}
              target="_blank"
              rel="noreferrer"
              className="hover:text-mute transition-colors"
            >
              TikTok
            </a>
            <span className="text-mute">/</span>
            <a
              href={SITE.social.youtube}
              target="_blank"
              rel="noreferrer"
              className="hover:text-mute transition-colors"
            >
              YouTube
            </a>
            <span className="text-mute">/</span>
            <a
              href={SITE.social.twitter}
              target="_blank"
              rel="noreferrer"
              className="hover:text-mute transition-colors"
            >
              Twitter
            </a>
          </div>
          <div className="text-mute">
            © {new Date().getFullYear()} Case Foster
          </div>
        </div>
      </footer>
    </section>
  );
}

/* -------------------------------------------------------------------- */

function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 600));
    setStatus("done");
    setEmail("");
  }

  if (status === "done") {
    return (
      <p className="mono-label text-ink text-center">
        You&apos;re on the list. ←
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="form-pill w-full">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "..." : "Subscribe"}
      </button>
    </form>
  );
}

/* -------------------------------------------------------------------- */

/**
 * ProgressTimeline — fixed to the right edge of the viewport.
 * Continuous vertical line ~50vh tall with a dot that slides down it
 * proportional to scroll progress (0 at top, 100% at bottom). Clicking
 * anywhere on the line jumps to that proportional point in the page.
 */
function ProgressTimeline() {
  const [progress, setProgress] = useState(0);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const compute = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      const ratio = window.scrollY / scrollable;
      setProgress(Math.max(0, Math.min(1, ratio)));
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const onLineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const line = lineRef.current;
    if (!line) return;
    const rect = line.getBoundingClientRect();
    const ratio = (e.clientY - rect.top) / rect.height;
    const clamped = Math.max(0, Math.min(1, ratio));
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    window.scrollTo({ top: scrollable * clamped, behavior: "smooth" });
  };

  return (
    <div
      className="progress-timeline"
      aria-label="Page progress"
      role="navigation"
    >
      <div
        className="progress-timeline-line"
        ref={lineRef}
        onClick={onLineClick}
      >
        <div
          className="progress-timeline-dot"
          style={{ top: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

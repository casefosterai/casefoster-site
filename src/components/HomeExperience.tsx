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

const SECTION_COUNT = 2;
const INITIAL_VISIBLE = 5;
const LOAD_INCREMENT = 5;

export default function HomeExperience({ day, total, projects }: Props) {
  const [activeSection, setActiveSection] = useState(0);
  const isAnimating = useRef(false);
  const lastWheelTime = useRef(0);

  /** Snap the viewport to a specific section (0 or 1). */
  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(SECTION_COUNT - 1, index));
    isAnimating.current = true;
    setActiveSection(clamped);

    const target = index === 0 ? 0 : window.innerHeight;
    window.scrollTo({ top: target, behavior: "smooth" });

    window.setTimeout(() => {
      isAnimating.current = false;
    }, 800);
  };

  /** Track which section is active based on scroll position. */
  useEffect(() => {
    const onScroll = () => {
      if (isAnimating.current) return;
      // If we're scrolled more than half a viewport, we're in section 2
      const scrollY = window.scrollY;
      const newSection = scrollY > window.innerHeight * 0.5 ? 1 : 0;
      setActiveSection((prev) => (prev === newSection ? prev : newSection));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Wheel: snap only at the boundary between section 1 and section 2.
   *  Within section 2, scroll freely. */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (isAnimating.current) return;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // Case A: at the very top, scrolling down → snap to section 2
      if (scrollY < 10 && e.deltaY > 0) {
        const now = performance.now();
        if (now - lastWheelTime.current < 600) return;
        if (Math.abs(e.deltaY) < 5) return;
        lastWheelTime.current = now;
        e.preventDefault();
        goTo(1);
        return;
      }

      // Case B: exactly at the top of section 2, scrolling up → snap to section 1
      // "exactly at the top of section 2" means scrollY is right around vh (within ~5px)
      if (Math.abs(scrollY - vh) < 10 && e.deltaY < 0) {
        const now = performance.now();
        if (now - lastWheelTime.current < 600) return;
        if (Math.abs(e.deltaY) < 5) return;
        lastWheelTime.current = now;
        e.preventDefault();
        goTo(0);
        return;
      }

      // Otherwise (inside section 2, or scrolling mid-section), scroll freely.
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  /** Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isAnimating.current) return;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      if ((e.key === "ArrowDown" || e.key === "PageDown") && scrollY < 10) {
        e.preventDefault();
        goTo(1);
      } else if (
        (e.key === "ArrowUp" || e.key === "PageUp") &&
        Math.abs(scrollY - vh) < 10
      ) {
        e.preventDefault();
        goTo(0);
      }
      // Otherwise let the browser handle keyboard scroll naturally
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /** Touch swipe support — only at section boundaries */
  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (isAnimating.current) return;
      const endY = e.changedTouches[0].clientY;
      const delta = startY - endY;
      if (Math.abs(delta) < 50) return;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      if (scrollY < 10 && delta > 0) {
        goTo(1);
      } else if (Math.abs(scrollY - vh) < 10 && delta < 0) {
        goTo(0);
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div className="relative">
      <Section1
        day={day}
        total={total}
        active={activeSection === 0}
        onScrollDown={() => goTo(1)}
      />
      <Section2 projects={projects} onScrollUp={() => goTo(0)} />
      <Timeline active={activeSection} onSelect={goTo} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */

function ArrowPrompt({
  direction,
  onClick,
  position,
}: {
  direction: "up" | "down";
  onClick: () => void;
  position: "top" | "bottom";
}) {
  const positionClasses =
    position === "top"
      ? "absolute top-10 left-1/2 -translate-x-1/2"
      : "absolute bottom-10 left-1/2 -translate-x-1/2";

  const arrow = direction === "up" ? "↑" : "↓";

  return (
    <button
      onClick={onClick}
      className={`${positionClasses} arrow-prompt group`}
      aria-label={`Scroll ${direction}`}
    >
      {direction === "up" && <span className="arrow-prompt-icon scroll-prompt">{arrow}</span>}
      <span className="arrow-prompt-label">Scroll</span>
      {direction === "down" && <span className="arrow-prompt-icon scroll-prompt">{arrow}</span>}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────── */

function Section1({
  day,
  total,
  active,
  onScrollDown,
}: {
  day: number;
  total: number;
  active: boolean;
  onScrollDown: () => void;
}) {
  return (
    <section className="snap-section">
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
            <span className={`live-dot ${active ? "is-active" : ""}`} aria-hidden />
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

      <ArrowPrompt direction="down" position="bottom" onClick={onScrollDown} />
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────── */

const Section2 = ({
  projects,
  onScrollUp,
}: {
  projects: Project[];
  onScrollUp: () => void;
}) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const visible = projects.slice(0, visibleCount);
  const hasMore = projects.length > visibleCount;

  return (
    <section className="page2-section">
      <ArrowPrompt direction="up" position="top" onClick={onScrollUp} />

      <div className="w-full max-w-3xl mx-auto px-6 pt-28 md:pt-32 pb-10">
        {/* Heading */}
        <h2 className="project-list-heading text-center">Recent projects</h2>

        {/* List */}
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

      {/* Email signup */}
      <div className="w-full max-w-xl mx-auto px-6 py-16 md:py-24">
        <p className="mono-label text-mute mb-6 text-center">
          Get notified when a new project drops
        </p>
        <SignupForm />
      </div>

      {/* Footer */}
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
          <div className="text-mute">© {new Date().getFullYear()} Case Foster</div>
        </div>
      </footer>
    </section>
  );
};

/* ──────────────────────────────────────────────────────────────────── */

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
      <p className="mono-label text-ink text-center">You&apos;re on the list. ←</p>
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

/* ──────────────────────────────────────────────────────────────────── */

function Timeline({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="fixed top-1/2 right-6 md:right-10 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
      {Array.from({ length: SECTION_COUNT }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3">
          <button
            onClick={() => onSelect(i)}
            aria-label={`Go to section ${i + 1}`}
            className={`timeline-dot ${active === i ? "is-active" : ""}`}
          />
          {i < SECTION_COUNT - 1 && <div className="timeline-line h-10" />}
        </div>
      ))}
    </div>
  );
}

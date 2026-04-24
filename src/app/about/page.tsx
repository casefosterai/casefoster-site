import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { SITE } from "@/lib/site";
import { getCurrentDay, getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "About",
  description: `About Case Foster and the "building with AI every day" project. ${SITE.description}`,
};

export default function AboutPage() {
  const day = getCurrentDay();
  const total = getAllProjects().length;

  return (
    <>
      <Nav />

      <main>
        <section>
          <div className="mx-auto max-w-2xl px-6 pt-10 md:pt-16 pb-10">
            <p className="mono-label text-mute mb-6">About</p>
            <h1
              className="display text-ink"
              style={{ fontSize: "clamp(48px, 9vw, 120px)" }}
            >
              HI, I&apos;M CASE.
            </h1>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-2xl px-6 pb-16">
            <div className="prose-case">
              <p>
                I&apos;m building something new with AI every single day — a
                Chrome extension, a web app, a small tool — and putting
                everything on casefoster.ai, free to use.
              </p>

              <h2>Why I&apos;m doing this</h2>
              <p>
                The cost of building software is collapsing toward zero. What
                used to take a team of engineers three months now takes one
                person and an afternoon. But distribution — getting anyone to
                care, use, or even know about what you&apos;ve built —
                hasn&apos;t gotten any easier. If anything, it&apos;s harder.
              </p>
              <p>
                So I&apos;m betting the other direction. Instead of spending a
                year on one product that no one sees, I&apos;m shipping a new
                one every day in public. The builds are the content. The
                content builds the audience. The audience is the moat.
              </p>

              <h2>What you&apos;ll find here</h2>
              <p>
                Every project is free. Some are Chrome extensions on the
                Chrome Web Store. Some are web apps you can open on your phone
                and save to your home screen. If something gets traction,
                I&apos;ll invest in it more. If it doesn&apos;t, I move on the
                next day. Either way, the next build ships.
              </p>

              <h2>Where to follow</h2>
              <p>
                I post each build on{" "}
                <a href={SITE.social.tiktok} target="_blank" rel="noreferrer">
                  TikTok
                </a>
                ,{" "}
                <a href={SITE.social.youtube} target="_blank" rel="noreferrer">
                  YouTube
                </a>
                ,{" "}
                <a
                  href={SITE.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
                , and{" "}
                <a href={SITE.social.twitter} target="_blank" rel="noreferrer">
                  Twitter
                </a>
                . The email signup on the homepage gets you the list version.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-14 pt-10 border-t border-ink/15 grid grid-cols-3 gap-6">
              <div>
                <div className="mono-label text-mute mb-2">Current day</div>
                <div className="display text-3xl md:text-4xl tabular text-ink">
                  {String(day).padStart(3, "0")}
                </div>
              </div>
              <div>
                <div className="mono-label text-mute mb-2">Shipped</div>
                <div className="display text-3xl md:text-4xl tabular text-ink">
                  {String(total).padStart(3, "0")}
                </div>
              </div>
              <div>
                <div className="mono-label text-mute mb-2">Days to go</div>
                <div className="display text-3xl md:text-4xl text-ink">∞</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

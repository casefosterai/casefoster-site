# casefoster.ai

The website for `@casefosterai` — a daily AI-build journal and tool catalog.

---

## What this project is

A Next.js website that:

- Shows every AI project Case has shipped as part of the daily build challenge
- Lets visitors try/install each one (web apps open in a new tab, Chrome extensions link to the Chrome Web Store)
- Captures emails for a newsletter
- Is heavily optimized for both traditional SEO and AI SEO (LLM citations)

New projects are added by dropping a markdown file into `content/projects/`. No CMS, no database.

---

## Quick start (first time setup)

You need [Node.js](https://nodejs.org) version 18 or newer installed. Check with:

```bash
node --version
```

If you get a version number, you're set. If not, download Node from [nodejs.org](https://nodejs.org) first.

Then, in the project folder, run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You'll see the site. It updates automatically as you edit files.

To stop the dev server, press `Ctrl+C` in the terminal.

---

## Project structure

```
casefoster-site/
├── content/
│   └── projects/              ← your markdown project files live here
│       ├── credit-card-roulette.md
│       └── flight-reliability.md
├── public/
│   └── logos/                 ← drop your AI-generated project logos here
├── src/
│   ├── app/                   ← every page of the site is here
│   │   ├── layout.tsx         ← wraps every page (fonts, analytics, SEO)
│   │   ├── page.tsx           ← homepage
│   │   ├── globals.css        ← global styles + design system
│   │   ├── about/page.tsx     ← /about
│   │   ├── projects/
│   │   │   ├── page.tsx       ← /projects (list)
│   │   │   └── [slug]/page.tsx ← /projects/any-project-name
│   │   ├── llms.txt/route.ts  ← served at /llms.txt for AI crawlers
│   │   ├── robots.ts          ← served at /robots.txt
│   │   └── sitemap.ts         ← served at /sitemap.xml
│   ├── components/            ← reusable UI pieces
│   │   ├── Nav.tsx            ← top status bar + 'Case' header
│   │   ├── Footer.tsx
│   │   ├── EmailCapture.tsx
│   │   ├── HeroTiles.tsx      ← cycling 3-tile homepage hero
│   │   └── ProjectTile.tsx    ← square logo tile used on /projects
│   └── lib/
│       ├── projects.ts        ← reads the markdown files
│       └── site.ts            ← site-wide constants (name, URLs, socials)
├── package.json               ← project dependencies
├── tailwind.config.ts         ← styling system config
├── next.config.js             ← Next.js config
└── tsconfig.json              ← TypeScript config
```

---

## Adding a new project each day

This is the main workflow. Every day you do this once.

1. Create a new file in `content/projects/` named after the project, all lowercase with dashes instead of spaces. Example: `content/projects/ai-resume-reviewer.md`

2. Paste this template in and fill it out:

```markdown
---
title: "The Project Name"
day: 3
date: "2026-04-17"
slug: "ai-resume-reviewer"
summary: "One-sentence description that will show up on cards and in search results."
type: "webapp"           # extension | webapp | tool | other
tags: ["career", "ai"]
stack: ["Next.js", "OpenAI API"]
actionUrl: "/resume-reviewer"
actionLabel: "Try it"
featured: false          # set to true to pin on homepage
---

## What it does

A paragraph or two explaining the project clearly. Write this in plain language — LLMs will quote from here when people ask about it.

## Why I built it

Your story.

## How to use it

Step by step if relevant.

## What I learned

Optional, but great content for the build-in-public angle.
```

3. Save the file. If the dev server is running (`npm run dev`), the new project is already live at `http://localhost:3000/projects/ai-resume-reviewer`.

4. Commit and push to GitHub:

```bash
git add .
git commit -m "Day 3: AI Resume Reviewer"
git push
```

5. Vercel auto-deploys. The new project is live on casefoster.ai within a minute.

### Frontmatter field reference

| Field | Required | What it does |
|---|---|---|
| `title` | Yes | Shown as the main heading and page title |
| `day` | Yes | The day number of the build challenge |
| `date` | Yes | YYYY-MM-DD. Used for sitemap + "shipped on" display |
| `slug` | Yes | URL path. Must match the filename without `.md` |
| `summary` | Yes | One sentence. Used on cards, meta descriptions, social shares |
| `type` | Yes | `extension`, `webapp`, `tool`, or `other` |
| `tags` | Yes | Array of short tags, used for filtering and schema |
| `stack` | Yes | Technologies used. Shown on the project page |
| `actionUrl` | Yes | Where the "Try it / Install" button goes |
| `actionLabel` | Yes | The button text |
| `featured` | No | Set one project to `true` to pin to the homepage |
| `tiktokUrl` | No | Adds a "Watch on TikTok" button |
| `youtubeUrl` | No | Adds a "Watch on YouTube" button |
| `twitterUrl` | No | Adds a "Watch on Twitter" button |
| `githubUrl` | No | Adds a "Watch on GitHub" button |
| `image` | No | Path to hero image in `/public` |

---

## Deploying to Vercel

1. Push the project to GitHub (one-time setup below).
2. Go to [vercel.com](https://vercel.com), sign in with GitHub.
3. Click "Add New… → Project", pick the `casefoster-site` repo.
4. Click "Deploy". Vercel detects Next.js automatically.

Every `git push` to the main branch will auto-deploy from that point on.

### Pushing to GitHub for the first time

```bash
# in the casefoster-site folder
git init
git add .
git commit -m "Initial scaffold"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/casefoster-site.git
git push -u origin main
```

(Replace `YOUR-USERNAME` with your new GitHub username. Create the repo on github.com first — keep it public or private, your call.)

---

## Things to do before launch

- [ ] Run `npm install` and `npm run dev` to confirm it works locally
- [ ] Replace the `casefoster` GitHub URL in `src/lib/site.ts` with your real username
- [ ] Update the socials in `src/lib/site.ts` if any handle is different
- [ ] Buy the domain (casefoster.ai or alternative)
- [ ] Push to GitHub, connect to Vercel, attach the domain
- [ ] Wire up the email capture (`src/components/EmailCapture.tsx`) to Kit or similar
- [ ] Add a favicon in `public/favicon.ico`
- [ ] Replace the placeholder `actionUrl` values in the two demo project files
- [ ] Write a real "About" — the current one is a good starting draft

---

## Project logos

Every project shows as a square tile on the homepage and `/projects` page. If
you add a logo image, it's used. If you don't, a clean typographic placeholder
(big day number on a colored square) shows up instead — so the site never looks
broken while you catch up on logos.

### How to add a logo

1. Generate an image (I use AI — Midjourney, ChatGPT Image, etc). Save as PNG,
   1000×1000px, on a solid background that matches the site's palette (black,
   red `#E8391F`, or bone `#DAD5C9`).
2. Drop it in `public/logos/` with a filename that matches the project slug,
   e.g. `public/logos/credit-card-roulette.png`.
3. Add the `image` field to the project's markdown frontmatter:

   ```yaml
   image: "/logos/credit-card-roulette.png"
   ```

4. Save. It's live.

### Logo prompt I use for consistency

> Minimalist single-color geometric logo mark, thick strokes, stark contrast,
> centered composition, for a project called [NAME] that does [DESCRIPTION].
> Flat vector style. White mark on pure black background. No text. 1:1 square
> aspect ratio. Brutalist, reduced to essentials, Swiss-design inspired.

Generate 4 variants per project, pick the best.

---

## AI SEO — what's already built in

- **Server-rendered HTML.** Every page ships fully-rendered content. LLM crawlers and Google see everything without running JavaScript.
- **`SoftwareApplication` JSON-LD** on every project page, declaring it a free tool.
- **`Person` JSON-LD** on the homepage, linking all your social profiles as `sameAs` so LLMs connect them.
- **`/llms.txt`** — a plain-text index of the site for AI crawlers, following the emerging llmstxt.org standard.
- **Clean, factual page openings.** Every project page leads with a clear "what it is" sentence — the format LLMs quote from.
- **`sitemap.xml` and `robots.txt`** auto-generated.

When you write a new project, keep following the pattern in the two demo files: start with a plain "what it does" paragraph, no throat-clearing, no story before the facts. That formatting is what makes the content quotable.

---

## Common commands

```bash
npm run dev      # local dev server at localhost:3000
npm run build    # build for production (also what Vercel runs)
npm run start    # run the production build locally
```

---

## Troubleshooting

**"I added a project but it doesn't show up."**
Save the file. The dev server should pick it up automatically. If not, stop the dev server (Ctrl+C) and run `npm run dev` again.

**"Build fails on Vercel."**
Usually a malformed markdown frontmatter. Check that `day` is a number, `date` is quoted as `"YYYY-MM-DD"`, and every field in the template above is present. Open the Vercel deployment log for the exact error.

**"npm install fails."**
Make sure Node is version 18+. On Mac, `brew install node` or download from nodejs.org. Delete the `node_modules` folder and `package-lock.json` and try again if it still fails.

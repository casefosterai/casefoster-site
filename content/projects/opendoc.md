---
title: "OpenDoc"
slug: "opendoc"
day: 4
date: "2026-05-22"
type: "webapp"
summary: "Search any U.S. doctor to see exactly how much pharma money they've taken — and how independent they really are from industry."
tags: ["healthcare", "transparency", "public-data"]
stack: ["Next.js", "React", "TypeScript", "Tailwind"]
image: "/logos/opendoc.png"
---
Type a doctor's name, pick their state, and see the paper trail: total dollars from pharma and medical device companies, which companies paid them, what for, and an Independence Score from 0 to 100 that ranks them against peers in the same specialty.

The data is already public — CMS Open Payments publishes it every year — but it's buried in a clunky federal portal nobody uses. OpenDoc makes it a 10-second lookup on your phone before your next appointment.

No login, no database, no tracking. Live calls to public APIs, scored against peer percentiles built from the full CMS dataset.

---
title: "Heist Index"
slug: "heistindex"
day: 7
date: "2026-05-26"
type: "webapp"
summary: "Every FDIC-insured bank branch in America, ranked on how viable it would be as a heist target. Public data, deadpan case file, share-ready dossier."
tags: ["satire", "data", "geography", "finance"]
stack: ["Next.js", "React", "TypeScript", "Tailwind", "Python", "SQLite", "Turso"]
image: "/logos/heistindex.png"
---
Bank security data is fragmented across federal datasets nobody bothers to connect. Heist Index pulls FDIC branch records, OpenStreetMap road and police data, and Census income figures into one place, then scores all 77,470 branches on three dimensions: Vulnerability, Payout, and Getaway.

Every branch gets a Heist Score from 0 to 100. Higher score, easier target. Search your local bank, get a case-file dossier styled like a 1970s detective board, screenshot it. The "for research and entertainment, use responsibly" framing is the joke. The data is real.

Browse the top-10 leaderboards by branch or by bank brand. Tap any name for the full case file.

## How the scores are built

The pipeline streams a 12GB OpenStreetMap extract through `osmium` with a disk-backed location index, queries spatial features per branch (nearest police, nearest highway ramp, arterial count within 500m, intersection density), joins with FDIC deposits and Census income, and ranks every score as a percentile across the full national dataset. The output is a SQLite file that ships to Turso for production.

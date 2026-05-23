---
title: "PoliTrade"
slug: "politrade"
day: 5
date: "2026-05-23"
type: "webapp"
summary: "U.S. House members ranked by the returns their disclosed stock trades would have produced if you'd copied them — priced from the day each trade became public, not the day they made it."
tags: ["finance", "politics", "data"]
stack: ["Next.js", "React", "TypeScript", "Tailwind", "Python"]
image: "/logos/politrade.png"
---
Congressional trade disclosures are interesting in theory and useless in practice — by the time a trade is public, the politician's entry price is gone. PoliTrade fixes that by anchoring every return to the disclosure date, so the leaderboard reflects what retail could realistically have replicated.

Pulls Periodic Transaction Reports straight from the House Clerk twice a day, parses the PDFs, matches buys to sells with FIFO, and prices everything off Yahoo Finance. Non-discretionary stuff (dividend reinvestments, options, managed accounts) gets flagged and excluded from the math.

Sort by closed return, open mark-to-market, or trade volume. Filter by party. Tap any name for the full trade history behind the number.

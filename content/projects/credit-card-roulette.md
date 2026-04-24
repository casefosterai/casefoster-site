---
title: "Credit Card Roulette"
slug: "credit-card-roulette"
day: 1
date: "2026-04-14"
type: "webapp"
summary: "A roulette wheel for groups deciding who picks up the bill. Everyone gets a number, the wheel spins, whoever's number the ball lands nearest to pays."
tags: ["fun", "social", "web-app"]
stack: ["Next.js", "React", "TypeScript", "Vercel"]
image: "/logos/credit-card-roulette.png"
featured: true
---

## What it is

Credit Card Roulette is the classic end-of-dinner game, turned into a web app. Everyone at the table enters a name, the wheel spins, and whoever the ball lands closest to picks up the whole check.

## Why I built it

The bar-napkin version of this always ends in an argument about how random the toss really was. A shared screen everyone can see, with a visibly fair physics-based spin, solves the argument. Plus it's funnier.

## How to use it

Open the app on your phone at the end of a meal. Tap to add each person at the table. Hit spin. The wheel decelerates over a few seconds and the loser is announced. You can save it to your home screen like a regular app — on iPhone, tap the share button and "Add to Home Screen."

## Under the hood

Built with Next.js and React, deployed on Vercel. The spin is a real physics simulation — angular momentum, friction, and collision with pins — so the outcome is genuinely unpredictable even if you watched the ball's starting position. No data is collected, nothing is saved. Refresh and it's a new game.

## What I learned

Making randomness *feel* random is surprisingly hard. The first version used `Math.random()` and people complained it felt rigged even when it wasn't. Adding a physics simulation with visible deceleration fixed the feeling immediately, even though the math underneath is no more or less random than before.

---
title: "Flight Reliability for Google Flights"
slug: "flight-reliability"
day: 2
date: "2026-04-15"
type: "extension"
summary: "A Chrome extension that adds on-time performance and cancellation rates to every flight on Google Flights, based on the airline and specific route."
tags: ["travel", "chrome", "data"]
stack: ["Chrome Extension", "TypeScript", "BTS data"]
image: "/logos/flight-reliability.png"
featured: false
---

## What it does

When you search for flights on Google Flights, every result now shows two extra numbers: the percentage of flights on that specific route and airline that arrive on time, and the percentage that get cancelled. No more guessing whether that cheap United red-eye actually makes it.

## Why I built it

Price is the default sort on every flight site. Reliability isn't even a filter. But a $40 savings means nothing if the flight gets cancelled and you're sleeping in an airport. The data to fix this exists — the Bureau of Transportation Statistics publishes it — it just isn't where you need it.

## How it works

The extension injects into the Google Flights results page, reads the airline and route pairs, cross-references them against a dataset of the last 12 months of on-time performance, and renders the numbers inline. Everything runs locally in the browser. No server, no tracking, no account.

## How to use it

Install from the Chrome Web Store, go to [google.com/flights](https://google.com/flights), search for any route, and the reliability scores will appear next to each result.

## What I learned

Chrome extension review is slower than I expected — plan on 2-5 days for approval. The injection logic needed to be resilient to Google's DOM changing between sessions, which ate most of the build time. The actual data layer was the easy part.

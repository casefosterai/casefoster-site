---
title: "Signpdf"
slug: "signpdf"
day: 6
date: "2026-05-25"
type: "webapp"
summary: "Sign a PDF in your browser. No uploads, no accounts, no DocuSign required. Everything runs locally — your PDF never touches a server."
tags: ["pdf", "signature", "tool", "no-backend"]
stack: ["Next.js", "React", "TypeScript", "Tailwind", "pdf-lib", "pdfjs-dist", "react-signature-canvas"]
image: "/logos/signpdf.png"
---
Most "signing" in everyday life isn't legally adversarial. It's a school permission slip, a gym waiver, a freelancer contract where both sides already trust each other. For those cases you don't need DocuSign's audit trail — you need to put a signature on a PDF and email it back, ideally from your phone, without printing anything.

Drop a PDF, place signature/text/date fields anywhere on any page, draw your signature with your finger or trackpad, download the signed copy. The file never leaves your device — rendering, stamping, and download all happen client-side. No accounts, no servers, no tracking.

Not a DocuSign replacement. For real estate, legal, or financial contracts, use DocuSign — they sell legally-defensible audit trails, which is the actual product. signpdf is the everyday alternative for everything else.

## How it works

- `pdfjs-dist` renders PDF pages to a canvas so you can see where to place fields
- `react-signature-canvas` captures hand-drawn signatures as PNG
- `pdf-lib` stamps signatures, text, and dates back into the original PDF on download

Field positions are stored as normalized ratios of each page rather than absolute pixels, so resizing the window doesn't move them. PDF coordinates have origin at bottom-left while browsers use top-left, so coordinates get flipped at stamp time.

## What it does

- Drag-and-drop on desktop, file picker on mobile
- Multi-page navigation
- Three field types: signature, text, date
- Tap to place, drag to move, drag the corner to resize
- Signature pad works with finger, stylus, or trackpad
- One-click download of the signed PDF
- Mobile-first, PWA-ready (Add to Home Screen on iOS/Android)

## What it deliberately doesn't do

- No audit trail, certificate of completion, or IP logging
- No sending to a third party — you sign your own PDF
- No multi-party signing workflows
- No legally-binding-by-DocuSign-standards claims

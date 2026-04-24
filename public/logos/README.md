# Project logos

Drop AI-generated logo images here. Name them to match your project slug:

- `/public/logos/credit-card-roulette.png`
- `/public/logos/flight-reliability.png`

Then add the path to the project's markdown frontmatter:

```yaml
image: "/logos/credit-card-roulette.png"
```

That's it — the tile on the homepage and the logo block on the project page
will use your image. Any project without an `image` field falls back to a
clean typographic placeholder (big day number on a colored square).

## Prompt I use for consistency

> Minimalist single-color geometric logo mark, thick strokes, stark contrast,
> centered composition, for a project called [NAME] that does [DESCRIPTION].
> Flat vector style. White mark on pure black background. No text. 1:1 square
> aspect ratio. Brutalist, reduced to essentials, Swiss-design inspired.

## Specs

- **Format:** PNG (best) or JPG
- **Size:** 1000×1000px (square)
- **Background:** solid color that works with the tile — black, red (#E8391F),
  or bone (#DAD5C9) match the site's palette
- **Subject:** a single geometric mark, no text (the project title shows below)

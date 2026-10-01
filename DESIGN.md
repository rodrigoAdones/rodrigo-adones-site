---
name: Rodrigo Adones
description: Quiet editorial homepage for an engineering leader's bilingual writing — who you are, one thesis line, latest articles.
colors:
  ground: "#FAF9F6"
  ink: "#202522"
  ink-soft: "#555B57"
  forest: "#315A49"
  forest-hover: "#23443A"
  rule: "#DCDDD8"
  input-disabled: "#EEEDE8"
  button-disabled: "#C5C6C1"
  button-disabled-text: "#6A6E6A"
  selection: "#D5E3DB"
typography:
  site-name:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Palatino, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.5
  display:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Palatino, serif"
    fontSize: "clamp(1.75rem, 1.4rem + 1.2vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Palatino, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Palatino, serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-lg:
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
  meta:
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: "0px"
  control: "3px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  "8": "4.5rem"
components:
  link:
    textColor: "{colors.forest}"
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.ground}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.forest-hover}"
    textColor: "{colors.ground}"
  button-disabled:
    backgroundColor: "{colors.button-disabled}"
    textColor: "{colors.button-disabled-text}"
    rounded: "{rounded.control}"
  input:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.75rem"
---

## Overview

Quiet editorial reading surface for a personal writing site. The homepage is who you are, one thesis line, the four pillars, the latest three articles, and an honest newsletter stub — not a dashboard, board, or card grid. Light only; no motion; chrome in English; posts may be English or Spanish.

## Colors

- **Ground** `#FAF9F6` — page background.
- **Ink** `#202522` — primary text; site name, headings, titles.
- **Soft ink** `#555B57` — descriptions, meta, ledes (≥ 4.5:1 on ground).
- **Forest** `#315A49` — links, primary button, focus ring.
- **Forest hover** `#23443A` — button hover fill.
- **Rule** `#DCDDD8` — section rules (frame width) and article rules (inner column).

Do not introduce board enamel, strip pillar paints, or grease-pencil red from the superseded 0001 board.

## Typography

- **Source Serif 4** (OFL, self-hosted woff2 + TTF): site name (400), h1 / h2 / article titles (600). Latin + Latin Extended subset.
- **System sans** (`Helvetica Neue`, Helvetica, Arial): body, meta, nav, forms.
- No monospace requirement on the homepage; no third-party font origins.

## Layout

- **Frame** ≈ `60rem`: header, footer, and full-width section rules.
- **Inner column** ≈ `43rem`, indented ≈ `8rem` from the frame; indent collapses first as the viewport narrows, then to the `1rem` gutter below `40rem`.
- **Date column** ≈ `8.5rem` beside the title column; below `40rem`, meta flows horizontally above each title.
- Square layout except inputs and the Subscribe button (`3px` radius).

## Elevation & Depth

Flat. No shadows, lifts, or layered cards. Hierarchy comes from type, rules, and the indented column.

## Shapes

Default radius `0`. Only form controls use `3px`. Focus: `2px` forest outline, `3px` offset. Hover: underline or darker button fill — no transitions or animations.

## Components

- **SiteHeader** — serif site name → `/`; nav with About and Blog only.
- **Intro** — h1 role line, thesis (with visible `[Placeholder]` while copy is provisional), pillar links.
- **LatestArticles / ArticleEntry** — ordered list of ≤ 3 entries; date / lang badge / reading time / optional Updated; title + description carry `lang`; primary pillar link.
- **Subscribe** — disabled until ADR 0007; availability sentence + RSS.
- **Footer** — LinkedIn, GitHub, Source (new tab), RSS (same tab).

## Do's and Don'ts

**Do**

- Keep chrome `lang="en"` and put `lang` on post title/description.
- Announce language badges as "Spanish"/"English" to assistive tech; hide the two-letter code from screen readers.
- Explain disabled newsletter state in text, not colour alone.
- Prefer rules and whitespace over cards, pills, and stat strips.

**Don't**

- Restore B612, board tokens, sequence numbers, pillar bays, or motion.
- Add dark mode, client JS, or third-party fonts.
- Ship placeholder intro copy without the visible `[Placeholder]` marker.

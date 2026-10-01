# 0001: Homepage

**Status:** Done
**Date:** 2026-09-20

> **Superseded visually by [0002](0002-homepage-quiet-editorial.md).** This spec's flight-progress-board
> visual direction is replaced by Quiet editorial; BaseLayout, sample-data approach, and footer link
> patterns carry forward.

## Context

This is a portfolio site aimed at recruiters, engineers, software architects, and CTOs. The site
will host an Articles section and an About section; the homepage is the front door that
introduces the site and routes visitors into those sections. Nothing beyond the default Astro
scaffold exists yet (`src/pages/index.astro` is still the untouched template), so this spec also
establishes the base layout/component pattern that the future Articles and About specs will reuse.

## Goals

- A clean, minimal homepage with:
  - A sidebar containing nav links to `/about/` and `/blog/` (labelled "Articles"; paths per
    ADR 0008, which supersedes the `/articles` path originally written here).
  - A "Latest filed" rack with the newest entry visually emphasised (it grows to the 3 newest
    once there are more than 9 posts, so it doesn't just repeat the pillar bays), using
    placeholder/static content for now (real data wiring is a future spec).
  - The four pillars as the page's organising map: one bay per pillar, each racking its own
    entries with a count, an empty state, and a link to `/tags/<pillar>/`.
  - A newsletter subscribe form stub: plain `<form method="post">`, provider `action` left as a
    TODO until ADR 0007's provider is chosen.
  - A footer with links to LinkedIn (`https://linkedin.com/in/rodrigo-adones-vicencio`) and
    GitHub (`https://github.com/rodrigoAdones`), opening in a new tab.
- Establish a reusable base layout (`<head>`, meta, favicon) that later pages (About, Articles)
  can build on instead of duplicating boilerplate.
- Styling via Astro's built-in scoped `<style>` blocks per component — no new dependency (no
  Tailwind/CSS framework added in this spec).

## Non-Goals

- Building the Articles content collection or real article data/rendering.
- Building the About page content.
- Building the `/about` and `/articles` pages themselves (links point to them, but the routes
  don't need to resolve yet — covered by their own future specs).
- Any dynamic fetching/sorting logic for "latest articles" — placeholder content only.
- Adding a CSS framework or design system (a small set of CSS custom properties in the base
  layout is not a framework).

## Approach

- `src/layouts/BaseLayout.astro` — shared HTML shell: `<head>` (charset, viewport, favicon,
  generator meta, `<title>`/`<meta description>` as slots or props), wraps a `<slot />` for page
  content. Replaces the inline `<html>`/`<head>` currently hardcoded in `src/pages/index.astro`.
- Visual direction: the "flight progress board" world recorded in
  `.impeccable/surfaces/src-pages-index-astro.md` (posts as colour-coded strips, one bay per
  pillar). B612 / B612 Mono self-hosted from `public/fonts/` (OFL; no npm dependency, no
  third-party request).
- `src/lib/strips.ts` — pure helpers, tested first: permanent sequence numbers (oldest = 1),
  strip status (filed/updated), grouping by primary pillar (`tags[0]`), latest-N, date and UTC
  "now" formatting.
- `src/data/sample-posts.ts` — 3 placeholder posts shaped like the ADR 0002 schema, marked as
  samples; swapped for `getPublishedPosts()` by the Articles spec.
- `src/components/Sidebar.astro` — nav landmark (`<nav lang="en">`) with links to `/about/` and
  `/blog/`; collapses to a top bar on small screens.
- `src/components/Strip.astro`, `LatestRack.astro`, `PillarBays.astro`, `SubscribeStrip.astro`.
- `src/components/Footer.astro` — `<footer>` with LinkedIn and GitHub links
  (`target="_blank" rel="noopener noreferrer"`).
- `src/pages/index.astro` — rewritten to use `BaseLayout` and compose `Sidebar` + main content +
  `LatestArticles` + `Footer`.
- Each component styled with its own scoped `<style>` block; no shared global stylesheet needed
  yet beyond a minimal reset if layout issues arise during implementation.

## Acceptance Criteria

- `pnpm build` and `pnpm lint` succeed with no errors.
- `pnpm test` passes (existing + any new tests); per the repo's TDD convention, any non-trivial
  logic introduced (e.g. selecting/formatting the 3 placeholder article entries) has a test
  written first.
- Homepage renders a sidebar (`<nav>`) with links to `/about/` and `/blog/`.
- Homepage renders a "Latest filed" section with the newest of the 3 placeholder entries, and
  the pillar bays render all 3.
- Homepage renders four pillar bays, including an empty state for a pillar with no posts.
- Footer renders LinkedIn and GitHub links pointing to the URLs above, opening in a new tab.
- Page has a real `<title>` (not the scaffold's "Astro") and uses semantic landmarks (`nav`,
  `main`, `footer`).

## Open Questions

- Exact visual design (colors, typography, spacing) beyond "clean and minimal" — left to
  implementation-time judgment unless refined further.
- ~~Responsive sidebar behaviour~~ — resolved: collapses to a top bar below 60rem.
- Newsletter provider (ADR 0007) still open; the form's `action` is a TODO.

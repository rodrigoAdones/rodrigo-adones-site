# 0001: Homepage

**Status:** Draft
**Date:** 2026-09-20

## Context

This is a portfolio site aimed at recruiters, engineers, software architects, and CTOs. The site
will host an Articles section and an About section; the homepage is the front door that
introduces the site and routes visitors into those sections. Nothing beyond the default Astro
scaffold exists yet (`src/pages/index.astro` is still the untouched template), so this spec also
establishes the base layout/component pattern that the future Articles and About specs will reuse.

## Goals

- A clean, minimal homepage with:
  - A sidebar containing nav links to `/about` and `/articles`.
  - A "Latest Articles" section near the bottom showing 3 entries, using placeholder/static
    content for now (real data wiring is a future spec) — purpose is to validate the design.
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
- Adding a CSS framework or design system.

## Approach

- `src/layouts/BaseLayout.astro` — shared HTML shell: `<head>` (charset, viewport, favicon,
  generator meta, `<title>`/`<meta description>` as slots or props), wraps a `<slot />` for page
  content. Replaces the inline `<html>`/`<head>` currently hardcoded in `src/pages/index.astro`.
- `src/components/Sidebar.astro` — nav landmark (`<nav>`) with links to `/about` and `/articles`.
- `src/components/LatestArticles.astro` — section with 3 hardcoded placeholder items (title +
  short excerpt/date), structured so a future spec can swap the static array for real content-
  collection data with minimal markup change.
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
- Homepage renders a sidebar (`<nav>`) with working links to `/about` and `/articles`.
- Homepage renders a "Latest Articles" section with exactly 3 placeholder entries.
- Footer renders LinkedIn and GitHub links pointing to the URLs above, opening in a new tab.
- Page has a real `<title>` (not the scaffold's "Astro") and uses semantic landmarks (`nav`,
  `main`, `footer`).

## Open Questions

- Exact visual design (colors, typography, spacing) beyond "clean and minimal" — left to
  implementation-time judgment unless refined further.
- Responsive behavior of the sidebar on small screens (collapse to a top nav vs. off-canvas) is
  unspecified — implementer's call unless clarified later.

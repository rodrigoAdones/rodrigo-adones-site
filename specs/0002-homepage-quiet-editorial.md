# 0002: Homepage — Quiet Editorial Redesign

**Status:** Done
**Date:** 2026-10-01

## Context

Spec 0001 built the homepage as a "flight progress board" (posts as colour-coded strips in four
pillar bays). Reviewing six alternatives (`docs/homepage-design-proposals.md`), the author chose
direction 1, "Quiet editorial" (`docs/homepage-mockups/01-quiet-editorial.png`), refined against
the ADRs. It matches ADR 0008's definition of `/` exactly — "who you are, the thesis in one line,
latest 3 posts" — and drops chrome the ADRs never asked for (bays, sequence numbers, slide-out
motion).

The mockup is the layout authority. This spec adds what the ADRs require and the mockup omits:
per-post language (ADR 0006), the four pillars (ADR 0002), the "updated" signal (ADR 0002), an
honest newsletter state (ADR 0007), and self-hosted fonts usable later for OG images (ADR 0010).
A refined HTML preview was reviewed and approved by the author on 2026-10-01
(https://claude.ai/artifact/478QTcjjLBmzhu9FGZnXq3, private); this spec describes that preview.

This replaces 0001's *visual direction*; 0001's base-layout pattern, sample-data approach and
footer links carry over.

## Goals

- Rebuild `/` in the Quiet editorial layout: header, intro, latest articles, newsletter, footer.
- **Header:** "Rodrigo Adones" (serif) linking to `/`; nav with exactly **About** (`/about/`) and
  **Blog** (`/blog/`), `lang="en"`, `aria-current="page"` on the current item (none on the
  homepage).
- **Intro:** `<h1>` role line + one-line thesis, both **placeholder copy** until the About copy
  lands, kept in one data file and flagged so it cannot ship unnoticed. Below it, a pillar line:
  AI-native delivery · Platform & DX · Delivery measurement · Commerce & payments, each linking
  to `/tags/<pillar-id>/`.
- **Latest articles:** the 3 newest posts, newest first (fewer if fewer exist), as an ordered
  list. Entry anatomy:
  - date column: publication date (`Sep 16, 2026`), language badge (`ES`/`EN`) + reading time
    (`7 min`), and `Updated Sep 21` only when `updatedDate` exists;
  - main column: title as `<h3>` (link to `/blog/<slug>/`), description, primary pillar name
    (`tags[0]`) linking to `/tags/<pillar-id>/`;
  - title and description carry `lang` = the post's language (ADR 0006); chrome stays English.
  - Single "View all articles →" link to `/blog/`.
  - Zero posts: the list is replaced by one honest sentence; no placeholder rows.
- **Newsletter:** heading "Get new articles by email"; lede "Every new article, sent in full to
  your inbox. Posts are in English and Spanish." (ADR 0006/0007); visible "Email address" label,
  `type="email"`, `autocomplete="email"`, Subscribe button. Until ADR 0007's provider is chosen,
  the fields render **disabled** (input and button greyed, so the button does not read as
  clickable) with the sentence "The newsletter opens with the first article. Until then, follow
  along by RSS." linking `/rss.xml`. Explanation is in text, not colour alone.
- **Footer** (`lang="en"`): name, then LinkedIn, GitHub (new tab, as today), RSS (`/rss.xml`,
  same tab) and Source (`https://github.com/rodrigoAdones/personal-site`, new tab).
- **Visual system** (light only, no motion):
  - Ground `#FAF9F6`, ink `#202522`, soft ink `#555B57` (descriptions, meta), forest `#315A49`
    (links, button, focus ring), button hover `#23443A`, rules `#DCDDD8`. All text ≥ 4.5:1.
  - Source Serif 4 (OFL, self-hosted) for site name (400), h1, h2 and article titles (600);
    system sans stack for everything else.
  - Outer frame ≈ 60rem (header, footer, full-width section rules). Inner column ≈ 43rem,
    indented ≈ 8rem from the frame; the indent shrinks first as the viewport narrows. Inside it
    an ≈ 8.5rem date column and the title column. Rules between articles span the inner column
    only; rules between sections span the frame.
  - Square layout; inputs and the button only get a 3px corner radius (as in the mockup).
  - Focus: 2px forest outline, offset 3px. Hover: underline / darker button fill, no transitions.
- **Accessibility:** skip link to `#main`, landmarks `header`/`nav`/`main`/`footer`, one `<h1>`,
  section `<h2>`s, entry `<h3>`s, language badge announced as the full language name
  ("Spanish"/"English") with the two-letter code hidden from screen readers.
- **Responsive (< 40rem):** indent collapses to the 1rem gutter, the date/meta row flows
  horizontally above each title, email field and button stack (button full width), no
  horizontal scroll at 390px.

## Non-Goals

- Real post data / `getPublishedPosts()`, the content collection, `/blog/`, `/about/`, `/tags/*`,
  `/rss.xml` routes — separate specs. Links point to them; they need not resolve yet.
- Choosing the newsletter provider (ADR 0007) or wiring the form `action`.
- OG images (ADR 0010); this spec only makes sure the chosen serif has a TTF available for later.
- Final intro/thesis copy.
- Dark mode, animation, client-side JS.
- Any new npm dependency.

## Approach

**Logic (TDD — tests first):** rename `src/lib/strips.ts` → `src/lib/home.ts` and
`strips.test.ts` → `home.test.ts`. (Not `posts.ts`: ADR 0002 reserves that name for
`getPublishedPosts()`.)
- Keep: `PILLARS` (drop `code`, add `href`), `PostSummary`, `latest`.
- Replace `toStrips` with `toEntries(posts)`: newest first, adds `href` (`/blog/<slug>/`),
  `pillar` (`tags[0]`), `updated: boolean`.
- `formatEntryDate(date)` → `Sep 16, 2026` (`Intl.DateTimeFormat('en-US', { timeZone: 'UTC' })`),
  `formatShortDate` → `Sep 21` for the updated marker.
- `LANG_NAMES = { es: 'Spanish', en: 'English' }` for the badge's accessible name.
- Delete: `byPillar`, `padSequence`, `formatZulu`, `formatStripDate`, sequence numbers, status.

**Data:**
- `src/data/sample-posts.ts` stays (type import moves to `home.ts`); `IS_SAMPLE_DATA` keeps
  sample titles rendered as plain text, not links, as today.
- New `src/data/intro.ts`: `role`, `thesis`, `IS_PLACEHOLDER = true`. While true, the thesis
  renders with a visible "[Placeholder]" prefix.

**Components** (scoped `<style>` per component, as in 0001):
- New: `SiteHeader.astro`, `Intro.astro`, `LatestArticles.astro`, `ArticleEntry.astro`,
  `Subscribe.astro`.
- Modify: `Footer.astro` (add RSS + Source, restyle).
- Delete: `Sidebar`, `CallsignStrip`, `LatestRack`, `PillarBays`, `Strip`, `SubscribeStrip`.
- Rewrite `src/pages/index.astro` to compose them inside `BaseLayout`.

**Layout & fonts:** `src/layouts/BaseLayout.astro` — replace B612 `@font-face`, preloads and
board tokens with the new tokens and Source Serif 4 (Regular for the site name, Semibold for
h1/h2/titles), woff2 in `public/fonts/`, subset to Latin + Latin Extended (ñ á é í ó ú ü ¿ ¡)
as a one-off step outside the repo's dependencies. Keep the TTF source available for ADR 0010's
phase 2. Update `public/fonts/OFL.txt` for Source Serif 4. Remove the four `b612-*.woff2` files.
Global `color-scheme: light`, explicit `body` background.

**Render tests:** structural acceptance criteria below are covered with Astro's Container API
(`astro/container`, ships with Astro — no new dependency) rendering `index.astro`/components.

**Docs, after the build:**
- `DESIGN.md`, `.impeccable/design.json` and `.impeccable/surfaces/src-pages-index-astro.md`
  are rewritten for the new world (Impeccable documenter at finish).
- `specs/0001-homepage.md`: add a line noting its visual direction is superseded by 0002.
- `docs/homepage-design-proposals.md`: remove the "all … content is English" line, which
  contradicts ADR 0006.

## Acceptance Criteria

- `pnpm build`, `pnpm lint`, `pnpm test` pass.
- `home.test.ts` was written first and covers: newest-first order; `latest` with fewer than *n*
  posts; `pillar` = `tags[0]`; `href` with trailing slash; `updated` only with `updatedDate`;
  `formatEntryDate` returns `Sep 16, 2026` for `2026-09-16T00:00:00Z` regardless of the
  machine's time zone; input not mutated.
- Rendered homepage:
  - exactly one `<h1>`; `<h2>`s "Latest articles" and "Get new articles by email"; each entry
    title is an `<h3>`;
  - skip link is the first focusable element and targets `#main`;
  - `<nav lang="en">` contains exactly two links: About → `/about/`, Blog → `/blog/`;
  - four pillar links in the intro, in `PILLARS` order, to `/tags/<id>/`;
  - at most 3 entries, newest first; each title and description has `lang` equal to the post's
    language; each shows a badge whose accessible name is "Spanish"/"English"; each links its
    primary pillar to `/tags/<id>/`;
  - "Updated …" appears only on entries with `updatedDate`;
  - one "View all articles" link to `/blog/`;
  - email input has a visible label, `type="email"`, `autocomplete="email"`; input and button
    are disabled, and the availability sentence plus a `/rss.xml` link are present;
  - `<footer lang="en">` has LinkedIn, GitHub, Source (new tab, `rel="noopener noreferrer"`)
    and RSS (`/rss.xml`, same tab);
  - the placeholder thesis renders with the visible "[Placeholder]" marker.
- With zero posts, the latest section shows the empty-state sentence and no entries.
- No `B612` reference, deleted component, or `b612-*.woff2` remains in the repo.
- No `<script>` in the built homepage, no request to a third-party font origin, and
  `package.json` dependencies unchanged.
- No CSS `transition` or `animation` declarations in homepage styles.
- Visual check at 1440px: matches the approved preview and the mockup's structure (frame vs
  inner column, long section rules vs short article rules, date column). At 390px: no
  horizontal scroll, meta above titles, form stacked.

## Open Questions

- Final role line and thesis — waiting on About copy (`src/data/intro.ts`).
- Source Serif 4 optical size: text cut only, or the Display cut for the h1 (one more file)?
  Decide at build by comparing against the mockup.
- Is `rodrigoAdones/personal-site` public yet? The Source link only works once it is (ADR 0000
  recommends making it public).
- Zero-post empty-state wording.

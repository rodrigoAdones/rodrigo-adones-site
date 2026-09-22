# 0006: Language Strategy — One Site, Per-Post Language

**Status:** Accepted
**Date:** 2026-09-15

## Context

The brand plan calls for visibility in Spanish **and** English (F5). The naive implementation —
`/es/` and `/en/` route trees with translation pairs — doubles the work per post, and under N1 the
realistic outcome is that the second language rots and you ship half-translated pages, which
reads worse than monolingual.

## Options Considered

- **`/es/` and `/en/` route trees with translation pairs** — the conventional i18n setup.
  Doubles the work per post; the second language rots. Rejected (and listed as an explicit
  non-goal in [0000](0000-context-and-constraints.md)).
- **One site, one route tree, language declared per post** — one combined index and feed; no
  translation obligation.

## Decision

One site, one route tree, no locale prefixes. Each post declares `lang: 'es' | 'en'` in
frontmatter ([0002](0002-content-model.md)). One combined chronological index and one combined
feed.

Implementation notes:

- Set `lang` on `<html>` **per post** from frontmatter, not globally. This is what screen readers
  and search engines actually consume.
- Show a small, unobtrusive language badge on index cards so readers are not surprised.
- Offer filtered views at `/es` and `/en` as *filters over the same content*, not separate sites.
  Cheap, and gives a clean link to share with an audience in one language.
- UI chrome (nav, footer) in English — it is the lower-friction default for a mixed audience and
  avoids a translation layer for six words.
- No `hreflang`: there are no translation pairs to relate. Adding `hreflang` without pairs is
  worse than omitting it.
- **Do not enable Astro's `i18n` config.** It exists to build exactly the rejected option —
  locale-prefixed route trees, translation pairs, `hreflang`, locale redirects. The `/es` and
  `/en` views are ordinary pages (`src/pages/[lang]/index.astro` with `getStaticPaths` over
  `['es', 'en']`, filtering `getPublishedPosts()` by `data.lang`), not locales.
- Chrome and article language must not bleed into each other. `<html lang>` follows the post,
  so the English nav and footer inherit it and get read with Spanish pronunciation rules by
  screen readers: put `lang="en"` on the `<nav>` and `<footer>` elements. Conversely, the UI
  strings *inside* the article — the date, "min read", "Updated on" — belong to the post and
  follow its language: `Intl.DateTimeFormat(post.data.lang)` for dates and a three-entry
  dictionary for the labels. This is the one place "no translation layer" bends, deliberately
  and bounded to those strings.
- `og:locale` follows the post's `lang` as well; the mechanics are
  [0010](0010-social-preview-images.md)'s.

## Consequences

- Choose the language per post by *audience*, not by mood: pillar-level technical posts and
  anything aimed at international hiring in English; LatAm-market and local-community posts in
  Spanish.
- The combined feed drives the newsletter ([0007](0007-newsletter.md)), so an English-only
  subscriber receives Spanish posts. Accepted — it is the same "one site" trade. If it is ever
  a real complaint, per-language feeds at `/es/rss.xml` and `/en/rss.xml` are a few lines each
  (`getPublishedPosts()` filtered by `lang`); the newsletter stays a single list regardless.
- Revisit if a specific post earns real traffic and a translation is clearly worth it — then
  translate *that post*, add both to a pair, and introduce `hreflang` for the pair only. Do not
  let one translated post trigger a full i18n rewrite.

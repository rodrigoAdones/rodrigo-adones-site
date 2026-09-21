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

## Consequences

- Choose the language per post by *audience*, not by mood: pillar-level technical posts and
  anything aimed at international hiring in English; LatAm-market and local-community posts in
  Spanish.
- Revisit if a specific post earns real traffic and a translation is clearly worth it — then
  translate *that post*, add both to a pair, and introduce `hreflang` for the pair only. Do not
  let one translated post trigger a full i18n rewrite.

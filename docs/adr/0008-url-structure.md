# 0008: URL Structure and Permalink Policy

**Status:** Proposed
**Date:** 2026-09-15

Recommendation: accept. **Decide this before writing any code.**

## Context

URLs are the one thing in this system that is genuinely expensive to change, because other
people's links and search rankings point at them. It costs nothing to get right now and is a
permanent low-grade tax to get wrong.

## Options Considered

- **Dated post URLs** (`/blog/2026/09/<slug>`) — announces "this is old" forever and makes a
  refresh-and-republish awkward. Rejected.
- **Flat, undated slugs** (`/blog/<slug>`) — ages well; the date lives in frontmatter and on the
  page.
- **Mutable slugs** — renaming a file silently breaks inbound links. Rejected in favour of
  immutable slugs plus `aliases` → 301.

## Decision

| Path | Content |
|---|---|
| `/` | Homepage — who you are, the thesis in one line, latest 3 posts |
| `/about` | About |
| `/blog` | Full chronological index |
| `/blog/<slug>` | Post |
| `/tags/<tag>` | Pillar-filtered index |
| `/rss.xml` | Feed — **never change this path** |
| `/sitemap-index.xml` | Sitemap |

**No dates in post URLs.** `/blog/dora-metrics-sin-politica` ages well;
`/blog/2026/09/dora-metrics-sin-politica` announces "this is old" forever. Date lives in
frontmatter and on the page, not in the path.

**Slugs are immutable.** The filename is the slug. Renaming a published post's file is a breaking
change. When you must, add the old path to `aliases` in frontmatter and generate a 301 from it —
which is why `aliases` is in the [0002](0002-content-model.md) schema from day one rather than
retrofitted after the first broken link.

Pick `trailingSlash` behaviour once, in config, and never touch it.

## Consequences

- Inbound links and search rankings survive file renames as long as `aliases` is maintained.
- `_redirects` on Workers Static Assets must be verified on first deploy
  ([0004](0004-hosting.md)).

## Open decision blocking this ADR

Everything above — canonical URLs, OG tags, the newsletter's from-address, the sitemap — is
parameterized on the domain. Register before building. Recommendation: `<lastname>.dev` or
`<firstname><lastname>.com` at Cloudflare Registrar (at-cost, no renewal gouging), and avoid a
name that encodes the current employer, current role, or a topic you might outgrow. A personal
domain should survive three job changes.

The action list in [0000](0000-context-and-constraints.md) marks registration as done; `site` in
`astro.config.mjs` is still unset and must be filled before this ADR can move to Accepted.

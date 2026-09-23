# 0010: Social Preview Images

**Status:** Accepted
**Date:** 2026-09-15 (accepted 2026-09-23)

Recommendation: build-time generation, as a phase 2.

## Context

LinkedIn is the primary distribution channel. A LinkedIn post whose link has no preview image is
measurably weaker. Since [0002](0002-content-model.md) already requires `title` and `description`,
generating a card is mechanical.

## Options Considered

- **One static default OG image** — ten minutes, covers every post.
- **Per-post OG images generated at build time** (Satori/Resvg in the build, or Astro's
  endpoint-based image generation) from `title` + `tags` + author name. Committed to the output,
  served as static files — no runtime image service, no Worker.
- **Runtime OG endpoint** — converts a static site into one with a runtime dependency in the path
  of every social share, to save a few seconds of build. Rejected.

## Decision

Phase 1: one well-designed static default OG image, 1200×630, at `public/og-default.png`. Ship it
with the site.

Phase 2: per-post OG images generated at **build time**. Do this when there are five posts and
the format is known to be worth investing in — the freeze list in
[0000](0000-context-and-constraints.md) already gates it that way.

### Which image a post uses

An explicit precedence, so there is never a question:

1. `heroImage` from frontmatter ([0002](0002-content-model.md)), if the post sets one.
2. The generated per-post card, once phase 2 lands.
3. `public/og-default.png`.

Note the asymmetry in where the two kinds of image live. `heroImage` sits under `src/` so
`astro:assets` can optimize it, and its built URL is content-hashed — resolve it through
`getImage()` rather than guessing a path. `og-default.png` sits in `public/` precisely because its
URL must be stable and unhashed: it is referenced by absolute URL from a meta tag, and crawlers
cache that URL (see Consequences).

### The tags

The image is useless without these, and the absolute URL is the part that goes wrong. A relative
`og:image` makes LinkedIn and X render **no preview at all**, silently:

```astro
---
// src/layouts/PostLayout.astro
import { getImage } from 'astro:assets';

const { title, description, lang, heroImage } = Astro.props;
const src = heroImage
  ? (await getImage({ src: heroImage, width: 1200, height: 630 })).src
  : '/og-default.png';               // phase 2 substitutes `/og/${slug}.png` here

const ogImage = new URL(src, Astro.site);        // absolute, derived from `site` (0008)
const ogLocale = lang === 'es' ? 'es_ES' : 'en_US';
---
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content="article" />
<meta property="og:locale" content={ogLocale} />
<meta property="og:image" content={ogImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content={title} />
<meta name="twitter:card" content="summary_large_image" />
```

`og:locale` follows the post's language, which is the mechanic
[0006](0006-language-strategy.md) defers here.

### Phase 2 shape

A prerendered endpoint, not a runtime service: `src/pages/og/[slug].png.ts` with
`getStaticPaths()` over `getPublishedPosts()` ([0002](0002-content-model.md)), returning a PNG
buffer built with Satori + Resvg. Same shape as `rss.xml.ts` ([0007](0007-newsletter.md)) and the
`_redirects` route ([0008](0008-url-structure.md)), and it falls out of the full-rebuild strategy
in [0003](0003-build-strategy.md) for free.

The gotcha that always bites: **Satori cannot use system fonts.** It needs an actual font buffer
passed in, so a `.woff`/`.ttf` file gets committed to the repo and read at build time.

## Consequences

- Every shared link has a preview from day one, at near-zero cost.
- Per-post images add a build-time dependency (Satori/Resvg) later; the site stays fully static
  either way ([0003](0003-build-strategy.md)).
- **LinkedIn caches previews aggressively and will not re-fetch on its own.** Two consequences,
  and LinkedIn is the primary channel: the default image's URL must never change, and once phase 2
  lands, posts already shared keep their old preview until refreshed by hand through LinkedIn's
  Post Inspector. That is an argument for doing phase 2 *before* a real sharing push, not after.
- Worth one test when this is implemented: assert `og:image` is an absolute URL. The CI link
  checker ([0005](0005-ci-cd.md)) walks links in `dist/` HTML and will not catch a relative
  `og:image`, and the failure is invisible until someone shares a link.

# 0008: URL Structure and Permalink Policy

**Status:** Accepted
**Date:** 2026-09-15 (accepted 2026-09-23)

Decided before any page was written, which was the point: these are the site's most expensive
commitments to reverse.

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

Site: **`https://rodrigoadones.dev`**. Every path below is written with the trailing slash it
actually serves.

| Path | Content |
|---|---|
| `/` | Homepage — who you are, the thesis in one line, latest 3 posts |
| `/about/` | About |
| `/blog/` | Full chronological index |
| `/blog/<slug>/` | Post |
| `/tags/<tag>/` | Pillar-filtered index — four known paths, one per pillar ([0002](0002-content-model.md)) |
| `/es/`, `/en/` | Language-filtered views over the same content ([0006](0006-language-strategy.md)) |
| `/404.html` | Not-found page, served by Workers `not_found_handling` ([0004](0004-hosting.md)) |
| `/rss.xml` | Feed — **never change this path** |
| `/sitemap-index.xml` | Sitemap — what `@astrojs/sitemap` emits |
| `/robots.txt` | Must carry `Sitemap: https://rodrigoadones.dev/sitemap-index.xml` |

The `Sitemap:` line is how search engines find the sitemap at all: the submission ping endpoints
were retired ([0005](0005-ci-cd.md)), so robots.txt is the only discovery path.

**No dates in post URLs.** `/blog/dora-metrics-sin-politica` ages well;
`/blog/2026/09/dora-metrics-sin-politica` announces "this is old" forever. Date lives in
frontmatter and on the page, not in the path.

**Slugs are immutable.** The filename is the slug. Renaming a published post's file is a breaking
change — and under [0007](0007-newsletter.md) a more expensive one than it looks, because
RSS-to-email dedupes on a guid derived from the post link, so a rename re-sends the post to every
subscriber. When you must rename, add the old path to `aliases` in frontmatter and generate a 301
from it — which is why `aliases` is in the [0002](0002-content-model.md) schema from day one
rather than retrofitted after the first broken link.

Slugs are lowercase ASCII with hyphens. Spanish titles produce accents and `ñ` naturally, so
de-accent when naming the file: `dora-metrics-sin-politica`, never `sin-política`. A
percent-encoded URL is an avoidable papercut in an email client or a chat preview.

**`trailingSlash: 'always'`.** Decided here, set in `astro.config.mjs` ([0001](0001-static-site-generator.md)),
and matched at the host by `html_handling: "force-trailing-slash"` ([0004](0004-hosting.md)) so
the framework and the CDN cannot disagree about which URL is canonical. Never touch it again.
Alias paths are therefore written *with* the trailing slash.

### Generating `dist/_redirects`

`aliases` is only a promise until something emits the redirects. The file is produced by a route,
not by an `astro:build:done` hook: an integration runs in plain Node and cannot import
`astro:content`, so a hook has no way to read the collection without re-parsing frontmatter off
disk — exactly the duplication [0002](0002-content-model.md) exists to prevent. An injected route
runs inside the Vite graph and can call `getPublishedPosts()` directly.

It lives outside `src/pages/` because Astro ignores underscore-prefixed files there, and is
injected at the literal path Workers expects ([0004](0004-hosting.md)):

```js
// src/integrations/redirects.js
export default function redirects() {
  return {
    name: 'alias-redirects',
    hooks: {
      'astro:config:setup': ({ injectRoute }) => {
        injectRoute({ pattern: '/_redirects', entrypoint: './src/routes/redirects.ts' });
      },
    },
  };
}
```

```ts
// src/routes/redirects.ts
import { getPublishedPosts } from '../lib/posts';

export async function GET() {
  const posts = await getPublishedPosts();
  const slugs = new Set(posts.map((p) => `/blog/${p.id}/`));
  const seen = new Map<string, string>();
  const lines: string[] = [];

  for (const post of posts) {
    for (const alias of post.data.aliases ?? []) {
      if (slugs.has(alias)) {
        throw new Error(`Alias ${alias} shadows a live post URL (in ${post.id})`);
      }
      if (seen.has(alias)) {
        throw new Error(`Alias ${alias} claimed by both ${seen.get(alias)} and ${post.id}`);
      }
      seen.set(alias, post.id);
      lines.push(`${alias}  /blog/${post.id}/  301`);
    }
  }
  return new Response(lines.join('\n') + '\n', {
    headers: { 'content-type': 'text/plain' },
  });
}
```

The two `throw`s are the point. A collision between two posts' aliases, or an alias that shadows
a live slug, silently drops one of the redirects — the build should fail instead. `_redirects` is
a build product and never lives in `public/`, which Astro copies verbatim.

Verified against Astro 7: the injected route emits `dist/_redirects` at that exact path, with no
trailing slash applied and no `.html` appended.

## Consequences

- Inbound links and search rankings survive file renames as long as `aliases` is maintained.
- `_redirects` on Workers Static Assets must be verified on first deploy
  ([0004](0004-hosting.md)).
- Every absolute URL on the site — canonical tags, OG tags, sitemap, feed links — derives from
  `site` in `astro.config.mjs`. It is set once, to `https://rodrigoadones.dev`, and nothing
  hardcodes the domain anywhere else.

## Resolved: the domain

This ADR was blocked on the domain, since canonical URLs, OG tags, the newsletter's from-address
and the sitemap are all parameterized on it. Resolved 2026-09-23: **`rodrigoadones.dev`**, at
Cloudflare Registrar. It encodes no employer, role or topic, so it survives job changes — which
was the criterion.

`site: 'https://rodrigoadones.dev'` is now set in `astro.config.mjs`, and this ADR is Accepted.

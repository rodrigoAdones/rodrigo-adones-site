# 0004: Hosting — Cloudflare Workers Static Assets

**Status:** Proposed
**Date:** 2026-09-15

Recommendation: Workers Static Assets over Cloudflare Pages.

## Context

Cloudflare is the right vendor: global edge, generous free tier, at-cost registrar, free analytics.
That part of the original proposal needs no defence.

But "Cloudflare Pages" is no longer the automatic answer. Cloudflare now has two products that
serve static sites, and the investment is going into Workers. Their own docs frame it as *"Workers
has a distinctly broader set of features available to it"* and position Workers as the default for
new framework deployments — while being clear that **Pages is not deprecated** and remains fully
supported.

## Options Considered

### Option A: Workers Static Assets

| Dimension | Assessment |
|---|---|
| Complexity | Low — a `wrangler.jsonc` with an `assets` block; no Worker script needed for pure static |
| Cost | Free — static asset requests are not billed |
| Future headroom | **High** |
| Ecosystem direction | **Where Cloudflare is investing** |

**Pros:** access to Durable Objects, Cron Triggers, KV/D1, Queues, gradual deployments, Tail
Workers and fuller observability *if ever needed*; a single primitive to learn that also covers
the dynamic case; better local dev via the Cloudflare Vite plugin.

**Cons:** you configure `wrangler.jsonc` yourself; custom domains must be on a Cloudflare zone;
branch-deploy controls are less granular than Pages'.

### Option B: Cloudflare Pages

| Dimension | Assessment |
|---|---|
| Complexity | **Lowest** — connect repo, done |
| Cost | Free |
| Future headroom | Medium |
| Ecosystem direction | Supported, but not where new features land |

**Pros:** automatic project-type detection; per-branch preview URLs and custom branch aliases out
of the box; custom domains outside Cloudflare zones; genuinely zero-config.

**Cons:** narrower feature set; you migrate later if the site grows a dynamic edge.

### Option C: GitHub Pages / Netlify / Vercel

All adequate. Rejected: a second vendor for no gain, and the domain will be at Cloudflare anyway.

## Trade-off Analysis

Both Cloudflare options are free and both serve a static site perfectly. The tie-break is not
today's requirements — it is that the first genuinely useful dynamic thing you will want is
predictable (a `/api/subscribe` proxy, an OG-image generator, a scheduled link-checker, a view
counter), and on Workers that is an additive change rather than a migration. The extra config
cost is one file, written once.

Choose Pages instead if the honest priority is *lowest possible time to live site* — its git
integration with zero config is still the fastest path from repo to URL, and migrating later is a
contained, well-documented job.

## Decision

**Workers Static Assets**, deployed with Wrangler from GitHub Actions ([0005](0005-ci-cd.md)).

## Consequences

- `_headers` and `_redirects` semantics differ from Pages in detail — verify the redirect file
  behaves as expected on first deploy ([0008](0008-url-structure.md) depends on it).
- Preview deployments come from `wrangler versions upload`, not from Pages' branch deploys.
  Slightly more wiring in CI; see [0005](0005-ci-cd.md).

## Reference config

**`wrangler.jsonc`**

```jsonc
{
  "name": "personal-site",
  "compatibility_date": "2026-09-01",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
}
```

No `main` entry: a pure static site needs no Worker script. Add one only when the "future
headroom" above is actually cashed in.

**`public/_redirects`** — generated from `aliases` per [0008](0008-url-structure.md):

```
/old-post-path/  /blog/new-slug/  301
```

## Sources

- [Migrate from Pages to Workers · Cloudflare docs](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)
- [Deploy a static Next.js site · Cloudflare Pages docs](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)
- [Next.js · Cloudflare Workers docs](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)

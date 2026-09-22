# 0004: Hosting — Cloudflare Workers Static Assets

**Status:** Accepted
**Date:** 2026-09-15 (accepted 2026-09-21)

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
| Cost | Free — static asset requests are not billed and do not count as Worker invocations |
| Future headroom | **High** |
| Ecosystem direction | **Where Cloudflare is investing** |

**Pros:** access to Durable Objects, Cron Triggers, KV/D1, Queues, gradual deployments, Tail
Workers and fuller observability *if ever needed*; a single primitive to learn that also covers
the dynamic case; better local dev via the Cloudflare Vite plugin.

The reason "additive, not a migration" is literally true: with no `main` script there is no Worker
invocation at all, so the free tier's 100k-requests/day limit never applies. When a `main` is
eventually added, assets are still matched and served *before* the Worker runs (the default,
`run_worker_first: false`), so only requests that miss the assets — a future `/api/subscribe` —
count against that limit. Adding dynamic behaviour does not change how the static site is served.

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

- `_headers` and `_redirects` are read from the root of the assets directory (`dist/`), with no
  `wrangler.jsonc` configuration; their semantics differ from Pages in detail — verify the
  redirect file behaves as expected on first deploy ([0008](0008-url-structure.md) depends on it).
- `not_found_handling: "404-page"` serves `dist/404.html`, which only exists if
  `src/pages/404.astro` does. Without it, misses return a bare 404.
- Preview deployments come from `wrangler versions upload`, not from Pages' branch deploys.
  Slightly more wiring in CI; see [0005](0005-ci-cd.md). The preview hostname derives from the
  Worker `name`, so it is set once and matches `package.json`.

## Reference config

**`wrangler.jsonc`**

```jsonc
{
  "name": "rodrigo-personal-site",
  "compatibility_date": "2026-09-01",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page",
    "html_handling": "force-trailing-slash"   // pinned to match Astro's trailingSlash: 'always' (0001, 0008)
  }
}
```

No `main` entry: a pure static site needs no Worker script. Add one only when the "future
headroom" above is actually cashed in; `compatibility_date` is inert until then.

`html_handling` is pinned rather than left on its `auto-trailing-slash` default so the host and
the framework cannot drift on the one URL decision [0008](0008-url-structure.md) says to make once.

**`dist/_redirects`** — a build product, generated from `aliases` per
[0008](0008-url-structure.md). It is *not* a hand-maintained file in `public/`: Astro copies
`public/` verbatim, so a generated file is written into `dist/` after `astro build` (the exact
step is 0008's). One line per alias:

```
/old-post-path/  /blog/new-slug/  301
```

## Sources

- [Static Assets · Cloudflare Workers docs](https://developers.cloudflare.com/workers/static-assets/)
- [Static Assets routing and `html_handling` / `not_found_handling`](https://developers.cloudflare.com/workers/static-assets/routing/)
- [`_redirects` and `_headers` for Static Assets](https://developers.cloudflare.com/workers/static-assets/headers-and-redirects/)
- [Astro · Cloudflare Workers framework guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)
- [Migrate from Pages to Workers · Cloudflare docs](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)

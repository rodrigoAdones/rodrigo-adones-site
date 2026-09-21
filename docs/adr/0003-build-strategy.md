# 0003: Build Strategy — Full Rebuild per Push

**Status:** Accepted
**Date:** 2026-09-15 (accepted 2026-09-20)

Recommendation: accept. **This corrects the original design.**

## Context

The original proposal described: *"every time a new post is added to the repo, run a process to
generate the static page for the article."*

This describes incremental, per-article generation. It is the one piece of over-engineering in
the proposal, and it is worth naming explicitly because it is a habit that transfers from large
systems where it is correct.

## Options Considered

- **Incremental, per-article generation** — requires change detection, partial-build
  orchestration, invalidation of every page that transitively references the new post (blog
  index, tag pages, RSS, sitemap, "related posts", the homepage's latest-three block), and a
  cache-consistency story. Real, stateful complexity that buys nothing, because the thing it
  optimizes already costs seconds. Worse, it is a correctness risk: the most common failure mode
  of naive incremental static generation is a new post that exists at its URL but never appears
  in the index or the feed. Under [0007](0007-newsletter.md), a post missing from the feed is a
  post that never reaches subscribers.
- **Full rebuild of every page on each push** — for a site of this size, 2–15 seconds.

## Decision

Push to `main` → GitHub Actions runs a **full site build** → deploy the whole output directory. No
incremental generation, no per-article pipeline, no build cache beyond the dependency cache. Pushes
to a PR branch run the identical build without the deploy step ([0005](0005-ci-cd.md)).

This depends on Astro's default `output: 'static'` — no adapter, no server runtime. `astro build`
emits a plain `dist/` directory and that directory is the whole deployable, which is what lets
[0004](0004-hosting.md) serve it as static assets.

Revisit only if build time exceeds ~2 minutes. At a realistic 1–4 posts/month, that is several
years away, and Astro's content layer handles thousands of entries.

## Consequences

- The invariant "what is deployed is exactly what the repo says" holds at all times. Every deploy
  is a full, reproducible rebuild from source — which also means rollback is just a revert.
- That invariant has a precondition: the build runs on a fresh runner. Astro keeps its own
  incremental content-layer cache in `.astro/` and `node_modules/.astro/`; CI must never persist
  those between runs. [0005](0005-ci-cd.md) caches only the pnpm store (`cache: pnpm`), which is
  fine. Adding `actions/cache` on `node_modules/` or `.astro/` to save seconds would quietly
  reintroduce the staleness this ADR exists to rule out.
- Slightly more CI minutes. Free-tier irrelevant (N4, N6).

# 0010: Social Preview Images

**Status:** Proposed
**Date:** 2026-09-15

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

Phase 1: one well-designed static default OG image. Ship it with the site.

Phase 2: per-post OG images generated at **build time**. Do this when there are five posts and
the format is known to be worth investing in.

## Consequences

- Every shared link has a preview from day one, at near-zero cost.
- Per-post images add a build-time dependency (Satori/Resvg) later; the site stays fully static
  either way ([0003](0003-build-strategy.md)).

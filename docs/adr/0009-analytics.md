# 0009: Analytics

**Status:** Proposed
**Date:** 2026-09-15

Recommendation: Cloudflare Web Analytics.

## Context

Some visibility into traffic is useful (N3), but on a five-page personal blog any analytics choice
that forces a consent banner costs more in credibility and usability than it returns in data.

## Options Considered

- **Cloudflare Web Analytics** — free, no cookies, no `localStorage`, no personal data; therefore
  no consent banner. Already at the hosting vendor ([0004](0004-hosting.md)).
- **Google Analytics** — consent banner, and more data than needed about fewer people than you
  think. Rejected.
- **Plausible / Umami, self-hosted** — a service to run; off-thesis. Rejected.

## Decision

Cloudflare Web Analytics. Free, no cookies, no `localStorage`, no personal data — and therefore
**no consent banner**, which is the real win: a cookie banner on a five-page personal blog is a
self-inflicted usability and credibility wound.

Track exactly three numbers and check them monthly, not daily: unique visitors per post,
referrers, and newsletter subscribers.

## Consequences

- No consent banner, no third-party tracking script, no privacy surface to maintain.
- Less granular data than GA. Deliberate: on a blog this size, daily analytics are a dopamine
  loop that displaces writing (N1).

# 0009: Analytics

**Status:** Accepted
**Date:** 2026-09-15 (accepted 2026-09-23)

Recommendation: Cloudflare Web Analytics.

## Context

Some visibility into traffic is useful, but on a five-page personal blog any analytics choice that
forces a consent banner costs more in credibility and usability than it returns in data.

The sharper motivation is N3. The site is a credibility artifact, and [0001](0001-static-site-generator.md)
stakes part of that on performance — "ships ~zero JavaScript, perfect Lighthouse scores". A
synthetic lab run does not confirm that claim; field data from real visitors on real phones does.
Analytics here is primarily how the performance claim gets verified, and only secondarily how
traffic gets counted.

## Options Considered

- **Cloudflare Web Analytics** — free, no cookies, no `localStorage`, no personal data; therefore
  no consent banner. Already at the hosting vendor ([0004](0004-hosting.md)). Reports Core Web
  Vitals from real visitors. Costs one small third-party script (see Consequences).
- **Cloudflare zone analytics only** — the domain is on a Cloudflare zone, so requests, top paths,
  countries and bandwidth are available server-side with *no client script whatsoever*. Coarser:
  it counts bots and asset requests rather than humans, and reports no Core Web Vitals. Kept as
  the fallback rather than rejected — it is what to fall back to if the beacon stops paying for
  itself.
- **Google Analytics** — consent banner, and more data than needed about fewer people than you
  think. Rejected.
- **Plausible / Umami, self-hosted** — a service to run; off-thesis. Rejected.

## Decision

Cloudflare Web Analytics. Free, no cookies, no `localStorage`, no personal data — and therefore
**no consent banner**, which is the real win: a cookie banner on a five-page personal blog is a
self-inflicted usability and credibility wound.

The beacon snippet goes in `BaseLayout.astro`, not into Cloudflare's automatic zone injection. In
git it is visible in review, survives a host change (N5), and is one grep away when debugging —
the same instinct as owning the build in [0005](0005-ci-cd.md).

Track exactly four numbers and check them monthly, not daily. They come from two places, which is
worth knowing before going looking:

| Number | Source |
|---|---|
| Unique visitors per post | Cloudflare Web Analytics |
| Referrers | Cloudflare Web Analytics |
| Core Web Vitals (LCP, INP, CLS) | Cloudflare Web Analytics — the N3 check |
| Newsletter subscribers and open rate | The provider's dashboard ([0007](0007-newsletter.md)) |

## Consequences

- No consent banner and no privacy surface to maintain.
- **But this is not a zero-JavaScript site any more, and that should be said plainly.** The beacon
  is ~5 KB loaded from `static.cloudflareinsights.com` — a third-party origin. "No cookies" and
  "no JavaScript" are different claims and only the first survives this decision. It sits
  uncomfortably beside [0007](0007-newsletter.md), which chose a plain `<form>` precisely to avoid
  a third-party script; the difference is that the beacon buys the N3 field data and the form
  embed bought nothing. If a CSP is ever added via `_headers` ([0004](0004-hosting.md)), it needs
  `script-src https://static.cloudflareinsights.com`.
- **Readership is undercounted, structurally and substantially.** Full-content email
  ([0007](0007-newsletter.md)) means subscribers read without visiting, and RSS clients execute no
  JavaScript. The most engaged part of the audience is exactly the part the beacon cannot see, so
  "unique visitors per post" is a floor, not a measure. Read it alongside the provider's open rate,
  and never quote a visitor count as if it were readership.
- Less granular data than GA. Deliberate: on a blog this size, daily analytics are a dopamine
  loop that displaces writing (N1).

# 0000: Context and Constraints

**Status:** Accepted
**Date:** 2026-09-15

Shared context for the ADR set. Individual ADRs reference the requirement and constraint IDs below
(F1–F6, N1–N6) instead of restating them. This is not a decision record; it is the frame every
decision is judged against.

## Purpose

This site is not a generic side project. It is the "own blog/newsletter" channel of the
personal-brand plan, so the architecture is judged against that goal, not against engineering
novelty.

## Functional requirements

| # | Requirement |
|---|---|
| F1 | Homepage, About page, blog index, blog post pages |
| F2 | Posts authored as markdown files in the same repo as the site |
| F3 | New post committed → published automatically |
| F4 | No comments section |
| F5 | Posts in Spanish *or* English, one site, no translation pairs |
| F6 | Email capture that feeds a newsletter, without running a backend |

## Non-functional requirements and constraints

| # | Constraint | Implication |
|---|---|---|
| N1 | **5–8 h/week total budget, shared with learning and content** | Maintenance cost is the dominant cost. Every hour spent on the platform is an hour not spent writing. Bias hard toward boring. |
| N2 | Author is a solo operator, sometimes writing from a phone | Authoring loop must work from a browser/phone, not only from the Mac |
| N3 | Site is a credibility artifact for Director-level hiring | Performance, correctness and polish are visible signals; a broken feed or a 2 s LCP is a negative signal |
| N4 | Traffic will be tens to low thousands of visits/month for years | Scalability is a non-issue. Do **not** design for scale. |
| N5 | Content must be portable — this outlives any vendor | Markdown + git is the source of truth; every host is replaceable |
| N6 | Budget: domain only, ideally < USD 20/year | Free tiers must cover everything else |

## Explicit non-goals

Comments, user accounts, search-as-a-service, a CMS, server-side rendering, personalization,
multi-author workflow, i18n route trees.

## Origin of this ADR set

The original proposal was: static site, markdown in the repo, Next.js, Cloudflare Pages, GitHub
Actions, and a per-article generation step on each new post. The overall shape is the correct
complexity level for N1 and N4 and was kept. Four decisions diverge from the original proposal:

- [0001](0001-static-site-generator.md) — the framework choice is closer than it looks; Astro over Next.js
- [0003](0003-build-strategy.md) — per-article generation replaced by a full rebuild per commit
- [0004](0004-hosting.md) — Pages vs Workers is now a real decision; Workers Static Assets
- [0007](0007-newsletter.md) — the newsletter is the one requirement that quietly threatens "pure static"

## Cross-cutting: cost

| Item | Cost |
|---|---|
| Domain (Cloudflare Registrar, at cost) | ~USD 10–15 / year |
| Workers Static Assets — static requests | Free |
| Cloudflare Web Analytics | Free |
| GitHub + Actions (public repo) | Free |
| Newsletter provider | Free at low subscriber counts — **verify current tiers** |
| **Total** | **≈ USD 1 / month** |

Make the repo public. It costs nothing, gives unlimited Actions minutes, and a public repo
containing a real CI pipeline and an ADR set is itself a work sample.

## Cross-cutting: risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Site gets built, blog stays empty** | **High** | **High** | The only risk that actually matters. Mitigation is process, not architecture: write three posts *before* building, so launch day has content. Timebox the build to two weekends. |
| Yak-shaving the platform instead of writing | High | High | This ADR set is the yak, shaved. Freeze the stack; any further platform change must wait until 5 posts are published. |
| Malformed RSS silently stops the newsletter | Medium | High | CI assertion on feed validity + newest item ([0007](0007-newsletter.md)) |
| Broken published URL after a rename | Medium | Medium | `aliases` + 301s from day one ([0008](0008-url-structure.md)) |
| Newsletter vendor lock-in | Low | Medium | Quarterly list export |
| Framework churn / dependency rot | Medium | Low | Minimal dependency tree; Dependabot monthly, not weekly |
| Cloudflare Pages/Workers direction shifts again | Low | Low | Output is a plain directory of static files. Any host will serve it. This is why N5 matters. |

## Action items

**Phase 0 — before any code**

1. [x] Register the domain (blocks [0008](0008-url-structure.md))
2. [ ] Choose the newsletter provider; confirm RSS-to-email exists on its free tier ([0007](0007-newsletter.md))
3. [x] Write the About page text — hardest copy on the site, and it forces the positioning
4. [ ] Draft three posts, one per pillar, in plain markdown

**Phase 1 — build (target: two weekends)**

5. [ ] Spend one evening with the Astro scaffold; confirm Astro or fall back to Next.js ([0001](0001-static-site-generator.md))
6. [ ] Scaffold, content schema, three pages, post layout
7. [ ] RSS + sitemap + robots.txt; static default OG image
8. [ ] `wrangler.jsonc`; connect domain; verify `_redirects`
9. [ ] Actions: PR checks + preview, `main` → deploy
10. [ ] Cloudflare Web Analytics; embed subscribe form

**Phase 2 — after launch**

11. [ ] Publish the three posts; announce on LinkedIn in both languages
12. [ ] Per-post OG images ([0010](0010-social-preview-images.md))
13. [ ] Instrument deploy frequency + lead time on this repo ([0005](0005-ci-cd.md))

**Frozen until 5 posts are live:** framework changes, search, comments, self-hosted newsletter,
i18n route trees, any new dependency.

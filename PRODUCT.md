# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally. The homepage and About mostly serve the first; posts mostly serve the second. Every surface still has to work for both.

- **Hiring decision-makers:** CTOs, VPs of Engineering and recruiters deciding whether Rodrigo is credible for a Director-level role. They skim fast and look for signs of seniority, judgment and follow-through. They often arrive from LinkedIn or a CV link.
- **Practitioner readers:** engineers and software architects who come for an article, may subscribe to the newsletter, and come back. They read closely, often long-form and technical, sometimes in their inbox rather than on the site.

## Product Purpose

The site is Rodrigo Adones's own blog and newsletter, the owned channel in a personal-brand plan. It exists to publish writing across four pillars and to act as a credibility artifact for Director-level hiring. Success means posts actually get published (an empty blog is the top risk), the newsletter grows, and a hiring decision-maker leaves convinced of the author's seniority.

## Positioning

An engineering leader focused on **organizational delivery outcomes**, writing across four fixed pillars:

- AI-native delivery (`ai-delivery`)
- Platform & DX (`platform-dx`)
- Delivery measurement (`delivery-metrics`)
- Commerce & payments (`commerce-payments`)

The site is its own proof. It is a public repo with ADRs, CI and a disciplined static architecture, so the way it is built demonstrates the delivery judgment the writing claims.

_Open decision:_ this positioning was derived from the ADRs. Sharpen it once the About page copy lands in the repo.

## Operating Context

- Posts are Markdown in `src/content/blog/`, schema-validated (ADR 0002), and each is tagged with 1–4 of the closed pillar tags.
- Publishing a post also sends the newsletter: RSS-to-email delivers the full post (ADR 0007). Posts must read well as a single column in email clients.
- The author is a solo operator with 5–8 h/week, sometimes writing from a phone. Maintenance cost dominates every decision.
- Engagement goes to LinkedIn. Posts end with a link to their LinkedIn discussion thread only when `discussionUrl` exists (ADR 0011).
- Traffic is low: tens to low thousands of visits a month.

## Capabilities and Constraints

- **Pages (F1):** homepage, About, blog index, post pages. The `/es/` and `/en/` pages are filtered views over the same content, not separate sites.
- **Stack:** Astro, TypeScript strict, pnpm, Vitest (TDD), fully static, deployed on Cloudflare Workers Static Assets.
- **Zero client JS and no third-party cookies:** ADRs 0007 and 0009 require this. Performance and correctness are visible credibility signals (N3).
- **Newsletter:** a plain `<form method="post">` to a hosted provider, not a JS embed. The provider is still undecided.
- **No comments, accounts, search, CMS or SSR.** No dependencies beyond those accepted ADRs name, until 5 posts are live.
- **Per-post metadata worth surfacing:** title, description, pubDate, optional updatedDate ("Updated on"), computed reading time, language, pillar tags.
- **Social previews:** static default OG image, then per-post OG images built with satori/resvg (ADR 0010).

## Brand Commitments

- **Identity:** the site is the author's personal name, **Rodrigo Adones**, on `rodrigoadones.dev`. There is no separate brand name or logo.
- **Bilingual:** each post is Spanish or English, declared per post. UI chrome (nav, footer) stays in English with `lang="en"`. In-article labels such as dates, "min read" and "Updated on" follow the post's language (ADR 0006). The voice must work in both languages.
- **Language badges:** index cards show a small, unobtrusive language badge.

## Evidence on Hand

- **Social links:** LinkedIn `https://linkedin.com/in/rodrigo-adones-vicencio` and GitHub `https://github.com/rodrigoAdones`.
- **Architecture record:** the public ADR set in `docs/adr/` and the specs in `specs/`.
- **Not yet in the repo:** posts (three are planned, one per pillar), About copy, headshot or photo, newsletter provider, subscriber counts, testimonials, employer logos. Do not fabricate any of these. Use clearly marked placeholders.

## Product Principles

1. **Writing over platform.** Any feature that costs maintenance time must earn it against time spent writing.
2. **The site is the work sample.** Speed, correctness, accessibility and restraint are part of the argument, not polish on top of it.
3. **One site, two languages, no translation debt.** Design for mixed Spanish and English content living side by side.
4. **Portable and boring by default.** Markdown plus git is the source of truth, and every vendor is replaceable.
5. **Publishing is sending.** A post must read fully and well in an inbox as well as on the page.

## Accessibility & Inclusion

Semantic landmarks (`nav`, `main`, `footer`). Correct per-element `lang` so screen readers switch pronunciation between Spanish posts and English chrome.

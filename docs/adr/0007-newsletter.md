# 0007: Newsletter — Hosted Provider, RSS-to-Email

**Status:** Accepted
**Date:** 2026-09-15

## Context

F6 is the requirement that threatens "just statics". An email list needs a POST endpoint, storage,
double opt-in, unsubscribe handling, bounce processing and deliverability — none of which a static
site can do, and all of which are a genuine project.

## Options Considered

- **Hosted newsletter provider with RSS-to-email** (Buttondown, Kit, Beehiiv) — the provider
  hosts the list and the subscribe form posts to its domain; each published post becomes the
  email via the feed.
- **Self-hosted** (Worker + D1 + email API) — the more interesting build and a legitimate
  portfolio piece; also an inbox-deliverability problem, a compliance surface, and a thing that
  breaks during a work sprint. Off-thesis: the positioning is about organizational delivery
  outcomes, not about running SMTP. Rejected.
- **Substack-as-primary** — owns the audience and the canonical URL, which violates N5 and
  undercuts the entire point of having a domain. Rejected.

## Decision

Canonical post lives on your domain. A hosted newsletter provider hosts the list; its subscribe
form is embedded in the page; **its RSS-to-email feature turns each published post into the
email.**

**The email carries the full post**, not a teaser. Each feed item emits `content:encoded` with
the rendered article, so a subscriber reads the whole thing in their inbox without clicking
through. A description-only feed would make the email a notification rather than a newsletter,
and "publishing is sending" would stop being true in any useful sense.

The subscribe form is a plain `<form action="https://<provider>/…" method="post">`, not the
provider's JavaScript embed: it keeps the site at zero JS (N3) and drops no third-party cookies,
consistent with [0009](0009-analytics.md). Both Buttondown and Kit accept a plain POST.

## Consequences

- **You write once.** Publishing a post *is* sending the newsletter. Given N1, this single
  property is what makes a newsletter survivable at all — any design where publishing and sending
  are two separate acts of writing will fail.
- The RSS feed is now **production infrastructure**, not a nicety. A malformed feed means no email
  goes out. Worth one CI assertion ([0005](0005-ci-cd.md)), written against `dist/` alone so it
  needs no frontmatter parsing: the feed is well-formed XML; every item `<link>` resolves to a
  `dist/blog/<slug>/index.html` that exists; every built post appears in the feed; and item dates
  descend. The third check is the one that catches [0003](0003-build-strategy.md)'s named failure
  — a post live at its URL but absent from the feed, and therefore never emailed.
- The site stays 100 % static. The form posts to the provider's domain.
- **Inbox readers are invisible to analytics** ([0009](0009-analytics.md)). Someone who reads the
  full post in email never hits the site, so traffic undercounts real readership. This is the
  accepted cost of full-content email; do not later misread flat traffic as a flat audience —
  read the provider's open rate alongside it.
- Gmail clips messages over ~102 KB behind a "View entire message" link. Syntax-highlighted code
  is verbose HTML, so a long technical post can reach it. Not fatal, but it is the reason to
  revisit if posts grow very long.
- Email clients render a narrow subset of CSS. Code blocks, tables and images survive; anything
  layout-dependent does not. Write posts that read fine as a single column.
- **Slugs and `pubDate` become immutable once published.** RSS-to-email dedupes on `<guid>`,
  which `@astrojs/rss` derives from the item link. Renaming a slug re-sends the post to every
  subscriber; this is the concrete cost behind [0008](0008-url-structure.md)'s immutable-slug
  rule and the reason `aliases` exists. Edits after publication go in `updatedDate`, which does
  not touch the guid.
- A vendor holds the subscriber list. Mitigate by exporting the list quarterly — one calendar
  reminder, and it preserves N5 for the one asset markdown-in-git does not cover.
- Verify current free-tier limits and whether RSS-to-email is available on the free plan before
  committing; these change, and the answer decides the provider. Record the pick as a dated
  amendment to this ADR — it is a parameter of this decision, not a new one.
- Revisit the full-content choice if Gmail clipping becomes routine, or if driving traffic to the
  domain turns out to matter more than inbox readership. Switching to teaser emails is a one-field
  change to the feed, with no other consequence.

## Reference config

**`src/pages/rss.xml.ts`** — production infrastructure:

```ts
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { getPublishedPosts } from '../lib/posts';   // sorted newest-first, see 0002

const parser = new MarkdownIt();

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: 'Rodrigo Adones — Engineering & Delivery',
    description: 'AI-assisted delivery, platform engineering and delivery measurement.',
    site: context.site!,
    xmlns: { dc: 'http://purl.org/dc/elements/1.1/' },
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}/`,
      // The full article — this is what the provider sends as the email body.
      content: sanitizeHtml(parser.render(p.body!), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      }),
      // Per-item language: <language> is channel-level in RSS 2.0, so use Dublin Core.
      customData: `<dc:language>${p.data.lang}</dc:language>`,
    })),
  });
}
```

Two things the feed depends on. Rendering `p.body` with `markdown-it` works because the blog
collection is markdown-only ([0002](0002-content-model.md)); MDX bodies would not render this
way. And relative image and link URLs must be rewritten to absolute against `context.site`
before sending — an email client has no base URL to resolve them against.

**Dependencies:** `@astrojs/rss`, `markdown-it`, `sanitize-html` (plus their `@types/*`).

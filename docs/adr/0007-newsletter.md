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

## Consequences

- **You write once.** Publishing a post *is* sending the newsletter. Given N1, this single
  property is what makes a newsletter survivable at all — any design where publishing and sending
  are two separate acts of writing will fail.
- The RSS feed is now **production infrastructure**, not a nicety. A malformed feed means no email
  goes out. Worth one CI assertion ([0005](0005-ci-cd.md)): feed is valid XML and its newest item
  matches the newest non-draft post.
- The site stays 100 % static. The form posts to the provider's domain.
- A vendor holds the subscriber list. Mitigate by exporting the list quarterly — one calendar
  reminder, and it preserves N5 for the one asset markdown-in-git does not cover.
- Verify current free-tier limits and whether RSS-to-email is available on the free plan before
  committing; these change, and the answer decides the provider.

## Reference config

**`src/pages/rss.xml.ts`** — production infrastructure:

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate - a.data.pubDate);
  return rss({
    title: 'Rodrigo Adones — Engineering & Delivery',
    description: 'AI-assisted delivery, platform engineering and delivery measurement.',
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}/`,
      customData: `<language>${p.data.lang}</language>`,
    })),
  });
}
```

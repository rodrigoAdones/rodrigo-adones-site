# 0002: Content Model — Markdown in the Same Repo, Schema-Validated

**Status:** Accepted
**Date:** 2026-09-15 (accepted 2026-09-20)

Recommendation: accept. This was the original proposal and it is right.

## Context

F2 requires posts authored as markdown files in the same repo as the site; N5 requires the content
to be portable and outlive any vendor (see [0000](0000-context-and-constraints.md)). The open
question is only how strictly the frontmatter is validated, and where.

## Options Considered

- **Single repository, schema-validated frontmatter** — content in `src/content/blog/*.md`
  alongside the site code; frontmatter validated against an explicit schema at build time.
- **Separate content repo** — a submodule to maintain for zero benefit at one author. Rejected.
- **Headless CMS** — a vendor, a login and a monthly bill between you and writing. Rejected.
- **Notion-as-source** — N5 portability violation. Rejected.

## Decision

Single repository. Content lives in `src/content/blog/*.md`, alongside the site code. Frontmatter
is validated against an explicit schema at build time.

### Frontmatter schema

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string, max 80 chars | yes | It is the `<title>` and OG title; longer gets truncated in search results and link previews |
| `description` | string, 50–160 chars | yes | Used for `<meta>`, OG, RSS, and the index card. Enforce the length — it is your click-through rate. |
| `pubDate` | date | yes | |
| `updatedDate` | date | no | Render "updated on" when present; good-faith signal |
| `lang` | `'es' \| 'en'` | yes | See [0006](0006-language-strategy.md) |
| `tags` | string[], 1–4 items | yes | Constrain to a closed list mapped to the four pillars — AI-native delivery, platform & DX, delivery measurement, commerce & payments. An open tag vocabulary becomes a mess by post 15, and a closed one forces every post to declare which pillar it serves. |
| `draft` | boolean | no, default false | Excluded from production builds |
| `heroImage` | image | no | |
| `canonicalUrl` | url | no | For cross-posting, see Consequences |
| `discussionUrl` | url | no | Link to the LinkedIn discussion thread; see [0011](0011-no-comments.md) |
| `aliases` | string[] | no | Old paths that should 301 here, absolute and with a trailing slash — see [0008](0008-url-structure.md) |

`readingTime` is computed, never authored — a small remark plugin injects it into
`remarkPluginFrontmatter` at build time (the `remark-reading-time` pattern from the Astro docs).

### Schema as code

`src/content.config.ts` — the whole argument for Astro ([0001](0001-static-site-generator.md)) in
25 lines:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const PILLARS = ['ai-delivery', 'platform-dx', 'delivery-metrics', 'commerce-payments'] as const;

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(80),
      description: z.string().min(50).max(160),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      lang: z.enum(['es', 'en']),
      tags: z.array(z.enum(PILLARS)).min(1).max(4),
      draft: z.boolean().default(false),
      heroImage: image().optional(),
      canonicalUrl: z.url().optional(),
      discussionUrl: z.url().optional(),
      aliases: z.array(z.string().startsWith('/').endsWith('/')).optional(),
    }),
});

export const collections = { blog };
```

A post with a 30-character description now fails CI. In Next.js, that check is code you write and
maintain.

Two details of the sample that are easy to get wrong:

- `z` is imported from `astro/zod`, not `astro:content`. The `astro:content` re-export is
  deprecated and removed in Astro 8. Astro 7 bundles Zod 4, so URL fields use `z.url()` —
  `z.string().url()` is deprecated there.
- `image()` resolves a path relative to the markdown file and requires the asset to live under
  `src/`, so it can be optimized at build time. A `heroImage` pointing into `public/` fails
  validation. This is the same constraint [0010](0010-social-preview-images.md) works within.

### Draft exclusion is a query concern, not a schema concern

The schema only *declares* `draft`. Nothing in Astro excludes drafts automatically — every
`getCollection('blog')` call (post pages, index, tag pages, RSS, sitemap) would have to filter
them, and forgetting once ships a draft. The site therefore reads the collection through a single
helper, and nothing else calls `getCollection('blog')` directly. The helper also sorts, because
every consumer — post pages, index, tag pages, RSS, sitemap, the homepage's latest-three — wants
newest first:

```ts
// src/lib/posts.ts
import { getCollection } from 'astro:content';

export const getPublishedPosts = async () => {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true
  );
  return posts.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
};
```

Drafts remain visible in `astro dev` so they can be previewed. Note that a PR preview is a
production build and *does* drop drafts — the branch, not the flag, is the draft mechanism for
unpublished posts ([0005](0005-ci-cd.md)). `draft: true` is for deliberately merging an
unfinished post to `main`.

## Consequences

- The closed tag list is a forcing function: a post that fits no pillar is a post you probably
  should not be writing. This is deliberate, given that the stated #1 failure mode is spreading a
  small weekly budget across many topics.
- `canonicalUrl` lets you republish on dev.to / Medium / LinkedIn articles later without SEO
  self-harm — but the canonical version always lives on your domain.

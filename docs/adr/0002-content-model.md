# 0002: Content Model — Markdown in the Same Repo, Schema-Validated

**Status:** Proposed
**Date:** 2026-09-15

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
| `title` | string | yes | |
| `description` | string, 50–160 chars | yes | Used for `<meta>`, OG, RSS, and the index card. Enforce the length — it is your click-through rate. |
| `pubDate` | date | yes | |
| `updatedDate` | date | no | Render "updated on" when present; good-faith signal |
| `lang` | `'es' \| 'en'` | yes | See [0006](0006-language-strategy.md) |
| `tags` | string[], max 4 | yes | Constrain to a closed list mapped to the four pillars — AI-native delivery, platform & DX, delivery measurement, commerce & payments. An open tag vocabulary becomes a mess by post 15, and a closed one forces every post to declare which pillar it serves. |
| `draft` | boolean | no, default false | Excluded from production builds |
| `heroImage` | image | no | |
| `canonicalUrl` | url | no | For cross-posting, see Consequences |
| `discussionUrl` | url | no | Link to the LinkedIn discussion thread; see [0011](0011-no-comments.md) |
| `aliases` | string[] | no | Old paths that should 301 here — see [0008](0008-url-structure.md) |

`readingTime` is computed, never authored.

### Schema as code

`src/content.config.ts` — the whole argument for Astro ([0001](0001-static-site-generator.md)) in
25 lines:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
      canonicalUrl: z.string().url().optional(),
      discussionUrl: z.string().url().optional(),
      aliases: z.array(z.string()).optional(),
    }),
});

export const collections = { blog };
```

A post with a 30-character description now fails CI. In Next.js, that check is code you write and
maintain.

## Consequences

- The closed tag list is a forcing function: a post that fits no pillar is a post you probably
  should not be writing. This is deliberate, given that the stated #1 failure mode is spreading a
  small weekly budget across many topics.
- `canonicalUrl` lets you republish on dev.to / Medium / LinkedIn articles later without SEO
  self-harm — but the canonical version always lives on your domain.

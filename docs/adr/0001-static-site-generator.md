# 0001: Static Site Generator

**Status:** Accepted
**Date:** 2026-09-15 (accepted 2026-09-20)

Recommendation: Astro, with Next.js as a defensible second.

## Context

The original proposal was Next.js. It works: App Router with `output: 'export'` produces a fully
static site. The question is whether it is the *cheapest to own* for a markdown blog under
constraint N1 (see [0000](0000-context-and-constraints.md)).

## Options Considered

### Option A: Astro (static output)

| Dimension | Assessment |
|---|---|
| Complexity | Low — content collections are a first-class feature |
| Cost | Free |
| Maintenance burden | **Low** — frontmatter validation, RSS, sitemap, image optimization are built in or one official integration away |
| Team familiarity | Medium — new to the author, but ~a weekend; it is mostly HTML + a schema file |
| Fit to requirement set | **High** — Astro's design centre *is* content sites |

**Pros**

- `src/content.config.ts` defines a Zod schema for post frontmatter. A post with a missing
  `description` or a malformed `date` **fails the build**, not production. This is the single
  highest-value feature for a solo blog, and in Next.js you build it yourself.
- Ships ~zero JavaScript by default. N3 (performance as a credibility signal) is met without
  effort or a performance budget to police. (The site does end up with one third-party script —
  the analytics beacon in [0009](0009-analytics.md) — which that ADR accepts explicitly and
  justifies on the same N3 grounds.)
- `@astrojs/rss` and `@astrojs/sitemap` are official, ~10 lines each. Directly serves
  [0007](0007-newsletter.md), where RSS becomes load-bearing infrastructure rather than a nicety.
- `astro:assets` optimizes images at build time with no host involvement.
- Islands are available if one interactive React component is ever wanted, so choosing Astro
  does not close the React door.

**Cons**

- A framework the author does not currently know; small unknown-unknown risk.
- Smaller ecosystem than Next for anything unusual.
- If the site ever becomes an app rather than a publication, you migrate.

### Option B: Next.js App Router with `output: 'export'`

| Dimension | Assessment |
|---|---|
| Complexity | Medium — you fight the framework's server-first defaults |
| Cost | Free |
| Maintenance burden | **Medium** — you hand-roll what Astro gives you |
| Team familiarity | **High** — already known |
| Fit to requirement set | Medium |

**Pros**

- Zero learning curve; could ship in a weekend.
- Largest ecosystem, best AI-assistant support, most Stack Overflow coverage.
- If the site later grows a dynamic surface, Cloudflare's current recommended path for full
  Next.js on Workers gives an upgrade route.
- Arguably a marginally better signal on a CV that leads with platform work.

**Cons — all of these are real work you own forever**

- `output: 'export'` disables `next/image` optimization (needs `images: { unoptimized: true }` or
  a custom loader), route handlers, middleware, ISR and the dynamic request APIs. You are using
  ~40 % of the framework and paying its full conceptual weight.
- No frontmatter validation. You write the Zod schema and the loader yourself, or you ship a post
  with a broken date and find out from a reader.
- RSS and sitemap cannot be route handlers in an exported build — they become a build script you
  maintain.
- Markdown pipeline is assembled by hand: `gray-matter` + `remark`/`rehype` + `next-mdx-remote` or
  `@next/mdx`, with the version-skew maintenance that implies.
- `trailingSlash` and static-host path semantics are a recurring papercut.

### Option C: Hugo or Eleventy

Lowest maintenance of all, fastest builds, but the templating is a professional dead end for the
author and the styling ergonomics are worse. Rejected — not because it is a bad choice, but
because the marginal saving over Astro is small and the ceiling is lower.

## Trade-off Analysis

The decision reduces to one question: **spend the first ~6 hours learning a framework, or spend
~2 hours/quarter forever maintaining a markdown pipeline you built yourself?**

Under N1, the amortized answer favours Astro. The features you would hand-build in Next.js —
schema validation, RSS, sitemap, image optimization — are not optional for this site; they are
exactly the infrastructure a brand-asset blog needs, and they are the parts most likely to rot
silently while you are busy at work.

The counter-argument that deserves weight: **shipping beats optimizing.** There is no blog today,
a CV dated 2024, and a LinkedIn About that still says "frontend developer". A Next.js site live
next Sunday is worth more than a better-architected Astro site live in November. If choosing Astro
creates any real chance of not shipping this month, choose Next.js and stop reading this ADR.

## Decision

**Astro, static output.**

The scaffold in Appendix A was built and evaluated; it felt right, and the fallback in Appendix B
was not needed. The rest of the ADR set is unaffected, because every other decision is
framework-independent.

## Consequences

- Easier: adding a post, guaranteeing feed/sitemap correctness, hitting perfect Lighthouse scores,
  keeping the dependency tree small.
- Harder: anything genuinely app-like later; you would add an island or migrate.
- Revisit if: the site grows authenticated or dynamic surfaces.

## Appendix A — Astro scaffold

```
personal-site/
├── .github/workflows/
│   ├── deploy.yml
│   └── pr.yml
├── src/
│   ├── content.config.ts          # ← the schema; the reason to pick Astro (see 0002)
│   ├── content/blog/
│   │   ├── dora-sin-politica.md
│   │   └── ai-assisted-delivery.md
│   ├── lib/
│   │   └── posts.ts                   # getPublishedPosts(), see 0002
│   ├── integrations/
│   │   └── redirects.js               # injects the _redirects route, see 0008
│   ├── routes/
│   │   └── redirects.ts               # emits dist/_redirects from aliases, see 0008
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── PostCard.astro
│   │   └── Subscribe.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── 404.astro                # served by Workers not_found_handling, see 0004
│   │   ├── blog/index.astro
│   │   ├── blog/[...slug].astro
│   │   ├── tags/[tag].astro
│   │   └── rss.xml.ts               # see 0007
│   └── styles/global.css
├── scripts/
│   └── check-feed.mjs              # see 0005, 0007
├── public/
│   ├── robots.txt
│   └── og-default.png
├── astro.config.mjs
├── wrangler.jsonc                 # see 0004
└── package.json
```

`src/content.config.ts` is in [0002](0002-content-model.md) and `src/pages/rss.xml.ts` in
[0007](0007-newsletter.md); the shared Cloudflare and CI config is in [0004](0004-hosting.md) and
[0005](0005-ci-cd.md).

**`src/pages/blog/[...slug].astro`**

```astro
---
import { render } from 'astro:content';
import { getPublishedPosts } from '../../lib/posts';   // see 0002 — the only place drafts are filtered
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<PostLayout {...post.data}>
  <Content />
</PostLayout>
```

**`astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import redirects from './src/integrations/redirects.js';

export default defineConfig({
  site: 'https://rodrigoadones.dev',   // resolved in 0008
  trailingSlash: 'always',             // decided in 0008
  integrations: [sitemap(), redirects()],
  markdown: { shikiConfig: { theme: 'github-dark-dimmed' } },
});
```

**No MDX.** `@astrojs/mdx` was in the original sketch and is deliberately absent: the collection
loader in [0002](0002-content-model.md) globs `**/*.md` and would not pick up an `.mdx` file at
all, and [0007](0007-newsletter.md) renders `post.body` with `markdown-it` to build the email,
which cannot process MDX. An MDX post would be invisible twice over. Markdown only.

**Dependencies.** Runtime: `astro`, `@astrojs/rss`, `@astrojs/sitemap`, `markdown-it` and
`sanitize-html` (the feed, [0007](0007-newsletter.md)). Dev: `@astrojs/check` and `typescript`
(for `astro check`), `linkinator`, `wrangler`, plus `eslint` and `vitest`, which the repo already
has. Phase 2 adds `satori` and `resvg` for per-post OG images ([0010](0010-social-preview-images.md)).

Still a small tree, and that was the argument: every one of these is a leaf with no framework
surface of its own. Compare Appendix B, where the equivalent list is the *beginning* of a
markdown pipeline you own.

## Appendix B — Next.js scaffold (static export), the fallback

*Not taken.* Kept as the record of what the alternative would have cost to own.

```
personal-site/
├── .github/workflows/{deploy.yml,pr.yml}
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/page.tsx
│   └── blog/
│       ├── page.tsx
│       └── [slug]/page.tsx
├── content/blog/*.md
├── lib/
│   ├── posts.ts                   # ← you write and own this
│   └── schema.ts                  # ← and this
├── scripts/generate-feeds.mjs     # ← and this
├── public/{_redirects,robots.txt,og-default.png}
├── next.config.mjs
├── wrangler.jsonc
└── package.json
```

**`next.config.mjs`** — note how much of the framework is switched off:

```js
/** @type {import('next').NextConfig} */
export default {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },   // next/image optimization unavailable in export
};
```

**`lib/posts.ts`** — the loader and validator Astro gives you for free:

```ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

const PILLARS = ['ai-delivery', 'platform-dx', 'delivery-metrics', 'commerce-payments'] as const;

export const PostFrontmatter = z.object({
  title: z.string().max(80),
  description: z.string().min(50).max(160),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  lang: z.enum(['es', 'en']),
  tags: z.array(z.enum(PILLARS)).min(1).max(4),
  draft: z.boolean().default(false),
  canonicalUrl: z.string().url().optional(),
  discussionUrl: z.string().url().optional(),
  aliases: z.array(z.string()).optional(),
});

const DIR = path.join(process.cwd(), 'content/blog');

export function getAllPosts() {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const { data, content } = matter(fs.readFileSync(path.join(DIR, file), 'utf8'));
      const parsed = PostFrontmatter.safeParse(data);
      if (!parsed.success) {
        // This throw is what makes the build fail instead of shipping a broken post.
        throw new Error(`Invalid frontmatter in ${file}:\n${parsed.error.message}`);
      }
      return { slug, frontmatter: parsed.data, content };
    })
    .filter((p) => !(process.env.NODE_ENV === 'production' && p.frontmatter.draft))
    .sort((a, b) => +b.frontmatter.pubDate - +a.frontmatter.pubDate);
}
```

**`app/blog/[slug]/page.tsx`**

```tsx
import { getAllPosts } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const post = getAllPosts().find((p) => p.slug === params.slug);
  if (!post) return {};
  const { title, description, canonicalUrl } = post.frontmatter;
  return { title, description, alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined };
}

export default function Page({ params }) {
  const post = getAllPosts().find((p) => p.slug === params.slug);
  if (!post) notFound();
  return (
    <article lang={post.frontmatter.lang}>
      <h1>{post.frontmatter.title}</h1>
      <MDXRemote source={post.content} />
    </article>
  );
}
```

**`scripts/generate-feeds.mjs`** — because route handlers do not exist in an exported build, RSS
and sitemap become a post-build script you run and maintain. Wire it as
`"build": "next build && node scripts/generate-feeds.mjs"`, writing `out/rss.xml` and
`out/sitemap.xml`. This is the concrete shape of the extra ownership described in Option B.

**Dependencies:** `next`, `react`, `react-dom`, `gray-matter`, `next-mdx-remote`, `zod`,
`remark`/`rehype` plugins as needed, `wrangler`, plus the feed script.

## Sources

- [Next.js · Cloudflare Workers docs](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [OpenNext — Cloudflare adapter](https://opennext.js.org/cloudflare)

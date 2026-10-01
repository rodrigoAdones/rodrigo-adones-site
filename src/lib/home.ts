// Homepage entry helpers: pure functions over post metadata.
// Pillar ids match the closed tag list in docs/adr/0002-content-model.md.
// Not posts.ts — ADR 0002 reserves that name for getPublishedPosts().

export const PILLARS = [
  { id: 'ai-delivery', name: 'AI-native delivery', href: '/tags/ai-delivery/' },
  { id: 'platform-dx', name: 'Platform & DX', href: '/tags/platform-dx/' },
  { id: 'delivery-metrics', name: 'Delivery measurement', href: '/tags/delivery-metrics/' },
  { id: 'commerce-payments', name: 'Commerce & payments', href: '/tags/commerce-payments/' },
] as const;

export type PillarId = (typeof PILLARS)[number]['id'];

export const LANG_NAMES = { es: 'Spanish', en: 'English' } as const;

export interface PostSummary {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  lang: 'es' | 'en';
  tags: [PillarId, ...PillarId[]];
  readingMinutes: number;
}

export interface Entry extends PostSummary {
  pillar: PillarId;
  href: string;
  updated: boolean;
}

const byPubDateDesc = (a: PostSummary, b: PostSummary) =>
  b.pubDate.getTime() - a.pubDate.getTime();

/** Newest first. */
export function toEntries(posts: readonly PostSummary[]): Entry[] {
  return [...posts].sort(byPubDateDesc).map((post) => ({
    ...post,
    pillar: post.tags[0],
    href: `/blog/${post.slug}/`,
    updated: post.updatedDate != null,
  }));
}

export function latest(entries: readonly Entry[], n: number): Entry[] {
  return entries.slice(0, n);
}

export function formatEntryDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

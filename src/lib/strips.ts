// Homepage "flight progress strip" model: pure helpers over post metadata.
// Pillar ids match the closed tag list in docs/adr/0002-content-model.md.

export const PILLARS = [
  { id: 'ai-delivery', name: 'AI-native delivery', code: 'AID' },
  { id: 'platform-dx', name: 'Platform & DX', code: 'PDX' },
  { id: 'delivery-metrics', name: 'Delivery measurement', code: 'DLM' },
  { id: 'commerce-payments', name: 'Commerce & payments', code: 'C&P' },
] as const;

export type PillarId = (typeof PILLARS)[number]['id'];

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

export interface Strip extends PostSummary {
  sequence: number;
  status: 'filed' | 'updated';
  pillar: PillarId;
  href: string;
}

export interface Bay {
  pillar: (typeof PILLARS)[number] & { href: string };
  strips: Strip[];
}

const byPubDateAsc = (a: PostSummary, b: PostSummary) =>
  a.pubDate.getTime() - b.pubDate.getTime();

/** Newest first. Sequence numbers count from the oldest post, so they never change. */
export function toStrips(posts: readonly PostSummary[]): Strip[] {
  return [...posts]
    .sort(byPubDateAsc)
    .map((post, i) => ({
      ...post,
      sequence: i + 1,
      status: post.updatedDate ? ('updated' as const) : ('filed' as const),
      pillar: post.tags[0],
      href: `/blog/${post.slug}/`,
    }))
    .reverse();
}

export function latest(strips: readonly Strip[], n: number): Strip[] {
  return strips.slice(0, n);
}

export function byPillar(strips: readonly Strip[]): Bay[] {
  return PILLARS.map((pillar) => ({
    pillar: { ...pillar, href: `/tags/${pillar.id}/` },
    strips: strips.filter((s) => s.pillar === pillar.id),
  }));
}

export function padSequence(n: number): string {
  return String(n).padStart(3, '0');
}

export function formatStripDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatZulu(date: Date): string {
  const iso = date.toISOString();
  return `${iso.slice(0, 10)} ${iso.slice(11, 13)}${iso.slice(14, 16)}Z`;
}

import { describe, expect, it } from 'vitest';
import {
  PILLARS,
  byPillar,
  formatStripDate,
  formatZulu,
  latest,
  padSequence,
  toStrips,
  type PostSummary,
} from './strips';

const post = (overrides: Partial<PostSummary> & Pick<PostSummary, 'slug'>): PostSummary => ({
  title: `Title ${overrides.slug}`,
  description: 'A description long enough to satisfy the schema minimum of fifty chars.',
  pubDate: new Date('2026-01-01T00:00:00Z'),
  lang: 'en',
  tags: ['ai-delivery'],
  readingMinutes: 5,
  ...overrides,
});

const posts: PostSummary[] = [
  post({ slug: 'middle', pubDate: new Date('2026-05-10T00:00:00Z'), tags: ['platform-dx'] }),
  post({ slug: 'oldest', pubDate: new Date('2026-02-01T00:00:00Z') }),
  post({
    slug: 'newest',
    pubDate: new Date('2026-09-01T00:00:00Z'),
    updatedDate: new Date('2026-09-10T00:00:00Z'),
    tags: ['delivery-metrics', 'ai-delivery'],
  }),
];

describe('toStrips', () => {
  it('numbers strips permanently by publication order, oldest first', () => {
    const strips = toStrips(posts);
    const seq = Object.fromEntries(strips.map((s) => [s.slug, s.sequence]));
    expect(seq).toEqual({ oldest: 1, middle: 2, newest: 3 });
  });

  it('returns strips newest first', () => {
    expect(toStrips(posts).map((s) => s.slug)).toEqual(['newest', 'middle', 'oldest']);
  });

  it('marks a strip updated only when it has an updatedDate', () => {
    const status = Object.fromEntries(toStrips(posts).map((s) => [s.slug, s.status]));
    expect(status).toEqual({ newest: 'updated', middle: 'filed', oldest: 'filed' });
  });

  it('racks each strip in the bay of its first tag', () => {
    const newest = toStrips(posts).find((s) => s.slug === 'newest');
    expect(newest?.pillar).toBe('delivery-metrics');
  });

  it('links each strip to its immutable post URL with a trailing slash', () => {
    expect(toStrips(posts)[0].href).toBe('/blog/newest/');
  });

  it('does not mutate the input order', () => {
    const input = [...posts];
    toStrips(input);
    expect(input.map((p) => p.slug)).toEqual(['middle', 'oldest', 'newest']);
  });
});

describe('latest', () => {
  it('takes the n newest strips', () => {
    expect(latest(toStrips(posts), 2).map((s) => s.slug)).toEqual(['newest', 'middle']);
  });

  it('returns fewer when fewer exist', () => {
    expect(latest(toStrips(posts), 10)).toHaveLength(3);
  });
});

describe('byPillar', () => {
  it('returns every pillar in canonical order, empty bays included', () => {
    const bays = byPillar(toStrips(posts));
    expect(bays.map((b) => b.pillar.id)).toEqual(PILLARS.map((p) => p.id));
    const counts = Object.fromEntries(bays.map((b) => [b.pillar.id, b.strips.length]));
    expect(counts).toEqual({
      'ai-delivery': 1,
      'platform-dx': 1,
      'delivery-metrics': 1,
      'commerce-payments': 0,
    });
  });

  it('points each bay at its pillar-filtered index', () => {
    expect(byPillar([])[0].pillar.href).toBe('/tags/ai-delivery/');
  });
});

describe('formatting', () => {
  it('pads sequence numbers to three digits', () => {
    expect(padSequence(7)).toBe('007');
    expect(padSequence(1234)).toBe('1234');
  });

  it('formats strip dates as ISO calendar dates in UTC', () => {
    expect(formatStripDate(new Date('2026-09-01T23:30:00-03:00'))).toBe('2026-09-02');
  });

  it('formats the board time in UTC with a Zulu suffix', () => {
    expect(formatZulu(new Date('2026-09-24T14:05:59Z'))).toBe('2026-09-24 1405Z');
  });
});

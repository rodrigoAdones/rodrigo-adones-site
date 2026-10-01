import { describe, expect, it } from 'vitest';
import {
  LANG_NAMES,
  PILLARS,
  formatEntryDate,
  formatShortDate,
  latest,
  toEntries,
  type PostSummary,
} from './home';

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

describe('PILLARS', () => {
  it('lists every pillar with a tag-index href', () => {
    expect(PILLARS.map((p) => ({ id: p.id, href: p.href }))).toEqual([
      { id: 'ai-delivery', href: '/tags/ai-delivery/' },
      { id: 'platform-dx', href: '/tags/platform-dx/' },
      { id: 'delivery-metrics', href: '/tags/delivery-metrics/' },
      { id: 'commerce-payments', href: '/tags/commerce-payments/' },
    ]);
  });
});

describe('toEntries', () => {
  it('returns entries newest first', () => {
    expect(toEntries(posts).map((e) => e.slug)).toEqual(['newest', 'middle', 'oldest']);
  });

  it('sets pillar from tags[0]', () => {
    const newest = toEntries(posts).find((e) => e.slug === 'newest');
    expect(newest?.pillar).toBe('delivery-metrics');
  });

  it('links each entry to its post URL with a trailing slash', () => {
    expect(toEntries(posts)[0].href).toBe('/blog/newest/');
  });

  it('marks updated only when updatedDate exists', () => {
    const flags = Object.fromEntries(toEntries(posts).map((e) => [e.slug, e.updated]));
    expect(flags).toEqual({ newest: true, middle: false, oldest: false });
  });

  it('does not mutate the input order', () => {
    const input = [...posts];
    toEntries(input);
    expect(input.map((p) => p.slug)).toEqual(['middle', 'oldest', 'newest']);
  });
});

describe('latest', () => {
  it('takes the n newest entries', () => {
    expect(latest(toEntries(posts), 2).map((e) => e.slug)).toEqual(['newest', 'middle']);
  });

  it('returns fewer when fewer exist', () => {
    expect(latest(toEntries(posts), 10)).toHaveLength(3);
  });
});

describe('formatting', () => {
  it('formats entry dates as Sep 16, 2026 in UTC regardless of machine timezone', () => {
    expect(formatEntryDate(new Date('2026-09-16T00:00:00Z'))).toBe('Sep 16, 2026');
    expect(formatEntryDate(new Date('2026-09-16T23:30:00-03:00'))).toBe('Sep 17, 2026');
  });

  it('formats short dates as Sep 21 in UTC', () => {
    expect(formatShortDate(new Date('2026-09-21T00:00:00Z'))).toBe('Sep 21');
  });
});

describe('LANG_NAMES', () => {
  it('maps language codes to accessible names', () => {
    expect(LANG_NAMES).toEqual({ es: 'Spanish', en: 'English' });
  });
});

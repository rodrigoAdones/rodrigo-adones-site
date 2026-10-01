import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import SiteHeader from './components/SiteHeader.astro';
import Intro from './components/Intro.astro';
import LatestArticles from './components/LatestArticles.astro';
import ArticleEntry from './components/ArticleEntry.astro';
import Subscribe from './components/Subscribe.astro';
import Footer from './components/Footer.astro';
import { LANG_NAMES, PILLARS, latest, toEntries, type Entry } from './lib/home';
import { samplePosts } from './data/sample-posts';

describe('homepage render', () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;
  let header: string;
  let intro: string;
  let latestHtml: string;
  let subscribe: string;
  let footer: string;
  let entries: Entry[];

  beforeAll(async () => {
    container = await AstroContainer.create();
    entries = latest(toEntries(samplePosts), 3);
    header = await container.renderToString(SiteHeader, { props: { current: 'home' } });
    intro = await container.renderToString(Intro);
    latestHtml = await container.renderToString(LatestArticles, {
      props: { entries, linked: false },
    });
    subscribe = await container.renderToString(Subscribe);
    footer = await container.renderToString(Footer);
  });

  it('renders exactly one h1 in the intro and section h2s', () => {
    expect(intro.match(/<h1\b/g)).toHaveLength(1);
    expect(latestHtml).toContain('>Latest articles<');
    expect(subscribe).toContain('>Get new articles by email<');
    expect(latestHtml.match(/<h3\b/g)?.length).toBe(entries.length);
  });

  it('nav has exactly About and Blog links, no aria-current on homepage', () => {
    expect(header).toMatch(/<nav[^>]*\slang="en"/);
    const navHtml = header.match(/<nav[\s\S]*?<\/nav>/)?.[0] ?? '';
    const navLinks = [...navHtml.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    expect(navLinks).toEqual(['/about/', '/blog/']);
    expect(header).not.toContain('aria-current');
  });

  it('intro lists four pillar links in PILLARS order', () => {
    const hrefs = [...intro.matchAll(/href="(\/tags\/[^"]+)"/g)].map((m) => m[1]);
    expect(hrefs).toEqual(PILLARS.map((p) => p.href));
  });

  it('shows the visible [Placeholder] marker on the thesis', () => {
    expect(intro).toContain('[Placeholder]');
  });

  it('renders at most 3 entries newest first with lang and pillar links', async () => {
    expect(entries).toHaveLength(3);
    expect(entries.map((e) => e.slug)).toEqual([
      'dora-metrics-sin-politica',
      'plataforma-interna-producto',
      'agent-written-diffs-review-queue',
    ]);

    for (const entry of entries) {
      const html = await container.renderToString(ArticleEntry, {
        props: { entry, linked: false },
      });
      expect(html).toMatch(new RegExp(`lang="${entry.lang}"`));
      expect(html).toContain(LANG_NAMES[entry.lang]);
      expect(html).toContain(`href="/tags/${entry.pillar}/"`);
      if (entry.updated) {
        expect(html).toMatch(/Updated/);
      } else {
        expect(html).not.toMatch(/Updated/);
      }
    }
  });

  it('links View all articles to /blog/', () => {
    expect(latestHtml).toMatch(/href="\/blog\/"[^>]*>[\s\S]*View all articles/);
  });

  it('newsletter input is labelled, typed, and disabled with RSS copy', () => {
    expect(subscribe).toMatch(/<label[^>]*for="subscribe-email"/);
    expect(subscribe).toMatch(/type="email"/);
    expect(subscribe).toMatch(/autocomplete="email"/);
    expect(subscribe).toMatch(/<fieldset[^>]*\sdisabled/);
    expect(subscribe).toContain('The newsletter opens with the first article');
    expect(subscribe).toMatch(/href="\/rss\.xml"/);
  });

  it('footer has LinkedIn, GitHub, Source (new tab) and RSS (same tab)', () => {
    expect(footer).toMatch(/<footer[^>]*\slang="en"/);
    expect(footer).toMatch(
      /href="https:\/\/linkedin\.com\/in\/rodrigo-adones-vicencio"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/,
    );
    expect(footer).toMatch(
      /href="https:\/\/github\.com\/rodrigoAdones"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/,
    );
    expect(footer).toMatch(
      /href="https:\/\/github\.com\/rodrigoAdones\/personal-site"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/,
    );
    expect(footer).toMatch(/href="\/rss\.xml"(?![^>]*target="_blank")/);
  });

  it('shows the empty-state sentence when there are zero posts', async () => {
    const empty = await container.renderToString(LatestArticles, {
      props: { entries: [], linked: false },
    });
    expect(empty).toContain('No articles published yet.');
    expect(empty).not.toMatch(/<h3\b/);
    expect(empty).not.toContain('View all articles');
  });
});

describe('skip link via BaseLayout', () => {
  it('is the first focusable element and targets #main', async () => {
    const { experimental_AstroContainer: AstroContainer } = await import('astro/container');
    const BaseLayout = (await import('./layouts/BaseLayout.astro')).default;
    const container = await AstroContainer.create();
    const html = await container.renderToString(BaseLayout, {
      props: { title: 'Rodrigo Adones', description: 'Test' },
      slots: { default: '<main id="main">content</main>' },
    });
    const body = html.match(/<body[\s\S]*<\/body>/)?.[0] ?? html;
    const firstAnchorHref = body.match(/<a\b[^>]*href="([^"]+)"/)?.[1];
    expect(firstAnchorHref).toBe('#main');
    expect(body).toMatch(/id="main"/);
    expect(html).not.toMatch(/fonts\.googleapis|fonts\.gstatic|typekit|use\.typekit/);
    expect(html).not.toMatch(/B612/);
    expect(body).not.toMatch(/<script[\s>]/i);
  });
});

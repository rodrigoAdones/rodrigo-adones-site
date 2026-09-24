// SAMPLE DATA — placeholder posts that validate the homepage design (specs/0001-homepage.md).
// Shaped like the ADR 0002 frontmatter; replaced by getPublishedPosts() in the Articles spec.
// Titles and descriptions are illustrative, not published writing.
import type { PostSummary } from '../lib/strips';

export const IS_SAMPLE_DATA = true;

export const samplePosts: PostSummary[] = [
  {
    slug: 'agent-written-diffs-review-queue',
    title: 'When half the diffs are written by agents, the review queue is the bottleneck',
    description:
      'Sample post. What changes in a delivery pipeline when code generation stops being the slow step and human review becomes the constraint.',
    pubDate: new Date('2026-07-14T00:00:00Z'),
    lang: 'en',
    tags: ['ai-delivery', 'delivery-metrics'],
    readingMinutes: 8,
  },
  {
    slug: 'plataforma-interna-producto',
    title: 'La plataforma interna es un producto, aunque nadie la haya pedido',
    description:
      'Post de ejemplo. Cómo tratar una plataforma interna como producto: usuarios, adopción y el costo de no medirla.',
    pubDate: new Date('2026-08-19T00:00:00Z'),
    lang: 'es',
    tags: ['platform-dx'],
    readingMinutes: 6,
  },
  {
    slug: 'dora-metrics-sin-politica',
    title: 'Métricas DORA sin política',
    description:
      'Post de ejemplo. Medir frecuencia de despliegue y lead time sin convertir las métricas en un ranking de equipos.',
    pubDate: new Date('2026-09-16T00:00:00Z'),
    updatedDate: new Date('2026-09-21T00:00:00Z'),
    lang: 'es',
    tags: ['delivery-metrics'],
    readingMinutes: 7,
  },
];

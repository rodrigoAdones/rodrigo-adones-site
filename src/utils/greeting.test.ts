import { describe, expect, it } from 'vitest';
import { greet } from './greeting';

describe('greet', () => {
  it('returns a greeting containing the given name', () => {
    expect(greet('Astro')).toBe('Hello, Astro!');
  });
});

// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Every absolute URL on the site derives from this — see docs/adr/0008-url-structure.md
  site: 'https://rodrigoadones.dev',
  trailingSlash: 'always',
});

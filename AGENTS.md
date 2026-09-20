## Spec-Driven Development

Before starting non-trivial work, check `specs/` for a relevant spec and follow it if one exists.

For a new non-trivial feature (a new page, real design decisions, anything more than a config tweak
or typo fix), draft a spec first using `specs/TEMPLATE.md` before writing code. Trivial changes
(config tweaks, dependency bumps, typo fixes, copy edits) can skip this.

Mark a spec's status `Done` once implemented — leave it in place as a record. See `specs/README.md`
for the full convention (numbering, status lifecycle, when to escalate a spec to its own folder).

## Development

This repo follows TDD: for any new behavior, write a failing test first, then write the
implementation code to make it pass. Don't consider work done until the tests pass.

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

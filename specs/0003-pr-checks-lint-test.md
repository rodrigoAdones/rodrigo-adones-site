# 0003: PR Checks — Lint and Test on GitHub Actions

**Status:** Done
**Date:** 2026-10-01

## Context

ADR 0005 (`docs/adr/0005-ci-cd.md`) decides that GitHub Actions owns the build and that a post
cannot reach production without passing checks, because posts will be published tired, from a
phone (ADR 0000, N2). Today the repo has no CI at all: there is no `.github/` directory, and
`pnpm lint` / `pnpm test` only run when someone remembers to run them locally.

This spec delivers the first slice of ADR 0005's PR pipeline: the two cheap gates that need no
`dist/` and no Cloudflare credentials. Later specs extend the same workflow file with
`astro check`, build, link/feed checks, and the preview upload.

## Goals

- Every pull request automatically runs `pnpm lint` and `pnpm test` on GitHub Actions.
- A lint error or a failing test shows up as a failed check on the PR, and the two are reported
  separately so it's obvious at a glance which one broke.
- The workflow is the file ADR 0005 names, `.github/workflows/pr.yml`, structured so later steps
  (astro check, build, link/feed checks, preview) can be added without rewriting it.
- Each job has a stable name (`Lint`, `Tests`) so both can be marked as required status checks
  on `main`.

## Non-Goals

- Running on `push` to `main`. The workflow triggers on pull requests only; post-merge gating
  belongs to `deploy.yml`, which ADR 0005 has repeat these gates.
- `astro check`, `astro build`, linkinator, the feed check, and `wrangler versions upload` /
  preview comments — later slices of ADR 0005's pipeline.
- `deploy.yml` and anything needing `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`.
- Configuring branch protection in code. Marking the checks as required is a manual step in
  GitHub settings (see Acceptance Criteria).
- `.github/dependabot.yml` (mentioned in ADR 0005, but a separate concern).
- New dependencies. The workflow uses only the existing `lint` and `test` scripts in
  `package.json` (dependency freeze, ADR 0000).
- Caching `node_modules/` or `.astro/` — forbidden by ADR 0003; only the pnpm store is cached.
- Coverage thresholds, Lighthouse, a Node/OS test matrix.

## Approach

**New file:** `.github/workflows/pr.yml`, following ADR 0005's reference config but split into
two parallel jobs so each gate reports as its own check:

```yaml
name: PR
on:
  pull_request:
permissions:
  contents: read                  # least privilege; pull-requests: write arrives with the preview slice
concurrency:
  group: pr-${{ github.event.pull_request.number }}
  cancel-in-progress: true        # a new push to the PR supersedes the running checks
jobs:
  lint:
    name: Lint                    # stable: required-status-check name
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v4          # version from package.json "packageManager" (pnpm@11.21.0)
      - uses: actions/setup-node@v5
        with: { node-version: 22, cache: pnpm }   # satisfies engines ">=22.12.0"
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
  tests:
    name: Tests                   # stable: required-status-check name
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v5
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
```

Notes for the implementer:

- `pnpm lint` = `eslint .` with `eslint.config.mjs` (ignores `dist/`, `.astro/`, `node_modules/`).
- `pnpm test` = `vitest run` with `vitest.config.ts` (`src/**/*.{test,spec}.{js,ts}`, node env).
  Current suites: `src/homepage.render.test.ts`, `src/utils/greeting.test.ts`,
  `src/lib/home.test.ts`. Both commands pass locally as of 2026-10-01 (22 tests).
- `pnpm-workspace.yaml` carries pnpm 11 settings (`allowBuilds`, `minimumReleaseAgeExclude`)
  that `--frozen-lockfile` must respect — don't pass flags that override them.
- The two jobs run in parallel and each does its own install; with the pnpm store cached this
  costs seconds, and the repo is public so Actions minutes are free (ADR 0000).
- The duplicated setup steps are deliberate at two jobs. Extract a composite action only if a
  third job (e.g. build) makes the repetition a real maintenance cost — not in this spec.
- Later slices add jobs or steps to this same file rather than new workflow files, and must not
  rename `Lint` or `Tests`, since that would break the required-check settings.

**TDD note:** the workflow is configuration, not application behavior, so there is no unit test to
write first. It is verified by the PR-based acceptance criteria below — a deliberately broken
commit must turn the corresponding check red.

**No new ADR:** this implements ADR 0005 as decided; splitting gates into separate jobs is a
presentation detail, not a structural choice.

## Acceptance Criteria

- [ ] `.github/workflows/pr.yml` exists and matches the Approach (PR-only trigger,
      `contents: read`, per-PR concurrency, jobs named `Lint` and `Tests`).
- [ ] Opening a PR against `main` triggers the workflow, and both `Lint` and `Tests` pass on the
      current codebase.
- [ ] A commit introducing an ESLint error (e.g. an unused variable in a `.ts` file) makes `Lint`
      fail while `Tests` still passes. Revert afterwards.
- [ ] A commit introducing a failing assertion in an existing test makes `Tests` fail while `Lint`
      still passes. Revert afterwards.
- [ ] Pushing twice in quick succession to the same PR cancels the first run.
- [ ] The workflow log shows the pnpm store restored from cache on a second run, and there is no
      cache step for `node_modules/` or `.astro/`.
- [ ] Merging to `main` does **not** trigger this workflow.
- [ ] After the first green run, `Lint` and `Tests` are added as required status checks on `main`
      in GitHub repo settings (manual, done by the repo owner).

## Open Questions

- None. Resolved during drafting: PR-only trigger (no `push` to `main`); repo is public, so
  Actions minutes are not a constraint.

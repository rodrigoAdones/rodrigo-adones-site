# Specs

This directory holds specs for non-trivial features and changes on this site. A spec is written
*before* the code, so both you and a future Claude Code session have durable context to work from
instead of re-deriving intent from scratch each time.

## When to write a spec

Write one before starting a new page, feature, or any change with real design decisions behind it.
Skip it for trivial changes: config tweaks, dependency bumps, typo fixes, copy edits.

## Numbering

Specs are numbered sequentially: `0001-<kebab-slug>.md`, `0002-<kebab-slug>.md`, etc.
`0000-overview.md` is the exception — it's the site-level vision/constraints doc that individual
feature specs can reference.

## Flat file vs. folder

Default to a single flat file per spec (`specs/0001-<kebab-slug>.md`) — this covers most changes on
a personal site. If a feature is large enough to need a separate design doc or task breakdown,
escalate it to a folder with the same number: `specs/0001-<kebab-slug>/spec.md`, plus optional
`design.md` and/or `tasks.md` alongside it.

## Status lifecycle

Each spec has a `**Status:**` line: `Draft` → `Approved` → `Done`. Update it in place as the spec
progresses — there's no archiving step; finished specs stay put as a record of what was built and why.

## Template

Copy `TEMPLATE.md` to start a new spec.

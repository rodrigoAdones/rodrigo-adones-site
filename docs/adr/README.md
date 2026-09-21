# Architecture Decision Records

This directory holds ADRs: short records of technical decisions made on this site where real
alternatives existed. An ADR captures the *why* behind a choice so that you and a future Claude
Code session don't re-litigate it from scratch.

ADRs are distinct from `specs/`: a spec describes *what* to build (a page, a feature); an ADR
records *why* a particular technical approach was chosen over its alternatives.

## When to write an ADR

Write one when you choose between genuine alternatives for something structural: tooling, framework
configuration, data modeling, content architecture, hosting/deployment, integrations. Skip it for
routine feature work (that's a spec), and for choices with no real alternative.

## Numbering

ADRs are numbered sequentially as flat files: `0001-<kebab-slug>.md`, `0002-<kebab-slug>.md`, etc.
`0000-context-and-constraints.md` is the exception — it's the shared requirements, constraints,
cost and risk context that individual ADRs reference (F1–F6, N1–N6) instead of restating.

## Status lifecycle

Each ADR has a `**Status:**` line: `Proposed` → `Accepted`. A decision can later become
`Deprecated` or `Superseded by NNNN`.

Unlike specs, an accepted ADR is never edited to reflect a changed decision. Instead, write a new
ADR with the new decision and mark the old one `Superseded by NNNN`. The old record stays in place
as history.

## Template

Copy `TEMPLATE.md` to start a new ADR.

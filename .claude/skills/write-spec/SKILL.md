---
name: write-spec
description: Use when the user wants to draft a new spec for a non-trivial feature, page, or change before writing code — e.g. "write a spec for X", "draft a spec", "let's spec this out", "/write-spec". Interviews the user section-by-section to fill out specs/TEMPLATE.md, grounds the Approach section in real files/patterns from this codebase, shows the full draft for approval, then writes specs/NNNN-<slug>.md. Skip for trivial changes (config tweaks, dependency bumps, typo fixes, copy edits) per CLAUDE.md.
---

# Write Spec

You are interviewing the user to produce a new spec under `specs/`, following the convention in
`specs/README.md` and the structure in `specs/TEMPLATE.md`. The reader of the finished spec is
**whichever agent implements the feature later** — possibly in a fresh session with no memory of
this conversation. Optimize every answer you record for that reader: concrete file paths and
patterns beat vague prose, and checkable acceptance criteria beat subjective ones.

## 0. Load context before asking anything

Read these first, silently, so you don't re-ask what's already answered:

- `specs/README.md` — numbering scheme, status lifecycle, flat-file vs. folder rule.
- `specs/0000-overview.md` — site purpose, audience, tech constraints, design principles. Don't
  make the user restate site-level facts already recorded there; reference them instead.
- List existing `specs/*.md` files to see what's already been built or planned, so you can flag
  overlap or point to a prior spec as precedent if relevant.

Determine the next spec number: glob `specs/[0-9][0-9][0-9][0-9]-*.md`, take the highest number,
add 1, zero-pad to 4 digits. Do not ask the user for this number.

## 1. Interview section by section

Follow `specs/TEMPLATE.md`'s structure: Title, Context, Goals, Non-Goals, Approach, Acceptance
Criteria, Open Questions. Ask about one section at a time in conversation — don't dump the whole
template as a form. Keep it a dialogue: react to what they tell you, and skip questions whose
answers are already implied by earlier answers or by `0000-overview.md`.

- Use plain conversational questions for open-ended sections (Context, Goals, Non-Goals).
- Use `AskUserQuestion` when a question has a small set of concrete options — e.g. flat file vs.
  folder escalation (per `specs/README.md`), or choosing between two existing components/patterns
  to extend.
- If the user's answer is vague on something the implementing agent will need (e.g. "make it look
  nice" for Acceptance Criteria), push back once and ask for something checkable.

## 2. Ground the Approach section in the real codebase

Before or while discussing Approach, do light exploration of this repo — Glob/Grep/Read for
relevant existing pages, components, layouts, or content collections (e.g. how other Astro pages
or collections here are structured), or launch an `Explore` subagent if the relevant area is
unclear. Propose concrete files and patterns to reuse or extend, and confirm them with the user
rather than asserting them unilaterally. This is what makes the written Approach section usable
without further investigation: name real files (`src/...`), not generic descriptions.

## 3. Draft, then show — don't write yet

Compose the full spec markdown using `specs/TEMPLATE.md`'s exact section structure, with:

- `**Status:** Draft`
- `**Date:** <today's date>`

Show the complete draft in chat and ask the user to review it. Apply any requested edits and
re-show if they're substantial.

## 4. Confirm the slug, then write

Confirm the kebab-case slug (derived from the feature title) with the user before writing. Then
write the file via the `Write` tool to `specs/NNNN-<slug>.md` (flat file by default; use the
`specs/NNNN-<slug>/spec.md` folder form only if step 1's flat-vs-folder question decided the
feature needs a separate `design.md`/`tasks.md`).

## 5. Close out

Tell the user the spec's path, and remind them the status lifecycle is `Draft` → `Approved` →
`Done`, updated in place (no archiving step) per `specs/README.md`. This skill only ever writes
`Draft` — flipping it to `Approved`/`Done` is a separate, later step the user does themselves.

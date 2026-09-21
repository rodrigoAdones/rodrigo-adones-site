# 0011: No Comments

**Status:** Accepted
**Date:** 2026-09-15

## Context

F4 rules out a comments section. This ADR records the rationale so it is not re-litigated, and
what replaces comments.

## Options Considered

- **Third-party comments** (Disqus, Giscus, utterances) — on a low-traffic personal blog these
  are a spam-moderation obligation, a third-party script, a privacy surface and a consent-banner
  risk — in exchange for discussion that, at this traffic level, would happen on LinkedIn anyway.
  Rejected.
- **No comments; link each post to its LinkedIn discussion thread.**

## Decision

No comments. No Disqus, no Giscus, no utterances.

Instead, end each post with a link to its LinkedIn discussion thread. This pushes engagement to
the channel being deliberately built, where the audience already is, and where the algorithmic
benefit accrues to the author. Implementation: an optional `discussionUrl` frontmatter field
([0002](0002-content-model.md)), added when the LinkedIn post goes up.

## Consequences

- No moderation, no third-party script, no consent-banner risk ([0009](0009-analytics.md) keeps
  the same property).
- Discussion lives on LinkedIn, not on the site; adding the `discussionUrl` is a manual step
  after each LinkedIn post.

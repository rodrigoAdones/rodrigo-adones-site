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

**When `discussionUrl` is absent, render nothing.** Every post lacks it at publication, and some
never get shared at all. A generic "discuss on LinkedIn" pointing at the profile is a dead-end
click, and it would appear on posts with no thread behind it.

**Adding `discussionUrl` does not bump `updatedDate`.** It is not a content edit, and
[0002](0002-content-model.md) treats `updatedDate` as a good-faith signal to readers that the
post itself changed. The edit is also safe for the newsletter: [0007](0007-newsletter.md)'s guid
derives from the post link, which is unchanged, so no one is emailed twice.

## Consequences

- No moderation, no third-party script, no consent-banner risk ([0009](0009-analytics.md) keeps
  the same property).
- Discussion lives on LinkedIn, not on the site; adding the `discussionUrl` is a manual step
  after each LinkedIn post.
- **Email subscribers never see the discussion link.** The order of events is publish → the post
  goes out by RSS-to-email → *then* it is shared on LinkedIn and `discussionUrl` is added. Because
  [0007](0007-newsletter.md) sends the full article, the emailed copy is a snapshot taken before
  the link exists, so the most engaged readers get the version without it. Not fixable without
  delaying publication, and not worth that. The newsletter's own reply channel partly covers it:
  a reply reaches the author directly, which is private discussion that F4 does not prohibit and
  that costs nothing to run.
- `discussionUrl` is the one link class on the site that nothing verifies. It points at a vendor
  URL that can rot — a deleted post, a changed account — and [0005](0005-ci-cd.md)'s link checker
  runs with `--skip "^https?://"`, deliberately ignoring external links. That is the right call
  for CI; the consequence is simply that this link is unchecked forever.

# Homepage design proposals

Six directions for Rodrigo Adones's portfolio homepage. These are design proposals, not changes to the published page. The site name links home; the menu contains exactly **About** and **Blog**. All interface and published article content is English.

## Visual mockups

These are static concept images. Article titles, dates, summaries, and newsletter promises in the images are illustrative, not claims about published work or an active subscription service. The specifications below govern implementation where image-generation details differ.

| Proposal | Mockup |
| --- | --- |
| 1. Quiet editorial | [View image](homepage-mockups/01-quiet-editorial.png) |
| 2. Architect's brief | [View image](homepage-mockups/02-architects-brief.png) |
| 3. Marginal notes | [View image](homepage-mockups/03-marginal-notes.png) |
| 4. Article index first | [View image](homepage-mockups/04-article-index-first.png) |
| 5. Two-panel introduction | [View image](homepage-mockups/05-two-panel-introduction.png) |
| 6. Flight board, simplified | [View image](homepage-mockups/06-flight-board-simplified-v2.png) |

## Shared page content

1. A concise introduction identifies Rodrigo as a software architect and engineering manager, then states his focus on engineering delivery. The final wording should come from approved About copy rather than invented credentials.
2. **Latest articles** displays the three most recently published posts, newest first. Each entry shows its real title, publication date, and a short description; its title links to the article. If fewer than three posts exist, show only published posts. A single **View all articles** link goes to `/blog/`.
3. **Newsletter** explains that subscribers receive new articles by email. The form has a visible **Email address** label and a **Subscribe** button. Until a provider endpoint is configured, show an honest availability message instead of an active form.
4. A small footer contains the existing LinkedIn and GitHub links. These are footer links, not menu sections.

The layouts use real text, rules, and spacing for visual interest. They need no photography, illustrations, carousel, animation, route transition, moving navigation, or client-side JavaScript. All page changes happen through normal links.

## 1. Quiet editorial

**Idea:** A calm reading page that makes the writing the primary proof of expertise.

```text
Rodrigo Adones                                      About  Blog
──────────────────────────────────────────────────────────────

Software architect & engineering manager
I help teams make complex systems easier to build and deliver.

Latest articles
01  Date   Article title and brief summary
02  Date   Article title and brief summary
03  Date   Article title and brief summary
                                             View all articles →

Get new articles by email
Email address  [____________________] [Subscribe]
──────────────────────────────────────────────────────────────
LinkedIn                                                GitHub
```

- **Layout:** One centered column, 44–52rem wide. The intro has generous top space; articles are separated by thin horizontal rules.
- **Type and color:** A restrained serif for the introduction and article titles; a plain sans serif for supporting text. Warm white `#FAF9F6`, charcoal `#202522`, muted forest `#315A49` for links.
- **Small screens:** The same order in one column; the email field and button stack.
- **Best fit:** A writing-led professional identity with minimal maintenance.

## 2. Architect's brief

**Idea:** Present a clear professional thesis before the writing, as a concise project brief.

```text
Rodrigo Adones                                      About  Blog
──────────────────────────────────────────────────────────────
SOFTWARE ARCHITECT / ENGINEERING MANAGER

Building systems and teams that deliver reliably.
Architecture · Platform · Delivery

RECENT WRITING
┌──────────────────────┬──────────────────────┬─────────────────┐
│ Article 1            │ Article 2            │ Article 3       │
│ Date · Summary       │ Date · Summary       │ Date · Summary  │
└──────────────────────┴──────────────────────┴─────────────────┘
View all articles

NEWSLETTER
One useful article when a new one is published.
Email address  [____________________] [Subscribe]
```

- **Layout:** Strong introductory statement, then a compact three-column article grid. No badges, decorative icons, or statistics.
- **Type and color:** Sans serif throughout, with a slightly heavier display weight. White `#FFFFFF`, ink `#17212B`, slate `#506171`, blue `#185A78` for links.
- **Small screens:** Cards become a single vertical list without changing their reading order.
- **Best fit:** Hiring managers who skim for role, point of view, and recent work.

## 3. Marginal notes

**Idea:** A personal essay feel, with a narrow context column and a generous reading column.

```text
Rodrigo Adones                                      About  Blog
──────────────────────────────────────────────────────────────
                                  Software architect &
ABOUT MY WORK                     engineering manager.
Architecture, engineering         A short, concrete statement
leadership, delivery.             of the work and perspective.

LATEST                           01  Article title
                                 Date · Summary
                                 02  Article title
                                 Date · Summary
                                 03  Article title
                                 Date · Summary

                                 View all articles

NEWSLETTER                       Get new writing by email
                                 Email address [______] [Subscribe]
```

- **Layout:** A 25/75 split. The left column contains short section labels and context, not an extra navigation menu.
- **Type and color:** Humanist sans serif with modest size contrast. Soft cream `#F5F3ED`, near black `#232622`, olive `#43583E` for links and rules.
- **Small screens:** Labels sit immediately above their section content; no side rail remains.
- **Best fit:** A more personal presentation that still reads quickly.

## 4. Article index first

**Idea:** Put evidence of active publishing immediately after a one-line introduction.

```text
Rodrigo Adones                                      About  Blog
──────────────────────────────────────────────────────────────
Software architect & engineering manager writing about
architecture, engineering teams, and delivery.

Latest articles                                      View all →
──────────────────────────────────────────────────────────────
Sep 2026    Article title
            One-sentence description
──────────────────────────────────────────────────────────────
Aug 2026    Article title
            One-sentence description
──────────────────────────────────────────────────────────────
Jul 2026    Article title
            One-sentence description

Subscribe to new articles
Email address [_______________________] [Subscribe]
```

- **Layout:** A simple dated list. Dates align in a narrow first column, while titles and summaries use the remaining width.
- **Type and color:** One sans serif family with regular and semibold weights. Paper `#F8F8F5`, black `#171B19`, deep teal `#175B60` for links.
- **Small screens:** Dates move above each title; rules continue to separate articles.
- **Best fit:** A blog that will publish frequently and wants its freshness to be obvious.

## 5. Two-panel introduction

**Idea:** Give the role and writing equal weight in the first view without adding content blocks.

```text
Rodrigo Adones                                      About  Blog
──────────────────────────────────────────────────────────────
┌──────────────────────────┬───────────────────────────────────┐
│ Software architect &     │ Latest articles                   │
│ engineering manager      │ 1  Article title · Date           │
│                          │ 2  Article title · Date           │
│ Clear, approved thesis.  │ 3  Article title · Date           │
│                          │ View all articles                 │
└──────────────────────────┴───────────────────────────────────┘

Get new articles by email
Short explanation and labeled email form
```

- **Layout:** Two quiet panels separated by one rule. Article summaries can appear beneath each title, so the list remains useful without a hover reveal.
- **Type and color:** Sans serif display with monospaced dates only. Off white `#F7F7F4`, graphite `#222629`, muted blue gray `#45616B` for links.
- **Small screens:** Introduction comes first, followed by the full article list and newsletter.
- **Best fit:** An equal emphasis on professional positioning and published thinking.

## 6. Flight board, simplified

**Idea:** Keep a trace of the current site's operational character while removing its extra bays and motion.

```text
Rodrigo Adones                                      About  Blog
══════════════════════════════════════════════════════════════
Software architect & engineering manager
Engineering delivery through better systems and teams.

LATEST ARTICLES
┌────────────────────────────────────────────────────────────┐
│ 01  Date  Article title                         Read →       │
│     Brief summary                                          │
├────────────────────────────────────────────────────────────┤
│ 02  Date  Article title                         Read →       │
│     Brief summary                                          │
├────────────────────────────────────────────────────────────┤
│ 03  Date  Article title                         Read →       │
│     Brief summary                                          │
└────────────────────────────────────────────────────────────┘
View all articles

NEWSLETTER  Email address [________________] [Subscribe]
```

- **Layout:** Ruled rows echo the existing strip board. The three article rows replace the current single latest strip and four pillar bays.
- **Type and color:** Reuse the locally hosted B612 family. Pale gray green `#E8ECE7`, ink `#141A16`, deep green `#285543`; one subtle accent rule.
- **Small screens:** Each article row becomes a stacked block; all content stays visible.
- **Best fit:** Continuity with the existing visual direction, with far less interface chrome.

## Shared implementation criteria

- Keep the same name link, About link, and Blog link in the same header position across pages. Identify the current page without moving or animating the menu.
- Use one descriptive `<h1>`, section `<h2>` headings, `<nav>`, `<main>`, and `<footer>`. Include a skip link and visible keyboard focus. The linked article title is the primary target for each entry.
- Give the email input a visible label, `type="email"`, and `autocomplete="email"`. Explain availability or errors in text, not color alone.
- Keep text contrast at least 4.5:1 for normal text, preserve reading order at narrow widths and zoom, and avoid text over images.
- Use a descriptive homepage title and meta description, canonical URL, and crawlable links to `/about/`, `/blog/`, and the three real article URLs. Use actual publication dates and avoid fabricated article details or structured data.
- Use no transitions, animated hover effects, client-side navigation, hidden-on-hover information, or layout shifts between routes. Focus indication remains visible for keyboard users.
- The repo currently plans bilingual posts in ADR 0006 and contains Spanish sample titles. An English-only implementation should update that decision and replace those samples before publication.

**Recommendation:** Proposal 1 is the clearest starting point. Proposal 6 is the smallest visual departure from the existing homepage. The choice between them is primarily whether the site should feel like an editorial journal or retain its operational visual identity.

### References

- [Google Search Central: Search appearance](https://developers.google.com/search/docs/appearance)
- [Google Search Central: Snippets and meta descriptions](https://developers.google.com/search/docs/appearance/snippet)
- [W3C: WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/)

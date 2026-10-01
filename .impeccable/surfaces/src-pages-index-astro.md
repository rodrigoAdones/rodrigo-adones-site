---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets:
  - "src/components/SiteHeader.astro"
  - "src/components/Intro.astro"
  - "src/components/LatestArticles.astro"
  - "src/components/ArticleEntry.astro"
  - "src/components/Subscribe.astro"
  - "src/components/Footer.astro"
  - "src/layouts/BaseLayout.astro"
---

# Homepage (`/`)

**Mode:** Read (with light Persuade). Hiring decision-makers and practitioner readers; proof is the writing itself. Intro copy is placeholder until About lands; newsletter form stubbed (provider undecided).

**Anti-goals:** flight-progress board, generic card-grid portfolio, startup landing, dark mode, motion, third-party fonts.

## Direction contract

THESIS: A calm editorial page that matches ADR 0008 — who you are, the thesis in one line, latest 3 posts — with pillars, per-post language, an updated signal, and an honest newsletter state.

OWN-WORLD: Ground `#FAF9F6`, ink `#202522`, soft ink `#555B57`, forest `#315A49` (links/button/focus), rules `#DCDDD8`. Source Serif 4 for site name and headings/titles; system sans elsewhere. Frame ≈ 60rem; inner ≈ 43rem indented ≈ 8rem. Square layout; 3px radius only on form controls. No motion.

STORY: Visitor reads the role and thesis, scans the four pillars, opens a recent article (or notes language/updated meta), optionally leaves an email once the newsletter opens, or follows RSS/Source/social in the footer.

FIRST VIEWPORT: Site name + About/Blog nav. Then the h1 role line, thesis, and pillar line. Latest articles begin below the first section rule — not a hero image, not a dashboard.

FORM: Quiet editorial (proposal 1 / specs/0002). Skip link → `#main`. Landmarks header/nav/main/footer.

FINISH: DESIGN.md and this surface brief rewritten for 0002; visual check at 1440px and 390px.

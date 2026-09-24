---
name: Rodrigo Adones
description: A flight progress board for an engineering leader's writing: every post is a paper strip racked in one of four pillar bays.
colors:
  board: "#d3dad4"
  board-deep: "#c2cbc4"
  holder: "#8b958f"
  holder-dark: "#5f6863"
  paper: "#f5f7f4"
  paper-muted: "#c9d0cb"
  ink: "#141414"
  ink-soft: "#363d39"
  rule: "rgb(20 20 20 / 0.32)"
  pencil: "#b3211a"
  pencil-on-ink: "#ff9c8f"
  strip-ai-delivery: "#ead7a2"
  strip-platform-dx: "#a7c4e2"
  strip-delivery-metrics: "#efb4a0"
  strip-commerce-payments: "#c6db9c"
typography:
  display:
    fontFamily: "B612, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3.25rem, 1rem + 13vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "B612, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "B612, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 700
    lineHeight: 1.25
  title-inked:
    fontFamily: "B612, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.25rem, 1rem + 1vw, 1.625rem)"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "B612, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "B612, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  numeral:
    fontFamily: "B612 Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  field:
    fontFamily: "B612 Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.04em"
    fontFeature: "tnum"
  label:
    fontFamily: "B612 Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.08em"
rounded:
  none: "0px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  "8": "4.5rem"
components:
  strip:
    backgroundColor: "{colors.strip-ai-delivery}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
  strip-inked:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.title-inked}"
    rounded: "{rounded.none}"
  strip-status-inked:
    textColor: "{colors.pencil-on-ink}"
    typography: "{typography.field}"
  bay-plate:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.75rem"
  holder-slot:
    backgroundColor: "{colors.board-deep}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.none}"
    padding: "0.5rem 1rem"
    height: "3.5rem"
  code-chip:
    backgroundColor: "{colors.strip-ai-delivery}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.25rem 0.5rem"
  now-rule:
    textColor: "{colors.pencil}"
    typography: "{typography.field}"
    padding: "0 0 0.5rem"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.pencil}"
    textColor: "{colors.paper}"
  button-primary-disabled:
    backgroundColor: "{colors.holder}"
    textColor: "{colors.ink}"
  input:
    backgroundColor: "{colors.board}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.75rem"
  input-focus:
    backgroundColor: "{colors.paper}"
  nav-tab:
    backgroundColor: "{colors.board}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
  nav-tab-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
---

# Design System: Rodrigo Adones

## Overview

**Creative North Star: "The Flight Progress Board"**

The site is a strip board in a daylight operations room. A grey-green enamel board carries aluminium holders; posts are paper strips racked in them, colour-coded by pillar, ruled into field cells, and read against one red "now" rule. The grammar of the board carries only real post metadata: sequence numbers, pillar codes, dates, language, reading time, status. There is no aviation costume: no planes, no radar, no cockpit chrome.

Density is operational rather than decorative. Everything sits on a hairline-ruled grid with square corners; hierarchy comes from paper against board, one solid-inked strip against many coloured ones, and one red line against everything else. Colour is tonal and economical: four soft pillar tints, a family of greens and greys for the board, near-black ink, and a single red pencil.

The world is light-only. It is set in a daylight office or on a phone in hand, not in a darkened control room; there is no dark mode.

**Key Characteristics:**
- Enamel board, aluminium holders, paper strips, grease-pencil ink, one red pencil.
- Square corners and 1px ruled field cells everywhere.
- Pillar colour appears only on strips and code chips.
- Exactly one solid-inked strip on the board: the newest post.
- Sequence numbers are permanent (counted from the oldest post), zero-padded, monospaced.
- The signature motion: a strip slides partway out of its holder on hover and focus.

## Colors

A tonal board of greens and greys, soft pillar tints on paper strips, near-black ink, and one red pencil.

### Primary
- **Red Grease Pencil** (pencil): the now rule and its build-time text, the active nav tab's underline mark, the focus ring, the text caret, and the primary button's hover. Chosen darker than the contract's #C4261D to hold 4.5:1 as text on the board.
- **Pencil On Ink** (pencil-on-ink): the red pencil's only form on the inked strip; used for its status cell ("Upd 09-21"), where the base pencil would fail contrast on near-black.

### Secondary
The four pillar strip colours, one per closed pillar tag (ADR 0002). They fill strips and code chips, and nothing else.
- **Buff Strip** (strip-ai-delivery): AI-native delivery, code AID. Also the text selection colour.
- **Chart Blue Strip** (strip-platform-dx): Platform & DX, code PDX.
- **Salmon Strip** (strip-delivery-metrics): Delivery measurement, code DLM.
- **Pale Green Strip** (strip-commerce-payments): Commerce & payments, code C&P.

### Neutral
- **Enamel Board** (board): page background; idle nav tabs; the input field.
- **Deep Enamel** (board-deep): the rail background; empty holder slots; disabled input.
- **Aluminium** (holder): the holder frame between racked strips, the rail's edge, the footer rule, the disabled button.
- **Dark Aluminium** (holder-dark): the 1px frame and bottom rim of every strip, plate, and paper panel.
- **Strip Paper** (paper): the callsign strip, bay plates, the subscribe strip, the active nav tab; text on the inked strip.
- **Faded Paper** (paper-muted): description text on the inked strip only.
- **Grease-Pencil Ink** (ink): all primary text; the inked strip; the monogram block; the primary button.
- **Soft Ink** (ink-soft): secondary text, descriptions, field labels, status cells on coloured strips.
- **Field Rule** (rule): the 1px lines between field cells. On the inked strip the same lines are paper at 28% opacity.

### Named Rules
**The One Red Pencil Rule.** At rest, red appears in exactly three places: the now rule, the active nav mark, and the inked strip's status cell (as pencil-on-ink). Beyond that it is state feedback only (focus ring, caret, button hover). Status cells on coloured strips use ink-soft, never red.

**The Pillar Colour Rule.** Pillar colour belongs to strips and code chips. No pillar-coloured box ever wraps a pillar-coloured strip; bays are paper plates over neutral grey holder fields.

**The Daylight Rule.** Light-only. `color-scheme: light`; no dark theme.

## Typography

**Display Font:** B612 (with Helvetica Neue, Arial, sans-serif)
**Body Font:** B612
**Label/Mono Font:** B612 Mono (with ui-monospace, SF Mono, Menlo, monospace)

**Character:** B612 was drawn for cockpit displays: open, slightly condensed, unambiguous at small sizes. The sans carries every word a person reads; the mono carries every value a controller would write in a field. Both are self-hosted (OFL) at 400 and 700.

### Hierarchy
- **Display** (700, clamp(3.25rem, 1rem + 13vw, 6rem), 0.9, uppercase): the callsign "RODRIGO ADONES" only.
- **Headline** (700, clamp(1.5rem, 1.2rem + 1vw, 2rem), 1.1): section heads ("Latest filed", "By pillar").
- **Title** (700, 1.1875rem, 1.25, max 44ch): strip titles; the inked strip scales to clamp(1.25rem, 1rem + 1vw, 1.625rem); compact bay strips drop to 0.9375rem. Plate and panel headings sit between (1.125rem bay names, 1.375rem subscribe heading).
- **Body** (400, 1rem, 1.5): running prose; descriptions at 0.9375rem, max 68ch.
- **Numeral** (mono 700, 1.375rem, 1, tabular): zero-padded strip sequence numbers (1rem compact, 1.0625rem under 40rem).
- **Field** (mono, 0.8125rem, 0.04em, uppercase, tabular): field cells, the now rule, bay counts, the domain.
- **Label** (mono, 0.75rem, 0.08em, uppercase): pillar codes (0.04em tracking), column headers inside a strip ("Route"), form labels.

### Named Rules
**The Sans Speaks, Mono Records Rule.** B612 sans for all prose, headings, titles, links and buttons. B612 Mono only for dates, codes, counts, sequence numbers, field cells, and the domain. A sentence set in mono is a bug.

## Layout

A two-column board: a 13.5rem left rail (sticky, full height) and a main column capped at 76rem, padded 1.5rem / 3rem / 2rem. Sections stack with a 4.5rem gap (3rem under 60rem); the now rule sits 2rem above the callsign strip. Spacing follows an eight-step scale (0.25rem to 4.5rem); cells inside strips use steps 1-4, section rhythm uses 5-8.

Racks are holder frames: an aluminium field with 3px padding and 3px gaps, strips sitting in the gaps like paper in rails. Each bay's holder field shows three ruled slots; empty slots stay visible, faintly lined every 0.875rem, so a thin pillar reads as room to fill rather than a broken layout.

Responsive behaviour (desktop-first max-width queries):
- **72rem:** pillar bays go from two columns to one.
- **60rem:** the rail becomes a static top bar; tabs run horizontally and slide down instead of right; the domain and footnote hide.
- **48rem:** the callsign strip stacks name over route (route becomes a 2x2 grid); the subscribe strip stacks.
- **40rem:** strips drop to two columns (3.25rem sequence cell + body) and their fields wrap into a single row beneath.

The latest rack shows only the inked newest strip until there are more than nine posts, then the newest three; the bays already list every post.

## Elevation & Depth

Flat and physical. Depth comes from paper sitting in aluminium frames: a 1px dark-aluminium border plus a 1px bottom rim (`0 1px 0 holder-dark`) on every paper surface. The only true shadow is the lift, and it appears only when a strip or tab is pulled out of its holder.

### Shadow Vocabulary
- **Holder rim** (`box-shadow: 0 1px 0 var(--holder-dark)`): resting strips, the callsign strip, the subscribe strip.
- **Lift** (`box-shadow: 0 0.5rem 1rem -0.5rem rgb(20 20 20 / 0.45)`): a strip on hover or focus, and the active nav tab.

### Named Rules
**The Pulled Strip Rule.** Nothing floats at rest. A strip lifts only when it slides out (0.75rem right, 0.375rem under 40rem; 260ms, ease-out cubic-bezier(0.16, 1, 0.3, 1)), and the lift comes with it.

## Shapes

Square. Every corner is 0 (inputs and buttons reset to `border-radius: 0`). Form is built from 1px rules: cells divided by field rules, frames in dark aluminium, and 2px aluminium edges for structural boundaries (the rail edge, the footer rule). The one 2px red line is the now rule. Holder slots carry a repeating horizontal ruling at 10% ink.

## Components

### Buttons
Blunt ink blocks, flush against their field.
- **Shape:** square (0px).
- **Primary:** ink block, paper text, 700 sans, padding 0.75rem 1.5rem, 1px ink border.
- **Hover / Focus:** the fill turns red pencil over 200ms; focus is the global 2px pencil outline offset 3px.
- **Disabled:** aluminium fill, ink text, `not-allowed` cursor.

### Chips
- **Code chip:** a small pillar-coloured tag in mono 0.75rem, 700 in bays, with a 1px field-rule border, padding 0.25rem 0.5rem. It is the only place pillar colour appears outside a strip. Used on bay plates and in the callsign's route field.

### Cards / Containers
There are no cards; there are strips and plates.
- **Corner Style:** square.
- **Background:** paper for plates and panels (callsign, bay plate, subscribe); pillar colour for strips.
- **Shadow Strategy:** holder rim at rest; lift only when pulled (see Elevation & Depth).
- **Border:** 1px dark aluminium; internal cells split by 1px field rules.
- **Internal Padding:** 0.75rem to 1.5rem.

### Inputs / Fields
- **Style:** board-coloured field, 1px dark-aluminium border, square, mono 1rem value text, sans placeholder; the right border is dropped so the button closes the field.
- **Focus:** fill turns paper, outline offset 0.
- **Disabled:** deep-enamel fill; a sentence below explains why.
- **Label:** mono label style, uppercase, ink-soft.

### Navigation
- **Style:** a rail of blank strips. Each tab is a board-coloured block with a 1px aluminium border, 700 sans at 1.0625rem.
- **Hover:** slides 0.375rem out and turns paper.
- **Active:** paper, ink border, slid 0.75rem out, a 3px red pencil mark along its bottom edge (inset), and the lift.
- **Mobile (60rem):** the rail becomes a top bar with the monogram; tabs run in a row, 0.9375rem, and slide down (0.1875rem hover, 0.375rem active).
- **Monogram:** a 3rem square ink block with paper "RA" in mono 700.

### Strip (signature)
The unit of the whole system. A three-column grid: sequence cell (4.75rem; zero-padded number over pillar code), body (title, description), and a 2x2 field grid (date, language, reading minutes, status). Cells are divided by field rules. Background is the post's pillar colour; the whole strip is the click target while the title stays the accessible link. Focus draws the pencil outline around the whole strip.
- **Compact** (in bays): 3.5rem sequence cell, title only, date and language stacked on the right.
- **Inked** (newest post only): ink background, paper text, faded-paper description, paper-at-28% rules, pillar colour kept on the sequence cell only, status in pencil-on-ink.
- **Status field:** 700, ink-soft on coloured strips; "Filed" or "Upd MM-DD".

### Now Rule (signature)
A 2px red pencil rule across the top of the main column with mono 700 uppercase text above it: "Board as of [UTC build time]Z" on the left, the strip count on the right.

### Pillar Bay
A paper plate (code chip, pillar name as link, strip count in mono) sitting on top of an aluminium holder field of three ruled deep-enamel slots. Compact strips fill slots from the top; unfilled slots stay visible and empty. An empty bay puts its one line of copy in the first slot.

## Do's and Don'ts

### Do:
- **Do** keep every corner square and every division a 1px rule.
- **Do** keep the red pencil to the now rule, the active nav mark, and the inked strip's status; everywhere else it is focus or hover state only.
- **Do** use pencil-on-ink (#ff9c8f) for red on the inked strip, and ink-soft for status on coloured strips.
- **Do** set prose in B612 and values (dates, codes, counts, sequence numbers, fields, the domain) in B612 Mono with tabular numerals.
- **Do** ink exactly one strip: the newest post.
- **Do** show empty holder slots in bays so the rack's capacity stays visible.
- **Do** carry only real post metadata in fields: sequence, pillar code, date, language, reading time, status.

### Don't:
- **Don't** wrap a pillar-coloured strip in a pillar-coloured box; bays are paper plates over grey holder fields.
- **Don't** use the red pencil as a decorative accent, a heading colour, or a status colour on coloured strips.
- **Don't** add planes, radar sweeps, cockpit chrome, or invented aviation data; the board grammar is for post metadata only.
- **Don't** add a dark mode.
- **Don't** add resting shadows; lift exists only for a pulled strip or the active tab.
- **Don't** renumber strips; sequence numbers count from the oldest post and never change.

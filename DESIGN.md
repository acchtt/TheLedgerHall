---
name: "The Ledger Hall"
description: "Source-extracted design system for the existing personal finance web app"
colors:
  night-background: "#0b1016"
  night-panel: "#111922"
  night-inset: "#17222d"
  night-line: "#263543"
  night-text: "#edf3f6"
  night-muted: "#8fa1ae"
  night-accent: "#70d3ad"
  night-danger: "#ee7b7b"
  night-warning: "#e6b85f"
  day-background: "#f3f6f7"
  day-panel: "#ffffff"
  day-inset: "#f0f4f5"
  day-line: "#dce5e8"
  day-text: "#162128"
  day-muted: "#657680"
  day-accent: "#187d64"
  day-danger: "#bd4e4e"
  day-warning: "#906716"
  outgoing: "#cf8a78"
  primary-button-ink: "#09251d"
typography:
  headline:
    fontFamily: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "24px"
    fontWeight: 700
    letterSpacing: "-0.035em"
  title:
    fontFamily: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "18px"
  body:
    fontFamily: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "14px"
    lineHeight: 1.45
  metric:
    fontFamily: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "clamp(21px, 2.2vw, 30px)"
    fontWeight: 800
    letterSpacing: "-0.04em"
  action:
    fontFamily: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "12px"
    fontWeight: 700
  eyebrow:
    fontFamily: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "10px"
    fontWeight: 800
    letterSpacing: "0.12em"
rounded:
  field: "8px"
  action: "9px"
  navigation: "10px"
  finance-card: "14px"
  panel: "15px"
  dialog: "16px"
  pill: "999px"
spacing:
  micro: "4px"
  tight: "8px"
  regular: "12px"
  grid: "14px"
  panel: "20px"
  content: "28px"
components:
  button-primary:
    backgroundColor: "{colors.night-accent}"
    textColor: "{colors.primary-button-ink}"
    rounded: "{rounded.action}"
    padding: "0 14px"
    height: "38px"
    typography: "{typography.action}"
  button-secondary:
    backgroundColor: "{colors.night-inset}"
    textColor: "{colors.night-text}"
    rounded: "{rounded.action}"
    padding: "0 14px"
    height: "38px"
    typography: "{typography.action}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.night-text}"
    rounded: "{rounded.action}"
    padding: "0 14px"
    height: "38px"
    typography: "{typography.action}"
  field:
    backgroundColor: "{colors.night-inset}"
    textColor: "{colors.night-text}"
    rounded: "{rounded.field}"
    padding: "0 10px"
    height: "40px"
  navigation-item:
    backgroundColor: "transparent"
    textColor: "{colors.night-muted}"
    rounded: "{rounded.navigation}"
    padding: "0 12px"
    height: "44px"
  panel:
    backgroundColor: "{colors.night-panel}"
    textColor: "{colors.night-text}"
    rounded: "{rounded.panel}"
    padding: "20px"
  finance-card:
    backgroundColor: "{colors.night-panel}"
    textColor: "{colors.night-text}"
    rounded: "{rounded.finance-card}"
    padding: "17px"
  status-chip:
    backgroundColor: "{colors.night-panel}"
    textColor: "{colors.night-muted}"
    rounded: "{rounded.pill}"
    padding: "7px 10px"
---

# Design System: The Ledger Hall

## Overview

**Creative North Star: "The Compact Finance Console"** *(provisional descriptive name, derived from the existing implementation; not a newly approved creative direction).*

The incumbent application is an operational finance workspace: a dark slate shell, gently separated navy surfaces, small dense utility text, and conspicuous numeric summaries. Its single mint accent links primary actions, active navigation, positive amounts, and progress. The light theme preserves the same hierarchy while switching the surfaces and foreground palette. No redesign or reinterpretation is authorized by this document.

The UI expresses information primarily through typography, rectangular data regions, restrained iconography, borders, and progress indicators. Navigation and editing share the same component language across six product sections. The browser's print variant deliberately abandons the app chrome for a plain finance report.

**Key Characteristics:**
- Compact, data-forward finance layout rather than an image-led promotional surface.
- Dark-by-default, light-capable paired palettes mapped through existing CSS custom properties.
- Fine borders, subtle panel elevation, mint state cues, and warm outgoing/warning colors.
- Reusable form, financial card, table, progress, reminder, and modal patterns.

The names and atmosphere terms here are source-derived descriptions. Confirm or revise the qualitative language separately; the implementation values below remain the current authority.

## Colors

The existing CSS has paired dark and light semantic values. Frontmatter records **both** with distinct names; runtime CSS selects between them using `html[data-theme="light"]`. The active source of truth is `styles.css`, not generated token variables.

### Primary
- **Mint Activity Accent** (`night-accent` / `day-accent`): primary buttons, active navigation, completed/progress fill, income, and selected utility copy.
- **Deep Primary Button Ink** (`primary-button-ink`): fixed dark foreground on accent-filled primary buttons; this remains fixed in the current light theme.

### Neutral
- **Night Canvas** (`night-background`): page background in the default dark theme.
- **Night Panel** (`night-panel`): side navigation, metric and content cards, dialogs, and small chips.
- **Night Inset** (`night-inset`): default controls and nested supporting surfaces.
- **Night Divider** (`night-line`): outlines, table rules, and internal separators.
- **Night Foreground** (`night-text`): principal text and numeric values.
- **Night Muted** (`night-muted`): metadata, labels, help, and less prominent navigation.
- **Day Canvas / Panel / Inset / Divider / Foreground / Muted** (matching `day-*` tokens): same semantic roles in light mode, without changes to page architecture.

### Status and chart colors
- **Soft Red** (`night-danger` / `day-danger`): danger action and locked-sync cues.
- **Amber** (`night-warning` / `day-warning`): upcoming/due labels and degraded/connecting sync cues.
- **Warm Outflow** (`outgoing`): the chart's outgoing bars, legend, and negative transaction amounts. It is a distinct literal color, not the danger variable.

**The Semantic Pairing Rule.** Existing semantic CSS variables have paired dark and light values. Extend both themes when a future change adds a semantic UI color; do not assume a dark-only value will remain readable in light mode.

## Typography

**UI family:** `Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`, as declared on `:root`. `index.html` does not import or bundle an Inter font file, so its actual rendered face depends on local font availability and fallback.

The existing interface emphasizes amounts and section labels rather than decorative display typography. It uses strong numeric weight and tight letter spacing for financial metrics, with much smaller copy for supporting facts.

### Hierarchy
- **Page headline:** 24px with negative tracking, used in the sticky top bar.
- **Section title:** 18px base heading size; common content section headings.
- **Metric value:** `clamp(21px, 2.2vw, 30px)`, weight 800, tracking -0.04em; 20px on the narrowest viewport.
- **Body:** `body` declares `font: 14px/1.45 inherit`; verify computed shorthand behavior when auditing in a live browser rather than assuming a loaded webfont.
- **Action:** 12px, weight 700, with compact controls.
- **Eyebrow:** 10px, weight 800, 0.12em tracking; uppercase labels precede titles.
- **Small utility copy:** 8–11px for fact captions, table headings, chart labels, helper text, and secondary metadata.

**The Numeric Emphasis Rule.** Major balances are the largest/heaviest text in a card; the supporting captions remain smaller and muted.

## Layout

A 248px sticky sidebar and flexible main workspace form the desktop app shell. The sidebar is viewport-height and contains an `LH` text mark, six navigation items, theme control, and cloud sync status. The top bar is sticky (88px tall) with a title and quick payment action; the main content is centered and capped at 1540px. Its horizontal padding scales with `clamp(20px, 4vw, 46px)`.

The overview starts with four summary metrics; content sections use 14px grid gaps and an asymmetric 1.25fr/0.75fr two-column pattern. Editor/list pages typically place a 280–340px sticky editing column beside a flexible record area. The debt editor has a wider 320–390px override. Forms use two internal columns; financial cards normally appear two across. These are **observed CSS measurements**, not a separate preexisting spacing-variable system.

Responsive changes currently occur at:
- **1100px:** metrics fall to two columns; the overview's asymmetric grids and planner stack; standard finance-card grids switch to one column.
- **820px:** desktop sidebar becomes a slide-out panel (width `min(82vw, 280px)`); the main top bar becomes 78px; editor and results stack; sticky forms return to normal flow; compact navigation hints disappear.
- **580px:** cards and forms use one column, metrics remain two columns, controls become vertical when necessary, and panels become tighter.

A separate `@media print` rule hides application navigation and nonreport sections and prints only the report surface.

**The Workspace-First Rule.** Preserve the separation between navigation, primary action/header, and active working content. Layout documentation does not authorize adding promotional hero sections or removing finance controls.

## Elevation & Depth

The visual system uses both tonal layering and elevation. Major cards share a thin divider border plus an ambient shadow; inset controls and supporting facts mostly distinguish themselves through a deeper surface color. The sticky header applies a translucent canvas-mix background with `backdrop-filter: blur(12px)`.

### Shadow Vocabulary
- **Panel shadow:** dark `0 16px 40px rgba(0,0,0,.18)`; light `0 12px 30px rgba(31,47,58,.08)`, both currently stored in `--shadow`.
- **Mobile navigation:** `20px 0 50px rgba(0,0,0,.3)` on the off-canvas sidebar.
- **Dialog:** `0 28px 80px rgba(0,0,0,.45)`, with a darkened/blurred backdrop.

## Shapes

Corners are consistently rounded without introducing circular cards: 8px text fields, 9px standard buttons, 10px navigation items and empty-state containers, 14px finance cards, 15px panels/metrics, and 16px dialogs. Status/date chips, type pills, and progress tracks have a full pill silhouette (999px radius). The amount/details microcells use an 8px inset radius; dialog timeline indices and step markers are circular.

Thin `var(--line)` borders organize fields, cards, table rows, and action lists. Dashed outlines indicate certain empty states. The app uses no full-bleed hero photography or texture asset in the inspected source.

## Components

### Buttons
- **Primary:** accent fill and dark ink text, 38px minimum height, 9px corners, 14px horizontal padding, 12px bold label.
- **Secondary:** inset surface with thin divider border; same base dimensions.
- **Ghost:** transparent fill with retained structure; destructive variant inherits base styling but uses the danger text color.
- **Inline actions:** small bold mint text with no filled button surface.
- **Current states:** standard buttons have no general hover/focus-visible styling specified by `.button`. Do not falsely document a hover effect or focus ring that source CSS does not provide.

### Fields
- **Text and selects:** 40px minimum height, inset background, divider outline, 8px corners, and 10px horizontal padding; labels are small and bold.
- **Debt form:** uses grouped inset sections, required/optional status labels, contextual help, and an APR unit suffix.
- **Current keyboard state:** global `button,input,select{outline:0}` is present and the source has no obvious replacement focus indicator. This is an existing accessibility audit item, not a desired design principle.

### Navigation
- **Sidebar:** muted 44px-high items with 10px corners and 17px outline SVG icons.
- **Active:** faint accent-tinted backdrop, a 2px inset accent bar, brightened text, and accent icon.
- **Hover:** secondary background/foreground shift; icons change color and translate 1px.
- **Mobile:** sidebar translates off-screen and opens from the left via the existing menu control.

### Cards, metrics, and financial records
- **Panel:** 15px rounded, 20px padded, panel surface plus thin border/shadow (15px padding on narrow mobile).
- **Metric:** 15px rounded, 18px padded, with a conspicuous numeric value.
- **Finance card:** 14px rounded, 17px padded; name, balance, metadata microcells, and available actions follow the same grid language.
- **Progress:** 7px inset track, fully rounded; accent bar fill.
- **Empty state:** dashed outlined, 10px rounded, center-aligned explanatory text.

### Data and status
- **Ledger tables:** full-width, border-collapsed, 11px base text, thin row dividers, uppercase small table headers, right-aligned numeric amounts.
- **Activity chart:** CSS grid of 14 day columns with mint incoming and warm outgoing bars; no third-party graphing component is involved.
- **Reminders:** horizontal rows with 38px date blocks and subdued metadata.
- **Chips:** 999px pill/date badges; transaction type pills use a smaller bordered variant.
- **Sync status:** tiny colored dot (accent = synced; warning = connecting/local; danger = locked), beside descriptive text. It is a connection state, not proof of private data storage.

### Payment dialog
- **Shape:** maximum width 470px, 16px panel corners, large modal shadow, darkened/blurred backdrop.
- **Content:** title row and close button, supporting balance display, payment fields, and actions.
- **Motion:** entry animation lasts .14s with a small upward translation and scale; mobile reduces padding and stacks balance details.

## Do's and Don'ts

### Do:
- **Do** use the existing semantic theme variables and retain dark/light parity for new state colors.
- **Do** prioritize balances, due dates, and transactions over decorative copy within the operational workspace.
- **Do** keep existing compact panel, input, and navigation patterns when extending the same interface.
- **Do** preserve desktop/mobile/sidebar and print-report behaviors when implementing new frontend features.
- **Do** represent cloud sync as a sync status, not as a security or privacy guarantee.

### Don't:
- **Don't** introduce unrelated marketing composition into the finance workflow as though it were incumbent identity.
- **Don't** claim Inter is bundled or guaranteed; it is presently a preferred font in a fallback stack.
- **Don't** describe global focus rings or universal button hover states as existing; these are not implemented in the inspected CSS.
- **Don't** substitute danger red for the distinct warm outgoing transaction color.
- **Don't** treat the documentation's descriptive metaphor as approval for changing the current visual design.

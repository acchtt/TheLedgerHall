# The Ledger Hall — Original Design

**Status:** Approved source of truth  
**Version:** Original Design 1.0  
**Locked:** 2026-07-28

This document replaces all earlier screenshot-matching attempts as the visual source of truth for The Ledger Hall.

## Design direction

A production-first medieval fantasy dashboard built from reusable HTML, CSS, and SVG components. It should feel like an illustrated council ledger without depending on a full-page screenshot, base64 loader, or baked-in text.

## Composition

Desktop reference canvas: approximately **3:2**, proportionally scaled inside wider screens while retaining the original 29% / 42% / 27% main-column balance.

- Header: approximately 20% height
- Main content: approximately 70% height
- Footer navigation: approximately 10% height
- Main columns: approximately **29% / 42% / 27%**

### Header

1. Hanging forest-green banner with gold tree crest
2. Lifetime P/L parchment card
3. Central crest, title, and parchment ribbon subtitle
4. Trial Record parchment card
5. Vertical carved utility panel: Chamber, Themes, Hide $

### Left ledger

1. Open Wagers
2. Trial Record
3. Recent Results and quote

### Center ledger

- Large Council Notes parchment
- Five framed manuscript messages
- Attached message input

### Right ledger

1. Battle Report
2. Odds Snapshot
3. Current Read

### Footer

One integrated carved navigation beam with five destinations.

## Visual system

- Dark carved oak with restrained gold inlay
- Warm fibrous parchment with irregular edges
- Painted valley header with river, mountains, castle, and subtle branches
- Restrained ivy around the outside frame only
- Forest green for positive values
- Muted red for negative values
- Antique gold for headings and active controls
- Cinzel for headings
- Crimson Text or a similarly readable classic serif for body content

## Non-negotiable implementation rules

- No full-page image backgrounds
- No base64 image loaders
- No sample text embedded in artwork
- No inherited V22–V25 styles
- Normal local SVG/CSS assets only
- Decorative elements must never overlap live content
- Components must remain reusable and data-driven
- The existing ledger functions must remain possible: messages, wager detection, unit conversion, persistence, themes, hidden-money mode, collapsible panels, and navigation

## Current build target

`original-v29.html`

## V29 refinement priorities

- Keep all ivy and root decoration behind live content
- Increase side-ledger, Battle Report, Odds Snapshot, and footer readability
- Give the right report column slightly more usable width
- Strengthen parchment edges and manuscript depth without introducing modern cards
- Preserve the V28 composition and interaction layer

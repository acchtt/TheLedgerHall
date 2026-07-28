# The Ledger Hall — Original Design

**Status:** Approved source of truth  
**Version:** Original Design 1.0  
**Locked:** 2026-07-28

This document replaces all earlier screenshot-matching attempts as the visual source of truth for The Ledger Hall.

## Design direction

A production-first medieval fantasy dashboard built from reusable HTML, CSS, and SVG components. It should feel like an illustrated council ledger without depending on a full-page screenshot, base64 loader, or baked-in text.

## Composition

Desktop reference canvas: approximately **3:2**, proportionally scaled inside wider screens.

- Hero header: approximately **23%** height
- Main content: approximately **66%** height
- Footer navigation: approximately **11%** height
- Main columns: approximately **28% / 43% / 28%**

### Header

1. Hanging forest-green banner with gold tree crest
2. Lifetime P/L parchment card
3. Central crest, monumental title, and dimensional parchment ribbon
4. Trial Record parchment card
5. Vertical carved utility panel: Chamber, Themes, Hide $

### Left ledger

1. Open Wagers
2. Trial Record
3. Recent Results and quote

### Center ledger

- Dominant irregular-edged Council Notes manuscript
- Five framed notes with deliberate height rhythm
- Official Bet Candidate receives restrained green emphasis
- Attached manuscript-style message input

### Right ledger

1. Featured Battle Report with distinct title, score, and statistics zones
2. Compact Odds Snapshot
3. Anchored Current Read section

### Footer

One substantial carved navigation beam with five destinations and a lit inset active state.

## Visual system

- Dark carved oak with restrained gold inlay
- Warm fibrous parchment with irregular edges
- Cinematic valley header with river, layered mountains, distant castle, branches, haze, and birds
- Decorative foliage confined to the scenery and outer architecture only
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
- Existing ledger functions must remain possible: messages, wager detection, unit conversion, persistence, themes, hidden-money mode, collapsible panels, and navigation

## Current build target

`original-v31.html`

## V31 acceptance targets

- Header must read as a cinematic hero scene rather than a row of cards
- Council Notes must be the obvious focal artifact
- Battle Report must feel like a featured report wing
- Footer must read as a substantial carved architectural beam
- Parchment and wood silhouettes must feel less rectangular and more handcrafted
- No decorative foliage may cross readable content
- Existing V30 data, storage, and interaction behavior must remain intact

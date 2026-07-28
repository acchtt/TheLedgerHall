# The Ledger Hall — Original Design

**Status:** Approved source of truth  
**Version:** Fantasy Concept 1.0  
**Locked:** 2026-07-29

This document replaces the earlier approximation passes. The visual source of truth is the **main fantasy Ledger Hall interface** from the approved concept image. The design-board notes, layout diagrams, palettes, and documentation panels around that interface are not part of the live page.

## Design direction

A polished medieval-fantasy game dashboard built from reusable HTML, CSS, and normal local SVG assets. It must capture the illustrated valley, carved architecture, parchment surfaces, gold trim, crest banner, wax seals, and dense council-hall composition without using a full-page screenshot or baking live text into artwork.

## Composition

Desktop reference canvas: approximately **4:3**, proportionally scaled inside wider screens.

- Hero header: approximately **22.5%** height
- Main content: approximately **67.5%** height
- Footer navigation: approximately **10%** height
- Main columns: approximately **27% / 44% / 27%**

### Header

1. Hanging forest-green banner with ornate gold tree crest
2. Lifetime P/L parchment plaque
3. Central crest, monumental title, and dimensional ribbon subtitle
4. Trial Record parchment plaque
5. Vertical carved utility panel: Chamber, Themes, Hide $
6. Cinematic valley, river, layered mountains, distant castle, tree canopy, haze, and warm daylight

### Left ledger

1. Open Wagers parchment card with shield and wax seal
2. Trial Record parchment table
3. Recent Results dark carved ledger and quote

### Center ledger

- Dominant irregular-edged Council Notes manuscript
- Five framed manuscript notes with deliberate height rhythm
- Official Bet Candidate receives restrained green emphasis
- Council shields and user wax seals remain live components
- Attached manuscript-style message input

### Right ledger

1. Featured Battle Report with distinct title, score, and statistics zones
2. Compact Odds Snapshot parchment table
3. Anchored Current Read carved section

### Footer

One substantial carved navigation beam with five destinations and a lit inset active state.

## Visual system

- Very dark carved oak with restrained antique-gold inlay
- Warm fibrous parchment with worn irregular edges
- Cinematic painted valley header rather than flat geometric mountains
- Controlled vines, roots, canopy, and lantern details confined to the outer frame
- Ornate forest-green and gold tree crest
- Forest green for positive values
- Muted red for negative values
- Antique gold for headings and active controls
- Cinzel for headings
- Crimson Text or a similarly readable classic serif for body content

## Non-negotiable implementation rules

- Follow the **main fantasy UI**, not the surrounding design-board documentation
- No full-page screenshot backgrounds
- No base64 image loaders
- No sample text embedded in artwork
- No inherited V22–V25 styles
- Normal local SVG/CSS assets only
- Decorative elements must never overlap live content
- Components must remain reusable and data-driven
- Existing ledger functions must remain possible: messages, wager detection, unit conversion, persistence, themes, hidden-money mode, collapsible panels, and navigation

## Current build target

`original-v32.html`

## V32 acceptance targets

- Graphics must use the new cinematic landscape, carved oak, parchment, crest, and outer-frame asset kit
- Overall canvas and density must resemble the approved fantasy concept rather than V31's generic medieval dashboard
- Council Notes must remain the focal artifact
- Battle Report must feel like a featured report wing
- Footer must read as a substantial carved architectural beam
- All live data and interaction behavior must remain intact

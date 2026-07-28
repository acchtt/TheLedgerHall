# The Ledger Hall — Original Design

**Status:** Approved source of truth  
**Version:** Fantasy Concept 1.2  
**Locked:** 2026-07-29

The visual source of truth is the **main fantasy Ledger Hall interface** from the approved concept image. The surrounding design-board notes, diagrams, palettes, and documentation are not part of the live page.

## Design direction

A polished medieval-fantasy game dashboard with a painted raster environment and reusable live HTML components. The raster layer supplies the valley, castle, canopy, carved architecture, lantern, banner, panel framing, headings, and footer. Opaque parchment and wood surfaces sit beneath all live figures, wagers, notes, odds, and controls.

## Composition

Desktop reference canvas: **4:3**, proportionally scaled inside wider screens.

- Hero header: approximately **22.5%** height
- Main content: approximately **67.5%** height
- Footer navigation: approximately **10%** height
- Main columns: approximately **27% / 44% / 27%**

### Header

1. Hanging forest-green banner with ornate gold tree crest
2. Lifetime P/L live parchment plaque
3. Central painted crest, monumental title, and ribbon subtitle
4. Trial Record live parchment plaque
5. Vertical carved utility panel with live click targets
6. Cinematic valley, river, layered mountains, distant castle, canopy, haze, and warm daylight

### Left ledger

1. Open Wagers live parchment card with shield and wax seal
2. Trial Record live parchment table
3. Recent Results live list over blank wood

### Center ledger

- Painted Council Notes manuscript shell
- Five live manuscript notes with deliberate height rhythm
- Official Bet Candidate receives restrained green emphasis
- Council shields and user wax seals remain live components
- Attached live message input

### Right ledger

1. Live Battle Report over opaque parchment
2. Live Odds Snapshot over opaque parchment
3. Live Current Read over blank wood

### Footer

One painted carved navigation beam with five transparent, accessible live click regions and a subtle active glow.

## Visual system

- Painted fantasy hall raster skin
- Very dark carved-oak material
- Warm fibrous parchment material
- Controlled vines, roots, canopy, and lantern confined to the painted architecture
- Forest green for positive values
- Muted red for negative values
- Antique gold for headings and active controls
- Cinzel for headings
- Crimson Text for body content

## Non-negotiable implementation rules

- Follow the **main fantasy UI**, not the surrounding design-board documentation
- Painted environment may be raster, but all changing data must remain HTML
- Opaque live surfaces must prevent baked sample data from bleeding through
- Decorative artwork must never block live content or controls
- Components must remain reusable and data-driven
- Existing ledger functions must remain available: messages, wager detection, unit conversion, persistence, themes, hidden-money mode, collapsible panels, and navigation
- Final production assets should be normal repository image files

## Current build target

`original-v35.html`

## V35 transport and acceptance targets

The GitHub connector corrupted direct binary uploads during V33. V35 therefore uses a temporary compact JPEG transport made of small JavaScript text chunks. The loader validates the exact base64 length, decoded byte length, JPEG start/end signatures, and browser decode before showing the painted skin. It switches to a stable SVG/wood fallback instead of leaving a blank page when any check fails.

- Painted skin must pass all loader integrity checks before display
- Failure must produce a visible stable fallback, never an empty dark hall
- Every live area must use opaque parchment or wood
- Overlay coordinates must align with the painted architecture at the 4:3 reference ratio
- Council Notes must remain the focal artifact
- Battle Report and footer controls must remain fully functional
- The existing interaction and persistence layer must remain intact
- Once a reliable direct binary upload route is available, replace the temporary chunk transport with normal image files

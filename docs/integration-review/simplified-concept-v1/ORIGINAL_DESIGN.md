# The Ledger Hall — Original Design Reference

## Canonical status

`ORIGINAL_DESIGN.png` is the canonical visual reference for the current rebuild. It supersedes every earlier composition board, wireframe, and asset-placement experiment.

- Reference dimensions: 1586 × 992 px
- Target desktop canvas: approximately 1600 × 1000 px
- Status: ORIGINAL / SOURCE OF TRUTH
- Reference approved by the user: 2026-07-31

## Required invariants

1. A single panoramic header spans the full interior width.
2. Header content consists of a left stat card, centered emblem/title/subtitle, right stat card, and compact utility group.
3. The primary content remains a three-column desktop grid: narrow left, wide center, narrow right.
4. All modules reuse the same dark-wood header and parchment-body language.
5. Bottom navigation remains one full-width row with five equal destinations.
6. Decorations never overlap live text or data.

## Approved substitution

The newly generated ledger-and-tree emblem replaces the emblem shown in the reference image. Its size and placement must continue to follow the reference.

## Asset policy

The previous audited asset family is archived reference material and is not used by this prototype. The active prototype may use only assets stored in `simplified-concept-v1/assets/`.

## Provisional component locks

- Footer navigation rail: v27 layout and painted PNG icon set, locked for the current review cycle on 2026-07-31.

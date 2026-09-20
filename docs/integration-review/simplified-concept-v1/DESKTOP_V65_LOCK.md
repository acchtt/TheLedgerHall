# The Ledger Hall — Desktop v65 Lock

Status: **LOCKED FOR NOW**

Locked on: 2026-08-01

Canonical viewport: **1600 × 1000**

## Locked baseline

- Header composition and generated landscape v3
- Lifetime P/L board with standalone antique-gold tree mark
- Trial Record summary board
- Three-column dashboard geometry and panel borders
- Council Notes message rhythm, typography, crest placement, and composer alignment
- Left and right panel proportions
- Parchment hierarchy and internal row styling
- Desktop footer geometry, navigation arrangement, and icon treatment

## Explicitly outside this lock

- Mobile and narrow-screen layouts
- Final Battle Report team logos
- Live data wiring and application behavior

## Verification

- No horizontal overflow at 1600 × 1000
- No panel content overflow
- No summary-board content overflow
- Dashboard bounds: x=35–1551, y=189–859
- Footer bounds: x=27–1573, y=879–985
- Council Notes message heights: 105, 108, 139, 84, and 107 px

## Core SHA-256 hashes

- `index.html`: `19B511EB166F5BB4695E395E8E2112AA15E8B27FD2621F4370ADC3478E3050A1`
- `styles.css`: `C90F70F6FC5F8408976BB82AAE978B396965DE026FF879025F1C98C7FC879E90`
- `assets/lifetime-golden-tree-v1.png`: `DB37E606C30CFBD078671BFC4A57E93DE933FEACB814CF2BFFAF529201D53187`
- `assets/ledger-hall-header-landscape-v3.png`: `079F9BF57ED638BB0EB0F1B19ED19B5610A00939C1F1562BD4881B63D6A2CBDD`

Any later visual change to the locked desktop baseline should use a new version number and preserve v65 as the comparison reference.

## Post-lock live-data layer

The visual baseline remains unchanged. The following behavior-only files were added after the lock:

- `index.html` live-data hooks: `D54F964054AF994E62E850CF8869DAE6C96E5F8D3C684229CABAB8C6A3DB2025`
- `live-data.js`: `20F5B5FFAC6AF7D5622E0165E5271583251F875C0375CDCF7E149AFB1D636F09`
- `live-data.json`: `6294D95FC80719C3E6505BF5CC357DE8900C8D07C2AA6D965F2576267635420D`

The locked stylesheet hash remains unchanged. Odds Snapshot is excluded from the live-data layer.

# R01 — Header Integration Review

## Status

Implemented locally on `integration/locked-assets-r01`. Not pushed or deployed.

## Integrated assets

| Asset | Repository path | SHA-256 verification |
|---|---|---|
| 01 — Header panorama | `assets/locked/r01-header/asset_01_header_panorama.png` | Pass |
| 09 — Heraldic shield | `assets/locked/r01-header/asset_09_heraldic_shield.png` | Pass |
| 13 — Subtitle scroll | `assets/locked/r01-header/asset_13_subtitle_scroll.png` | Pass |

All three files appear in `docs/integration-controls/INTEGRATION_ASSET_ALLOWLIST.json` and remain byte-identical to `docs/integration-controls/CORRECTED_MANIFEST.json`.

No retired, preview, review, test, state, or reference asset is used by production HTML or CSS.

## Implementation

- Asset 01 supplies the masthead panorama with cover-style cropping.
- Asset 09 is the decorative crest image.
- `The Ledger Hall` remains live `<h1>` text.
- Asset 13 is the subtitle ribbon background.
- `Council Notes, Wagers & Battle Reports` remains live paragraph text.
- Existing lifetime and trial data remain live on desktop and tablet.
- Existing utility buttons remain live and are deferred visually to R02.
- On viewports below 900 px, R01 is centered independently of the legacy 1024 px dashboard. Header stat plaques and utility buttons are temporarily hidden to preserve a readable title stack; their compact responsive treatment remains part of later integration work.

## Responsive checks

Measured results are in `r01-responsive-audit.json`.

- 1920 px desktop: pass
- 1440 px desktop: pass
- 1024 px tablet: pass
- 390 px mobile header crop: pass

The pre-existing dashboard overflow below 1024 px remains unchanged and is not counted as an R01 regression.

## Regression checks

- Theme control toggled on and off: pass
- Open Wagers collapsed and expanded: pass
- Browser warnings and errors: none
- Production data and interaction JavaScript: unchanged

## Review files

- `r01-header-desktop-1920.png`
- `r01-header-desktop-1440.png`
- `r01-header-tablet-1024.png`
- `r01-header-mobile-390.png`
- `r01-desktop-1440.png`

## Rollback

Revert the R01 commit. The Phase 0 baseline and audit-control commits remain intact.

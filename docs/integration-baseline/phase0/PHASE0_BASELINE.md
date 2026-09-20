# The Ledger Hall — Phase 0 Baseline

## Scope

This baseline was captured before integrating any audited locked asset.

- Repository: `acchtt/TheLedgerHall`
- Base branch: `main`
- Base commit: `1c29b87`
- Integration branch: `integration/locked-assets-r01`
- Deployed baseline: `https://acchtt.github.io/TheLedgerHall/?v=23`
- Audited handoff: `The_Ledger_Hall_Locked_Assets_01-28_2026-07-31_v6_audited`
- Integration controls: `docs/integration-controls/`

No production HTML, CSS, JavaScript, or locked asset binary was changed in Phase 0.

The corrected manifest, integration allowlist, audit results, and audit report were compared against the handoff copies and found byte-for-byte identical before being added to the branch.

## Captured viewports

| Capture | Viewport | Document width | Result |
|---|---:|---:|---|
| `desktop-1920.png` | 1920 × 1080 | 1920 | No horizontal overflow |
| `desktop-1440.png` | 1440 × 1000 | 1440 | No horizontal overflow |
| `tablet-1024.png` | 1024 × 900 | 1024 | Fixed 1024 px layout |
| `tablet-768.png` | 768 × 900 | 1024 | Horizontal overflow |
| `mobile-430.png` | 430 × 900 | 1024 | Horizontal overflow |
| `mobile-390.png` | 390 × 844 | 1024 | Horizontal overflow |
| `mobile-360.png` | 360 × 800 | 1024 | Horizontal overflow |

Machine-readable measurements are in `responsive-audit.json`.

## Baseline findings

1. The current deployed page preserves a 1024 px fixed layout below the 900 px breakpoint.
2. The live title stack is hidden by current CSS (`.brand { display: none !important; }`).
3. The current page depends on a runtime-decoded blob skin assembled from `assets/ledger-v23.part0` through `part3`.
4. The masthead, dashboard, and footer remain functional HTML containers, so the locked assets can be integrated without replacing the application logic.
5. Existing messages, wager detection, unit conversion, persistence, themes, hidden-money mode, collapsible panels, and navigation are implemented in `chat.js` and must remain untouched during R01.
6. The sub-1024 overflow is recorded as existing responsive debt. It is not part of the R01 header-only change and will be handled in the approved responsive phase.

## R01 approval boundary

R01 may change only:

- the header asset files copied from the audited allowlist;
- masthead/title-stack markup needed for accessibility and layering;
- masthead-specific CSS;
- the production stylesheet reference if a new integration stylesheet is introduced.

R01 must not change:

- side-column, central-ledger, battle-report, or footer structure;
- live data in `chat.js`;
- navigation behavior;
- retired Assets 17 or 22;
- any locked source asset in place.

## Rollback

R01 will be a separate commit after this Phase 0 baseline commit. Rejection of R01 can therefore be handled by reverting only the R01 commit while retaining this evidence.

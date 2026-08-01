# Repository Cleanup

Cleanup performed after publishing the locked Ledger Hall desktop v65 baseline.

## Retained

- The repository-root GitHub Pages preview and its complete dependency chain.
- The locked desktop v65 prototype under `docs/integration-review/simplified-concept-v1/`.
- Production assets referenced by either active entry point.
- The canonical original-design reference, v65 lock record, live-data contract, final review previews, and asset build scripts.
- Phase 0 screenshots and integration-control audit records.

## Removed

- Superseded root prototypes and stylesheet versions from v5 through v35.
- Assets used exclusively by those retired prototypes.
- The rejected R01 wireframe and corrected-placement experiment.
- Intermediate border, header, emblem, icon, and transparency exports not used by the active prototype.
- Historical preview screenshots other than the three approved v65 review images.
- Deferred mobile and tablet experiment screenshots.

## Verification rule

The retained root page and desktop v65 page must resolve every local runtime reference. JavaScript and JSON validation must pass before this cleanup is published.

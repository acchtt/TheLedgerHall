# Audited Integration Controls

These files are verified, byte-identical copies of the controls supplied with the audited v6 handoff.

Integration rules:

1. Copy production assets only when their paths appear in `INTEGRATION_ASSET_ALLOWLIST.json`.
2. Verify copied asset bytes against `CORRECTED_MANIFEST.json` before committing each region.
3. Do not integrate Assets 17 or 22.
4. Do not integrate files matching the allowlist's forbidden patterns, including review, preview, test, state, or reference files.
5. Treat `LOCKED_SET_AUDIT_RESULTS.json` and `LOCKED_SET_AUDIT_REPORT.md` as the pre-integration audit record; do not rewrite them to describe later implementation work.

The source files remain read-only reference material. These copies are committed so each integration phase can be reviewed without depending on an external folder.

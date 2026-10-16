# Product

<!-- impeccable:product-schema 1 -->

This record captures established behavior and repository-backed product facts for The Ledger Hall as of 16 October 2026. Items marked **Open** are not decisions and must not be filled in by design work without confirmation.

## Platform

web

## Users

- The interface and documentation address an individual managing their own finances: budget targets, outstanding debts, scheduled payments, and everyday transactions.
- **Open:** whether The Ledger Hall is intended strictly for its owner, for a household, or for a broader audience. The existing application does not demonstrate separate user accounts or collaborative roles.

## Product Purpose

The Ledger Hall is a personal finance ledger that makes it possible to record financial activity, monitor debt reduction and savings goals, plan payments, and review financial progress in one browser-based application.

Its current success path is operational rather than promotional: a person can add debts and goals, log payments and other transactions, understand what is due, compare payoff strategies, and export their records.

## Positioning

The currently implemented mechanism combines a manual transaction ledger, debt accounts with daily or monthly schedules, budget goals, due/overdue reminders, and an estimated snowball/avalanche debt payoff planner in a single interface.

**Open:** a distinct market position or claim relative to other finance tools has not been established. Do not invent claims of uniqueness, financial accuracy, bank connectivity, or measurable outcomes.

## Operating Context

- Browser-based use on desktop, tablet, and mobile screens.
- Six primary destinations: Overview, Budget Goals, Debts, Transactions, Payoff Planner, and Reports & Settings.
- Typical work: create or update debts/goals; enter payments, contributions, income, and expenses; inspect summaries, recent activity, and payment reminders; calculate an estimated payoff order; back up or export data.
- Local browser storage is available when the cloud API cannot be reached. The interface displays cloud/local sync status.
- Financial values can be displayed in VND, USD, EUR, GBP, JPY, or KRW. VND is the current default. The interface copy is in English.
- Reports are available as CSV transaction export, browser print/Save-as-PDF, and JSON backup/restore.

## Capabilities and Constraints

- **Existing frontend:** static HTML, CSS, and vanilla JavaScript. `index.html` is the application entry point, with modules under `js/` and styles in `styles.css`.
- **Existing hosting/storage architecture:** Cloudflare Pages, Pages Functions, and Cloudflare D1. The Pages Function is `functions/api/state.js`, using the `LEDGER_DB` binding and the `user_state` table.
- **Current storage mode:** `GET /api/state` and `PUT /api/state` use the single D1 row keyed `user_email = 'default'`, without Cloudflare Access authentication. This means anyone who can access the API can read and overwrite the shared financial state. Preserve the distinction between *cloud sync* and *privacy/security* in any future UI copy. Public access is an accepted current configuration, not a claim that the data is private.
- The browser immediately caches state in `localStorage` and attempts cloud synchronization when available. The existing model stores goals, debts, transactions, and settings as one JSON snapshot.
- Previous D1 rows keyed by Cloudflare Access email are not automatically loaded by the new shared-key API; the README explains optional manual migration. Do not assume old data has been migrated.
- Debt details can include current and optional starting balances, APR, notes, payment frequency, and due day. Reminders reflect scheduled daily or monthly obligations; no push-notification service is evidenced.
- The payoff planner is an **estimate**, not lender-grade amortization. Interest is approximated monthly from APR / 12; daily payment schedules use 30.4375 days per month. Actual lender calculations can differ.
- The codebase supports light and dark themes, responsive layouts, and browser-local fallback. Do not replace these behaviors as a side effect of visual changes.
- There is no repository evidence of bank-feed synchronization, financial advice, multi-user authorization, or a native mobile application.

## Brand Commitments

- Established product name: **The Ledger Hall**.
- Current short description: **Personal finance ledger**.
- The existing application includes an `LH` mark and finance-oriented language such as Overview, Debts, Ledger, and Payoff Planner. These are incumbent interface facts, not a newly approved visual direction.
- **Open:** no binding visual redesign reference, formal brand guide, or additional identity assets have been confirmed for this product.

## Evidence on Hand

- `README.md`: product capabilities, deployment architecture, data synchronization, backup behavior, and payoff-planner assumptions.
- `index.html`: primary navigation, existing forms, labels, user actions, and entry point.
- `js/core.js`, `js/dashboard.js`, `js/accounts.js`, `js/transactions.js`, `js/planner.js`, `js/reports.js`: application state and feature implementation.
- `functions/api/state.js`, `migrations/0001_init.sql`, and `wrangler.example.jsonc`: D1 API, schema, and deployment reference.
- `styles.css`: current visual implementation; visual-system documentation belongs in `DESIGN.md` if separately requested.
- No customer research, usage benchmarks, testimonials, financial accuracy certification, or legal/compliance claims are established by these repository files. Future design work must not invent them.

## Product Principles

These are working principles inferred from the product's implemented behavior, **pending owner confirmation**, rather than new mandates:

1. Keep financial obligations, recorded activity, and progress understandable at a glance.
2. Make routine payment and transaction entry straightforward without sacrificing record detail.
3. Clearly distinguish recorded balances/transactions from payoff projections and estimates.
4. Keep records exportable and recoverable through explicit backup tools.
5. Show the actual sync/storage state; do not imply confidentiality or account isolation that the shared public API does not provide.

## Accessibility & Inclusion

- The existing interface includes form labels, semantic sections, responsive layout rules, and light/dark display options. Accessibility compliance has not been audited or certified.
- **Open:** no product-specific accessibility standard, language-support requirement, or assistive-technology target has been confirmed.

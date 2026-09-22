# The Ledger Hall

A responsive personal finance application for budget goals, debt management, daily/monthly payment tracking, and debt payoff planning.

## Architecture

The production setup is designed for **Cloudflare Pages + Pages Functions + D1**:

- Static frontend: HTML, CSS, vanilla JavaScript
- Server API: Cloudflare Pages Functions (Workers runtime)
- Persistent database: Cloudflare D1
- Authentication perimeter: Cloudflare Access
- Local fallback/cache: browser `localStorage`

The frontend loads the authenticated user's state from D1 on startup and writes changes back to D1 automatically. If the API is unavailable, the app continues to work with the local browser cache and displays the sync state in the sidebar.

## Features

- **Financial dashboard** — debt, monthly payments, goal savings, net activity, debt/goal progress, reminders, a 14-day activity chart, and recent ledger entries.
- **Budget goals** — create/edit/delete targets, target dates, progress, and linked contributions.
- **Debt management** — current balance, optional starting balance/APR, daily or monthly scheduled payments, due dates, notes, and popup payment logging.
- **Transaction ledger** — debt payments, goal contributions, income, expenses, filtering, search, and reversible balance adjustments.
- **Recurring payment reminders** — daily schedule checks plus monthly due-date/overdue checks with configurable lead days.
- **Debt payoff calculator** — snowball and avalanche strategies, extra monthly payments, payoff date, interest estimate, and payoff order.
- **Reports and portability** — CSV export, print/Save-as-PDF report, full JSON backup, and JSON restore.
- **Responsive UI** — desktop, tablet, and mobile layouts with dark/light themes.
- **Cloud sync** — per-user state stored in D1 using the authenticated Cloudflare Access email.
- **Offline fallback** — local browser cache remains available when cloud sync is temporarily unavailable.

## File structure

```text
TheLedgerHall/
├── index.html
├── styles.css
├── _headers
├── functions/
│   └── api/
│       └── state.js
├── migrations/
│   └── 0001_init.sql
├── js/
│   ├── core.js
│   ├── dashboard.js
│   ├── accounts.js
│   ├── transactions.js
│   ├── planner.js
│   └── reports.js
├── wrangler.example.jsonc
├── README.md
└── .nojekyll
```

## Cloudflare Pages hostname

Cloudflare Pages automatically provides a hostname in this format:

```
<project-name>.pages.dev
```

For this project, use the project name `theledgerhall` if available:

```
https://theledgerhall.pages.dev
```

Cloudflare does **not** provide a `.pages.com` project hostname. If you own a custom domain, you can attach it later from **Pages → Custom domains**.

## Deploy to Cloudflare Pages

### 1. Create the D1 database

Create a D1 database named:

```
theledgerhall-db
```

You can do this in the Cloudflare dashboard under **Workers & Pages → D1**, or with Wrangler:

```bash
npx wrangler d1 create theledgerhall-db
```

### 2. Apply the database migration

From the repository directory:

```bash
npx wrangler d1 execute theledgerhall-db --remote --file=migrations/0001_init.sql
```

The migration creates one `user_state` row per authenticated Cloudflare Access email.

### 3. Connect the GitHub repository to Pages

In Cloudflare:

1. Go to **Workers & Pages**.
2. Select **Create application → Pages → Connect to Git**.
3. Connect GitHub and select `acchtt/TheLedgerHall`.
4. Use project name `theledgerhall`.
5. Production branch: `main`.
6. Build command: `exit 0`.
7. Build output directory: `.`.
8. Deploy.

Cloudflare will assign the project a `*.pages.dev` hostname.

### 4. Bind D1 to the Pages Function

Open the Pages project and go to:

**Settings → Bindings → Add → D1 database**

Set:

```
Variable name: LEDGER_DB
Database: theledgerhall-db
```

Redeploy the Pages project after adding the binding.

The server function at `/api/state` expects the binding name to be exactly `LEDGER_DB`.

### 5. Protect the app with Cloudflare Access

The D1 API intentionally refuses unauthenticated requests. Protect the Pages application with **Cloudflare Access** and allow only your email/account.

The API reads:

```
Cf-Access-Authenticated-User-Email
```

and uses that verified identity as the D1 key. Different allowed users therefore receive separate finance data.

Until Access is configured, the frontend will show **Cloud sync locked** and continue using local browser storage.

## Optional Wrangler configuration

`wrangler.example.jsonc` is included as a reference.

After creating the D1 database, replace:

```
REPLACE_WITH_YOUR_D1_DATABASE_ID
```

with the actual database ID and rename the file to `wrangler.jsonc` if you want Wrangler configuration to become the source of truth.

If you configure Pages and bindings entirely in the Cloudflare dashboard, you do not need to rename this file.

## Local development

A simple static server still works for frontend-only development:

```bash
python -m http.server 8080
```

In that mode, `/api/state` is unavailable, so the application automatically falls back to local storage.

For full Pages Functions/D1 development, use Wrangler after configuring a local D1 binding:

```bash
npx wrangler pages dev .
```

## Data model

D1 stores one JSON finance state per authenticated Access user:

```text
user_state
├── user_email   TEXT PRIMARY KEY
├── payload      TEXT
└── updated_at   TEXT
```

The payload contains:

- `goals[]`
- `debts[]`
- `transactions[]`
- `settings`

This snapshot model keeps the existing client state atomic and makes cross-device synchronization simple. Individual debt and transaction calculations still happen in the application.

## Cloud/local sync behavior

- On startup, the app requests `GET /api/state`.
- If D1 already contains data, the D1 copy becomes the active state.
- If D1 has no state yet, the current local data is uploaded automatically.
- Every later change is cached locally immediately and debounced to D1.
- If cloud sync fails, local changes remain available and the sidebar shows the degraded sync state.
- When connectivity returns, the client retries synchronization.

## Payoff planner assumptions

The payoff planner is for planning rather than lender-grade amortization.

- Interest is estimated monthly from APR / 12.
- Monthly schedules use the configured scheduled payment.
- Daily schedules are converted using 30.4375 days per average month.
- The starting payoff budget equals combined scheduled minimums plus the entered extra payment.
- As debts clear, the same monthly budget rolls toward remaining balances.

Actual lender interest, fees, allocation rules, compounding, and statement dates can differ.

## Backups

D1 provides cross-device persistence, but JSON backup/export remains available under **Reports & Settings** for an independent copy of your finance data.

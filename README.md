# The Ledger Hall

A responsive, privacy-first personal finance web application for budget goals, debt management, daily/monthly payment tracking, and debt payoff planning.

## Features

- **Financial dashboard** — debt, monthly payments, goal savings, net activity, debt/goal progress, reminders, a 14-day activity chart, and recent ledger entries.
- **Budget goals** — create/edit/delete targets, target dates, progress, and linked contributions.
- **Debt management** — original/current balances, APR, daily or monthly scheduled payments, monthly due day, notes, and one-click payment logging.
- **Transaction ledger** — debt payments, goal contributions, income, expenses, filtering, search, and reversible balance adjustments.
- **Recurring payment reminders** — daily schedule checks plus monthly due-date/overdue checks with configurable lead days.
- **Debt payoff calculator** — snowball and avalanche strategies, extra monthly payments, payoff date, interest estimate, and payoff order.
- **Reports and portability** — CSV export, print/Save-as-PDF report, full JSON backup, and JSON restore.
- **Responsive UI** — desktop, tablet, and mobile layouts with dark/light themes.
- **Privacy** — no account, analytics, API keys, or external database. Data is stored in browser `localStorage`.

## Tech stack

The app is intentionally build-free:

- HTML5
- CSS3
- Vanilla JavaScript using modern browser APIs
- Browser `localStorage`

There are no runtime dependencies, package managers, or build tools.

## File structure

```text
TheLedgerHall/
├── index.html
├── styles.css
├── js/
│   ├── core.js
│   ├── dashboard.js
│   ├── accounts.js
│   ├── transactions.js
│   ├── planner.js
│   └── reports.js
├── README.md
└── .nojekyll
```

## Run locally

Use any static file server. For example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

You can also open `index.html` directly in a modern browser, though serving it over HTTP is recommended.

## GitHub Pages

1. Open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select `main` and `/ (root)`.
4. Save.

No build workflow is required.

## Stored data

The application stores one JSON document at `ledgerHall.v1`, containing:

- `goals[]`
- `debts[]`
- `transactions[]`
- `settings`

Debt payment transactions reduce the linked debt balance; deleting them restores that amount. Goal contributions increase the linked goal total; deleting them reverses the contribution.

## Payoff planner assumptions

The payoff planner is for planning rather than lender-grade amortization.

- Interest is estimated monthly from APR / 12.
- Monthly schedules use the configured scheduled payment.
- Daily schedules are converted using 30.4375 days per average month.
- The starting payoff budget equals combined scheduled minimums plus the entered extra payment.
- As debts clear, the same monthly budget rolls toward remaining balances.

Actual lender interest, fees, allocation rules, compounding, and statement dates can differ.

## Backups

Data lives only in the current browser profile. Use **Reports & Settings → Export full backup** before clearing browser storage or moving to another device.

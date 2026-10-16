# Merchant Hall — UI concept prototypes

**Repository:** `acchtt/TheLedgerHall`  
**Branch:** `demo/merchant-hall`  
**Status:** Concept prototype for review, not production-ready integration.

## Open the prototype

Open `prototypes/merchant-hall/index.html` in a modern browser, or from the repository root run:

```sh
python -m http.server 8080
```

Then visit `http://localhost:8080/prototypes/merchant-hall/`.

A single responsive preview includes three distinct Merchant Hall layout directions. Use the top-right concept selector:

| Direction | Thesis | Visual hierarchy |
| --- | --- | --- |
| **Ledger Desk** | Merchant's working desk | Debt overview / upcoming payment / obligations / recent entries |
| **Counting Room** | Dense financial register | Monthly reconciled figures / itemized ledger / due schedule |
| **Reserve Chamber** | Quiet savings and commitments | Savings headline / goal progress / upcoming payments / activity |

The same illustrative finances appear in each composition. Layout adapts at 1180px, 900px, and 620px; at 900px the desktop sidebar becomes a horizontally scrollable mobile navigation row. Check at 1440px desktop and 390px mobile for visual comparison.

## Fidelity & limitations

- Standalone HTML/CSS/vanilla JavaScript with no build step and no modification of existing production `index.html`, `styles.css`, `js/`, or `functions/`.
- Illustrative figures only. The demo does **not** read or write `/api/state`, Cloudflare D1, or browser storage.
- The concept switcher works; the payment dialog is a **preview** and discards entries.
- Other navigation sections explain that the prototype is limited to the Overview concept. Do not mistake these placeholders for functioning product pages.
- The serif typography uses Google Fonts when available and a local serif fallback otherwise.
- The existing `DESIGN.md` documents the current production look and remains unchanged. These are candidate visual directions, **not** an approved rebrand.
- No responsive screenshot pass or live deployment verification has been completed yet; browser/device visual QA remains outstanding.

## Review decision

Compare the three concepts for clarity of balances, obligations, transaction access, and the degree of medieval character. Select one or ask for a hybrid before any production UI changes. After approval, implement through the actual app components and run accessibility, responsive, and functional QA.

**Production warning:** The existing application currently uses a public unauthenticated D1 API. This static demo does not change or conceal that behavior.

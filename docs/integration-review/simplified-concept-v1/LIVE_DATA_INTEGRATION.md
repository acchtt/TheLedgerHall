# Ledger Hall Live Data Integration

Desktop visual baseline: v65.

## Included

- Lifetime P/L summary
- Trial summary and Trial Record table
- Open Wager card
- Recent Results
- Council Notes and message submission
- Battle Report score summary
- Current Read

## Excluded

Odds Snapshot is intentionally absent from the live-data contract. Its current markup remains frozen until a replacement module is selected.

## Data source

The page renders an identical built-in fallback immediately. In a normal browser it then loads `live-data.json` without browser caching and refreshes it every 15 seconds while visible.

Configure the source with the `data-endpoint` and `data-poll-ms` attributes on the `live-data.js` script tag.

## Runtime updates

```js
document.dispatchEvent(new CustomEvent("ledgerhall:data", {
  detail: {
    lifetime: { pl: 3.125 },
    battle: { leftScore: 11, rightScore: 4, time: "20:10" }
  }
}));
```

Dispatch `ledgerhall:refresh` to request a reload. In normal extensible browser contexts, the controller is also exposed as `window.LedgerHallLiveData`.

Restricted host environments can update the JSON value of the hidden `#ledger-hall-live-patch` textarea; the runtime reads that bridge every 250 ms. This keeps live updates available even when global APIs are frozen.

# Live DOM Region Map

## R01 — Header panorama

Current container:

- `header.masthead`

Current children:

- `.hanging-banner`
- `.summary-card.lifetime-card`
- `.brand`
- `.summary-card.positive`
- `nav.utility-nav`

Approved R01 assets:

- Asset 01: `asset_01_header_panorama.png`
- Asset 09: `asset_09_heraldic_shield.png`
- Asset 13: `asset_13_subtitle_scroll.png`

Current CSS touchpoints:

- `ledger-v23.css`: `.page-frame`, `.masthead`, `.hanging-banner`, `.brand`, `.summary-card`, `.utility-nav`
- `ledger-v23-final.css`: corrected masthead-relative positions
- `ledger-v24.css`: current production import and surface overrides

R01 constraints:

- Asset 01 supplies only the painted panorama.
- Asset 09 remains a decorative crest image with empty alternative text.
- Page title and subtitle remain live text.
- Asset 13 supplies only the scroll ribbon.
- Asset 17 must not be copied or referenced.
- Utility controls remain live buttons.

## R02 — Top navigation and global controls

Current container:

- `nav.utility-nav`

Deferred until R02:

- button frames;
- utility icons;
- hover, focus, active, and hidden-money states.

## R03 — Left side-column modules

Current container:

- `aside.left-column`

Children:

- Open Wagers: `section.wood-panel` with `#open-wagers`
- Trial Record: `section.wood-panel` with `#trial-details`
- Recent Results: `section.wood-panel.recent-panel` with `#recent-results`

Deferred until R03.

## R04 — Central ledger

Current container:

- `section.chat-panel`

Live children:

- `#chat-feed`
- `#message-form`
- `#message-input`

Deferred until R04. Existing message and input behavior must remain intact.

## R05 — Battle Report and Odds Snapshot

Current container:

- `aside.right-column`

Children:

- `section.wood-panel.battle-panel`
- Odds Snapshot `section.wood-panel` with `#odds-list`
- `section.wood-panel.current-read`

Deferred until R05.

## R06 — Footer navigation

Current container:

- `footer.bottom-nav`

Deferred until R06. Existing button targets are mapped in `chat.js`.

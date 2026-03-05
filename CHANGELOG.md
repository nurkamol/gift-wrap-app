# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-03-05

First stable public release. The extension went through six internal iterations
(v1–v6) before this release; the full history is documented below.

### Added

#### Extension (gift-wrap.js v6)
- Per-item gift wrap checkbox on every product page
- Colour variants pulled automatically from the Gift Wrap product — no manual IDs
- Optional 200-character personalised gift message per item
- Gift wrap line appears directly below its parent product in the cart (Dawn `<table>` structure handled)
- **Orphaned wrap cleanup** — when a product is removed from the cart via any method (drawer, page, or programmatic), its gift wrap is automatically removed too
- **`parentEverInCart` guard** — prevents premature wrap removal when a customer selects gift wrap before adding the product to cart
- **`cleanupRunning` flag** — prevents re-entrant `cleanupOrphanedWraps()` calls that caused an infinite cart-update loop in earlier versions
- **`res.ok` check in `window.fetch` interceptor** — cleanup's own `/cart/change.js` calls no longer re-trigger the `gw:cart-changed` event, eliminating the "There was an error while updating your cart" Shopify error
- Duplicate prevention — one gift wrap per product, enforced on every add
- Qty control — option to hide the quantity stepper for gift wrap rows in cart
- Inline Remove button on the product page block

#### Theme block (gift_wrap.liquid)
- Colour dropdown populated from the Gift Wrap product's variants via `all_products` + a `product` picker — no variant IDs to copy
- Warning message rendered in dropdown when no Gift Wrap product is selected in settings
- `data-one-per-product="true"` hardcoded (was a configurable checkbox in earlier builds)
- **Header icon** setting: editable text field (default `🎁`) — paste any emoji or clear to hide; replaces the old on/off checkbox

#### Schema settings
- `gift_wrap_product` — product picker (replaces manual handle input)
- `section_title` — heading above the block
- `price` + `currency` — cosmetic display price with currency selector (AED, USD, EUR, GBP, SAR, KWD, QAR)
- `accent_color` — colour picker for checkbox fill and price text
- `header_icon` — free-text emoji field
- `show_message_field` — toggle for the gift message textarea
- `message_placeholder` — customisable placeholder text
- `hide_gift_wrap_qty` — hides the qty stepper for gift wrap in cart
- `show_remove_btn` — shows/hides inline Remove button on the block

#### Admin web page (web/page.js + web/index.js)
- Full admin page rendered via shared `renderPage()` module
- Quick Setup card — 5-step walkthrough
- Frequently Asked Questions — 32 answers across 6 categories with live search and accordion
- Author card with links (website, GitHub, email)
- "Open Theme Editor" button that deep-links to the store's theme editor (requires `?shop=` param)
- Local HTTPS dev server (`web/index.js`) with automatic self-signed cert fallback to HTTP

#### Infrastructure
- Cloudflare Pages deployment (`functions/[[path]].js`) — Web Standard `Request`/`Response`, catch-all route
- `public/index.html` static redirect for bare visits
- `npm run cf-deploy` script (`wrangler pages deploy public`)
- Self-signed TLS cert generation instructions for local dev

#### Documentation
- `README.md` — full feature reference, project structure, setup guide, troubleshooting, theme compatibility
- `PUBLISHING.md` — step-by-step Cloudflare Pages + Shopify CLI deploy guide
- `INSTALLING.md` — per-store installation guide for client stores (Partner account and independent stores)
- `CHANGELOG.md` — this file

### Internal version history

| Extension version | Key change |
|---|---|
| v1 | Initial release — basic checkbox, manual variant IDs in schema textarea |
| v2 | Auto colour variants via `all_products` product picker |
| v3 | Gift message textarea + char counter |
| v4 | Cart ordering — gift wrap reordered below its parent in Dawn's `<table>` cart |
| v5 | `window.fetch` interceptor — catches Dawn's silent cart mutations (`/cart/change.js`, `/cart/update.js`) to fire `gw:cart-changed` |
| v6 | `cleanupRunning` flag + `res.ok` check — eliminates infinite loop and Shopify cart error |

---

## [Unreleased]

_Nothing yet._

<!-- Template for future releases:

## [X.Y.Z] — YYYY-MM-DD

### Added
### Changed
### Fixed
### Removed

-->

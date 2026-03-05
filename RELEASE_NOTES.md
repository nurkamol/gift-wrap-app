# 🎁 Gift Wrap App — v1.0.0 Release Notes

**Release date:** 2026-03-05
**Type:** Initial stable release

---

## What's included

A production-ready Shopify **Theme App Extension** that adds per-item gift wrapping to any product page. No Shopify Plus required. Works on all plans.

---

## Highlights

### 🎨 Zero-config colour variants
Connect your Gift Wrapping product via a picker in the Theme Editor — all colour variants populate automatically. No variant IDs to copy or maintain.

### 🛒 Smart cart sync
Gift wrap is automatically removed from the cart when its parent product is removed — via the cart drawer, cart page, or any programmatic method. Powered by a `window.fetch` interceptor that catches Dawn's silent cart mutations.

### 🔄 Infinite loop fix (v6)
Early builds could trigger a "There was an error while updating your cart" Shopify error. Resolved with a `cleanupRunning` re-entrancy guard and a `res.ok` check in the fetch interceptor so the cleanup's own cart API calls don't re-trigger the event loop.

### 💬 Gift messages
Optional 200-character personalised message per item — shown as a `Gift message` property on the order in Shopify Admin.

### 🎁 Editable header icon
The emoji shown in the block header is a free-text setting — paste any emoji or clear the field to hide it entirely.

### ☁️ Cloudflare Pages admin page
The "Manage app" page is deployed to Cloudflare Pages (`gift-wrap-app.pages.dev`) with a built-in FAQ (32 answers, 6 categories, live search) and a Quick Setup guide.

---

## Files in this release

```
gift-wrap-app-v1.0.0.zip
├── extensions/gift-wrapping/
│   ├── assets/gift-wrap.js        ← Extension logic (v6)
│   ├── assets/gift-wrap.css       ← Styles
│   ├── blocks/gift_wrap.liquid    ← Liquid block + schema
│   ├── locales/en.default.json
│   └── shopify.extension.toml
├── functions/[[path]].js          ← Cloudflare Pages function
├── web/
│   ├── index.js                   ← Local HTTPS dev server
│   ├── page.js                    ← Shared admin page renderer (FAQ, Quick Setup)
│   └── certs/cert.pem             ← Self-signed cert (dev only, public key)
├── public/index.html              ← Static redirect for bare Cloudflare visits
├── shopify.app.toml
├── package.json
├── package-lock.json
├── README.md
├── PUBLISHING.md
├── INSTALLING.md
├── CHANGELOG.md
└── LICENSE
```

---

## Compatibility

| Theme | Status |
|---|---|
| Dawn (Shopify default) | ✅ Fully supported |
| Prestige | ✅ Supported |
| Impulse | ✅ Supported |
| Other themes | ✅ Should work — uses standard Shopify Cart AJAX API |

---

## Getting started

1. See **[PUBLISHING.md](./PUBLISHING.md)** to deploy the extension and admin page
2. See **[INSTALLING.md](./INSTALLING.md)** to add the block to a store's theme
3. See **[README.md](./README.md)** for full configuration reference

---

## Known limitations

- Cart ordering (gift wrap below parent) is implemented for Dawn's `<table>` cart structure. Themes with non-standard cart markup may require minor adaptation.
- The Cloudflare Pages admin page (`web/page.js`) is a static info page — it does not implement OAuth token exchange. For a TAE-only app with no backend API calls this is sufficient.

---

*Built by [Nurkamol Vakhidov](https://nurkamol.com) · MIT License*

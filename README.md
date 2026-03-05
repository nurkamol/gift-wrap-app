# 🎁 Gift Wrap App — Per-Item Shopify Theme App Extension

![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)
![Shopify](https://img.shields.io/badge/Shopify-Theme%20App%20Extension-green)
![Version](https://img.shields.io/badge/version-1.0.1-blue)

A Shopify **Theme App Extension (TAE)** that adds per-item gift wrapping to any product page. Customers can select a wrap colour, add a personalised message, and the gift wrap line item is automatically linked to its parent product in the cart.

Works on all Shopify plans — no Shopify Plus required.

> 📖 **Ready to go live?** See [PUBLISHING.md](./PUBLISHING.md) for the full step-by-step production deploy guide.
> 🏪 **Installing on a client store?** See [INSTALLING.md](./INSTALLING.md) for the per-store setup guide.
> 📋 **What's new?** See [CHANGELOG.md](./CHANGELOG.md) for the full version history.

---

## ✨ Features

| Feature | Detail |
|---|---|
| **Per-item selection** | Gift wrap checkbox on each product page |
| **Auto colour variants** | Colours pulled directly from your Gift Wrap product — no manual IDs |
| **Gift message** | Optional 200-character personalised message per item |
| **Smart cart sync** | Gift wrap is auto-removed when its product is removed from the cart |
| **Duplicate prevention** | One gift wrap per product, always — no accidental duplicates |
| **Cart ordering** | Gift wrap line always appears directly below its product |
| **Qty control** | Option to hide the quantity selector for gift wrap in cart |
| **Accent colour** | Fully customisable brand colour for checkbox and accents |
| **Dawn-compatible** | Works with Dawn, Prestige, Impulse and most modern Shopify themes |

---

## 📁 Project Structure

```
gift-wrap-app/
├── shopify.app.toml                    ← App config (client_id, store URL)
├── package.json
├── web/
│   ├── index.js                        ← HTTPS admin page (shown in Shopify admin)
│   └── certs/
│       ├── cert.pem                    ← Self-signed TLS cert (dev only)
│       └── key.pem                     ← Private key (git-ignored)
└── extensions/
    └── gift-wrapping/
        ├── shopify.extension.toml
        ├── blocks/
        │   └── gift_wrap.liquid        ← Liquid block + schema settings
        ├── assets/
        │   ├── gift-wrap.js            ← Cart API logic (v6)
        │   └── gift-wrap.css           ← Styles
        └── locales/
            └── en.default.json
```

---

## ✅ Prerequisites

- **Node.js 18+**
- **Shopify Partner account** → https://partners.shopify.com
- **Shopify CLI** (installed automatically via `npm install`)
- A dev store and/or a live store where the app will be installed

---

## 🛍️ Step 1 — Create the Gift Wrapping Product

Do this in every Shopify store where you want the extension active (dev + production).

1. Go to **Products → Add product**
2. Title: `Gift Wrapping`
3. Price: `10.00` (or whatever you charge — this is the real charge at checkout)
4. Under **Options**, add one option:
   - Option name: `Colour`
   - Values: `Gray`, `Gold`, `Silver` (add/remove to match your stock)
5. Set status to **`Draft`** — this hides it from your storefront but keeps it purchasable via the cart API
6. **Save**

> No variant IDs to copy. The theme block reads variants automatically via the product picker.

---

## 🔧 Step 2 — Local Development Setup

### Install dependencies

```bash
cd gift-wrap-app
npm install
```

### Generate the HTTPS cert (one-time)

The admin web page must be served over HTTPS (Shopify requirement). Generate a self-signed cert for localhost:

```bash
mkdir -p web/certs
openssl req -x509 \
  -newkey rsa:2048 \
  -keyout web/certs/key.pem \
  -out web/certs/cert.pem \
  -days 3650 \
  -nodes \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

> `key.pem` is git-ignored. `cert.pem` is safe to commit (it's public).

### Start the dev server

Open **two terminal tabs**:

```bash
# Tab 1 — Extension dev server (hot-reloads your Liquid/JS/CSS)
shopify app dev

# Tab 2 — Admin web page (serves the "Manage app" page over HTTPS)
npm run web
```

`shopify app dev` will:
- Ask you to log into your Partner account (first run only)
- Install the app on your dev store
- Start a preview server at `http://127.0.0.1:9293`
- Hot-reload the extension on every file save

> **Important:** Always stop with `Ctrl+C` or press `q` in the CLI panel. Never use `Ctrl+Z` — suspended processes hold their ports open and cause `EADDRINUSE` errors on next start.

---

## 🎨 Step 3 — Add the Block to Your Theme

1. In Shopify admin → **Online Store → Themes → Customize**
2. Using the page selector (top centre), switch to a **Product** template
3. In the left panel, click **Add block** → choose **Per-Item Gift Wrapping**
4. In the block settings, configure:

### Gift Wrap Product
| Setting | What to do |
|---|---|
| **Gift Wrap Product** | Click the picker and select your `Gift Wrapping` product |

Colour variants populate **automatically** from the product's variants — no manual entry needed.

### Display
| Setting | Default | Description |
|---|---|---|
| Section title | `Add Gift Wrapping` | Heading shown above the block |
| Display price | `10.00` | Visual price shown to customers (cosmetic only — real price is on the product) |
| Currency | `AED` | Currency symbol shown next to the price |

### Visual Customisation
| Setting | Default | Description |
|---|---|---|
| Accent colour | `#c0a96e` (gold) | Checkbox fill, price text and focus ring colour |
| Header icon | `🎁` | Emoji shown before the section title — paste any emoji or leave blank to hide |

### Gift Message
| Setting | Default | Description |
|---|---|---|
| Allow gift message | On | Shows a free-text message field (max 200 chars) |
| Message placeholder | `Write a personal message...` | Grey hint text inside the textarea |

### Cart Behaviour
| Setting | Default | Description |
|---|---|---|
| Hide quantity selector | On | Hides the qty stepper for gift wrap rows in cart — recommended |
| Show Remove button | On | Adds an inline "Remove" link on the product page |

> **Always on (not configurable):** One gift wrap per product (no duplicates), and gift wrap is automatically removed from cart when its parent product is removed.

5. **Save** the theme.

---

## 🚀 Step 4 — Deploy to Production

### 4a. Deploy the app extension

```bash
shopify app deploy
```

This pushes the extension code to Shopify's CDN and makes it available to any store that has the app installed. You will be prompted to confirm.

### 4b. Install the app on your production store

After deploying, the app needs to be installed on your live store:

1. Go to your **Shopify Partner Dashboard** → Apps → Gift Wrap App
2. Click **Select store** → choose your **production store**
3. Click **Install** — this authorises the app and makes the extension available in the theme editor
4. In your production store's Shopify admin → **Online Store → Themes → Customize**
5. Repeat **Step 3** above to add and configure the block on the live theme

> You only do this install step **once per store**. After that, `shopify app deploy` pushes updates automatically to all stores where the app is installed.

### 4c. Verify on production

After installing:
- Visit a product page on your live store
- The gift wrap block should appear (if it's been added to the theme)
- Add a product + gift wrap to cart and verify both appear correctly
- Remove the product from the cart — the gift wrap should disappear automatically

---

## 🔄 Updating the Extension

After making code changes locally:

```bash
# 1. Test locally with shopify app dev first
# 2. When ready, deploy:
shopify app deploy
```

Changes are live within a few minutes on all stores where the app is installed. No theme re-save needed — the extension assets are served from Shopify's CDN.

---

## 📋 How Orders Appear in Shopify Admin

Go to **Orders → [any order with gift wrap]**. Each gift-wrapped item creates a linked line item:

| Line Item | Variant | Properties |
|---|---|---|
| The Complete Snowboard | Ice | — |
| Gift Wrapping | Gold | Wrapped item: The Complete Snowboard |
| Frankincense Oil | Oman 10ml | — |
| Gift Wrapping | Gray | Wrapped item: Frankincense Oil · Gift message: Happy Birthday! |

The `Wrapped item` property links the gift wrap to its product for fulfilment.

---

## 🧠 How the Smart Cart Logic Works

The extension (v6) includes several automatic behaviours:

### Orphaned wrap cleanup
When a product is removed from the cart (via the cart drawer, cart page, or any method), its gift wrap is automatically removed too. This works even across different product pages by intercepting Dawn's `fetch` calls to `/cart/change.js`.

### Wrap-before-add protection
If a customer checks the gift wrap box *before* adding the product to cart, the wrap is not prematurely removed. The `parentEverInCart` flag tracks whether the product was ever confirmed present.

### Re-entry guard
The cleanup function uses a `cleanupRunning` flag to prevent infinite loops — without this, the cleanup's own cart API calls would re-trigger themselves.

### Cart ordering
Gift wrap rows in the cart drawer are automatically reordered to appear directly below their parent product, regardless of the order they were added.

---

## 🛠️ Troubleshooting

### `EADDRINUSE: address already in use 127.0.0.1:9293`
A previous `shopify app dev` process is still running.
```bash
lsof -ti tcp:9293 | xargs kill -9
# Then restart:
shopify app dev
```

### `ERR_SSL_PROTOCOL_ERROR` on `https://localhost:3000`
The HTTPS cert is missing. Re-run the `openssl` command from Step 2.
Then visit `https://localhost:3000` in your browser, click **Advanced → Proceed to localhost** to trust the self-signed cert.

### Colour dropdown shows "Please select a Gift Wrap Product"
The **Gift Wrap Product** picker in the block settings is empty. Open Theme Editor → click the block → set the product.

### Gift wrap stays in cart after product removed
Ensure you are running **v6** of the extension (`shopify app deploy` after the latest changes). Check browser console for `[GiftWrap]` log messages.

### Block not visible in Theme Editor
Make sure `shopify app dev` is running (dev) or `shopify app deploy` has been run and the app is installed on the store (production).

### Gift wrap appears at wrong position in cart
Dawn's cart drawer uses a `<table>` element. The reorder logic handles this automatically. If your theme uses a different structure, open an issue with your theme name.

---

## 📝 Theme Compatibility

| Theme | Status |
|---|---|
| Dawn (Shopify default) | ✅ Fully supported |
| Prestige | ✅ Supported |
| Impulse | ✅ Supported |
| Other themes | Should work — uses standard Shopify Cart AJAX API |

If a theme doesn't fire cart update events after adding/removing items, the `fetch` interceptor (added in v5) catches these changes anyway.

---

## 🔐 Security Notes

- `web/certs/key.pem` is in `.gitignore` — never commit it
- The self-signed cert is for **local development only**
- For a production-hosted admin page, replace with a cert from a real CA or deploy to Vercel/Netlify with automatic HTTPS

---

## 📦 Scripts

```bash
npm run dev        # start local dev server (shopify app dev)
npm run web        # start local HTTPS admin page at https://localhost:3000
npm run deploy     # deploy extension to Shopify CDN
npm run build      # build without deploying
npm run cf-deploy  # deploy admin page to Cloudflare Pages (production)
```

---

## 👤 Author

**Nurkamol Vakhidov**

| | |
|---|---|
| 🌐 Website | [nurkamol.com](https://nurkamol.com) |
| 🐙 GitHub | [github.com/nurkamol](https://github.com/nurkamol) |
| ✉️ Email | [nurkamol@gmail.com](mailto:nurkamol@gmail.com) |

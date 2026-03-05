# 🏪 Installing Gift Wrap App on a Client Store

This guide covers how to install the app on any Shopify store after the app has already been deployed.

> 📖 Haven't deployed yet? See [PUBLISHING.md](./PUBLISHING.md) first.

There are **two scenarios** depending on the client relationship:

| Scenario | When to use |
|---|---|
| **A. Store under your Partner account** | You manage the store as a collaborator or you created it |
| **B. Independent client store** | Client owns their own Shopify account |

---

## Scenario A — Store Under Your Partner Account

*Most common for freelancers and agencies who manage client stores.*

### A1 — Install the app via Partner Dashboard

1. Go to **[partners.shopify.com](https://partners.shopify.com)**
2. Click **Apps → Gift Wrap App**
3. Click **"Select store"** → choose the client's store
4. Click **"Install app"** and approve the permissions

---

### A2 — Create the Gift Wrapping product on their store

> ⚠️ This must be done on **every new store**. The product is not shared between stores.

1. In the client's **Shopify Admin → Products → Add product**
2. Fill in the details:

| Field | Value |
|---|---|
| **Title** | `Gift Wrapping` |
| **Price** | Whatever they charge (e.g. `15.00`) |
| **Status** | `Draft` ← important, hides it from storefront |

3. Under **Options**, add one option:
   - Option name: `Colour`
   - Values: `Gray`, `Gold`, `Silver` (add/remove to match their stock)
4. Click **Save**

---

### A3 — Add the block to their theme

1. In the client's Shopify Admin → **Online Store → Themes → Customize**
2. Using the page selector at the top, navigate to a **Product** template
3. In the left panel, click **Add block → Per-Item Gift Wrapping**
4. Configure the block settings:

| Setting | Action |
|---|---|
| **Gift Wrap Product** | Use the picker to select the `Gift Wrapping` product created in A2 |
| **Display price** | Enter the wrap price shown to customers (e.g. `15.00`) |
| **Currency** | Select their store currency |
| **Accent colour** | Match their brand colour if needed |
| **Header icon** | Keep `🎁` or paste any emoji; clear to hide |

5. Click **Save**

> Repeat for each product template where the gift wrap block should appear.

---

## Scenario B — Independent Client Store

*The client owns their own Shopify account and you are not yet a collaborator.*

### B1 — Get collaborator access to their store

1. Ask the client to go to their **Shopify Admin → Settings → Users and permissions → Collaborators**
2. They enable collaborator requests and share their store URL with you
3. In your **Partner Dashboard → Stores → Add store → Log in to a store**
4. Enter their `.myshopify.com` URL and request collaborator access
5. Client approves the request in their Shopify Admin

Once approved, their store appears in your Partner Dashboard and you can follow **Scenario A** above.

---

## Per-Store Setup Checklist

Use this checklist for every new store installation:

- [ ] App installed via Partner Dashboard
- [ ] `Gift Wrapping` product created with `Colour` variants, status set to **Draft**
- [ ] Block added to product template(s) in Theme Editor
- [ ] **Gift Wrap Product** picker set in block settings
- [ ] Currency and display price configured
- [ ] Test: add a product + select gift wrap → both appear in cart
- [ ] Test: remove the product from cart → gift wrap disappears automatically
- [ ] Test: place a test order → `Wrapped item` property appears on the order in Shopify Admin

---

## ⏱️ Time Estimate

| Task | Time |
|---|---|
| Install app (Partner Dashboard) | ~2 min |
| Create Gift Wrapping product | ~3 min |
| Add & configure block in Theme Editor | ~5 min |
| Verification testing | ~5 min |
| **Total per store** | **~15 min** |

---

## 🔄 Future Updates

When you deploy a new version of the extension (`shopify app deploy`), **all installed stores are updated automatically** — no reinstallation or theme re-save needed.

The only exception is if a **schema setting changes** (e.g. a new block option is added). In that case, visit the Theme Editor on each affected store and click **Save** once to pick up the new default values.

---

## 🛠️ Troubleshooting

### Block not visible in Theme Editor after install

Make sure `shopify app deploy` has been run and the app is installed on the store. Deploying without installing does not make the block available.

### Gift Wrapping product variants not showing in the colour dropdown

The **Gift Wrap Product** picker in the block settings is empty or points to the wrong product. Open the Theme Editor → click the block → re-select the product.

### "Manage app" link in Shopify admin shows an error

The `application_url` in `shopify.app.toml` and the Partner Dashboard App URL must both point to `https://gift-wrap-app.pages.dev`. Run `shopify app deploy` after updating either.

### Gift wrap stays in cart after removing the product

Ensure the store is running the latest deployed version (v6+). Check the browser console for `[GiftWrap]` log messages to confirm the extension is loading.

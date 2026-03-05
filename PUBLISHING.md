# 🚀 Publishing Guide — Gift Wrap App

This guide covers everything needed to take the app from local development to a live production store.

There are **two independent publish actions** — both are required:

| Action | Tool | What it does |
|---|---|---|
| **A. Deploy admin page** | Cloudflare Pages | Gives the app a real public HTTPS URL for "Manage app" |
| **B. Deploy extension** | Shopify CLI | Pushes JS/CSS/Liquid to Shopify's CDN and installs on your store |

---

## Part A — Deploy the Admin Web Page to Cloudflare Pages

The admin page (`web/page.js`) needs a permanent public HTTPS URL.
Cloudflare Pages hosts it for free, deploys from the edge globally, and has no cold starts.

---

### A1 — Create a Cloudflare account

1. Go to **https://cloudflare.com** and sign up for a free account
2. In the dashboard, go to **Workers & Pages** in the left sidebar — you don't need to configure anything yet

---

### A2 — Log in with Wrangler CLI

```bash
npx wrangler login
```

A browser window opens asking you to authorise Wrangler with your Cloudflare account.
Click **Allow** — you only need to do this once.

---

### A3 — Deploy to Cloudflare Pages

```bash
npm run cf-deploy
```

This runs `wrangler pages deploy public --project-name gift-wrap-app`.

**First deployment only** — Wrangler will ask:

| Prompt | Answer |
|---|---|
| No project found. Would you like to create one? | **Y** |
| Enter the name of your new project | `gift-wrap-app` |
| Enter the production branch name | `main` |

After deployment you will see:

```
✨ Deployment complete!
🌎 https://gift-wrap-app.pages.dev
```

> Copy your `*.pages.dev` URL — you need it in the next two steps.

---

### A4 — Update `shopify.app.toml`

Open `shopify.app.toml` and replace the localhost values with your Cloudflare Pages URL:

```toml
application_url = "https://gift-wrap-app.pages.dev"

[auth]
redirect_urls = [
  "https://localhost:3000/auth/callback",
  "https://gift-wrap-app.pages.dev/auth/callback"
]
```

> Keep the `localhost` redirect — you still need it for local development.

---

### A5 — Update the Partner Dashboard

1. Go to **https://partners.shopify.com**
2. Click **Apps** → **Gift Wrap App** → **App setup**
3. Update these two fields:

| Field | Value |
|---|---|
| **App URL** | `https://gift-wrap-app.pages.dev` |
| **Allowed redirection URL(s)** | Add `https://gift-wrap-app.pages.dev/auth/callback` |

4. Click **Save**

---

## Part B — Deploy the Extension and Install on Your Live Store

### B1 — Deploy the extension to Shopify's CDN

```bash
shopify app deploy
```

This bundles and uploads `gift-wrap.js`, `gift-wrap.css`, and `gift_wrap.liquid` to Shopify's global CDN. You will see a confirmation prompt — review and confirm.

> ✅ Safe to run at any time. Existing theme block configurations on live stores are never overwritten.

---

### B2 — Install the app on your production store

> Skip this step if the app is already installed on the store.

1. Go to **https://partners.shopify.com**
2. Click **Apps** → **Gift Wrap App**
3. Click **Select store** → choose your **production store**
4. Click **Install app**
5. Approve the permissions in the Shopify admin popup

---

### B3 — Add the block to your live theme

1. In your **production store's** Shopify admin → **Online Store → Themes → Customize**
2. Using the page selector at the top, navigate to a **Product** template
3. In the left panel, click **Add block** → select **Per-Item Gift Wrapping**
4. Configure the block settings:
   - **Gift Wrap Product** → select your `Gift Wrapping` product
   - Set currency, display price, accent colour, and other options as needed
5. Click **Save**

> Repeat for each product template where you want the block to appear.

---

## Verification Checklist

After completing both parts, verify everything works on the live store:

- [ ] Visit `https://gift-wrap-app.pages.dev/?shop=YOUR-STORE.myshopify.com` — admin page loads with "Open Theme Editor" button
- [ ] Go to Shopify admin → Apps → Gift Wrap App → **Manage app** — admin page loads correctly
- [ ] Visit a product page on your live store — the gift wrap block is visible
- [ ] Check the gift wrap checkbox — colour options appear
- [ ] Select a colour — gift wrap line appears in the cart
- [ ] Remove the product from the cart — gift wrap is also removed automatically
- [ ] Place a test order — gift wrap appears with `Wrapped item` property in Shopify admin → Orders

---

## Future Updates

### Update the extension (JS / CSS / Liquid changes)

```bash
shopify app deploy
```

Changes are live within minutes. No reinstallation or theme re-save needed.

### Update the admin page (`web/page.js` changes)

```bash
npm run cf-deploy
```

Cloudflare deploys globally in under 30 seconds.

---

## All npm Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server (`shopify app dev`) |
| `npm run web` | Start local HTTPS admin page at `https://localhost:3000` |
| `npm run deploy` | Deploy extension to Shopify CDN |
| `npm run build` | Build without deploying |
| `npm run cf-deploy` | Deploy admin page to Cloudflare Pages (production) |

---

## Custom Domain (optional)

By default your admin page lives at `gift-wrap-app.pages.dev`.
To use a custom domain (e.g. `giftwrap.maison-etherique.com`):

1. Go to **Cloudflare dashboard → Workers & Pages → gift-wrap-app → Custom domains**
2. Click **Set up a custom domain** and follow the steps
3. Update `application_url` in `shopify.app.toml` and the Partner Dashboard to your custom domain
4. Run `shopify app deploy` to push the URL change

---

## Troubleshooting

### `wrangler login` fails or times out

Try the device-code flow instead:

```bash
npx wrangler login --use-device-code
```

---

### `npm run cf-deploy` shows "No functions directory found"

Make sure `functions/[[path]].js` exists at the project root:

```bash
ls functions/
# should show: [[path]].js
```

---

### Admin page loads but "Open Theme Editor" button is grey

Shopify did not pass the `?shop=` parameter. This only happens when the URL is opened directly — not from Shopify admin. When merchants click **Manage app** in Shopify admin, the shop param is always included automatically.

---

### "Manage app" still shows localhost after Cloudflare deploy

Both places must be updated together:
1. `shopify.app.toml` → `application_url`
2. Partner Dashboard → App setup → App URL

Then run `shopify app deploy` to sync the updated URL with Shopify.

---

### Extension not visible on production store after `shopify app deploy`

The app must also be **installed** on the production store (Step B2).
Deploying the extension does not automatically install it.

---

### Block settings were reset after deploying

This does not happen. Deploying only updates the CDN-hosted asset files.
Theme block configurations are stored in the theme and are never touched by `shopify app deploy`.

---

### Partner Dashboard shows the app as "Development" or "Unpublished"

For a **private/custom app** used on your own stores only, this is expected and fine.
You do **not** need to publish to the Shopify App Store to use the app on your own stores.
Only submit to the App Store if you intend to distribute the app publicly to other merchants.

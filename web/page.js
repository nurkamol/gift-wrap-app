/**
 * Shared page renderer – used by both:
 *   web/index.js          (local dev HTTPS server)
 *   functions/[[path]].js (Cloudflare Pages, production)
 */

// ─── FAQ data ─────────────────────────────────────────────────────────────────
export const FAQ = [
  {
    category: '🛍️ Setup & Configuration',
    items: [
      {
        q: 'How do I connect my Gift Wrapping product to the block?',
        a: `Open your Shopify Theme Editor → navigate to a Product template → click the
            <strong>Per-Item Gift Wrapping</strong> block → use the <strong>Gift Wrap Product</strong>
            picker to select your Gift Wrapping product. Colour variants populate
            automatically — no IDs to copy.`,
      },
      {
        q: 'Why is the colour dropdown showing a warning instead of colours?',
        a: `The <strong>Gift Wrap Product</strong> picker in the block settings is empty.
            Open Theme Editor → click the block → set the product. Once set, all variants
            of that product appear in the dropdown automatically.`,
      },
      {
        q: 'How do I add, rename, or remove wrap colours?',
        a: `Go to <strong>Shopify Admin → Products → Gift Wrapping → Variants</strong>.
            Add, rename, or delete variants there. Changes appear in the dropdown on your
            store immediately — no theme save needed.`,
      },
      {
        q: 'Should the Gift Wrapping product be Active or Draft?',
        a: `Set it to <strong>Draft</strong>. This hides it from your storefront, search
            results, and collections so customers cannot buy it directly. The cart API
            can still add it — that is how the extension works.`,
      },
      {
        q: 'Can I add the block to multiple product templates?',
        a: `Yes. Open each product template in the Theme Editor and add the block to each
            one. The same Gift Wrap product and settings can be shared across all templates.`,
      },
      {
        q: 'What does "Display price" do — is it the real charge?',
        a: `The display price shown on the block is <strong>cosmetic only</strong> — it
            tells customers what to expect. The <em>real</em> charge comes from the actual
            price set on your Gift Wrapping product variants in Shopify Admin. Keep both in
            sync to avoid confusion.`,
      },
    ],
  },
  {
    category: '🛒 Cart Behaviour',
    items: [
      {
        q: 'Why does gift wrap disappear when I remove the product from the cart?',
        a: `This is intentional. The extension monitors the cart and automatically removes
            any gift wrap whose parent product is no longer present. This prevents orphaned
            gift wrap charges appearing on orders without a wrapped item.`,
      },
      {
        q: 'What if a customer selects gift wrap before adding the product to the cart?',
        a: `The extension handles this safely. It waits until the product is confirmed
            in the cart before enabling auto-removal. Selecting wrap before adding the
            product will not cause the wrap to disappear unexpectedly.`,
      },
      {
        q: 'Can a customer add gift wrap for the same product twice?',
        a: `No. The extension enforces one gift wrap per product at all times.
            If a customer tries to add wrap for a product that already has one, the
            existing wrap is updated instead.`,
      },
      {
        q: 'Can customers change the gift wrap quantity in the cart?',
        a: `By default the quantity selector for gift wrap rows is hidden (recommended).
            This prevents customers from setting qty to 2 while only having 1 of the
            product. You can toggle this under <strong>Cart Behaviour → Hide quantity
            selector</strong> in the block settings.`,
      },
      {
        q: 'A customer has 3 units of a product — do they get 3 gift wraps?',
        a: `Currently one gift wrap is added per product line (not per unit). If you need
            qty-matching, that would require a customisation — please open a developer
            issue with your use case.`,
      },
      {
        q: 'I got a "There was an error while updating your cart" message. Why?',
        a: `This was a bug in earlier versions where the cleanup logic could call itself
            in a loop. It is fixed in <strong>v6</strong>. Run
            <code>shopify app deploy</code> to push the latest version. If the error
            still appears after deploying, clear your browser cache and try again.`,
      },
    ],
  },
  {
    category: '📦 Orders & Fulfilment',
    items: [
      {
        q: 'How do I see which items are gift wrapped in an order?',
        a: `Go to <strong>Shopify Admin → Orders</strong> and open any order. Each gift
            wrap line item has a <strong>Wrapped item</strong> property showing the product
            title it belongs to. If the customer added a message, a
            <strong>Gift message</strong> property also appears on that line.`,
      },
      {
        q: 'How do I know which wrap colour was selected?',
        a: `The gift wrap line item shows the variant name (e.g. <em>Gold</em>, <em>Gray</em>)
            in the <strong>Variant</strong> column of the order, alongside the
            <strong>Wrapped item</strong> property.`,
      },
      {
        q: 'Can I filter or export orders that include gift wrapping?',
        a: `In Shopify Admin → Orders, use the search bar and filter by product name
            <em>"Gift Wrapping"</em>. For bulk exports with line item properties, use the
            built-in order export (CSV) or a reporting app such as
            <em>Report Pundit</em> or <em>Better Reports</em>.`,
      },
      {
        q: 'Does gift wrap appear as a separate line item on the customer receipt?',
        a: `Yes. Gift Wrapping is a real product added to the cart, so it appears as its
            own line on the order confirmation email, packing slip, and invoice — just like
            any other product. The <strong>Wrapped item</strong> property tells your team
            which item it belongs to.`,
      },
      {
        q: 'Can I set different gift wrap prices per product?',
        a: `Not natively — the price comes from the Gift Wrapping product variant, which is
            a single price. A workaround is to create multiple Gift Wrapping products
            (e.g. Standard Wrap / Premium Wrap) and add a separate block for each one on
            different product templates.`,
      },
    ],
  },
  {
    category: '🎨 Appearance & Customisation',
    items: [
      {
        q: 'How do I change the checkbox and accent colour?',
        a: `Open the Theme Editor → click the block → find
            <strong>Visual Customisation → Accent colour</strong>. Pick any colour from
            the colour picker. It updates the checkbox fill, price text, and focus ring
            throughout the block.`,
      },
      {
        q: 'Can I hide the gift message field?',
        a: `Yes. Open the block settings → <strong>Gift Message → Allow customers to add
            a gift message</strong> → toggle off.`,
      },
      {
        q: 'Can I rename "Wrap colour" or "Gift message"?',
        a: `These labels are currently hardcoded in the Liquid template. To change them,
            edit <code>extensions/gift-wrapping/blocks/gift_wrap.liquid</code> and update
            the label text, then run <code>shopify app deploy</code>.`,
      },
      {
        q: 'How do I move the block to a different position on the product page?',
        a: `In the Theme Editor, drag the <strong>Per-Item Gift Wrapping</strong> block
            up or down in the block list on the left panel. It will reposition on the
            product page accordingly.`,
      },
    ],
  },
  {
    category: '🔧 Troubleshooting',
    items: [
      {
        q: 'The block is not visible on product pages.',
        a: `Check two things:<br>
            1. <strong>Development:</strong> Is <code>shopify app dev</code> running?
            The extension is only served while the dev server is active.<br>
            2. <strong>Production:</strong> Has the app been deployed
            (<code>shopify app deploy</code>) <em>and</em> installed on the store via the
            Partner Dashboard? Both steps are required.`,
      },
      {
        q: 'Gift wrap is not being removed when the product is deleted from cart.',
        a: `Make sure you are running <strong>v6</strong> of the extension. Check by
            opening your browser console on a product page and looking for
            <code>[GiftWrap]</code> log lines — version is shown in the first line.
            If on an older version, run <code>shopify app deploy</code>.`,
      },
      {
        q: 'The gift wrap row appears in the wrong position in the cart.',
        a: `The reorder logic targets Dawn's <code>&lt;table&gt;</code> cart structure.
            Some themes use a <code>&lt;ul&gt;</code> or custom element. Open a browser
            console and run <code>document.querySelector('.cart-items')?.tagName</code>
            and share the result — it helps diagnose the structure your theme uses.`,
      },
      {
        q: 'Shopify shows "There was an error" when adding a new product to the cart.',
        a: `This is caused by an infinite loop in older versions of the extension.
            Deploy the latest version: <code>shopify app deploy</code>.
            Also clear your browser cache after deploying — an old cached JS file
            can still cause the error even after deployment.`,
      },
      {
        q: 'The "Manage app" link shows ERR_SSL_PROTOCOL_ERROR.',
        a: `The admin web page requires HTTPS. Either:<br>
            1. Run <code>npm run web</code> to start the HTTPS server, then visit
            <code>https://localhost:3000</code> and click
            <em>Advanced → Proceed to localhost</em> to trust the cert.<br>
            2. Or re-generate the cert:
            <code>openssl req -x509 -newkey rsa:2048 -keyout web/certs/key.pem -out web/certs/cert.pem -days 3650 -nodes -subj "/CN=localhost"</code>`,
      },
      {
        q: 'shopify app dev fails with EADDRINUSE on port 9293.',
        a: `A previous dev process is still holding the port. Kill it:<br>
            <code>lsof -ti tcp:9293 | xargs kill -9</code><br>
            Then restart <code>shopify app dev</code>. Always stop the server with
            <strong>Ctrl+C</strong> or press <strong>q</strong> in the CLI panel —
            never use Ctrl+Z.`,
      },
      {
        q: 'How do I completely remove the extension from a theme?',
        a: `Open Theme Editor → find the <strong>Per-Item Gift Wrapping</strong> block →
            click the three-dot menu → <strong>Remove block</strong>. This removes it
            from the theme without uninstalling the app. To uninstall the app entirely,
            go to Shopify Admin → Apps → Gift Wrap App → Delete.`,
      },
    ],
  },
  {
    category: '🚀 Deployment & Updates',
    items: [
      {
        q: 'How do I go from development to my live store?',
        a: `Three steps:<br>
            1. <code>shopify app deploy</code> — pushes the extension to Shopify's CDN.<br>
            2. Partner Dashboard → Apps → Gift Wrap App → <strong>Select store</strong>
            → choose your production store → <strong>Install</strong>.<br>
            3. Open Theme Editor on the live store → add and configure the block → Save.`,
      },
      {
        q: 'Do I need to reinstall the app every time I make a change?',
        a: `No. After the first install, just run <code>shopify app deploy</code> whenever
            you make code changes. The update is pushed to all stores where the app is
            installed automatically. No theme re-save is needed.`,
      },
      {
        q: 'Will deploying break anything on the live store?',
        a: `No. Deploying only updates the JavaScript and CSS assets served from Shopify's
            CDN. The Liquid block and schema settings remain unchanged unless you explicitly
            modify them. Existing block configurations on live themes are preserved.`,
      },
      {
        q: 'Can I install the app on multiple stores?',
        a: `Yes. From the Partner Dashboard, install the app on as many stores as you own.
            Each store gets its own independent block configuration in its Theme Editor.`,
      },
    ],
  },
];

// ─── HTML renderer ────────────────────────────────────────────────────────────
export function renderPage(shop) {
  const themeEditorUrl = shop
    ? `https://${shop}/admin/themes/current/editor`
    : null;

  const totalFaqs = FAQ.reduce((n, s) => n + s.items.length, 0);

  const faqHtml = FAQ.map((section, si) => `
    <div class="faq-section">
      <h3 class="faq-category">${section.category}</h3>
      ${section.items.map((item, ii) => `
        <details class="faq-item" id="faq-${si}-${ii}">
          <summary class="faq-q">
            <span>${item.q}</span>
            <svg class="faq-chevron" viewBox="0 0 20 20" fill="none">
              <path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </summary>
          <div class="faq-a">${item.a}</div>
        </details>
      `).join('')}
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Gift Wrap App – Admin</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --gold: #c0a96e; --gold-dark: #a08550; --gold-light: #f6f0e4;
      --text: #202223; --text-muted: #6d7175; --border: #e3e3e3;
      --bg: #f6f6f7; --card: #fff; --radius: 12px;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg); color: var(--text);
      min-height: 100vh; padding: 32px 16px 64px;
    }
    .page { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }

    /* Hero */
    .hero {
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
      border-radius: var(--radius); padding: 36px 40px; color: #fff;
      display: flex; align-items: flex-start; gap: 20px;
    }
    .hero-icon { font-size: 48px; flex-shrink: 0; line-height: 1; }
    .hero h1   { font-size: 26px; font-weight: 700; }
    .hero p    { opacity: .85; margin-top: 6px; font-size: 15px; line-height: 1.5; }
    .hero-actions { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; }
    .btn {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;
      text-decoration: none; transition: opacity .15s; border: none; cursor: pointer;
    }
    .btn:hover { opacity: .85; }
    .btn-white   { background: #fff; color: var(--gold-dark); }
    .btn-outline { background: transparent; border: 1.5px solid rgba(255,255,255,.6); color: #fff; }

    /* Cards */
    .card { background: var(--card); border-radius: var(--radius); box-shadow: 0 1px 3px rgba(0,0,0,.08); overflow: hidden; }
    .card-head {
      padding: 20px 28px 16px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; gap: 10px;
    }
    .card-head h2 { font-size: 16px; font-weight: 600; }
    .card-head .badge {
      background: var(--gold-light); color: var(--gold-dark);
      font-size: 11px; font-weight: 700; padding: 3px 8px;
      border-radius: 100px; text-transform: uppercase; letter-spacing: .04em;
    }
    .card-body { padding: 24px 28px; }

    /* Steps */
    .steps { list-style: none; display: flex; flex-direction: column; gap: 16px; }
    .steps li { display: flex; gap: 14px; }
    .step-num {
      flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%;
      background: var(--gold-light); color: var(--gold-dark);
      font-weight: 700; font-size: 13px;
      display: flex; align-items: center; justify-content: center;
    }
    .step-body { padding-top: 3px; font-size: 14px; line-height: 1.6; color: #4a4a4a; }
    .step-body strong { color: var(--text); }
    .step-body code {
      background: #f3f3f3; border: 1px solid #e0e0e0; border-radius: 4px;
      padding: 1px 6px; font-size: 12px; font-family: 'SF Mono', 'Fira Mono', monospace;
    }

    /* FAQ */
    .faq-section { margin-bottom: 4px; }
    .faq-category {
      font-size: 13px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .06em; color: var(--text-muted); padding: 16px 28px 8px;
    }
    .faq-item { border-top: 1px solid var(--border); }
    .faq-item:last-child { border-bottom: 1px solid var(--border); }
    .faq-q {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 16px; padding: 15px 28px; font-size: 14px; font-weight: 500;
      line-height: 1.5; cursor: pointer; list-style: none; transition: background .12s;
    }
    .faq-q:hover { background: #fafafa; }
    .faq-q::-webkit-details-marker { display: none; }
    .faq-chevron {
      flex-shrink: 0; width: 18px; height: 18px;
      color: var(--text-muted); margin-top: 1px; transition: transform .2s;
    }
    details[open] .faq-chevron { transform: rotate(180deg); }
    .faq-a {
      padding: 0 28px 16px 28px; font-size: 13.5px; line-height: 1.7; color: #4a4a4a;
    }
    .faq-a strong { color: var(--text); }
    .faq-a code {
      background: #f3f3f3; border: 1px solid #e0e0e0; border-radius: 4px;
      padding: 1px 6px; font-size: 12px; font-family: 'SF Mono', 'Fira Mono', monospace;
      word-break: break-all;
    }

    /* Search */
    .search-wrap { position: relative; padding: 16px 28px 4px; }
    .search-input {
      width: 100%; padding: 10px 14px 10px 38px;
      border: 1.5px solid var(--border); border-radius: 8px;
      font-size: 14px; color: var(--text); background: var(--bg);
      transition: border-color .15s, box-shadow .15s;
    }
    .search-input:focus {
      outline: none; border-color: var(--gold);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--gold) 20%, transparent);
    }
    .search-icon {
      position: absolute; left: 40px; top: 50%; transform: translateY(-30%);
      color: #aaa; pointer-events: none; width: 16px; height: 16px;
    }
    .no-results {
      display: none; padding: 20px 28px; font-size: 14px;
      color: var(--text-muted); font-style: italic;
    }

    /* Footer */
    .footer-note {
      background: var(--gold-light); border-left: 3px solid var(--gold);
      border-radius: 6px; padding: 14px 18px;
      font-size: 13px; color: #6b5b3e; line-height: 1.65;
    }
    .footer-note strong { color: #5a4a30; }

    /* Author card */
    .author-card {
      background: var(--card); border-radius: var(--radius);
      box-shadow: 0 1px 3px rgba(0,0,0,.08);
      padding: 20px 28px;
      display: flex; align-items: center; gap: 18px;
    }
    .author-avatar {
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; flex-shrink: 0; color: #fff; font-weight: 700;
    }
    .author-info { flex: 1; }
    .author-name  { font-size: 15px; font-weight: 600; color: var(--text); }
    .author-role  { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
    .author-links { display: flex; gap: 12px; margin-top: 8px; flex-wrap: wrap; }
    .author-link  {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 12px; color: var(--gold-dark); text-decoration: none;
      font-weight: 500; transition: opacity .15s;
    }
    .author-link:hover { opacity: .75; }
    .author-link svg { width: 13px; height: 13px; flex-shrink: 0; }

    @media (max-width: 560px) {
      .hero { padding: 24px 20px; flex-direction: column; gap: 12px; }
      .card-head, .card-body, .faq-category,
      .faq-q, .faq-a, .search-wrap { padding-left: 18px; padding-right: 18px; }
      .search-icon { left: 32px; }
    }
  </style>
</head>
<body>
<div class="page">

  <div class="hero">
    <div class="hero-icon">🎁</div>
    <div>
      <h1>Per-Item Gift Wrapping</h1>
      <p>Theme App Extension · All settings live in your Shopify Theme Editor</p>
      <div class="hero-actions">
        ${themeEditorUrl
          ? `<a class="btn btn-white" href="${themeEditorUrl}" target="_blank">Open Theme Editor →</a>`
          : `<span class="btn btn-white" style="opacity:.5;cursor:default">Open Theme Editor</span>`
        }
        <a class="btn btn-outline" href="https://partners.shopify.com" target="_blank">Partner Dashboard</a>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-head"><h2>Quick Setup</h2><span class="badge">5 steps</span></div>
    <div class="card-body">
      <ol class="steps">
        <li><span class="step-num">1</span>
          <div class="step-body">In <strong>Shopify Admin → Products</strong>, create a product called
            <strong>Gift Wrapping</strong>. Add a <em>Colour</em> option with your wrap variants
            (Gray, Gold, Silver…). Set status to <strong>Draft</strong>.</div></li>
        <li><span class="step-num">2</span>
          <div class="step-body">Open the <strong>Theme Editor</strong> using the button above and
            navigate to a <strong>Product</strong> template.</div></li>
        <li><span class="step-num">3</span>
          <div class="step-body">Click <strong>Add block</strong> → choose
            <em>Per-Item Gift Wrapping</em>.</div></li>
        <li><span class="step-num">4</span>
          <div class="step-body">In the block settings, use the <strong>Gift Wrap Product</strong>
            picker to select your Gift Wrapping product. Colours populate automatically.</div></li>
        <li><span class="step-num">5</span>
          <div class="step-body"><strong>Save</strong> the theme. The block is now live on every
            product page it has been added to.</div></li>
      </ol>
    </div>
  </div>

  <div class="card">
    <div class="card-head">
      <h2>Frequently Asked Questions</h2>
      <span class="badge">${totalFaqs} answers</span>
    </div>
    <div class="search-wrap">
      <svg class="search-icon" viewBox="0 0 20 20" fill="none">
        <circle cx="8.5" cy="8.5" r="5.5" stroke="#aaa" stroke-width="1.6"/>
        <path d="M13 13l3.5 3.5" stroke="#aaa" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
      <input class="search-input" type="search" placeholder="Search FAQ…"
        id="faq-search" autocomplete="off"/>
    </div>
    <div id="faq-list">${faqHtml}</div>
    <p class="no-results" id="no-results">No results found. Try different keywords.</p>
  </div>

  <div class="footer-note">
    <strong>No backend required.</strong> This is a pure Theme App Extension — all
    configuration lives in the Shopify Theme Editor. This admin page is only shown when
    you click <em>"Manage app"</em> in Shopify admin. For code changes, run
    <code>shopify app deploy</code> from the project root.
  </div>

  <div class="author-card">
    <div class="author-avatar">N</div>
    <div class="author-info">
      <div class="author-name">Nurkamol Vakhidov</div>
      <div class="author-role">Developer &amp; Author</div>
      <div class="author-links">
        <a class="author-link" href="https://nurkamol.com" target="_blank">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="8" cy="8" r="6.5"/>
            <path d="M8 1.5C8 1.5 5.5 4 5.5 8s2.5 6.5 2.5 6.5M8 1.5C8 1.5 10.5 4 10.5 8S8 14.5 8 14.5M1.5 8h13"/>
          </svg>
          nurkamol.com
        </a>
        <a class="author-link" href="https://github.com/nurkamol" target="_blank">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
              0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
              -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
              .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
              -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
              .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
              .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
              0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          github.com/nurkamol
        </a>
        <a class="author-link" href="mailto:nurkamol@gmail.com">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="1.5" y="3.5" width="13" height="9" rx="1.5"/>
            <path d="M1.5 5l6.5 4.5L14.5 5"/>
          </svg>
          nurkamol@gmail.com
        </a>
      </div>
    </div>
  </div>

</div>
<script>
  const searchInput   = document.getElementById('faq-search');
  const noResults     = document.getElementById('no-results');
  const allItems      = document.querySelectorAll('.faq-item');
  const allSections   = document.querySelectorAll('.faq-section');

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      allItems.forEach(el => el.style.display = '');
      allSections.forEach(el => el.style.display = '');
      noResults.style.display = 'none';
      return;
    }
    let anyVisible = false;
    allSections.forEach(section => {
      const items = section.querySelectorAll('.faq-item');
      let sectionVisible = false;
      items.forEach(item => {
        const match = item.textContent.toLowerCase().includes(q);
        item.style.display = match ? '' : 'none';
        if (match) { sectionVisible = true; anyVisible = true; if (q.length > 2) item.open = true; }
      });
      section.style.display = sectionVisible ? '' : 'none';
    });
    noResults.style.display = anyVisible ? 'none' : 'block';
  });

  document.querySelectorAll('.faq-item').forEach(det => {
    det.addEventListener('toggle', () => {
      if (det.open) {
        document.querySelectorAll('.faq-item[open]').forEach(other => {
          if (other !== det) other.removeAttribute('open');
        });
      }
    });
  });
</script>
</body>
</html>`;
}

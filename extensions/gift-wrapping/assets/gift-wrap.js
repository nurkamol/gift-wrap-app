/**
 * Gift Wrap – Per-Item Product Page Logic (v6)
 *
 * New in this version
 * ───────────────────
 * • checkParentProductInCart() replaced by cleanupOrphanedWraps() which scans
 *   ALL gift wrap lines in the cart (not just the current page's product).
 *   Orphaned wraps from any product are now removed on every cart change event,
 *   even when the user has navigated away from that product's page.
 * • parentEverInCart guard: the current page's wrap is only auto-removed when
 *   its product was previously confirmed in the cart, preventing premature
 *   removal when gift wrap is selected before the product is added.
 * • init() cleans up orphaned gift wrap lines on page load (wrap in cart but
 *   its product is no longer there).
 */

(function () {
  'use strict';

  const container = document.getElementById('gift-wrap-container');
  if (!container) return;

  // ── Settings from Liquid ──────────────────────────────────────────────────────
  const productTitle      = container.dataset.productTitle                      || '';
  const productId         = parseInt(container.dataset.productId,         10)   || null;
  const giftWrapProductId = parseInt(container.dataset.giftWrapProductId, 10)   || null;
  const hideQty           = container.dataset.hideQty       === 'true';
  const onePerProduct     = container.dataset.onePerProduct === 'true';

  // ── DOM refs ──────────────────────────────────────────────────────────────────
  const toggle     = container.querySelector('.gw-toggle');
  const options    = container.querySelector('.gw-options');
  const select     = container.querySelector('.gw-colour-select');
  const msgInput   = container.querySelector('.gw-message-input');
  const charCount  = container.querySelector('.gw-char-count');
  const statusEl   = container.querySelector('.gw-status');
  const statusText = container.querySelector('.gw-status-text');
  const removeBtn  = container.querySelector('.gw-remove-btn');

  // ── State ─────────────────────────────────────────────────────────────────────
  let cartLineKey      = null;
  let busy             = false;
  let domBusy          = false;    // guards our own DOM moves from re-triggering the observer
  let parentEverInCart = false;    // true once the parent product has been confirmed in cart
  let cleanupRunning   = false;    // prevents re-entrant cleanupOrphanedWraps() calls

  // ── Cart helpers ──────────────────────────────────────────────────────────────
  async function getCart() {
    return fetch('/cart.js').then(r => r.json()).catch(() => null);
  }

  async function findExistingWrap() {
    if (!giftWrapProductId) return null;
    const cart = await getCart();
    if (!cart) return null;
    return cart.items.find(item =>
      item.product_id === giftWrapProductId &&
      item.properties?.['Wrapped item'] === productTitle
    ) || null;
  }

  // ── Init: restore UI from cart ────────────────────────────────────────────────
  async function init() {
    const existing = await findExistingWrap();
    if (!existing) return;

    cartLineKey      = existing.key;
    parentEverInCart = true; // a wrap existed → parent was in cart at some point

    // If the parent product is no longer in cart, clean up the orphaned wrap
    if (productId) {
      const cart = await getCart();
      if (cart) {
        const productInCart = cart.items.some(i => i.product_id === productId && i.quantity > 0);
        if (!productInCart) {
          await remove(false);
          return; // skip UI restore — wrap is orphaned
        }
      }
    }

    if (select && select.tagName === 'SELECT') {
      const opt = Array.from(select.options).find(o => parseInt(o.value) === existing.variant_id);
      if (opt) opt.selected = true;
    }
    const savedMsg = existing.properties?.['Gift message'] || '';
    if (msgInput && savedMsg) {
      msgInput.value = savedMsg;
      if (charCount) charCount.textContent = savedMsg.length + ' / 200';
    }
    toggle.checked        = true;
    options.style.display = 'block';
    showStatus(true);
  }

  init().then(setupCartObserver);

  // ── Toggle ────────────────────────────────────────────────────────────────────
  toggle.addEventListener('change', async () => {
    if (toggle.checked) {
      if (onePerProduct && cartLineKey) { showStatus(true); return; }
      options.style.display = 'block';
      if (select && select.value) await addOrUpdate();
    } else {
      options.style.display = 'none';
      showStatus(false);
      await remove();
    }
  });

  // ── Colour select ─────────────────────────────────────────────────────────────
  if (select && select.tagName === 'SELECT') {
    select.addEventListener('change', async () => {
      if (toggle.checked && select.value) await addOrUpdate();
    });
  }

  // ── Message (debounced) ───────────────────────────────────────────────────────
  if (msgInput) {
    msgInput.addEventListener('input', () => {
      if (charCount) charCount.textContent = msgInput.value.length + ' / 200';
      clearTimeout(msgInput._t);
      msgInput._t = setTimeout(async () => {
        if (toggle.checked && select && select.value) await addOrUpdate();
      }, 600);
    });
  }

  // ── Remove button ─────────────────────────────────────────────────────────────
  if (removeBtn) {
    removeBtn.addEventListener('click', async () => {
      toggle.checked        = false;
      options.style.display = 'none';
      showStatus(false);
      if (select && select.tagName === 'SELECT') select.selectedIndex = 0;
      if (msgInput) { msgInput.value = ''; if (charCount) charCount.textContent = '0 / 200'; }
      await remove();
    });
  }

  // ── Add / update ──────────────────────────────────────────────────────────────
  async function addOrUpdate() {
    if (busy) return;
    const variantId = select ? select.value : null;
    if (!variantId) return;

    // Always verify against live cart to prevent duplicates
    if (!cartLineKey) {
      const existing = await findExistingWrap();
      if (existing) {
        if (onePerProduct && existing.variant_id === parseInt(variantId, 10)) {
          cartLineKey = existing.key;
          showStatus(true);
          return;
        }
        cartLineKey = existing.key;
      }
    }

    const colour  = select.tagName === 'SELECT'
      ? (select.options[select.selectedIndex]?.text || '') : '';
    const message = msgInput ? msgInput.value.trim() : '';

    if (cartLineKey) await remove(false);

    const properties = { 'Wrapped item': productTitle };
    if (message) properties['Gift message'] = message;

    setLoading(true);
    busy = true;
    try {
      const res  = await fetch('/cart/add.js', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(variantId, 10), quantity: 1, properties }),
      });
      const data = await res.json();
      if (data.key) {
        cartLineKey = data.key;
        showStatus(true);
        refreshCart();
      } else {
        console.error('[GiftWrap] add failed:', data);
      }
    } catch (err) {
      console.error('[GiftWrap] error:', err);
    } finally {
      setLoading(false);
      busy = false;
    }
  }

  // ── Remove ────────────────────────────────────────────────────────────────────
  async function remove(doRefresh = true) {
    if (!cartLineKey) return;
    try {
      await fetch('/cart/change.js', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cartLineKey, quantity: 0 }),
      });
      cartLineKey = null;
      if (doRefresh) refreshCart();
    } catch (err) {
      console.error('[GiftWrap] remove error:', err);
    }
  }

  // ── Auto-remove orphaned Gift Wrap lines ─────────────────────────────────────
  // Scans ALL gift wrap items in the cart (not just this page's) and removes
  // any whose parent product is no longer present.  This fires on every cart
  // change event so orphaned wraps are caught even when the user is browsing
  // a different product page.
  async function cleanupOrphanedWraps() {
    if (cleanupRunning) return;
    cleanupRunning = true;
    try {
      const cart = await getCart();
      if (!cart) return;

      // All gift wrap lines are identified by having a 'Wrapped item' property.
      const wraps = cart.items.filter(item => item.properties?.['Wrapped item']);
      if (!wraps.length) return;

    // Build a set of product titles that are genuinely in the cart
    // (use product_title so multi-variant items still match correctly).
    const presentTitles = new Set(
      cart.items
        .filter(item => !item.properties?.['Wrapped item'])
        .map(item => item.product_title)
    );

    let needsRefresh = false;

    for (const wrap of wraps) {
      const wrappedTitle = wrap.properties['Wrapped item'];

      if (presentTitles.has(wrappedTitle)) {
        // Parent product is in cart — arm auto-remove for this page's wrap
        if (wrap.key === cartLineKey) parentEverInCart = true;
        continue;
      }

      // Parent product is gone.
      // Special case for the current page's wrap: only remove if the product
      // was previously confirmed present (guards the "wrap before add" flow).
      if (wrap.key === cartLineKey && !parentEverInCart) continue;

      // Remove the orphaned wrap silently
      try {
        await fetch('/cart/change.js', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: wrap.key, quantity: 0 }),
        });

        // If it was this page's wrap, reset the UI too
        if (wrap.key === cartLineKey) {
          cartLineKey       = null;
          parentEverInCart  = false;
          toggle.checked        = false;
          options.style.display = 'none';
          showStatus(false);
          if (select && select.tagName === 'SELECT') select.selectedIndex = 0;
          if (msgInput) { msgInput.value = ''; if (charCount) charCount.textContent = '0 / 200'; }
        }
        needsRefresh = true;
      } catch (err) {
        console.error('[GiftWrap] cleanup error:', err);
      }
    }

    if (needsRefresh) refreshCart();
    } finally {
      cleanupRunning = false;
    }
  }

  // ── Detect external cart changes (Dawn removing items, etc.) ─────────────────
  // Dawn's cart drawer replaces its DOM via the Sections API and fires NO
  // global events we can listen to. We patch window.fetch once (guarded by a
  // flag so multiple blocks don't stack patches) and relay cart modifications
  // via a custom event that every gift-wrap instance handles independently.
  if (!window._gwFetchPatched) {
    window._gwFetchPatched = true;
    const _orig = window.fetch;
    window.fetch = async function (input, init) {
      const res = await _orig.apply(this, arguments);
      const url = typeof input === 'string' ? input : (input?.url || '');
      if (res.ok && (url.includes('/cart/change') || url.includes('/cart/update'))) {
        document.dispatchEvent(new CustomEvent('gw:cart-changed'));
      }
      return res;
    };
  }
  document.addEventListener('gw:cart-changed', () => setTimeout(cleanupOrphanedWraps, 400));

  // ── Cart DOM observer ─────────────────────────────────────────────────────────
  // Single observer instance, reused. Uses the `domBusy` flag so our own
  // insertBefore calls do not retrigger the callback (infinite-loop guard).

  let observer   = null;
  let obsTimer   = null;

  function setupCartObserver() {
    const el = findCartContainer();
    if (!el) { setTimeout(setupCartObserver, 600); return; }
    if (observer) observer.disconnect();

    observer = new MutationObserver(() => {
      if (domBusy) return;
      clearTimeout(obsTimer);
      obsTimer = setTimeout(applyCartCustomisations, 100);
    });
    observer.observe(el, { childList: true, subtree: true });
  }

  function applyCartCustomisations() {
    if (hideQty) hideGiftWrapQty();
    reorderCartItems();
    cleanupOrphanedWraps(); // async – fire-and-forget; handles all products
  }

  function findCartContainer() {
    const sels = ['#CartDrawer-CartItems', 'cart-items', '.cart-items', '#cart-items'];
    for (const s of sels) { const el = document.querySelector(s); if (el) return el; }
    return null;
  }

  // Also run on standard cart events and cart-icon click
  ['cart:refresh', 'cart:updated', 'dispatch:cart-update', 'cart:built'].forEach(evt =>
    document.addEventListener(evt, () => setTimeout(applyCartCustomisations, 200))
  );
  document.addEventListener('click', e => {
    if (e.target.closest('[data-cart-toggle],.cart-toggle,#cart-icon-bubble,[href="/cart"],[data-open-cart]')) {
      setTimeout(applyCartCustomisations, 350);
      // Re-attach observer in case drawer was first opened now
      setTimeout(setupCartObserver, 400);
    }
  });

  // ── 1. Hide quantity selector for Gift Wrap lines ─────────────────────────────
  // Uses display:none so no blank gap is left behind.
  function hideGiftWrapQty() {
    const rowSels  = ['.cart-item', '[data-cart-item]', '.cart__item'];
    const nameSels = ['.cart-item__name a', '.cart-item__name', '[data-cart-item-title]'];
    const qtySels  = ['quantity-input', '.cart-item__quantity-wrapper', '.cart-item__quantity'];

    for (const rs of rowSels) {
      document.querySelectorAll(rs).forEach(row => {
        let name = '';
        for (const ns of nameSels) {
          const el = row.querySelector(ns);
          if (el) { name = el.textContent.trim().toLowerCase(); break; }
        }
        if (!name.includes('gift wrap')) return;
        for (const qs of qtySels) {
          const qty = row.querySelector(qs);
          if (qty) { qty.style.display = 'none'; qty.setAttribute('aria-hidden', 'true'); }
        }
      });
    }
  }

  // ── 2. Reorder: each Gift Wrap row goes right after its product ───────────────
  function reorderCartItems() {
    // Find the cart items container (may be a <ul> or a <table>)
    const wrapSels = [
      '#CartDrawer-CartItems .cart-items',
      'cart-items .cart-items',
      '.cart-items',
    ];
    let cartEl = null;
    for (const s of wrapSels) { cartEl = document.querySelector(s); if (cartEl) break; }
    if (!cartEl) return;

    // Dawn's cart drawer uses a <table>; rows live in <tbody>, not the table itself.
    const wrap = cartEl.tagName === 'TABLE'
      ? (cartEl.querySelector('tbody') || cartEl)
      : cartEl;

    const nameSels = ['.cart-item__name a', '.cart-item__name'];
    const rows     = Array.from(wrap.querySelectorAll(':scope > .cart-item'));
    if (rows.length < 2) return;

    // Map: exact product title → row element (non-gift-wrap rows only)
    const productMap = new Map();
    rows.forEach(row => {
      let name = '';
      for (const ns of nameSels) {
        const el = row.querySelector(ns);
        if (el) { name = el.textContent.trim(); break; }
      }
      if (!name.toLowerCase().includes('gift wrap')) productMap.set(name, row);
    });

    // Move each gift wrap row to sit directly after its product row
    domBusy = true;
    try {
      rows.forEach(row => {
        let name = '';
        for (const ns of nameSels) {
          const el = row.querySelector(ns);
          if (el) { name = el.textContent.trim().toLowerCase(); break; }
        }
        if (!name.includes('gift wrap')) return;

        const wrapped = readWrappedItemName(row);
        if (!wrapped) return;

        const productRow = productMap.get(wrapped);
        if (!productRow || productRow.nextElementSibling === row) return;

        wrap.insertBefore(row, productRow.nextSibling);
      });
    } finally {
      setTimeout(() => { domBusy = false; }, 80);
    }
  }

  /** Reads the "Wrapped item: ..." property text from a cart row element. */
  function readWrappedItemName(row) {
    // Dawn's cart drawer renders properties as <dl><dt>Key:</dt><dd>Value</dd></dl>
    for (const dt of row.querySelectorAll('dt')) {
      const label = dt.textContent.trim().replace(/:$/, '').toLowerCase();
      if (label === 'wrapped item') {
        const dd = dt.nextElementSibling;
        if (dd && dd.tagName === 'DD') return dd.textContent.trim();
      }
    }
    // Fallback: older themes use <li>/<p>/<span> with "Key: Value" inline
    for (const el of row.querySelectorAll('li, p, span')) {
      const txt = el.textContent.trim();
      if (txt.startsWith('Wrapped item:') && txt.length < 200) {
        return txt.slice('Wrapped item:'.length).trim();
      }
    }
    return null;
  }

  // ── UI helpers ────────────────────────────────────────────────────────────────
  function showStatus(on) {
    if (!statusEl) return;
    if (on) {
      const colour = select && select.tagName === 'SELECT' && select.value
        ? select.options[select.selectedIndex]?.text : null;
      if (statusText) {
        statusText.textContent = colour
          ? `✓ Gift wrap added (${colour})`
          : '✓ Gift wrap added to this item';
      }
      statusEl.style.display = 'flex';
    } else {
      statusEl.style.display = 'none';
    }
  }

  function setLoading(on) {
    const label = container.querySelector('.gw-checkbox-label');
    if (label) label.style.opacity = on ? '0.6' : '1';
  }

  function refreshCart() {
    ['cart:refresh', 'cart:updated', 'dispatch:cart-update'].forEach(n =>
      document.dispatchEvent(new CustomEvent(n))
    );
    fetch('/cart.js')
      .then(r => r.json())
      .then(cart => document.dispatchEvent(new CustomEvent('cart:built', { detail: cart })))
      .catch(() => {});
  }

})();

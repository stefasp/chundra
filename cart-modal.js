// cart-modal.js — Chundra
// Renders the cart sidebar/modal.
// Shows items, subtotal, shipping per zone, and initiates Stripe checkout.
// Stripe session creation requires a small serverless function (see stripe-checkout.js).

(function () {
  // ── Inject HTML ──────────────────────────────────────────────
  const html = `
  <div id="cart-modal" role="dialog" aria-modal="true" aria-label="Your cart">
    <div id="cm-overlay"></div>
    <div id="cm-panel">
      <div id="cm-header">
        <h2>Your cart</h2>
        <button id="cm-close" aria-label="Close cart">×</button>
      </div>

      <div id="cm-body">
        <div id="cm-empty" style="display:none;">
          <p>Your cart is empty.</p>
        </div>

        <ul id="cm-item-list"></ul>

        <div id="cm-totals" style="display:none;">
          <div id="cm-subtotal-row">
            <span>Subtotal</span>
            <span id="cm-subtotal">—</span>
          </div>

          <!-- Zone selector -->
          <div id="cm-zone-block">
            <label for="cm-zone-select">Shipping to:</label>
            <select id="cm-zone-select">
              <option value="">— Select region —</option>
              <option value="spain">Spain</option>
              <option value="europe">Rest of Europe</option>
              <option value="world">Rest of the world</option>
            </select>
          </div>

          <div id="cm-shipping-row" style="display:none;">
            <span>Shipping</span>
            <span id="cm-shipping-cost">—</span>
          </div>
          <div id="cm-shipping-breakdown" style="display:none;"></div>
          <div id="cm-shipping-confirm" style="display:none;">
            <p>⚠️ Shipping cost will be confirmed before payment is processed.</p>
          </div>

          <div id="cm-total-row" style="display:none;">
            <span><strong>Total</strong></span>
            <strong id="cm-total">—</strong>
          </div>

          <div id="cm-savings-row" style="display:none;">
            <span>🎁 You save on shipping</span>
            <span id="cm-savings" class="cm-savings-amount">—</span>
          </div>

          <p id="cm-shipping-pending" style="display:none;">
            Select your region to see shipping costs.
          </p>
        </div>
      </div>

      <div id="cm-footer" style="display:none;">
        <p id="cm-stripe-note">Payment processed securely via Stripe. You'll be redirected to complete your order.</p>
        <button id="cm-checkout-btn" class="button main" disabled>
          Proceed to checkout
        </button>
        <p id="cm-checkout-error" style="display:none;" class="cm-error"></p>
      </div>
    </div>
  </div>

  <!-- Cart toggle button (fixed, bottom right) -->
  <button id="cart-fab" aria-label="Open cart">
    <span id="cart-fab-icon">🛍</span>
    <span id="cart-fab-count" style="display:none;">0</span>
  </button>`;

  document.body.insertAdjacentHTML('beforeend', html);

  // ── DOM refs ─────────────────────────────────────────────────
  const modal        = document.getElementById('cart-modal');
  const overlay      = document.getElementById('cm-overlay');
  const itemList     = document.getElementById('cm-item-list');
  const emptyMsg     = document.getElementById('cm-empty');
  const totalsEl     = document.getElementById('cm-totals');
  const subtotalEl   = document.getElementById('cm-subtotal');
  const zoneSelect   = document.getElementById('cm-zone-select');
  const shippingRow  = document.getElementById('cm-shipping-row');
  const shippingCost = document.getElementById('cm-shipping-cost');
  const breakdown    = document.getElementById('cm-shipping-breakdown');
  const confirmNote  = document.getElementById('cm-shipping-confirm');
  const totalRow     = document.getElementById('cm-total-row');
  const totalEl      = document.getElementById('cm-total');
  const savingsRow   = document.getElementById('cm-savings-row');
  const savingsEl    = document.getElementById('cm-savings');
  const pendingMsg   = document.getElementById('cm-shipping-pending');
  const footerEl     = document.getElementById('cm-footer');
  const checkoutBtn  = document.getElementById('cm-checkout-btn');
  const checkoutErr  = document.getElementById('cm-checkout-error');
  const fab          = document.getElementById('cart-fab');
  const fabCount     = document.getElementById('cart-fab-count');

  // ── Open / Close ─────────────────────────────────────────────
  function openCart() {
    render();
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.getElementById('cm-close').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  fab.addEventListener('click', openCart);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

  // ── Render ───────────────────────────────────────────────────
  function render() {
    const products = Cart.getProducts();
    const isEmpty  = products.length === 0;

    emptyMsg.style.display  = isEmpty ? 'block' : 'none';
    totalsEl.style.display  = isEmpty ? 'none'  : 'block';
    footerEl.style.display  = isEmpty ? 'none'  : 'block';

    // Items
    itemList.innerHTML = '';
    products.forEach(p => {
      const effectivePrice = p.priceSale ?? p.price;
      const li = document.createElement('li');
      li.className = 'cm-item';
      li.innerHTML = `
        <img class="cm-item-img" src="${p.images[0]}" alt="${p.name}">
        <div class="cm-item-info">
          <p class="cm-item-name">${p.name}</p>
          <p class="cm-item-meta">${p.materials || ''}</p>
          ${p.priceSale
            ? `<p class="cm-item-price"><span class="price-original">€${p.price}</span> <strong>€${p.priceSale}</strong></p>`
            : `<p class="cm-item-price"><strong>€${p.price}</strong></p>`
          }
        </div>
        <button class="cm-remove-btn" data-id="${p.id}" aria-label="Remove ${p.name}">×</button>`;
      itemList.appendChild(li);
    });

    // Subtotal
    const subtotal = Cart.getSubtotal();
    subtotalEl.textContent = `€${subtotal}`;

    // Reset shipping
    shippingRow.style.display  = 'none';
    totalRow.style.display     = 'none';
    savingsRow.style.display   = 'none';
    breakdown.style.display    = 'none';
    confirmNote.style.display  = 'none';
    pendingMsg.style.display   = 'block';
    checkoutBtn.disabled       = true;

    // Recalculate if zone already selected
    if (zoneSelect.value) {
      updateShipping(products, zoneSelect.value, subtotal);
    }
  }

  // ── Shipping calc ────────────────────────────────────────────
  function updateShipping(products, zone, subtotal) {
    const result   = calculateShipping(products, zone);
    const allZones = calculateAllZones(products);

    pendingMsg.style.display = 'none';
    shippingRow.style.display = 'flex';

    if (result.cost === null) {
      shippingCost.textContent    = 'Custom quote';
      breakdown.style.display     = 'block';
      breakdown.textContent       = result.breakdown;
      confirmNote.style.display   = 'block';
      totalRow.style.display      = 'none';
      checkoutBtn.disabled        = true;
    } else {
      shippingCost.textContent    = `€${result.cost}`;
      breakdown.style.display     = result.breakdown ? 'block' : 'none';
      breakdown.textContent       = result.breakdown;
      confirmNote.style.display   = result.needsConfirmation ? 'block' : 'none';

      const total = subtotal + result.cost;
      totalRow.style.display      = 'flex';
      totalEl.textContent         = `€${total}`;

      // Savings: compare to sum of individual shipping costs
      const individualCost = products.reduce((sum, p) => {
        const r = calculateShipping([p], zone);
        return sum + (r.cost || 0);
      }, 0);
      const saved = individualCost - result.cost;
      if (saved > 0.5 && products.length > 1) {
        savingsRow.style.display = 'flex';
        savingsEl.textContent    = `−€${saved.toFixed(0)}`;
      } else {
        savingsRow.style.display = 'none';
      }

      checkoutBtn.disabled = false;
    }
  }

  zoneSelect.addEventListener('change', () => {
    const products = Cart.getProducts();
    const subtotal = Cart.getSubtotal();
    if (zoneSelect.value) {
      updateShipping(products, zoneSelect.value, subtotal);
    }
  });

  // ── Remove items ─────────────────────────────────────────────
  itemList.addEventListener('click', (e) => {
    const btn = e.target.closest('.cm-remove-btn');
    if (btn) {
      Cart.removeItem(btn.dataset.id);
      render();
    }
  });

  // ── Stripe Checkout ──────────────────────────────────────────
  checkoutBtn.addEventListener('click', async () => {
    checkoutErr.style.display = 'none';
    checkoutBtn.disabled      = true;
    checkoutBtn.textContent   = 'Redirecting…';

    const products  = Cart.getProducts();
    const zone      = zoneSelect.value;
    const shipping  = calculateShipping(products, zone);

    const lineItems = products.map(p => ({
      id:    p.id,
      name:  p.name,
      price: p.priceSale ?? p.price,
      image: window.location.origin + '/' + p.images[0],
    }));

    try {
      // POST to your Vercel serverless function
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items:        lineItems,
          shippingCost: shipping.cost,
          zone:         zone,
          shippingLabel: shipping.needsConfirmation
            ? 'Shipping (to be confirmed)'
            : `Shipping to ${zone} — ${shipping.breakdown}`,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      checkoutErr.textContent  = `Something went wrong: ${err.message}`;
      checkoutErr.style.display = 'block';
      checkoutBtn.disabled      = false;
      checkoutBtn.textContent   = 'Proceed to checkout';
    }
  });

  // ── FAB counter ──────────────────────────────────────────────
  function updateFab() {
    const count = Cart.getCount();
    fabCount.textContent    = count;
    fabCount.style.display  = count > 0 ? 'flex' : 'none';
  }

  window.addEventListener('cartUpdated', () => {
    updateFab();
    if (modal.classList.contains('is-open')) render();
  });

  updateFab(); // init
})();

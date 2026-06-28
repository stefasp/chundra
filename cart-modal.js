// cart-modal.js — Chundra

(function () {
  const html = `
  <div id="cart-modal" role="dialog" aria-modal="true" aria-label="Your cart">
    <div id="cm-overlay"></div>
    <div id="cm-panel">
      <div id="cm-header">
        <h2>Your cart</h2>
        <button id="cm-close" aria-label="Close cart">×</button>
      </div>
      <div id="cm-body">
        <div id="cm-empty" style="display:none;"><p>Your cart is empty.</p></div>
        <ul id="cm-item-list"></ul>
        <div id="cm-totals" style="display:none;">

          <div id="cm-subtotal-row">
            <span>Pieces total</span>
            <span id="cm-subtotal">—</span>
          </div>

          <!-- Zone selector (shown before selection) -->
          <div id="cm-zone-block">
            <label for="cm-zone-select">Shipping to:</label>
            <select id="cm-zone-select">
              <option value="">— Select region —</option>
              <option value="spain">🇪🇸 Spain</option>
              <option value="europe">🇪🇺 Rest of Europe</option>
              <option value="world">🌍 Rest of the world</option>
            </select>
          </div>

          <!-- Confirmed zone display (shown after selection) -->
          <div id="cm-shipping-confirmed">
            <div id="cm-shipping-zone-label">
              <span id="cm-zone-flag"></span>
              <span id="cm-zone-name"></span>
            </div>
            <button id="cm-shipping-change-btn">Change</button>
          </div>

          <div id="cm-shipping-row">
            <span>Shipping</span>
            <span id="cm-shipping-cost">—</span>
          </div>
          <div id="cm-shipping-breakdown"></div>
          <div id="cm-shipping-confirm"><p>⚠️ Final shipping cost confirmed before payment.</p></div>
          <div id="cm-savings-row">
            <span>🎁 You save on shipping</span>
            <span id="cm-savings" class="cm-savings-amount">—</span>
          </div>
          <div id="cm-total-row">
            <span><strong>Total to pay via Stripe</strong></span>
            <strong id="cm-total">—</strong>
          </div>
          <p id="cm-shipping-pending">Select your region to see shipping costs.</p>
        </div>
      </div>

      <div id="cm-footer" style="display:none;">
        <button id="cm-checkout-btn" disabled>Proceed to checkout</button>
        <p id="cm-stripe-note">🔒 Payment processed securely via Stripe. You'll be redirected to complete your order.</p>
        <p id="cm-checkout-error" style="display:none;" class="cm-error"></p>
      </div>
    </div>
  </div>

  <button id="cart-fab" aria-label="Open cart">
    <span id="cart-fab-icon">🛍</span>
    <span id="cart-fab-count" style="display:none;">0</span>
  </button>`;

  document.body.insertAdjacentHTML('beforeend', html);

  // ── DOM refs ──────────────────────────────────────────────
  const modal         = document.getElementById('cart-modal');
  const overlay       = document.getElementById('cm-overlay');
  const itemList      = document.getElementById('cm-item-list');
  const emptyMsg      = document.getElementById('cm-empty');
  const totalsEl      = document.getElementById('cm-totals');
  const subtotalEl    = document.getElementById('cm-subtotal');
  const zoneBlock     = document.getElementById('cm-zone-block');
  const zoneSelect    = document.getElementById('cm-zone-select');
  const confirmedEl   = document.getElementById('cm-shipping-confirmed');
  const zoneFlagEl    = document.getElementById('cm-zone-flag');
  const zoneNameEl    = document.getElementById('cm-zone-name');
  const changeBtn     = document.getElementById('cm-shipping-change-btn');
  const shippingRow   = document.getElementById('cm-shipping-row');
  const shippingCostEl= document.getElementById('cm-shipping-cost');
  const breakdownEl   = document.getElementById('cm-shipping-breakdown');
  const confirmNote   = document.getElementById('cm-shipping-confirm');
  const savingsRow    = document.getElementById('cm-savings-row');
  const savingsEl     = document.getElementById('cm-savings');
  const totalRow      = document.getElementById('cm-total-row');
  const totalEl       = document.getElementById('cm-total');
  const pendingMsg    = document.getElementById('cm-shipping-pending');
  const footerEl      = document.getElementById('cm-footer');
  const checkoutBtn   = document.getElementById('cm-checkout-btn');
  const checkoutErr   = document.getElementById('cm-checkout-error');
  const fab           = document.getElementById('cart-fab');
  const fabCount      = document.getElementById('cart-fab-count');

  const ZONE_LABELS = {
    spain:  { flag: '🇪🇸', name: 'Spain' },
    europe: { flag: '🇪🇺', name: 'Rest of Europe' },
    world:  { flag: '🌍', name: 'Rest of the world' },
  };

  // ── Open / Close ──────────────────────────────────────────
  function openCart() { render(); modal.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function closeCart() { modal.classList.remove('is-open'); document.body.style.overflow = ''; }

  document.getElementById('cm-close').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  fab.addEventListener('click', openCart);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

  // ── Render ────────────────────────────────────────────────
  function render() {
    const products = Cart.getProducts();
    const isEmpty  = products.length === 0;

    emptyMsg.style.display = isEmpty ? 'block' : 'none';
    totalsEl.style.display = isEmpty ? 'none'  : 'block';
    footerEl.style.display = isEmpty ? 'none'  : 'block';

    // Items
    itemList.innerHTML = '';
    products.forEach(p => {
      const ep = p.priceSale ?? p.price;
      const li = document.createElement('li');
      li.className = 'cm-item';
      li.innerHTML = `
        <img class="cm-item-img" src="${p.images[0]}" alt="${p.name}">
        <div class="cm-item-info">
          <p class="cm-item-name">${p.name}</p>
          <p class="cm-item-meta">${p.materials || ''}</p>
          ${p.priceSale
            ? `<p class="cm-item-price"><span class="price-original">€${p.price}</span> <strong>€${p.priceSale}</strong></p>`
            : `<p class="cm-item-price"><strong>€${p.price}</strong></p>`}
        </div>
        <button class="cm-remove-btn" data-id="${p.id}" aria-label="Remove">×</button>`;
      itemList.appendChild(li);
    });

    const subtotal = Cart.getSubtotal();
    subtotalEl.textContent = `€${subtotal}`;

    // Reset shipping display
    showPending();
    checkoutBtn.disabled = true;

    // Recalc if zone already selected
    if (zoneSelect.value) applyZone(products, zoneSelect.value, subtotal);
  }

  // ── Zone selection ────────────────────────────────────────
  function showPending() {
    zoneBlock.style.display      = 'flex';
    confirmedEl.classList.remove('visible');
    shippingRow.classList.remove('visible');
    breakdownEl.classList.remove('visible');
    confirmNote.classList.remove('visible');
    savingsRow.classList.remove('visible');
    totalRow.classList.remove('visible');
    pendingMsg.style.display     = 'block';
    checkoutBtn.disabled         = true;
  }

  function applyZone(products, zone, subtotal) {
    const result = calculateShipping(products, zone);
    const label  = ZONE_LABELS[zone];

    // Hide selector, show confirmed pill
    zoneBlock.style.display = 'none';
    zoneFlagEl.textContent  = label.flag;
    zoneNameEl.textContent  = label.name;
    confirmedEl.classList.add('visible');
    pendingMsg.style.display = 'none';

    shippingRow.classList.add('visible');

    if (result.cost === null) {
      shippingCostEl.textContent = 'Quote on request';
      breakdownEl.textContent    = result.breakdown;
      breakdownEl.classList.add('visible');
      confirmNote.classList.add('visible');
      totalRow.classList.remove('visible');
      checkoutBtn.disabled = true;
    } else {
      shippingCostEl.textContent = `€${result.cost}`;

      if (result.breakdown) {
        breakdownEl.textContent = result.breakdown;
        breakdownEl.classList.add('visible');
      }
      if (result.needsConfirmation) confirmNote.classList.add('visible');

      const total = subtotal + result.cost;
      totalEl.textContent = `€${total}`;
      totalRow.classList.add('visible');

      // Savings
      const individualCost = products.reduce((sum, p) => {
        const r = calculateShipping([p], zone);
        return sum + (r.cost || 0);
      }, 0);
      const saved = individualCost - result.cost;
      if (saved > 0.5 && products.length > 1) {
        savingsEl.textContent = `−€${saved.toFixed(0)}`;
        savingsRow.classList.add('visible');
      }

      checkoutBtn.disabled = false;
    }
  }

  zoneSelect.addEventListener('change', () => {
    if (!zoneSelect.value) return;
    const products = Cart.getProducts();
    const subtotal = Cart.getSubtotal();
    applyZone(products, zoneSelect.value, subtotal);
  });

  // "Change" button — show selector again
  changeBtn.addEventListener('click', () => {
    zoneSelect.value = '';
    showPending();
  });

  // ── Remove items ──────────────────────────────────────────
  itemList.addEventListener('click', e => {
    const btn = e.target.closest('.cm-remove-btn');
    if (btn) { Cart.removeItem(btn.dataset.id); render(); }
  });

  // ── Stripe Checkout ───────────────────────────────────────
  checkoutBtn.addEventListener('click', async () => {
    checkoutErr.style.display = 'none';
    checkoutBtn.disabled      = true;
    checkoutBtn.textContent   = 'Redirecting…';

    const products = Cart.getProducts();
    const zone     = zoneSelect.value || zoneNameEl.textContent.toLowerCase().replace(/ /g,'_');
    const shipping = calculateShipping(products, zoneSelect.value || 'world');

    const lineItems = products.map(p => ({
      id:    p.id,
      name:  p.name,
      price: p.priceSale ?? p.price,
      image: window.location.origin + '/' + p.images[0],
    }));

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items:        lineItems,
          shippingCost: shipping.cost,
          zone:         zone,
          shippingLabel: shipping.needsConfirmation
            ? 'Shipping (to be confirmed)'
            : `Shipping — ${shipping.breakdown}`,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      checkoutErr.textContent   = `Something went wrong: ${err.message}`;
      checkoutErr.style.display = 'block';
      checkoutBtn.disabled      = false;
      checkoutBtn.textContent   = 'Proceed to checkout';
    }
  });

  // ── FAB counter ───────────────────────────────────────────
  function updateFab() {
    const count = Cart.getCount();
    fabCount.textContent   = count;
    fabCount.style.display = count > 0 ? 'flex' : 'none';
  }

  window.addEventListener('cartUpdated', () => {
    updateFab();
    if (modal.classList.contains('is-open')) render();
  });

  updateFab();
})();

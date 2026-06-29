// cart-modal.js — Chundra
// Supports two delivery methods: Correos (home) and Inpost (pickup point)
// Inpost only shown for supported countries. For large paintings, only the
// supported method is shown.

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

          <!-- Step 1: Region selector -->
          <div id="cm-zone-block">
            <label for="cm-zone-select">Shipping to:</label>
            <select id="cm-zone-select">
              <option value="">— Select region —</option>
              <optgroup label="Inpost available">
                <option value="spain">🇪🇸 Spain</option>
                <option value="portugal">🇵🇹 Portugal</option>
                <option value="france">🇫🇷 France</option>
                <option value="belgium">🇧🇪 Belgium</option>
                <option value="luxembourg">🇱🇺 Luxembourg</option>
                <option value="netherlands">🇳🇱 Netherlands</option>
                <option value="germany">🇩🇪 Germany</option>
                <option value="italy">🇮🇹 Italy</option>
                <option value="poland">🇵🇱 Poland</option>
              </optgroup>
              <optgroup label="Standard shipping">
                <option value="europe">🌍 Rest of Europe</option>
                <option value="world">🌏 Rest of the world</option>
              </optgroup>
            </select>
          </div>

          <!-- Confirmed zone + change -->
          <div id="cm-shipping-confirmed">
            <span id="cm-shipping-zone-label"></span>
            <button id="cm-shipping-change-btn" aria-label="Change region">
              <img src="images/icons/edit.png" alt="Edit">
            </button>
          </div>

          <!-- Step 2: Delivery method (only for Inpost zones) -->
          <div id="cm-delivery-method" style="display:none;">
            <p id="cm-delivery-label">How would you like to receive it?</p>
            <div id="cm-delivery-options">
              <button class="cm-delivery-btn active" data-method="correos" id="cm-btn-correos">
                <span class="cm-delivery-icon">🏠</span>
                <span class="cm-delivery-name">To my address</span>
                <span class="cm-delivery-price" id="cm-price-correos">—</span>
              </button>
              <button class="cm-delivery-btn" data-method="inpost" id="cm-btn-inpost">
                <span class="cm-delivery-icon">📦</span>
                <span class="cm-delivery-name">Inpost pickup point</span>
                <span class="cm-delivery-price" id="cm-price-inpost">—</span>
              </button>
            </div>
          </div>

          <!-- Shipping breakdown -->
          <div id="cm-shipping-row" style="display:none;">
            <span>Shipping</span>
            <span id="cm-shipping-cost">—</span>
          </div>
          <div id="cm-shipping-breakdown" class="cm-breakdown-text"></div>
          <div id="cm-shipping-confirm" class="cm-confirm-note" style="display:none;">
            <p>⚠️ Final shipping cost confirmed before payment.</p>
          </div>

          <p id="cm-shipping-pending">Select your region to see shipping options.</p>
        </div>
      </div>

      <div id="cm-footer">
        <div id="cm-total-row">
          <span>Total to pay via Stripe</span>
          <strong id="cm-total">—</strong>
        </div>
        <button id="cm-checkout-btn" disabled>Proceed to checkout</button>
        <p id="cm-stripe-note">
          <img src="images/icons/lock.png" alt="Secure">
          Payment processed securely via Stripe. You'll be redirected to complete your order.
        </p>
        <p id="cm-checkout-error" style="display:none;" class="cm-error"></p>
      </div>

    </div>
  </div>

  <button id="cart-fab" aria-label="Open cart">
    <span>🛍</span>
    <span id="cart-fab-count" style="display:none;">0</span>
  </button>`;

  document.body.insertAdjacentHTML('beforeend', html);

  // ── DOM refs ──────────────────────────────────────────────
  const modal           = document.getElementById('cart-modal');
  const overlay         = document.getElementById('cm-overlay');
  const itemList        = document.getElementById('cm-item-list');
  const emptyMsg        = document.getElementById('cm-empty');
  const totalsEl        = document.getElementById('cm-totals');
  const subtotalEl      = document.getElementById('cm-subtotal');
  const zoneBlock       = document.getElementById('cm-zone-block');
  const zoneSelect      = document.getElementById('cm-zone-select');
  const confirmedEl     = document.getElementById('cm-shipping-confirmed');
  const zoneLabelEl     = document.getElementById('cm-shipping-zone-label');
  const changeBtn       = document.getElementById('cm-shipping-change-btn');
  const deliveryMethod  = document.getElementById('cm-delivery-method');
  const deliveryBtns    = document.querySelectorAll('.cm-delivery-btn');
  const priceCorreos    = document.getElementById('cm-price-correos');
  const priceInpost     = document.getElementById('cm-price-inpost');
  const btnCorreos      = document.getElementById('cm-btn-correos');
  const btnInpost       = document.getElementById('cm-btn-inpost');
  const shippingRow     = document.getElementById('cm-shipping-row');
  const shippingCostEl  = document.getElementById('cm-shipping-cost');
  const breakdownEl     = document.getElementById('cm-shipping-breakdown');
  const confirmNote     = document.getElementById('cm-shipping-confirm');
  const pendingMsg      = document.getElementById('cm-shipping-pending');
  const footerEl        = document.getElementById('cm-footer');
  const totalEl         = document.getElementById('cm-total');
  const checkoutBtn     = document.getElementById('cm-checkout-btn');
  const checkoutErr     = document.getElementById('cm-checkout-error');
  const fab             = document.getElementById('cart-fab');
  const fabCount        = document.getElementById('cart-fab-count');

  let selectedZone   = '';
  let selectedMethod = 'correos'; // 'correos' | 'inpost'

  // ── Open / Close ──────────────────────────────────────────
  function openCart()  { render(); modal.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
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
    totalsEl.style.display = isEmpty ? 'none' : 'block';

    itemList.innerHTML = '';
    products.forEach(p => {
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

    subtotalEl.textContent = `€${Cart.getSubtotal()}`;

    if (selectedZone) {
      applyZone(products, selectedZone);
    } else {
      showPending();
    }
  }

  // ── Zone states ───────────────────────────────────────────
  function showPending() {
    zoneBlock.style.display      = 'flex';
    confirmedEl.style.display    = 'none';
    deliveryMethod.style.display = 'none';
    shippingRow.style.display    = 'none';
    breakdownEl.textContent      = '';
    confirmNote.style.display    = 'none';
    pendingMsg.style.display     = 'block';
    checkoutBtn.disabled         = true;
    footerEl.style.display       = 'none';
  }

  function applyZone(products, zone) {
    selectedZone = zone;
    // Expose zone globally so piece modal can show zone-specific shipping
    if (typeof window.onShippingZoneSelected === 'function') window.onShippingZoneSelected(zone);
    const label  = ZONE_LABELS[zone] || { flag: '🌍', name: zone };

    zoneBlock.style.display    = 'none';
    pendingMsg.style.display   = 'none';
    zoneLabelEl.textContent    = `Shipping to ${label.flag} ${label.name}`;
    confirmedEl.style.display  = 'flex';

    const { correos, inpost } = calculateShippingOptions(products, zone);

    // Show/hide delivery method selector
    const hasInpost = inpost && inpost.cost !== null;

    if (hasInpost) {
      // Show both options
      deliveryMethod.style.display = 'block';
      priceCorreos.textContent = correos.cost !== null ? `€${correos.cost}` : 'Quote';
      priceInpost.textContent  = `€${inpost.cost}`;
      applyMethod(products, zone, selectedMethod, correos, inpost);
    } else {
      // Only one option — show it directly
      deliveryMethod.style.display = 'none';
      applyResult(products, zone, correos);
    }
  }

  function applyMethod(products, zone, method, correos, inpost) {
    // Update button active state
    deliveryBtns.forEach(b => b.classList.toggle('active', b.dataset.method === method));
    const result = method === 'inpost' ? inpost : correos;
    applyResult(products, zone, result);
  }

  const NO_METHOD_MSG = `For this piece and destination I would need to find a custom shipping option. Please write to <strong class="cm-email-copy" data-email="stefus.sp@gmail.com">stefus.sp@gmail.com</strong> — click to copy.`;

  function applyResult(products, zone, result) {
    shippingRow.style.display = 'block';

    // No shipping method available for this zone + products combination
    if (!result || result.noMethod || result.cost === null) {
      shippingCostEl.textContent = '';
      breakdownEl.innerHTML      = NO_METHOD_MSG;
      confirmNote.style.display  = 'none';
      footerEl.style.display     = 'none';
      checkoutBtn.disabled       = true;
      return;
    }

    shippingCostEl.textContent = `€${result.cost}`;
    breakdownEl.textContent    = result.breakdown || '';
    confirmNote.style.display  = result.needsConfirmation ? 'block' : 'none';

    const total = Cart.getSubtotal() + result.cost;
    totalEl.textContent      = `€${total}`;
    footerEl.style.display   = 'flex';
    checkoutBtn.disabled     = false;
  }

  // ── Event listeners ───────────────────────────────────────
  zoneSelect.addEventListener('change', () => {
    if (!zoneSelect.value) return;
    selectedMethod = 'correos'; // reset to default
    deliveryBtns.forEach(b => b.classList.toggle('active', b.dataset.method === 'correos'));
    applyZone(Cart.getProducts(), zoneSelect.value);
  });

  changeBtn.addEventListener('click', () => {
    selectedZone = '';
    zoneSelect.value = '';
    showPending();
  });

  deliveryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedMethod = btn.dataset.method;
      const products = Cart.getProducts();
      const { correos, inpost } = calculateShippingOptions(products, selectedZone);
      applyMethod(products, selectedZone, selectedMethod, correos, inpost);
    });
  });

  // Click to copy email in no-method message
  document.getElementById('cm-body').addEventListener('click', e => {
    const el = e.target.closest('.cm-email-copy');
    if (!el) return;
    const email = el.dataset.email;
    navigator.clipboard.writeText(email).then(() => {
      const orig = el.textContent;
      el.textContent = 'Copied!';
      setTimeout(() => { el.textContent = orig; }, 1500);
    });
  });

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
    const { correos, inpost } = calculateShippingOptions(products, selectedZone);
    const result = selectedMethod === 'inpost' && inpost ? inpost : correos;

    const lineItems = products.map(p => ({
      id: p.id, name: p.name,
      price: p.priceSale ?? p.price,
      image: window.location.origin + '/' + p.images[0],
    }));

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: lineItems,
          shippingCost: result.cost,
          zone: selectedZone,
          deliveryMethod: selectedMethod,
          shippingLabel: selectedMethod === 'inpost'
            ? `Inpost pickup point — ${ZONE_LABELS[selectedZone]?.name}`
            : result.needsConfirmation ? 'Shipping (to be confirmed)' : `Shipping — ${result.breakdown}`,
        }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else throw new Error(data.error || 'Unknown error');
    } catch (err) {
      checkoutErr.textContent   = `Something went wrong: ${err.message}`;
      checkoutErr.style.display = 'block';
      checkoutBtn.disabled      = false;
      checkoutBtn.textContent   = 'Proceed to checkout';
    }
  });

  // ── FAB ──────────────────────────────────────────────────
  function updateFab() {
    const count = Cart.getCount();
    fabCount.textContent   = count;
    fabCount.style.display = count > 0 ? 'flex' : 'none';
  }
  window.addEventListener('cartUpdated', () => { updateFab(); if (modal.classList.contains('is-open')) render(); });
  updateFab();
})();

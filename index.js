// index.js — Chundra
// 1. Filter bar logic
// 2. Auto-populate card details from PRODUCTS data
// 3. Update piece modal shipping when zone is known

document.addEventListener('DOMContentLoaded', function () {

  // ── 1. Filter bar ─────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cards.forEach(card => {
        if (filter === 'all') { card.style.display = ''; return; }
        const cats = (card.dataset.category || '').split(' ');
        card.style.display = cats.includes(filter) ? '' : 'none';
      });
    });
  });

  // ── 2. Auto-populate card .details from PRODUCTS ──────────
  if (typeof PRODUCTS === 'undefined') return;

  document.querySelectorAll('.card[data-product-id]').forEach(card => {
    const p = PRODUCTS[card.dataset.productId];
    if (!p) return;

    const detailsEl = card.querySelector('.details');
    if (!detailsEl) return;

    // Price HTML
    let priceHTML = '';
    if (p.priceSale) {
      const pct = Math.round((1 - p.priceSale / p.price) * 100);
      priceHTML = `<p class="card-price"><span class="price-original">€${p.price}</span> <strong class="price-sale">€${p.priceSale}</strong> <span class="price-badge">–${pct}%</span></p>`;
    } else {
      priceHTML = `<p class="card-price"><strong>€${p.price}</strong></p>`;
    }

    // Dimensions string
    let dimsStr = '';
    if (p.dims) {
      const d = p.dims;
      dimsStr = `${d.w} W × ${d.h} H × ${d.d} D cm`;
      if (p.dimsFramed) {
        const f = p.dimsFramed;
        dimsStr += ` <span class="card-dims-framed">(framed: ${f.w} W × ${f.h} H × ${f.d} D cm)</span>`;
      }
      if (p.dimsCompact) {
        const c = p.dimsCompact;
        dimsStr += ` <span class="card-dims-framed">(central: ${c.w} W × ${c.h} H cm)</span>`;
      }
    }

    // Weight string
    const weightStr = p.weight
      ? `${p.weight} kg · ${(p.weight * 2.205).toFixed(2)} lbs`
      : 'NA';

    // Framing
    const framingMap = { 'framed': 'Framed', 'unframed': 'Unframed', 'stretched canvas': 'Stretched canvas' };
    const framingStr = p.framed ? framingMap[p.framed] || p.framed : '';

    detailsEl.innerHTML = `
      <h3>${p.name}</h3>
      ${p.subtitle ? `<p class="card-subtitle">${p.subtitle}</p>` : ''}
      ${priceHTML}
      <div class="card-specs">
        ${p.materials ? `<p>${p.materials}</p>` : ''}
        ${dimsStr ? `<p>${dimsStr}</p>` : ''}
        <p>Weight: ${weightStr}</p>
        ${framingStr ? `<p>${framingStr}</p>` : ''}
      </div>
    `;

    // Sold state — add class and overlay
    if (p.status === 'sold') {
      card.classList.add('sold');
    }
  });

});

// ── 3. Expose zone globally so piece-modal can read it ────────
// Called by cart-modal.js when zone is confirmed
window.onShippingZoneSelected = function(zone) {
  window.selectedShippingZone = zone;
  // If piece modal is open, refresh its shipping block
  if (typeof PieceModal !== 'undefined' && PieceModal.refreshShipping) {
    PieceModal.refreshShipping(zone);
  }
};

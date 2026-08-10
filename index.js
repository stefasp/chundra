// index.js — Chundra
// 1. Filter bar logic
// 2. Auto-populate card details from PRODUCTS data
// 3. Update piece modal shipping when zone is known

document.addEventListener('DOMContentLoaded', function () {

  // ── 1. Filter bar ─────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.card[data-category]');

  const CAT_DESCRIPTIONS = {
    guardians: {
      title: "Some objects decorate a space. Others quietly shape the way we move through it.",
      body: "Each Guardian embodies a human quality — courage, patience, kindness, resilience, curiosity. Chosen with intention, it becomes a gentle daily reminder of the person you want to become. Over time, these small reminders help shape the mindset you bring into your life, one day at a time."
    },
    ritual: {
      title: "A ritual object is completed by the person who lives with it.",
      body: "Every piece includes a simple reflective exercise, but its meaning is never predetermined. It emerges through your own thoughts, memories, and intentions. These objects invite you to pause, pay attention, and return to the questions that matter most. Over time, they become personal landmarks in your own story."
    },
  };

  const catDescEl   = document.getElementById('cat-description');
  const catDescText = document.getElementById('cat-desc-text');

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
      // Show category description if available
      if (CAT_DESCRIPTIONS[filter] && catDescEl && catDescText) {
        const desc = CAT_DESCRIPTIONS[filter];
        catDescText.innerHTML = `<p class="cat-desc-title">${desc.title}</p><p class="cat-desc-body">${desc.body}</p>`;
        catDescEl.style.display = 'block';
      } else if (catDescEl) {
        catDescEl.style.display = 'none';
      }
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
    const weightStr = p.weight ? `${p.weight} kg` : null;

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
        ${p.weight ? `<p>Weight: ${p.weight} kg</p>` : ''}
        ${framingStr ? `<p>${framingStr}</p>` : ''}
      </div>
    `;

    // Sold state
    if (p.status === 'sold') {
      card.classList.add('sold');
    } else {
      // Category badges (not shown on sold items)
      const CAT_LABELS = {
        ritual: 'Ritual', guardians: 'Guardian', wallart: 'Wall Art',
        jewellery: 'Jewellery', functional: 'Functional',
      };
      const badgesEl = document.createElement('div');
      badgesEl.className = 'card-badges';
      (p.category || []).forEach(cat => {
        if (!CAT_LABELS[cat]) return;
        const badge = document.createElement('span');
        badge.className = `cat-badge ${cat}`;
        badge.textContent = CAT_LABELS[cat];
        badgesEl.appendChild(badge);
      });
      if (badgesEl.children.length > 0) {
        card.appendChild(badgesEl);
      }
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

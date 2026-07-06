// piece-modal.js — Chundra
// Modal with photo slider + details + shipping preview per zone.

(function () {

  const modalHTML = `
  <div id="piece-modal" role="dialog" aria-modal="true" aria-labelledby="pm-title">
    <div id="pm-overlay"></div>
    <div id="pm-content">
      <button id="pm-close" aria-label="Close">×</button>
      <div id="pm-inner">

        <!-- LEFT: photo slider -->
        <div id="pm-gallery">
          <div id="pm-slider-wrap">
            <button id="pm-prev" aria-label="Previous">&#8249;</button>
            <div id="pm-main-img-wrap">
              <img id="pm-main-img" src="" alt="">
            </div>
            <button id="pm-next" aria-label="Next">&#8250;</button>
          </div>
          <div id="pm-thumbs"></div>
        </div>

        <!-- RIGHT: details -->
        <div id="pm-details">
          <p id="pm-category-label"></p>
          <h2 id="pm-title"></h2>
          <p id="pm-subtitle"></p>
          <div id="pm-price-block"></div>
          <div id="pm-description"></div>

          <div id="pm-specs">
            <div class="pm-spec" id="pm-spec-materials"></div>
            <div class="pm-spec" id="pm-spec-dims"></div>
            <div class="pm-spec" id="pm-spec-weight"></div>
            <div class="pm-spec" id="pm-spec-framed"></div>
            <div class="pm-spec pm-spec-note" id="pm-spec-dims-note"></div>
          </div>

          <!-- Shipping preview -->
          <div id="pm-shipping-block">
            <p class="pm-shipping-title">📦 Estimated shipping <span class="pm-shipping-subtitle">(confirmed at checkout)</span></p>
            <div id="pm-shipping-custom" style="display:none;"></div>
            <table id="pm-shipping-table" style="display:none;">
              <tbody>
                <tr><td>🇪🇸 Spain</td><td id="pm-ship-spain">—</td></tr>
                <tr><td>🇪🇺 Europe</td><td id="pm-ship-europe">—</td></tr>
                <tr><td>🌍 Rest of world</td><td id="pm-ship-world">—</td></tr>
              </tbody>
            </table>
            <p class="pm-shipping-multi">Buying multiple pieces? Shipping is recalculated at checkout — you often save when combining.</p>
          </div>

          <div id="pm-actions">
            <button id="pm-cart-btn" class="button main"></button>
            <p id="pm-sold-msg" style="display:none;">This piece has been sold.</p>
          </div>
        </div>

      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  let currentProduct = null;
  let currentSlide   = 0;
  let images         = [];

  const modal   = document.getElementById('piece-modal');
  const overlay = document.getElementById('pm-overlay');
  const mainImg = document.getElementById('pm-main-img');
  const thumbs  = document.getElementById('pm-thumbs');
  const prevBtn = document.getElementById('pm-prev');
  const nextBtn = document.getElementById('pm-next');
  const cartBtn = document.getElementById('pm-cart-btn');
  const soldMsg = document.getElementById('pm-sold-msg');

  // ── Open ────────────────────────────────────────────────────
  function openModal(productId) {
    const p = PRODUCTS[productId];
    if (!p) return;
    currentProduct = p;
    images = p.images || [];
    currentSlide = 0;
    populate(p);
    renderSlide(0);
    renderThumbs();
    updateCartBtn();
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  // ── Populate ────────────────────────────────────────────────
  function populate(p) {
    // Category labels (English)
    const CAT_LABELS = {
      guardians: 'Guardians', guardianas: 'Guardians',
      viajeros: 'Travelers', lamparas: 'Lamps',
      macetas: 'Pots & Jars', wallart: 'Wall Art',
      cuadros: 'Paintings', dibujo: 'Drawings',
      ritual: 'Ritual Pieces',
    };
    const cats = (p.category || [])
      .map(c => CAT_LABELS[c] || c.charAt(0).toUpperCase() + c.slice(1))
      .join(' · ');
    document.getElementById('pm-category-label').textContent = cats;

    // Title & subtitle
    document.getElementById('pm-title').textContent = p.name;
    const subEl = document.getElementById('pm-subtitle');
    subEl.textContent = p.subtitle || '';
    subEl.style.display = p.subtitle ? 'block' : 'none';

    // Price
    const pb = document.getElementById('pm-price-block');
    if (p.priceSale) {
      const pct = Math.round((1 - p.priceSale / p.price) * 100);
      pb.innerHTML = `<span class="price-original">€${p.price}</span> <strong class="price-sale">€${p.priceSale}</strong> <span class="price-badge">–${pct}%</span>`;
    } else {
      pb.innerHTML = `<strong class="pm-price">€${p.price}</strong>`;
    }

    // Description
    const descEl = document.getElementById('pm-description');
    if (p.description && p.description.trim()) {
      const html = p.description.trim()
        .split(/\n\n+/)
        .map(para => `<p>${para
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
        }</p>`)
        .join('');
      descEl.innerHTML = html;
      descEl.style.display = 'block';
    } else {
      descEl.style.display = 'none';
    }

    // Specs
    setSpec('pm-spec-materials', 'Materials', p.materials);

    if (p.dims) {
      const d = p.dims;
      let dimsStr = `${d.w} W × ${d.h} H × ${d.d} D cm`;
      if (p.dimsFramed) {
        const f = p.dimsFramed;
        dimsStr += ` (framed: ${f.w} W × ${f.h} H × ${f.d} D cm)`;
      }
      if (p.dimsCompact) {
        const c = p.dimsCompact;
        dimsStr += ` / central figure: ${c.w} W × ${c.h} H × ${c.d} D cm`;
      }
      setSpec('pm-spec-dims', 'Dimensions', dimsStr);
    } else {
      hide('pm-spec-dims');
    }

    p.weight
      ? setSpec('pm-spec-weight', 'Weight', `${p.weight} kg`)
      : hide('pm-spec-weight');

    typeof p.framed === 'boolean'
      ? setSpec('pm-spec-framed', 'Framing', p.framed ? 'Framed' : 'Unframed')
      : hide('pm-spec-framed');

    p.dimsNote
      ? setSpec('pm-spec-dims-note', '', `⚠ ${p.dimsNote}`)
      : hide('pm-spec-dims-note');

    // Shipping preview
    populateShipping(p);

    // Sold / cart
    const isSold = p.status === 'sold';
    cartBtn.style.display = isSold ? 'none' : 'inline-block';
    soldMsg.style.display = isSold ? 'block' : 'none';

    // Slider arrows
    prevBtn.style.display = images.length > 1 ? 'flex' : 'none';
    nextBtn.style.display = images.length > 1 ? 'flex' : 'none';
  }

  function populateShipping(p) {
    const customEl = document.getElementById('pm-shipping-custom');
    const tableEl  = document.getElementById('pm-shipping-table');
    const zone     = window.selectedShippingZone;

    // shippingNote is only a fallback for non-Inpost zones.
    // We still show the full table — shippingNote shows in world/europe rows only.

    // If user already chose a zone in cart, show that zone with both methods
    if (zone && typeof calculateShippingOptions !== 'undefined') {
      const label = (typeof ZONE_LABELS !== 'undefined' && ZONE_LABELS[zone])
        ? `${ZONE_LABELS[zone].flag} ${ZONE_LABELS[zone].name}`
        : zone;
      const { correos, inpost } = calculateShippingOptions([p], zone);

      let html = `<p class="pm-shipping-zone-label">Shipping to ${label}</p>`;

      if (inpost && inpost.cost !== null) {
        const correosCost = correos.cost !== null ? `€${correos.cost}` : 'Quote';
        html += `
          <table id="pm-shipping-table-inner">
            <tr><td>🏠 To your address</td><td>${correosCost}</td></tr>
            <tr><td>📦 Inpost pickup</td><td>€${inpost.cost}</td></tr>
          </table>`;
      } else {
        const correosCost = correos.cost !== null ? `€${correos.cost}` : 'Quote on request';
        html += `<p class="pm-shipping-single">🏠 ${correosCost}</p>`;
      }

      customEl.innerHTML    = html;
      customEl.style.display = 'block';
      tableEl.style.display  = 'none';
      return;
    }

    // Default: show key zones with Correos + Inpost where available
    const PREVIEW_ZONES = [
      { key: 'spain',   flag: '🇪🇸', label: 'Spain' },
      { key: 'portugal',flag: '🇵🇹', label: 'Portugal' },
      { key: 'france',  flag: '🇫🇷', label: 'France' },
      { key: 'germany', flag: '🇩🇪', label: 'Germany' },
      { key: 'europe',  flag: '🌍', label: 'Rest of Europe' },
      { key: 'world',   flag: '🌏', label: 'Rest of world' },
    ];

    const rows = PREVIEW_ZONES.map(z => {
      const { correos, inpost } = typeof calculateShippingOptions !== 'undefined'
        ? calculateShippingOptions([p], z.key)
        : { correos: calculateShipping([p], z.key), inpost: null };

      // For pieces with shippingNote, Correos shows quote for non-Inpost zones
      let correosStr;
      if (p.shippingNote && correos.cost === null) {
        correosStr = 'Quote';
      } else {
        correosStr = correos.cost !== null ? `€${correos.cost}` : 'Quote';
      }
      const inpostStr = (inpost && inpost.cost !== null) ? `€${inpost.cost}` : '—';

      return `<tr>
        <td>${z.flag} ${z.label}</td>
        <td>${correosStr}</td>
        <td>${inpostStr}</td>
      </tr>`;
    }).join('');

    const html = `
      <table id="pm-shipping-table-full">
        <thead>
          <tr>
            <th></th>
            <th>🏠 Home</th>
            <th>📦 Inpost</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;

    customEl.innerHTML    = html;
    customEl.style.display = 'block';
    tableEl.style.display  = 'none';
  }

  // Public: refresh shipping if zone changes while modal is open
  window.PieceModal = window.PieceModal || {};
  PieceModal.refreshShipping = function(zone) {
    if (currentProduct) populateShipping(currentProduct);
  };

  function setSpec(id, label, value) {
    const el = document.getElementById(id);
    if (value) {
      el.innerHTML = label ? `<strong>${label}:</strong> ${value}` : value;
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  }
  function hide(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  // ── Slider ──────────────────────────────────────────────────
  function renderSlide(idx) {
    currentSlide = ((idx % images.length) + images.length) % images.length;
    mainImg.src = images[currentSlide];
    mainImg.alt = currentProduct?.name || '';
    thumbs.querySelectorAll('.pm-thumb').forEach((t, i) =>
      t.classList.toggle('active', i === currentSlide)
    );
  }

  function renderThumbs() {
    thumbs.innerHTML = '';
    if (images.length <= 1) { thumbs.style.display = 'none'; return; }
    thumbs.style.display = 'flex';
    images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.className = 'pm-thumb' + (i === 0 ? ' active' : '');
      img.alt = `Photo ${i + 1}`;
      img.addEventListener('click', () => renderSlide(i));
      thumbs.appendChild(img);
    });
  }

  prevBtn.addEventListener('click', () => renderSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => renderSlide(currentSlide + 1));

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'ArrowLeft')  renderSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') renderSlide(currentSlide + 1);
    if (e.key === 'Escape')     closeModal();
  });

  // Touch swipe
  let touchX = 0;
  mainImg.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  mainImg.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) renderSlide(currentSlide + (dx < 0 ? 1 : -1));
  });

  // ── Cart ────────────────────────────────────────────────────
  function updateCartBtn() {
    if (!currentProduct) return;
    const inCart = Cart.hasItem(currentProduct.id);
    cartBtn.textContent = inCart ? '✓ Added to cart' : 'Add to cart';
    cartBtn.classList.toggle('in-cart', inCart);
  }

  cartBtn.addEventListener('click', () => {
    if (!currentProduct || currentProduct.status === 'sold') return;
    Cart.hasItem(currentProduct.id)
      ? Cart.removeItem(currentProduct.id)
      : Cart.addItem(currentProduct.id);
    updateCartBtn();
  });

  window.addEventListener('cartUpdated', updateCartBtn);

  // ── Close ───────────────────────────────────────────────────
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    currentProduct = null;
  }

  document.getElementById('pm-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // ── Card click delegation ───────────────────────────────────
  document.addEventListener('click', e => {
    const card = e.target.closest('[data-product-id]');
    if (!card) return;
    const id = card.dataset.productId;
    if (!id || !PRODUCTS[id]) return;
    e.preventDefault();
    openModal(id);
  });

  window.PieceModal = { open: openModal, close: closeModal };
})();

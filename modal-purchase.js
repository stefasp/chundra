// Purchase Modal — Chundra
// Uses event delegation to handle dynamically injected content (footer, gallery)

(function() {

  // Only run on pages that have a purchase button
  if (!document.querySelector('.open-purchase-modal')) return;

  const modalHTML = `
    <div id="purchase-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div id="purchase-modal-overlay"></div>
      <div id="purchase-modal-content">
        <button id="purchase-modal-close" aria-label="Close">&times;</button>

        <div id="purchase-modal-header">
          <p id="modal-label">You're enquiring about</p>
          <h2 id="modal-piece-name"></h2>
          <p id="modal-piece-price"></p>
        </div>

        <div id="purchase-modal-shipping">
          <p>📦 <strong>Estimated shipping costs</strong></p>
          <ul>
            <li id="ship-spain">Spain — </li>
            <li id="ship-europe">Rest of Europe — </li>
            <li id="ship-world">Rest of the world — </li>
          </ul>
          
          <p class="shipping-note">Payment only via PayPal. The payment link will be sent via email.</p>
          <p class="shipping-note">Ready to ship in 1–2 days. For sculptures sent within EU delivery can take up to 48 hours once dispatched, more for other destinations.</p>
        </div>

        <form id="purchase-form" action="https://formspree.io/f/xkoqjobo" method="POST" novalidate>
          <input type="hidden" name="piece" id="form-piece-name">

          <input type="text"  name="name"         required placeholder="Full name">
          <input type="email" name="paypal_email"  required placeholder="PayPal email">
          <input type="email" name="contact_email"          placeholder="Contact email (if different from PayPal)">
          <input type="text"  name="country"       required placeholder="Country">
          <input type="text"  name="city"          required placeholder="City">
          <input type="text"  name="address"       required placeholder="Full address (Street, House, Apartment)">
          <input type="tel"   name="phone"         required placeholder="Phone">

          <p class="message-hint">Need a custom quote or want to combine multiple pieces in one shipment? Just mention it in your message.</p>
          <textarea name="message" rows="3" placeholder="Notes or message (optional)"></textarea>

          <label id="policy-check">
            <input type="checkbox" name="policy" id="policy-checkbox">
            By submitting this form, you agree to the <a href="privacy.html" target="_blank">privacy</a> and <a href="policy.html" target="_blank">return</a> policy
          </label>
          <p id="policy-error" style="display:none;">Please accept the privacy and return policy to continue.</p>

          <button type="submit" id="form-submit">Send enquiry</button>
          <p id="form-success" style="display:none;">✓ Message sent! I'll be in touch soon.</p>
          <p id="form-error"   style="display:none;">Something went wrong. Please try again or contact me directly.</p>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal      = document.getElementById('purchase-modal');
  const overlay    = document.getElementById('purchase-modal-overlay');
  const formPiece  = document.getElementById('form-piece-name');
  const form       = document.getElementById('purchase-form');
  const successMsg = document.getElementById('form-success');
  const errorMsg   = document.getElementById('form-error');
  const submitBtn  = document.getElementById('form-submit');

  function openModal(btn) {
    document.getElementById('modal-piece-name').textContent  = btn.dataset.piece || '';
    document.getElementById('modal-piece-price').textContent = btn.dataset.price || '';
    formPiece.value = btn.dataset.piece || '';

    document.getElementById('ship-spain').textContent   = 'Spain — '             + (btn.dataset.shipSpain  || 'on request');
    document.getElementById('ship-europe').textContent  = 'Rest of Europe — '    + (btn.dataset.shipEurope || 'on request');
    document.getElementById('ship-world').textContent   = 'Rest of the world — ' + (btn.dataset.shipWorld  || '60–130 € (will be confirmed via email)');

    successMsg.style.display = 'none';
    errorMsg.style.display   = 'none';
    document.getElementById('policy-error').style.display = 'none';
    document.getElementById('policy-checkbox').checked = false;
    form.style.display    = 'block';
    submitBtn.textContent = 'Send enquiry';
    submitBtn.disabled    = false;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function(e) {
    const modalBtn = e.target.closest('.open-purchase-modal');
    if (modalBtn) { e.preventDefault(); openModal(modalBtn); return; }
    if (e.target === overlay || e.target.closest('#purchase-modal-close')) { closeModal(); return; }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate policy checkbox manually
    const policyCheck   = document.getElementById('policy-checkbox');
    const policyError   = document.getElementById('policy-error');

    if (!policyCheck.checked) {
      policyError.style.display = 'block';
      policyCheck.focus();
      return;
    }
    policyError.style.display = 'none';

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled    = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        form.style.display       = 'none';
        successMsg.style.display = 'block';
      } else {
        errorMsg.style.display = 'block';
        submitBtn.textContent  = 'Send enquiry';
        submitBtn.disabled     = false;
      }
    } catch {
      errorMsg.style.display = 'block';
      submitBtn.textContent  = 'Send enquiry';
      submitBtn.disabled     = false;
    }
  });

})();
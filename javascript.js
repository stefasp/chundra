// Copy buttons
document.addEventListener('click', function(e) {
  if (e.target.closest('#copyButton') || e.target.id === 'copyButton') {
    e.preventDefault();
    const t = document.getElementById('textToCopy');
    if (t) navigator.clipboard.writeText(t.value).then(() => {
      const el = e.target.closest('#copyButton') || e.target;
      const orig = el.textContent;
      el.textContent = 'Copied!';
      setTimeout(() => { el.textContent = orig; }, 1500);
    });
    return;
  }
  if (e.target.closest('#copyButton2') || e.target.id === 'copyButton2') {
    e.preventDefault();
    const t = document.getElementById('textToCopy2');
    if (t) {
      const el = e.target.closest('#copyButton2') || e.target;
      const orig = el.textContent;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(t.value).then(() => {
          el.textContent = 'Copied!';
          setTimeout(() => { el.textContent = orig; }, 1500);
        });
      } else {
        t.style.display = 'block';
        t.select();
        document.execCommand('copy');
        t.style.display = 'none';
        el.textContent = 'Copied!';
        setTimeout(() => { el.textContent = orig; }, 1500);
      }
    }
    return;
  }
});

// Cookie consent
function loadGA() {
  window['ga-disable-G-Q8DDRJ6Y35'] = false;
}

function disableGA() {
  window['ga-disable-G-Q8DDRJ6Y35'] = true;
}

document.addEventListener('DOMContentLoaded', function() {
  const cookieBanner = document.getElementById('cookie-banner');
  const consent = localStorage.getItem('cookie-consent');

  if (!consent) {
    cookieBanner.style.display = 'flex';
    disableGA();
  } else if (consent === 'accepted') {
    loadGA();
  } else {
    disableGA();
  }

  document.getElementById('cookie-accept').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    cookieBanner.style.display = 'none';
    loadGA();
  });

  document.getElementById('cookie-decline').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'declined');
    cookieBanner.style.display = 'none';
    disableGA();
  });
});
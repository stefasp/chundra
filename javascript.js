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
      // Try modern API first, fall back to execCommand
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
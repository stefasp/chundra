(() => {
  const existingHeader = document.querySelector('body > header');
  if (existingHeader?.querySelector('.logo-container')) {
    existingHeader.remove();
  }

  const header = document.createElement('header');
  header.className = 'site-nav-header';
  header.innerHTML = `
    <div class="site-nav-container">
      <div class="logo-container">
        <a href="/index.html" aria-label="Stefania Spangenberg — Work">
          <img src="/images/logo.png" alt="Stefania Spangenberg Art gallery">
        </a>
      </div>
      <nav aria-label="Main navigation">
        <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false">☰</button>
        <ul class="menu">
          <li><a href="/index.html">Work</a></li>
          <li><a href="/shop.html">Shop</a></li>
          <li><a href="/about.html">About</a></li>
          <li><button class="copy-email" type="button" data-email="stefus.sp@gmail.com">Contact</button></li>
          <li><a href="https://www.instagram.com/chundra.art/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
        </ul>
      </nav>
    </div>`;

  document.body.prepend(header);

  const menu = header.querySelector('.menu');
  const toggle = header.querySelector('.menu-toggle');
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  header.querySelector('.copy-email').addEventListener('click', async (event) => {
    const button = event.currentTarget;
    const originalText = button.textContent;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(button.dataset.email);
      } else {
        const input = document.createElement('textarea');
        input.value = button.dataset.email;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.append(input);
        input.select();
        const copied = document.execCommand('copy');
        input.remove();
        if (!copied) throw new Error('Clipboard copy was not available.');
      }
      button.textContent = 'Email copied';
    } catch (error) {
      console.error('Could not copy the contact email to the clipboard.', error);
      button.textContent = 'Copy failed';
    }

    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1800);
  });
})();

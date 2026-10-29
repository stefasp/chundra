(() => {
  const grid = document.getElementById('featured-works');
  if (!grid) return;

  const featured = Object.values(PRODUCTS).filter(product => product.featured);
  const firstIds = ['catch-my-breath', 'wounded'];
  const firstWorks = firstIds
    .map(id => featured.find(product => product.id === id))
    .filter(Boolean);
  const remainingWorks = featured.filter(product => !firstIds.includes(product.id));
  const horizons = remainingWorks.find(product => product.id === 'horizons');

  if (horizons) {
    remainingWorks.splice(remainingWorks.indexOf(horizons), 1);
    const pivotIndex = remainingWorks.findIndex(product => product.id === 'pivot');
    remainingWorks.splice(pivotIndex === -1 ? remainingWorks.length : pivotIndex + 1, 0, horizons);
  }

  const ariadnaIndex = remainingWorks.findIndex(product => product.id === 'ariadna');
  if (ariadnaIndex !== -1) {
    const [ariadna] = remainingWorks.splice(ariadnaIndex, 1);
    remainingWorks.splice(Math.floor(remainingWorks.length / 2), 0, ariadna);
  }

  [...firstWorks, ...remainingWorks].forEach(product => {
      const image = product.featuredImage || product.images?.[0];
      if (!image) {
        console.error(`Featured product "${product.id}" has no image.`);
        return;
      }

      const card = document.createElement('button');
      card.className = 'work-card';
      card.type = 'button';
      card.dataset.productId = product.id;
      if (product.featuredImage) card.dataset.featuredImage = product.featuredImage;
      card.setAttribute('aria-label', `View ${product.name}`);

      const artwork = document.createElement('img');
      artwork.src = image;
      artwork.alt = product.name;
      artwork.loading = 'lazy';
      card.appendChild(artwork);

      const caption = document.createElement('span');
      caption.className = 'work-caption';

      const name = document.createElement('span');
      name.className = 'work-name';
      name.textContent = product.name;
      caption.appendChild(name);

      const details = [];
      if (product.dims) {
        const { w, h, d } = product.dims;
        details.push(d > 0 ? `${w} × ${h} × ${d} cm` : `${w} × ${h} cm`);
      }
      if (product.year) details.push(String(product.year));

      if (details.length) {
        const metadata = document.createElement('span');
        metadata.className = 'work-metadata';
        metadata.textContent = details.join(' · ');
        caption.appendChild(metadata);
      }

      card.appendChild(caption);
      grid.appendChild(card);
    });
})();

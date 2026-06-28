// index.js — Chundra
// Filter bar logic for the gallery.
// Cards use data-category attribute (can have multiple space-separated values).

document.addEventListener('DOMContentLoaded', function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.card[data-category]');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide cards
      cards.forEach(card => {
        if (filter === 'all') {
          card.style.display = '';
          return;
        }
        // data-category can be "guardianas ritual" (space-separated)
        const categories = (card.dataset.category || '').split(' ');
        card.style.display = categories.includes(filter) ? '' : 'none';
      });
    });
  });
});

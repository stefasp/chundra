// index-filter.js — filter logic for index-old.html (no dependency on products.js)
document.addEventListener('DOMContentLoaded', function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.card[data-category]');
  if (!filterBtns.length || !cards.length) return;
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
});

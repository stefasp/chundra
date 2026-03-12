// Gallery filter — index only
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.filter-btn');
  const products = document.querySelectorAll('.gallery a.card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      products.forEach(product => {
        const categories = product.dataset.category
          ? product.dataset.category.split(' ')
          : [];
        if (filter === 'all' || categories.includes(filter)) {
          product.classList.remove('hide');
        } else {
          product.classList.add('hide');
        }
      });
    });
  });
});
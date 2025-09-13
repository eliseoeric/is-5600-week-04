let currentPage = 1;
const limit = 2;

async function loadProducts(page = 1) {
  try {
    const res = await fetch(`/products?limit=${limit}&offset=${(page - 1) * limit}`);
    const products = await res.json();

    const container = document.getElementById('products');
    container.innerHTML = '';

    if (!products.length) {
      container.innerHTML = '<p>No products found.</p>';
      return;
    }

    products.forEach(p => {
      const div = document.createElement('div');
      div.className = 'card mb-3 p-3';
      div.innerHTML = `
        <h3>${p.name}</h3>
        <p><strong>Price:</strong> $${p.price.toFixed(2)}</p>
        <p><strong>Tags:</strong> ${p.tags.join(', ')}</p>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Error loading products:', err);
  }
}

document.getElementById('prev').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    loadProducts(currentPage);
  }
});

document.getElementById('next').addEventListener('click', () => {
  currentPage++;
  loadProducts(currentPage);
});

loadProducts(currentPage);

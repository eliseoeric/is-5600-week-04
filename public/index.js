let page = 1;
const limit = 3;

async function loadProducts() {
  const res = await fetch(`/products?limit=${limit}&offset=${(page - 1) * limit}`);
  const items = await res.json();

  const container = document.getElementById("products");
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = `<div class="alert alert-warning">No products found</div>`;
    return;
  }

  items.forEach(p => {
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h5 class="card-title text-primary">${p.name}</h5>
          <p class="card-text"><b>💲 ${p.price.toFixed(2)}</b></p>
          <p><span class="badge bg-info text-dark">${p.tags.join(", ")}</span></p>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

document.getElementById("prev").addEventListener("click", () => {
  if (page > 1) { page--; loadProducts(); }
});
document.getElementById("next").addEventListener("click", () => {
  page++; loadProducts();
});

loadProducts();

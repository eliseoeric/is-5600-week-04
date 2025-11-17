const productsDiv = document.getElementById("products");
const categoryInput = document.getElementById("filter-category");
const minInput = document.getElementById("filter-min");
const maxInput = document.getElementById("filter-max");
const filterBtn = document.getElementById("filter-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let offset = 0;
let limit = 10;

function loadProducts() {
  const category = categoryInput.value;
  const minPrice = minInput.value;
  const maxPrice = maxInput.value;

  const params = new URLSearchParams({
    offset,
    limit,
    category,
    minPrice,
    maxPrice
  });

  fetch("/products?" + params.toString())
    .then(res => res.json())
    .then(showProducts);
}

function showProducts(result) {
  productsDiv.innerHTML = "";

  result.data.forEach(p => {
    const div = document.createElement("div");
    div.style.border = "1px solid black";
    div.style.margin = "20px";
    div.style.padding = "20px";

    div.innerHTML = `
      <p><b>Name:</b> ${p.name}</p>
      <p><b>Price:</b> $${p.price}</p>
      <p><b>Category:</b> ${p.category}</p>
    `;

    productsDiv.appendChild(div);
  });
}

filterBtn.addEventListener("click", () => {
  offset = 0;
  loadProducts();
});

prevBtn.addEventListener("click", () => {
  if (offset >= limit) offset -= limit;
  loadProducts();
});

nextBtn.addEventListener("click", () => {
  offset += limit;
  loadProducts();
});

loadProducts();

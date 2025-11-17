const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON

// --- In-memory product store ---
let products = [
  { id: 1, name: "Laptop", price: 899, category: "electronics" },
  { id: 2, name: "Phone", price: 499, category: "electronics" },
  { id: 3, name: "Shoes", price: 59, category: "apparel" }
];

// ---------- GET /products (List + Filter + Pagination) ----------
app.get('/products', (req, res) => {
  let { category, minPrice, maxPrice, page = 1, limit = 5 } = req.query;

  let result = [...products];

  // Filtering
  if (category) {
    result = result.filter(p => p.category === category);
  }
  if (minPrice) {
    result = result.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    result = result.filter(p => p.price <= Number(maxPrice));
  }

  // Pagination
  page = Number(page);
  limit = Number(limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedResult = result.slice(start, end);

  res.json({
    total: result.length,
    page,
    limit,
    products: paginatedResult
  });
});

// ---------- GET /products/:id (View single product) ----------
app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) return res.status(404).json({ error: "Product not found" });

  res.json(product);
});

// ---------- POST /products (Create new product) ----------
app.post('/products', (req, res) => {
  const { name, price, category } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: "name, price, and category are required" });
  }

  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    name,
    price,
    category
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// ---------- PUT /products/:id (Update product) ----------
app.put('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) return res.status(404).json({ error: "Product not found" });

  const { name, price, category } = req.body;

  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;
  if (category !== undefined) product.category = category;

  res.json(product);
});

// ---------- DELETE /products/:id (Delete product) ----------
app.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) return res.status(404).json({ error: "Product not found" });

  const deleted = products.splice(index, 1);
  res.json({ message: "Product deleted", product: deleted[0] });
});

// ---------- Start server ----------
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
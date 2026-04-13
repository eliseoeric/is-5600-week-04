const express = require('express');
const app = express();

app.use(express.json()); // middleware to read JSON

// Dummy in-memory data
let products = [
  { id: 1, name: "Shirt", price: 25 },
  { id: 2, name: "Shoes", price: 50 },
  { id: 3, name: "Hat", price: 15 }
];

// -----------------------------
// GET ALL PRODUCTS (with filter + pagination)
// -----------------------------
app.get('/products', (req, res) => {
  let { name, page = 1, limit = 5 } = req.query;

  let result = [...products];

  // Filtering
  if (name) {
    result = result.filter(p =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Pagination
  page = parseInt(page);
  limit = parseInt(limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  res.json({
    total: result.length,
    page,
    data: result.slice(start, end)
  });
});

// -----------------------------
// GET SINGLE PRODUCT
// -----------------------------
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

// -----------------------------
// CREATE PRODUCT
// -----------------------------
app.post('/products', (req, res) => {
  const { name, price } = req.body;

  const newProduct = {
    id: products.length + 1,
    name,
    price
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});

// -----------------------------
// UPDATE PRODUCT
// -----------------------------
app.put('/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { name, price } = req.body;

  if (name) product.name = name;
  if (price) product.price = price;

  res.json(product);
});

// -----------------------------
// DELETE PRODUCT
// -----------------------------
app.delete('/products/:id', (req, res) => {
  products = products.filter(p => p.id != req.params.id);

  res.json({ message: "Product deleted" });
});

// -----------------------------
// START SERVER
// -----------------------------
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
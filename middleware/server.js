const express = require("express");
const app = express();
const PORT = 3000;

// Import middleware
const logger = require("./middleware/logger");
const validateProduct = require("./middleware/validateProduct");

// Import product data
const products = require("./products");

// Middleware
app.use(express.json());
app.use(logger);

// GET all products
app.get("/products", (req, res) => {
  let result = [...products];
  if (req.query.category) result = result.filter(p => p.category === req.query.category);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || result.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  res.json({ page, limit, total: result.length, products: result.slice(start, end) });
});

// GET single product
app.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// CREATE product
app.post("/products", validateProduct, (req, res) => {
  const newProduct = { id: products.length + 1, ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// UPDATE product
app.put("/products/:id", validateProduct, (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// DELETE product
app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });
  const removed = products.splice(index, 1);
  res.json({ message: "Product deleted", removed: removed[0] });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

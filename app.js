const express = require("express");
const app = express();

// Load products
let products = require("./data/products.json");

// Middleware
app.use(express.json());

// ----------------------
// GET all products (filter + pagination)
// ----------------------
app.get("/products", (req, res) => {
  let { page = 1, limit = 10, name } = req.query;

  // Convert to numbers
  page = parseInt(page);
  limit = parseInt(limit);

  let result = [...products];

  // Filter by name
  if (name) {
    result = result.filter(p =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Pagination
  const start = (page - 1) * limit;
  const end = start + limit;

  res.json({
    total: result.length,
    page,
    limit,
    data: result.slice(start, end)
  });
});

// ----------------------
// GET single product
// ----------------------
app.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

// ----------------------
// CREATE product
// ----------------------
app.post("/products", (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }

  const newProduct = {
    id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
    name,
    price
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});

// ----------------------
// UPDATE product
// ----------------------
app.put("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products[index] = {
    ...products[index],
    ...req.body
  };

  res.json(products[index]);
});

// ----------------------
// DELETE product
// ----------------------
app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deleted = products.splice(index, 1);

  res.json({
    message: "Product deleted",
    deleted: deleted[0]
  });
});

// ----------------------
// Start server
// ----------------------
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
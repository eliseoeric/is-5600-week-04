const express = require("express");
const router = express.Router();

let products = require("./products");

// GET all products (with filtering + pagination)
router.get("/products", (req, res) => {
  let { page = 1, limit = 10, name } = req.query;

  let result = [...products];

  // Filter by name
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

  res.json(result.slice(start, end));
});

// GET single product
router.get("/products/:id", (req, res) => {
  const product = products.find(p => p.id == req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

// CREATE product
router.post("/products", (req, res) => {
  const newProduct = {
    id: products.length + 1,
    ...req.body
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// UPDATE product
router.put("/products/:id", (req, res) => {
  const index = products.findIndex(p => p.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products[index] = {
    ...products[index],
    ...req.body
  };

  res.json(products[index]);
});

// DELETE product
router.delete("/products/:id", (req, res) => {
  const index = products.findIndex(p => p.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products.splice(index, 1);

  res.json({ message: "Product deleted" });
});

module.exports = router;
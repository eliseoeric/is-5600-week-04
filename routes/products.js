const express = require('express');
const fs = require('fs');
const path = require('path');
const validateProduct = require('../middleware/validateProduct');

const router = express.Router();
const dataPath = path.join(__dirname, '../data/products.json');

// Read products
function readProducts() {
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

// Write products
function writeProducts(products) {
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
}

// GET all products
router.get('/', (req, res) => {
  let products = readProducts();
  const { name, page = 1, limit = 10 } = req.query;

  if (name) {
    products = products.filter(p =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginatedProducts = products.slice(start, end);

  res.json({
    total: products.length,
    page: parseInt(page),
    limit: parseInt(limit),
    data: paginatedProducts,
  });
});

// GET single product
router.get('/:id', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));

  if (!product) return res.status(404).json({ error: 'Product not found' });

  res.json(product);
});

// POST create product
router.post('/', validateProduct, (req, res) => {
  const products = readProducts();
  const newProduct = { id: Date.now(), ...req.body };

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

// PUT update product
router.put('/:id', validateProduct, (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === parseInt(req.params.id));

  if (index === -1)
    return res.status(404).json({ error: 'Product not found' });

  products[index] = { ...products[index], ...req.body };
  writeProducts(products);

  res.json(products[index]);
});

// DELETE product
router.delete('/:id', (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === parseInt(req.params.id));

  if (index === -1)
    return res.status(404).json({ error: 'Product not found' });

  const removed = products.splice(index, 1);
  writeProducts(products);

  res.json({ success: true, removed });
});

// EXPORT ROUTER
module.exports = router;

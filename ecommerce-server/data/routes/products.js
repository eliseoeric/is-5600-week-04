const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const validateProduct = require('../middleware/validateProduct');

const dataFile = path.join(__dirname, '..', 'products.json');

// Helper functions
function readProducts() {
  const raw = fs.readFileSync(dataFile);
  return JSON.parse(raw);
}

function writeProducts(products) {
  fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));
}

// GET /products?category=&minPrice=&maxPrice=&q=&page=&limit=
router.get('/', (req, res) => {
  let products = readProducts();
  const { category, minPrice, maxPrice, q } = req.query;

  if (category) products = products.filter(p => p.category === category);
  if (minPrice) products = products.filter(p => p.price >= Number(minPrice));
  if (maxPrice) products = products.filter(p => p.price <= Number(maxPrice));
  if (q) {
    const ql = q.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(ql) || 
      (p.description && p.description.toLowerCase().includes(ql))
    );
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const start = (page - 1) * limit;
  const paginated = products.slice(start, start + limit);

  res.json({
    page,
    limit,
    total: products.length,
    products: paginated
  });
});

// GET /products/:id
router.get('/:id', (req, res) => {
  const products = readProducts();
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST /products
router.post('/', validateProduct, (req, res) => {
  const products = readProducts();
  const { name, price, category, description } = req.body;
  const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newProduct = { id: newId, name, price, category, description: description || '' };

  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// PUT /products/:id
router.put('/:id', validateProduct, (req, res) => {
  const products = readProducts();
  const id = Number(req.params.id);
  const idx = products.findIndex(p => p.id === id);

  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  const updated = { ...products[idx], ...req.body, id };
  products[idx] = updated;
  writeProducts(products);
  res.json(updated);
});

// DELETE /products/:id
router.delete('/:id', (req, res) => {
  let products = readProducts();
  const id = Number(req.params.id);
  const newProducts = products.filter(p => p.id !== id);

  if (newProducts.length === products.length) return res.status(404).json({ error: 'Product not found' });

  writeProducts(newProducts);
  res.json({ message: 'Deleted' });
});

module.exports = router;

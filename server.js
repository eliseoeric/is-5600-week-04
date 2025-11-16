const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serve static files

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Load products from JSON
let products = [];
const productsPath = path.join(__dirname, 'full-products.json');

try {
  const data = fs.readFileSync(productsPath, 'utf-8');
  products = JSON.parse(data);
  console.log(`Loaded ${products.length} products from full-products.json`);
} catch (err) {
  console.error('Error loading products:', err);
  products = [];
}

// ========== ROUTES ========== //

// GET /products?offset=0&limit=10&tag=texture
app.get('/products', (req, res) => {
  let { offset = 0, limit = 25, tag } = req.query;
  offset = parseInt(offset);
  limit = parseInt(limit);

  let filtered = products;

  if (tag) {
    filtered = filtered.filter(p =>
      p.tag.toLowerCase() === tag.toLowerCase() ||
      (p.tags && p.tags.some(t => t.title.toLowerCase() === tag.toLowerCase()))
    );
  }

  const paginated = filtered.slice(offset, offset + limit);
  res.json(paginated);
});

// GET /products/:id
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST /products
app.post('/products', (req, res) => {
  const { name, price, tag } = req.body;
  if (!name || !price || !tag) return res.status(400).json({ error: 'Missing fields' });

  const id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newProduct = { id, name, price, tag };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /products/:id
app.put('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const { name, price, tag } = req.body;
  if (name) product.name = name;
  if (price) product.price = price;
  if (tag) product.tag = tag;

  res.json(product);
});

// DELETE /products/:id
app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  const deleted = products.splice(index, 1);
  res.json(deleted[0]);
});

// Start server
app.listen(port, () => {
  console.log(`eCommerce server running at http://localhost:${port}`);
});

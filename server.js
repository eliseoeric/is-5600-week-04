const express = require('express');
const { products, getNextId } = require('./data');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
const { logger } = require('./middleware');
app.use(logger);

// Simple logger middleware (optional, but safe)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ------------------- ROUTES -------------------

// GET /api/products – list all products (with filtering & pagination)
app.get('/api/products', (req, res) => {
  let results = [...products];

  if (req.query.category) {
    results = results.filter(p => p.category === req.query.category);
  }

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
    const start = (page - 1) * limit;
    results = results.slice(start, start + limit);
  }

  res.json(results);
});

// GET /api/products/search?query=... – search by name or category
app.get('/api/products/search', (req, res) => {
  const query = req.query.query;
  if (!query) return res.json(products);
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );
  res.json(filtered);
});

// GET /api/products/:id – single product
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// POST /api/products – create new product (no auth required)
app.post('/api/products', (req, res) => {
  const { name, price, description, category } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ message: 'Name and price are required' });
  }
  const newProduct = {
    id: getNextId(),
    name,
    price: parseFloat(price),
    description: description || '',
    category: category || 'general',
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id – update product (no auth)
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  const { name, price, description, category } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ message: 'Name and price are required' });
  }
  products[index] = {
    id,
    name,
    price: parseFloat(price),
    description: description || '',
    category: category || 'general',
  };
  res.json(products[index]);
});

// DELETE /api/products/:id – delete product (no auth)
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });
  products.splice(index, 1);
  res.status(204).send();
});

// Root route (just for testing)
app.get('/', (req, res) => {
  res.send('Server is running. Use /api/products');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
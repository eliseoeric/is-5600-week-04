const fs = require('fs').promises;
const path = require('path');
const express = require('express');

const port = process.env.PORT || 3000;
const app = express();

// Parse JSON bodies (needed for PUT/POST)
app.use(express.json());

// Serve static files from /public at site root (so /index.js, /nanohtml.js work)
app.use(express.static(path.join(__dirname, 'public')));

// If you also want URLs like /public/index.js, uncomment this:
// app.use('/public', express.static(path.join(__dirname, 'public')));

// Mock update/delete handlers
const products = require('./products');
app.put('/products/:id', products.updateProduct);     // 200
app.delete('/products/:id', products.deleteProduct);  // 202

// API + root page
app.get('/products', listProducts);
app.get('/', handleRoot);

// (Optional) health
// app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(port, () => console.log(`Server listening on port ${port}`));

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
}

async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json');
  try {
    const data = await fs.readFile(productsFile);
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 3000;

// Path to product data
const productsFile = path.join(__dirname, 'data/full-products.json');

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  // Simple CORS middleware
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// List all products
app.get('/products', async (req, res) => {
  try {
    const data = await fs.readFile(productsFile);
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const data = await fs.readFile(productsFile);
    const products = JSON.parse(data);
    const product = products.find(p => p.id === req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new product
app.post('/products', async (req, res) => {
  try {
    const data = await fs.readFile(productsFile);
    const products = JSON.parse(data);
    const newProduct = req.body;
    products.push(newProduct);
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product by ID
app.put('/products/:id', async (req, res) => {
  try {
    const data = await fs.readFile(productsFile);
    const products = JSON.parse(data);
    const index = products.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
      products[index] = req.body;
      await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
      res.json(products[index]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product

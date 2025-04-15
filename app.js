const fs = require('fs').promises;
const path = require('path');
const express = require('express');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const productsFile = path.join(__dirname, 'data/full-products.json');

// Helper functions
async function readProducts() {
  const data = await fs.readFile(productsFile);
  return JSON.parse(data);
}

async function writeProducts(products) {
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
}

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ UPDATED: Get all products with optional filtering (by description) and pagination
app.get('/products', async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  try {
    let products = await readProducts();

    // Filter by 'description' instead of 'name'
    if (search) {
      products = products.filter(p =>
        typeof p.description === 'string' &&
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    res.json(paginatedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product by ID
app.get('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const products = await readProducts();
    const product = products.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new product
app.post('/products', async (req, res) => {
  const newProduct = req.body;
  try {
    const products = await readProducts();
    newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;
    products.push(newProduct);
    await writeProducts(products);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a product by ID
app.put('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const updatedData = req.body;
  try {
    const products = await readProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    products[index] = { ...products[index], ...updatedData };
    await writeProducts(products);
    res.json(products[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a product by ID
app.delete('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    let products = await readProducts();
    const newProducts = products.filter(p => p.id !== id);
    if (products.length === newProducts.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await writeProducts(newProducts);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});


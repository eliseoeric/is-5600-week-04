
const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const { randomUUID } = require('crypto');

// Setup
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', handleRoot);
app.get('/products', listProducts);
app.get('/products/:id', getProduct);
app.post('/products', createProduct);
app.put('/products/:id', updateProduct);
app.delete('/products/:id', deleteProduct);

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// File path
const productsFile = path.join(__dirname, 'data/full-products.json');

/* ---------------- HELPERS ---------------- */

async function readProducts() {
  const data = await fs.readFile(productsFile, 'utf-8');
  return JSON.parse(data);
}

async function writeProducts(data) {
  await fs.writeFile(productsFile, JSON.stringify(data, null, 2));
}

/* ---------------- ROUTES ---------------- */

// Root
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
}

/* ---------------- GET ALL (FILTER + PAGINATION) ---------------- */

async function listProducts(req, res) {
  try {
    let data = await readProducts();

    // FILTER (description + alt_description + user.name)
    if (req.query.tag) {
      const tag = req.query.tag.toLowerCase();

      data = data.filter(p => {
        const text = `
          ${p.description || ''}
          ${p.alt_description || ''}
          ${p.user?.name || ''}
        `.toLowerCase();

        return text.includes(tag);
      });
    }

    // PAGINATION
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || data.length;

    const result = data.slice(offset, offset + limit);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* ---------------- GET ONE ---------------- */

async function getProduct(req, res) {
  try {
    const data = await readProducts();

    const product = data.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* ---------------- CREATE ---------------- */

async function createProduct(req, res) {
  try {
    const data = await readProducts();

    const newProduct = {
      id: randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...req.body
    };

    data.push(newProduct);

    await writeProducts(data);

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* ---------------- UPDATE ---------------- */

async function updateProduct(req, res) {
  try {
    const data = await readProducts();

    const index = data.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    data[index] = {
      ...data[index],
      ...req.body,
      updated_at: new Date().toISOString()
    };

    await writeProducts(data);

    res.json(data[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* ---------------- DELETE ---------------- */

async function deleteProduct(req, res) {
  try {
    const data = await readProducts();

    const filtered = data.filter(p => p.id !== req.params.id);

    if (filtered.length === data.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await writeProducts(filtered);

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
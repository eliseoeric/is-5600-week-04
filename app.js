const fs = require('fs').promises
const path = require('path')
const express = require('express')

// Set the port
const port = process.env.PORT || 3000
// Boot the const app
app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));
// register the routes
app.get('/products', listProducts)
app.get('/', handleRoot);
// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const express = require('express');
const app = express();

// Middleware - Logger
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// In-memory products data
let products = [
  { id: 1, name: 'Laptop', price: 899 },
  { id: 2, name: 'Television', price: 599 },
  { id: 3, name: 'Tablet', price: 499 }
];

// Get all products with optional filtering and pagination
app.get('/products', (req, res) => {
  const { name, page = 1, limit = 10 } = req.query;
  let result = products;

  if (name) {
    result = result.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  res.json(result.slice(startIndex, endIndex));
});

// Get a single product by ID
app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) return res.status(404).send('Product not found');
  res.json(product);
});

// Create a new product
app.post('/products', (req, res) => {
  const { name, price } = req.body;

  if (!name || price === undefined) {
    return res.status(400).send('Name and price are required');
  }

  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    name,
    price
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update an existing product
app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) return res.status(404).send('Product not found');

  const { name, price } = req.body;
  product.name = name || product.name;
  product.price = price !== undefined ? price : product.price;

  res.json(product);
});

// Delete a product
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) return res.status(404).send('Product not found');

  products.splice(index, 1);
  res.status(204).send();
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

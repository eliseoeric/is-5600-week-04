const fs = require('fs').promises;
const path = require('path');
const express = require('express');

// Set the port
const port = process.env.PORT || 3000;
// Boot the app
const app = express();

// NEW: parse JSON bodies (needed for PUT)
app.use(express.json());

// Register the public directory
app.use(express.static(path.join(__dirname, 'public')));

// NEW: wire up mock update/delete handlers
// If you place the file under lib/, change to: require('./lib/products')
const products = require('./products');
app.put('/products/:id', products.updateProduct);
app.delete('/products/:id', products.deleteProduct);

// register the routes
app.get('/products', listProducts);
app.get('/', handleRoot);

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`));

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res}
 */
async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json');
  try {
    const data = await fs.readFile(productsFile);
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
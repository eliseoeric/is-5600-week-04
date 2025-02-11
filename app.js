const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');
const middleware = require('./middleware');

// Set the port
const port = process.env.PORT || 3000;
// Boot the app
const app = express();

// Register the public directory
app.use(express.static(__dirname + '/public'));

// Middleware
app.use(middleware.cors);
app.use(bodyParser.json());

// Register routes
app.get('/', handleRoot);
app.get('/products', listProducts);
app.get('/products/:id', api.getProduct);
app.post('/products', api.createProduct);
app.put('/products/:id', api.updateProduct);
app.delete('/products/:id', api.deleteProduct);

// Error Handling
app.use(middleware.notFound);
app.use(middleware.handleError);

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`));

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products with pagination & filtering
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json');
  const { offset = 0, limit = 25, tag } = req.query;

  try {
    const data = await fs.readFile(productsFile, 'utf-8');
    let products = JSON.parse(data);

    // Apply tag filtering
    if (tag) {
      products = products.filter(product => product.tags.includes(tag));
    }

    // Apply pagination
    const paginatedProducts = products.slice(Number(offset), Number(offset) + Number(limit));

    res.json({
      products: paginatedProducts,
      total: products.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
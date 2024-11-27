const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');
const middleware = require('./middleware');
const path = require('path');

const app = express();
const port = 3000;
// app.js

// ...

app.get('/orders', api.listOrders)
app.get('/orders/', api.createOrder)
// Middleware
app.use(middleware.cors);        // Enable CORS for all routes
app.use(bodyParser.json());      // Parse incoming JSON bodies
// api.js

/**
 * Create an order
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function createOrder (req, res, next) {
  const order = await Orders.create(req.body)
  res.json(orders)
}

/**
 * List orders
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function listOrders (req, res, next) {
  const { offset = 0, limit = 25, productId, status } = req.query

  const orders = await Orders.list({ 
    offset: Number(offset), 
    limit: Number(limit),
    productId, 
    status 
  })

  res.json(orders)
}
// Routes
app.get('/', api.handleRoot);    // Route for serving the root HTML page
app.get('/products', api.listProducts);  // Route to get all products
app.get('/products/:id', api.getProduct); // Route to get a single product by ID
app.post('/products', api.createProduct); // Route to create a new product
app.put('/products/:id', api.updateProduct); // Route to update a product
app.delete('/products/:id', api.deleteProduct); // Route to delete a product

// Error handling middleware
app.use(middleware.handleError); // Handles server errors
app.use(middleware.notFound);     // Handles 404 errors if no route matches

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// app.js

// Register routes for orders
app.put('/orders/:id', api.editOrder); // Update an order
app.delete('/orders/:id', api.deleteOrder); // Delete an order

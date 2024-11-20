const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');
const middleware = require('./middleware');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(middleware.cors);        // Enable CORS for all routes
app.use(bodyParser.json());      // Parse incoming JSON bodies

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

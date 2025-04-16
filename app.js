const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const api = require('./api');
const middleware = require('./middleware');
const bodyParser = require('body-parser');

// Set the port
const port = process.env.PORT || 3000;

// Boot the app
const app = express();

// Middleware setup
app.use(middleware.cors);            // Apply CORS middleware
app.use(bodyParser.json());          // Apply bodyParser middleware

// Register the public directory for static files
app.use(express.static(path.join(__dirname, 'public')));

// Register the routes
app.get('/', api.handleRoot);        // Handle root route
app.get('/products', api.listProducts);   // List all products route
app.get('/products/:id', api.getProduct); // Get a product by ID route
app.post('/products', api.createProduct);  // Create a new product route
app.put('/products/:id', api.updateProduct); // Update a product route
app.delete('/products/:id', api.deleteProduct); // Delete a product route

// Error handling middlewares
app.use(middleware.handleError);     // Handle errors
app.use(middleware.notFound);        // 404 Not Found handler

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`));

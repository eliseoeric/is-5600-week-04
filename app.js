const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const api = require('./api');
const middleware = require('./middleware');
const bodyParser = require('body-parser');

const app = express();

// Set the port
const port = process.env.PORT || 3000;

// Register the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(middleware.cors); // Enable CORS
app.use(bodyParser.json()); // Parse incoming JSON requests

// Register routes
app.get('/', api.handleRoot); // Handle root route
app.get('/products', api.listProducts); // List all products
app.get('/products/:id', api.getProduct); // Get a specific product by ID
app.post('/products', api.createProduct); // Create a new product
app.delete('/products/:id', api.deleteProduct); // Delete a product by ID
app.put('/products/:id', api.updateProduct); // Update a product by ID

// Error handling middleware
app.use(middleware.notFound); // Handle 404 errors
app.use(middleware.handleError); // Handle other errors

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}`));

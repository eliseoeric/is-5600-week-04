
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
app.use(middleware.cors);
app.use(bodyParser.json());

// Register routes
app.get('/', api.handleRoot);
app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);
app.post('/products', api.createProduct);
app.delete('/products/:id', api.deleteProduct);
app.put('/products/:id', api.updateProduct);

// Error handling middleware
app.use(middleware.handleError);
app.use(middleware.notFound);

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`));

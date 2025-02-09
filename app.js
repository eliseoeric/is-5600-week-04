const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');
const middleware = require('./middleware');

const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files like index.js, nanohtml.js
app.use(middleware.cors);

// Routes
app.get('/', api.handleRoot);
app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);
app.post('/products', api.createProduct);
app.put('/products/:id', api.updateProduct);
app.delete('/products/:id', api.deleteProduct);

// Error handling middleware
app.use(middleware.notFound);
app.use(middleware.handleError);

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));

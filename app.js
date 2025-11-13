const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
const middleware = require('./middleware');
app.use(middleware.cors);

// Body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Static files
app.use(express.static(__dirname + '/public'));

// API routes (import from data/api.js)
const api = require('./data/api');
app.get('/', api.handleRoot);
app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);
app.post('/products', api.createProduct);
app.put('/products/:id', api.updateProduct);
app.delete('/products/:id', api.deleteProduct);

// Start server
app.listen(port, () => console.log(`Server listening on port ${port}`));

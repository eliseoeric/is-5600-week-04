const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const api = require('./api');
const middleware = require('./middleware');

const port = process.env.PORT || 3000;
const app = express();

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(middleware.cors);
app.use(bodyParser.json());

// Route handlers from ./api
app.get('/', api.handleRoot);
app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);
app.post('/products', api.createProduct);
app.delete('/products/:id', api.deleteProduct);
app.put('/products/:id', api.updateProduct);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

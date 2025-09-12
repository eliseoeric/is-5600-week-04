const express = require('express');
const middleware = require('./middleware');
const api = require('./api');

const app = express();

app.use(middleware.cors);
app.use(express.json());

// Existing routes
app.get('/', api.handleRoot);
app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);
app.post('/products', api.createProduct);

// NEW routes
app.put('/products/:id', api.updateProduct);
app.delete('/products/:id', api.deleteProduct);

// Error handlers
app.use(middleware.notFound);
app.use(middleware.handleError);

app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});

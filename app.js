const express = require('express');
const path = require('path');
const api = require('./api');
const middleware = require('./middleware');

const app = express();
const port = process.env.PORT || 3000;

app.use(middleware.cors);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', api.handleRoot);
app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);
app.post('/products', api.createProduct);
app.put('/products/:id', api.updateProduct);
app.delete('/products/:id', api.deleteProduct);

// Error handlers
app.use(middleware.notFound);
app.use(middleware.handleError);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const api = require('./public/api');
const middleware = require('./public/middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(middleware.cors);
app.use(bodyParser.json());
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const fs = require('fs').promises;
const path = require('path');
const express = require('express');

const api = require('./api');  // Added missing require for api
const middleware = require('./middleware');  // Added middleware require
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(middleware.cors);

// Routes
app.get('/', api.handleRoot);
app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);
app.post('/products', api.createProduct);
app.put('/products/:id', api.updateProduct);
app.delete('/products/:id', api.deleteProduct);

// 404 and error handling middleware
app.use(middleware.notFound);
app.use(middleware.handleError);

app.listen(port, () => console.log(`Server listening on port ${port}`));

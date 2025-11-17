// app.js
const express = require('express');
const path = require('path');

const api = require('./api');
const middleware = require('./middleware');

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(middleware.cors);
app.use(express.json()); // body parser

// static frontend (public/*)
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/', api.handleRoot);
app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);

// create, update, delete
app.post('/products', api.createProduct);
app.put('/products/:id', api.updateProduct);
app.delete('/products/:id', api.deleteProduct);

// not found handler (must be after routes)
app.use(middleware.notFound);

// error handler (must be last)
app.use(middleware.handleError);

// start
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// app.js
const express = require('express');
const api = require('./api');
const middleware = require('./middleware');

const app = express();
const port = process.env.PORT || 3000;

// static frontend from /public
app.use(express.static(__dirname + '/public'));

// parse JSON bodies
app.use(express.json());

// CORS
app.use(middleware.cors);

// routes (api.js only exports functions; do NOT call app.get inside api.js)
app.get('/', api.handleRoot);
app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);
app.post('/products', api.createProduct);
app.put('/products/:id', api.updateProduct);
app.delete('/products/:id', api.deleteProduct);

// 404 + error handlers
app.use(middleware.notFound);
app.use(middleware.handleError);

app.listen(port, () => {
  console.log(`API running on ${port}`);
});

const fs = require('fs').promises;      // professor had these at top; harmless to keep
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const api = require('./api');           // our modular routes
const middleware = require('./middleware');

const port = process.env.PORT || 3000;
const app = express();

// Serve ONLY /public as static (matches professor directions)
app.use(express.static(path.join(__dirname, 'public')));

// Global middleware
app.use(middleware.cors);
app.use(bodyParser.json());

// Routes (professor + additions)
app.get('/', api.handleRoot);                 // root -> index.html at repo root
app.get('/products', api.listProducts);       // list w/ limit, offset, tag
app.get('/products/:id', api.getProduct);     // single
app.post('/products', api.createProduct);     // create (stub)
app.put('/products/:id', api.updateProduct);  // update (stub)
app.delete('/products/:id', api.deleteProduct);// delete (stub)

// 404 + error
app.use(middleware.notFound);
app.use(middleware.handleError);

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`));

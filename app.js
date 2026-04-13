const express = require('express');
const path = require('path');

const app = express();

const api = require('./api');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', api.handleRoot);

app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);

app.post('/products', api.createProduct);
app.put('/products/:id', api.updateProduct);
app.delete('/products/:id', api.deleteProduct);

// Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
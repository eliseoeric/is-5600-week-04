const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');
const middleware = require('./middleware');
const path = require('path');

const app = express();

// Middlewares
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

// Error Handling Middlewares
app.use(middleware.notFound);
app.use(middleware.handleError);


app.listen(() => {
  console.log(`Server running at http://localhost:${3000}/`);
});

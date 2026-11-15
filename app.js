
const express = require('express');
const api = require('./api');
const middleware = require('./middleware');

const port = process.env.PORT || 3000;

const app = express();

// Register public directory
app.use(express.static(__dirname + '/public'));

// Register middleware
app.use(middleware.cors);
app.use(express.json());

// Register routes
app.get('/', api.handleRoot);

app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);

app.post('/products', api.createProduct);

app.delete('/products/:id', api.deleteProduct);
app.put('/products/:id', api.updateProduct);

// Register error handling
app.use(middleware.notFound);
app.use(middleware.handleError);

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const express = require('express');
const api = require('./api');
const middleware = require('./middleware');
const bodyParser = require('body-parser');

// Set the port
const port = process.env.PORT || 3000;

// Boot the app
const app = express();

// Register the public directory
app.use(express.static(__dirname + '/public'));

// Register middleware
app.use(middleware.cors);
app.use(bodyParser.json());

// Register routes
app.get('/', api.handleRoot);
app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);
app.post('/products', api.createProduct);
app.put('/products/:id', api.updateProduct); // New PUT route
app.delete('/products/:id', api.deleteProduct); // New DELETE route

// Error handling middleware
app.use(middleware.handleError);
app.use(middleware.notFound);

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`));

const express = require('express');
const api = require('./api');
const middleware = require('./middleware');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

const app = express();

// Register the public directory
app.use(express.static(__dirname + '/public'));

// Apply middleware
app.use(middleware.cors);
app.use(bodyParser.json());

// Register routes
app.get('/products', api.listProducts);
app.get('/', api.handleRoot);
app.get('/products/:id', api.getProduct);
app.post('/products', api.createProduct);

// Error handling middleware (must be last)
app.use(middleware.notFound);
app.use(middleware.handleError);

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`));

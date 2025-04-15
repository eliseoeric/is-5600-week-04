const express = require('express');
const api = require('./api');
const middleware = require('./middleware');

// Set the port
const port = process.env.PORT || 3000;

// Boot the app
const app = express();

// Middleware
app.use(express.json()); // Needed for parsing JSON request bodies
app.use(express.static(__dirname + '/public'));
app.use(middleware.cors);

// Register the routes
app.get('/', api.handleRoot);
app.get('/products', api.listProducts);
app.get('/products', api.listProducts);         
app.get('/products/:id', api.getProduct);      

// Error handling middleware should be last
app.use(middleware.notFound);
app.use(middleware.handleError);

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`));

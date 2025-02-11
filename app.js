const express = require('express');
const api = require('./api');
const middleware = require('./middleware'); // Make sure path is correct
const bodyParser = require('body-parser');
const path = require('path'); // Import path

// Set the port
const port = process.env.PORT || 3000;
// Boot the app
const app = express();

// Register the public directory
app.use(express.static(path.join(__dirname, 'public'))); // Use path.join and __dirname

// Register middleware FIRST
app.use(middleware.cors);
app.use(bodyParser.json());

// Register the routes
app.get('/', api.handleRoot);
app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);
app.post('/products', api.createProduct);
app.delete('/products/:id', api.deleteProduct);
app.put('/products/:id', api.updateProduct);


// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`));

// Register error handling middleware LAST
app.use(middleware.handleError);
app.use(middleware.notFound); // Use the middleware object

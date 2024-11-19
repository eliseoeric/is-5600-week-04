const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));
// register the routes
app.use(middleware.cors)
app.use(bodyParser.json())
app.get('/products', api.listProducts)
app.get('/', api.handleRoot);
app.post('/products', api.createProduct)
app.get('/products/:id', api.getProduct) 
app.use(middleware.handleError)
app.use(middleware.notFound)
// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

const express = require('express');
const products = require('./products'); // Assuming products.js is in the same directory

const app = express();
app.use(express.json());

// Existing routes...

// DELETE route to delete a product
app.delete('/products/:id', (req, res) => {
    products.deleteProduct(req, res);
});

// PUT route to update a product
app.put('/products/:id', (req, res) => {
    products.updateProduct(req, res);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

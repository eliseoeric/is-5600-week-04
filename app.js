const express = require('express');
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

const products = require('./products');


app.use(express.json());

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
app.get('/Products/:id', api.getProduct)
app.post('/products', api.createProduct)

// Existing routes (e.g., POST, GET)
// Add the DELETE route
app.delete('/products/:id', (req, res) => {
  const productId = req.params.id; // Capture the product ID from the request
  products.deleteProduct(productId); // Call the deleteProduct method
  res.status(202).send({ message: `Product with ID ${productId} deleted.` });
});

// Add the PUT route
app.put('/products/:id', (req, res) => {
  const productId = req.params.id; // Capture the product ID from the request
  const updatedData = req.body; // Get the data to update from the request body
  products.updateProduct(productId, updatedData); // Call the updateProduct method
  res.status(200).send({ message: `Product with ID ${productId} updated.` });
});

module.exports = app;

app.use(middleware.handleError)
app.use(middleware.notFound)
// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))


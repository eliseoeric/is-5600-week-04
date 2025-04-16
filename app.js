const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')
const Products = require('./products');

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
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.use(middleware.handleError)
app.use(middleware.notFound)
app.use(express.json())

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

// DELETE route
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    await Products.deleteProduct(id);
    res.sendStatus(202); // Accepted
  });
  
// PUT route
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    await Products.updateProduct(id, updatedData);
    res.sendStatus(200); // OK
  });
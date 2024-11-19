const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

// Set the port
const port = process.env.PORT || 3000

// Boot the app
const app = express()

// Register the public directory
app.use(express.static(__dirname + '/public'))

// Register middleware
app.use(middleware.cors)
app.use(bodyParser.json())

// Register the routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)

// New DELETE route for removing a product
app.delete('/products/:id', async (req, res) => {
  const productId = req.params.id
  try {
    await api.deleteProduct(productId)  // Call the delete function from products.js
    res.status(202).json({ message: `Product with ID ${productId} accepted for deletion.` })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

// New PUT route for updating a product
app.put('/products/:id', async (req, res) => {
  const productId = req.params.id
  const updatedProduct = req.body  // The updated product data will come from the request body
  try {
    const updated = await api.updateProduct(productId, updatedProduct)  // Call the update function from products.js
    res.status(200).json({ message: `Product with ID ${productId} updated.`, updatedProduct: updated })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' })
  }
})

// Error handling middleware
app.use(middleware.notFound)
app.use(middleware.handleError)

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

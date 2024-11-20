const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

const port = process.env.PORT || 3000 // Set the port
const app = express()

app.use(express.static(__dirname + '/public')) // Serve static files from the "public" directory
app.use(middleware.cors) // Enable CORS
app.use(bodyParser.json()) // Parse JSON request bodies

// Defining all the routes
app.get('/products', api.listProducts) // Get all products
app.get('/', api.handleRoot) // Serve the root page
app.get('/products/:id', api.getProduct) // Get a product by ID
app.post('/products', api.createProduct) // Create a new product
app.delete('/products/:id', api.deleteProduct) // Delete a product by ID
app.put('/products/:id', api.updateProduct) // Update a product by ID

app.use(middleware.notFound) // Handle 404 errors
app.use(middleware.handleError) // Handle other errors

app.listen(port, () => console.log(`Server listening on port ${port}`)) // Start the server

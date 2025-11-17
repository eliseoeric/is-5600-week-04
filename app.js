const fs = require('fs').promises
const path = require('path')
const express = require('express')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()

// Middleware to parse JSON bodies
app.use(express.json())
// Register the public directory
app.use(express.static(__dirname + '/public'));

// Custom middleware functions

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Request time middleware
app.use((req, res, next) => {
  req.requestTime = Date.now()
  next()
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Register the routes
app.get('/', handleRoot);
app.get('/products', listProducts)
app.get('/products/:id', getProduct)
app.post('/products', createProduct)
app.put('/products/:id', updateProduct)
app.delete('/products/:id', deleteProduct)

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products with filtering and pagination
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    let products = JSON.parse(data)
    
    // Filtering by tag
    const tag = req.query.tag
    if (tag) {
      products = products.filter(product => 
        product.tags && product.tags.some(t => 
          typeof t === 'object' ? t.title.toLowerCase().includes(tag.toLowerCase()) : t.toLowerCase().includes(tag.toLowerCase())
        )
      )
    }
    
    // Pagination
    const offset = parseInt(req.query.offset) || 0
    const limit = parseInt(req.query.limit) || 25
    
    const paginatedProducts = products.slice(offset, offset + limit)
    
    res.json(paginatedProducts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Get a single product by ID
 * @param {object} req
 * @param {object} res
 */
async function getProduct(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    const products = JSON.parse(data)
    const product = products.find(p => p.id === req.params.id)
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    const products = JSON.parse(data)
    
    const newProduct = {
      id: generateId(),
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    products.push(newProduct)
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2))
    
    res.status(201).json(newProduct)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Update a product
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    const products = JSON.parse(data)
    const productIndex = products.findIndex(p => p.id === req.params.id)
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' })
    }
    
    const updatedProduct = {
      ...products[productIndex],
      ...req.body,
      updated_at: new Date().toISOString()
    }
    
    products[productIndex] = updatedProduct
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2))
    
    res.json(updatedProduct)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Delete a product
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    const products = JSON.parse(data)
    const productIndex = products.findIndex(p => p.id === req.params.id)
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' })
    }
    
    const deletedProduct = products.splice(productIndex, 1)[0]
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2))
    
    res.json({ message: 'Product deleted successfully', product: deletedProduct })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Generate a unique ID for new products
 */
function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}
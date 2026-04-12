const fs = require('fs').promises
const path = require('path')
const express = require('express')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()

// Middleware - Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// In-memory product data store (initialized from file)
let products = []

// Initialize products from file on startup
async function initializeProducts() {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    products = JSON.parse(data)
    console.log(`Loaded ${products.length} products from file`)
  } catch (err) {
    console.error('Error loading products:', err.message)
    products = []
  }
}

// Middleware - Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// Middleware - Validation for POST/PUT requests
const validateProduct = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const { name, price } = req.body
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Product name is required and must be a non-empty string' })
    }
    
    if (price === undefined || typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Product price is required and must be a non-negative number' })
    }
  }
  next()
}

// Register middlewares and routes
app.use(express.static(__dirname + '/public'))
app.use(validateProduct)

// Routes
app.get('/', handleRoot)
app.get('/products', listProducts)
app.get('/products/:id', getProductById)
app.post('/products', createProduct)
app.put('/products/:id', updateProduct)
app.delete('/products/:id', deleteProduct)

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

// Boot the server
app.listen(port, async () => {
  await initializeProducts()
  console.log(`Server listening on port ${port}`)
})

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

/**
 * List all products with filtering and pagination
 * @param {object} req
 * @param {object} res
 */
function listProducts(req, res) {
  try {
    let filtered = [...products]

    // Filtering by name
    if (req.query.name) {
      const searchTerm = req.query.name.toLowerCase()
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm))
    }

    // Filtering by min and max price
    if (req.query.minPrice) {
      const minPrice = parseFloat(req.query.minPrice)
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(p => p.price >= minPrice)
      }
    }

    if (req.query.maxPrice) {
      const maxPrice = parseFloat(req.query.maxPrice)
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(p => p.price <= maxPrice)
      }
    }

    // Pagination
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.max(1, parseInt(req.query.limit) || 10)
    const offset = (page - 1) * limit
    const total = filtered.length
    const paginated = filtered.slice(offset, offset + limit)

    res.json({
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Get a single product by ID
 * @param {object} req
 * @param {object} res
 */
function getProductById(req, res) {
  try {
    const { id } = req.params
    const product = products.find(p => p.id === id)

    if (!product) {
      return res.status(404).json({ error: `Product with id ${id} not found` })
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
function createProduct(req, res) {
  try {
    const { name, price, description } = req.body

    // Generate a simple ID (in production, use UUID or database-generated ID)
    const id = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newProduct = {
      id,
      name: name.trim(),
      price,
      description: description || '',
      createdAt: new Date().toISOString()
    }

    products.push(newProduct)
    res.status(201).json(newProduct)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Update an existing product
 * @param {object} req
 * @param {object} res
 */
function updateProduct(req, res) {
  try {
    const { id } = req.params
    const { name, price, description } = req.body

    const product = products.find(p => p.id === id)

    if (!product) {
      return res.status(404).json({ error: `Product with id ${id} not found` })
    }

    // Update fields
    if (name !== undefined) product.name = name.trim()
    if (price !== undefined) product.price = price
    if (description !== undefined) product.description = description
    product.updatedAt = new Date().toISOString()

    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Delete a product
 * @param {object} req
 * @param {object} res
 */
function deleteProduct(req, res) {
  try {
    const { id } = req.params
    const index = products.findIndex(p => p.id === id)

    if (index === -1) {
      return res.status(404).json({ error: `Product with id ${id} not found` })
    }

    const deletedProduct = products.splice(index, 1)[0]
    res.json({ message: 'Product deleted successfully', product: deletedProduct })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const fs = require('fs').promises
const path = require('path')
const express = require('express')

// Set the port
const port = process.env.PORT || 3000

// Boot the app
const app = express()

// ============== MIDDLEWARE ==============

// Parse JSON bodies (for POST and PUT requests)
app.use(express.json())

// Middleware 1: Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// Middleware 2: Response Time Tracker
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`[${req.method} ${req.url}] completed in ${duration}ms`)
  })
  next()
})

// Middleware 3: Simple Authentication Check (for POST/PUT/DELETE)
const requireAuth = (req, res, next) => {
  // Allow GET requests without auth
  if (req.method === 'GET') {
    return next()
  }
  
  // Check for auth token in headers
  const authToken = req.headers['authorization']
  
  if (authToken === 'Bearer secret123') {
    next()
  } else {
    res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Valid authorization token required for POST, PUT, DELETE operations',
      example: 'Authorization: Bearer secret123'
    })
  }
}

// Apply auth middleware to all routes (will check method inside)
app.use(requireAuth)

// Register the public directory for static files
app.use(express.static(__dirname + '/public'))

// ============== ROUTES ==============

// GET / - Serve the homepage
app.get('/', handleRoot)

// GET /health - Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    endpoints: {
      list: 'GET /products',
      filter: 'GET /products?category=Abstract&minPrice=10&maxPrice=100',
      paginate: 'GET /products?page=1&limit=5',
      single: 'GET /products/:id',
      create: 'POST /products',
      update: 'PUT /products/:id',
      delete: 'DELETE /products/:id'
    }
  })
})

// GET /products - List all products with filtering and pagination
app.get('/products', listProducts)

// GET /products/:id - Get single product by ID
app.get('/products/:id', getProductById)

// POST /products - Create a new product
app.post('/products', createProduct)

// PUT /products/:id - Update a product
app.put('/products/:id', updateProduct)

// DELETE /products/:id - Delete a product
app.delete('/products/:id', deleteProduct)

// Boot the server
app.listen(port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║     🚀 eCommerce Server Started Successfully!        ║
╠═══════════════════════════════════════════════════════╣
║  Port: ${port}                                           ║
║  URL:  http://localhost:${port}                         ║
╠═══════════════════════════════════════════════════════╣
║  Available Endpoints:                                 ║
║                                                       ║
║  GET    /products              - List all products    ║
║  GET    /products/:id          - Get one product      ║
║  POST   /products              - Create product       ║
║  PUT    /products/:id          - Update product       ║
║  DELETE /products/:id          - Delete product       ║
║  GET    /health                - Health check         ║
║  GET    /                      - Homepage             ║
╠═══════════════════════════════════════════════════════╣
║  Query Parameters for GET /products:                  ║
║    ?category=Abstract                                 ║
║    ?minPrice=10&maxPrice=100                          ║
║    ?inStock=true                                      ║
║    ?minRating=4.0                                     ║
║    ?page=1&limit=10                                   ║
║    ?sortBy=price&sortOrder=desc                       ║
╠═══════════════════════════════════════════════════════╣
║  For POST/PUT/DELETE, include header:                 ║
║  Authorization: Bearer secret123                      ║
╚═══════════════════════════════════════════════════════╝
  `)
})

// ============== ROUTE HANDLERS ==============

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
async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  
  try {
    const data = await fs.readFile(productsFile, 'utf8')
    let products = JSON.parse(data).products
    
    // Get query parameters
    const { 
      category, 
      minPrice, 
      maxPrice, 
      inStock, 
      minRating,
      page = 1, 
      limit = 10,
      sortBy = 'id',
      sortOrder = 'asc'
    } = req.query
    
    // Apply filters
    let filteredProducts = [...products]
    
    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      )
    }
    
    // Filter by min price
    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => 
        p.price >= parseFloat(minPrice)
      )
    }
    
    // Filter by max price
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => 
        p.price <= parseFloat(maxPrice)
      )
    }
    
    // Filter by in stock
    if (inStock !== undefined) {
      const inStockBool = inStock === 'true'
      filteredProducts = filteredProducts.filter(p => 
        p.inStock === inStockBool
      )
    }
    
    // Filter by minimum rating
    if (minRating) {
      filteredProducts = filteredProducts.filter(p => 
        p.rating >= parseFloat(minRating)
      )
    }
    
    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
    
    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit)
    const endIndex = startIndex + parseInt(limit)
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
    
    // Prepare response with metadata
    const response = {
      success: true,
      count: paginatedProducts.length,
      total: filteredProducts.length,
      products: paginatedProducts,
      pagination: {
        currentPage: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(filteredProducts.length / parseInt(limit)),
        hasNext: endIndex < filteredProducts.length,
        hasPrev: startIndex > 0
      },
      filters: {
        category: category || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        inStock: inStock || null,
        minRating: minRating || null
      }
    }
    
    res.json(response)
    
  } catch (err) {
    console.error('Error reading products:', err)
    res.status(500).json({ 
      success: false,
      error: 'Internal Server Error', 
      message: err.message 
    })
  }
}

/**
 * Get a single product by ID
 * @param {object} req
 * @param {object} res
 */
async function getProductById(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  const productId = parseInt(req.params.id)
  
  try {
    const data = await fs.readFile(productsFile, 'utf8')
    const products = JSON.parse(data).products
    
    const product = products.find(p => p.id === productId)
    
    if (product) {
      res.json({
        success: true,
        product: product
      })
    } else {
      res.status(404).json({ 
        success: false,
        error: 'Not Found', 
        message: `Product with id ${productId} not found` 
      })
    }
    
  } catch (err) {
    console.error('Error reading product:', err)
    res.status(500).json({ 
      success: false,
      error: 'Internal Server Error', 
      message: err.message 
    })
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
    // Read current products
    const data = await fs.readFile(productsFile, 'utf8')
    const productsData = JSON.parse(data)
    let products = productsData.products
    
    // Get new product data from request body
    const { name, price, category, description, inStock, rating } = req.body
    
    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Missing required fields: name, price, and category are required'
      })
    }
    
    // Create new product with auto-increment ID
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
    
    const newProduct = {
      id: newId,
      name: name,
      price: parseFloat(price),
      category: category,
      description: description || '',
      inStock: inStock !== undefined ? inStock : true,
      rating: rating || 0,
      created_at: new Date().toISOString()
    }
    
    // Add to products array
    products.push(newProduct)
    
    // Save back to file
    await fs.writeFile(productsFile, JSON.stringify({ products: products }, null, 2))
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    })
    
  } catch (err) {
    console.error('Error creating product:', err)
    res.status(500).json({ 
      success: false,
      error: 'Internal Server Error', 
      message: err.message 
    })
  }
}

/**
 * Update a product
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  const productId = parseInt(req.params.id)
  
  try {
    // Read current products
    const data = await fs.readFile(productsFile, 'utf8')
    const productsData = JSON.parse(data)
    let products = productsData.products
    
    // Find product index
    const productIndex = products.findIndex(p => p.id === productId)
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Product with id ${productId} not found`
      })
    }
    
    // Get update data from request body
    const { name, price, category, description, inStock, rating } = req.body
    
    // Update only provided fields
    const updatedProduct = { ...products[productIndex] }
    
    if (name !== undefined) updatedProduct.name = name
    if (price !== undefined) updatedProduct.price = parseFloat(price)
    if (category !== undefined) updatedProduct.category = category
    if (description !== undefined) updatedProduct.description = description
    if (inStock !== undefined) updatedProduct.inStock = inStock
    if (rating !== undefined) updatedProduct.rating = parseFloat(rating)
    
    // Add updated timestamp
    updatedProduct.updated_at = new Date().toISOString()
    
    // Replace product in array
    products[productIndex] = updatedProduct
    
    // Save back to file
    await fs.writeFile(productsFile, JSON.stringify({ products: products }, null, 2))
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    })
    
  } catch (err) {
    console.error('Error updating product:', err)
    res.status(500).json({ 
      success: false,
      error: 'Internal Server Error', 
      message: err.message 
    })
  }
}

/**
 * Delete a product
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  const productId = parseInt(req.params.id)
  
  try {
    // Read current products
    const data = await fs.readFile(productsFile, 'utf8')
    const productsData = JSON.parse(data)
    let products = productsData.products
    
    // Find product
    const productIndex = products.findIndex(p => p.id === productId)
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Product with id ${productId} not found`
      })
    }
    
    // Store deleted product for response
    const deletedProduct = products[productIndex]
    
    // Remove from array
    products.splice(productIndex, 1)
    
    // Save back to file
    await fs.writeFile(productsFile, JSON.stringify({ products: products }, null, 2))
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
      product: deletedProduct
    })
    
  } catch (err) {
    console.error('Error deleting product:', err)
    res.status(500).json({ 
      success: false,
      error: 'Internal Server Error', 
      message: err.message 
    })
  }
}
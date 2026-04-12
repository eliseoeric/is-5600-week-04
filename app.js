const fs = require('fs').promises
const path = require('path')
const express = require('express')

const Products = require('./products')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()

app.use(express.json())
app.use(requestLogger)
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', handleRoot)
app.get('/products', listProductsFile)

app.get('/api/products', listProducts)
app.get('/api/products/:id', getProduct)
app.post('/api/products', validateProductBody, createProduct)
app.put('/api/products/:id', validateProductBody, updateProduct)
app.delete('/api/products/:id', deleteProduct)

app.use(errorHandler)

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

/**
 * Return the original file-backed products list for the existing front-end
 */
async function listProductsFile(req, res, next) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))
  } catch (err) {
    next(err)
  }
}

/**
 * List in-memory products with optional filtering and pagination
 */
function listProducts(req, res, next) {
  try {
    const offset = req.query.offset !== undefined ? Number(req.query.offset) : 0
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : 25
    const tag = req.query.tag

    if (!Number.isInteger(offset) || offset < 0 || !Number.isInteger(limit) || limit < 1) {
      throw createHttpError(400, 'offset must be 0 or greater and limit must be 1 or greater')
    }

    res.json(Products.list({ offset, limit, tag }))
  } catch (err) {
    next(err)
  }
}

/**
 * Retrieve a single product by ID
 */
function getProduct(req, res, next) {
  try {
    const product = Products.getById(req.params.id)
    if (!product) {
      return next(createHttpError(404, `Product ${req.params.id} not found`))
    }
    res.json(product)
  } catch (err) {
    next(err)
  }
}

/**
 * Create a new product
 */
function createProduct(req, res, next) {
  try {
    const product = Products.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
}

/**
 * Update an existing product by ID
 */
function updateProduct(req, res, next) {
  try {
    const product = Products.update(req.params.id, req.body)
    if (!product) {
      return next(createHttpError(404, `Product ${req.params.id} not found`))
    }
    res.json(product)
  } catch (err) {
    next(err)
  }
}

/**
 * Delete a product by ID
 */
function deleteProduct(req, res, next) {
  try {
    const success = Products.remove(req.params.id)
    if (!success) {
      return next(createHttpError(404, `Product ${req.params.id} not found`))
    }
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

/**
 * Request logging middleware
 */
function requestLogger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
  next()
}

/**
 * Validate incoming product payloads for create and update operations
 */
function validateProductBody(req, res, next) {
  const { name, price, tags } = req.body

  if (req.method === 'PUT' && Object.keys(req.body).length === 0) {
    return next(createHttpError(400, 'Request body is required for update'))
  }

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      return next(createHttpError(400, 'name must be a non-empty string'))
    }
  }

  if (price !== undefined) {
    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      return next(createHttpError(400, 'price must be a non-negative number'))
    }
  }

  if (req.method === 'POST') {
    if (name === undefined) {
      return next(createHttpError(400, 'name is required'))
    }
    if (price === undefined) {
      return next(createHttpError(400, 'price is required'))
    }
  }

  if (tags !== undefined && !Array.isArray(tags)) {
    return next(createHttpError(400, 'tags must be an array of strings'))
  }

  next()
}

/**
 * Standardized error-handling middleware
 */
function errorHandler(err, req, res, next) {
  console.error(err)
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({ error: err.message || 'Internal server error' })
}

function createHttpError(statusCode, message) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

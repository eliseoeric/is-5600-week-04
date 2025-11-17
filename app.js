const fs = require('fs').promises
const path = require('path')
const express = require('express')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()

// Built-in middleware to parse JSON bodies
app.use(express.json())

// Simple request logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`)
  next()
})

// Register the public directory
app.use(express.static(__dirname + '/public'));

// Routes
app.get('/products', listProducts)
app.post('/products', validateProduct, createProduct)
app.get('/products/:id', getProduct)
app.put('/products/:id', validateProduct, updateProduct)
app.delete('/products/:id', deleteProduct)
app.get('/', handleRoot);

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

/**
 * Handle the root route
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

const PRODUCTS_FILE = path.join(__dirname, 'data', 'full-products.json')

async function readProductsFile() {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8')
    if (!data) return []
    return JSON.parse(data)
  } catch (err) {
    // If file doesn't exist or is empty, initialize with empty array
    if (err.code === 'ENOENT') return []
    throw err
  }
}

async function writeProductsFile(products) {
  await fs.mkdir(path.dirname(PRODUCTS_FILE), { recursive: true })
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8')
}

/**
 * Validate minimal product payload for POST/PUT
 */
function validateProduct(req, res, next) {
  const { name, price } = req.body || {}
  if (!name || (price === undefined || price === null)) {
    return res.status(400).json({ error: 'Product must include `name` and `price`' })
  }
  next()
}

/**
 * List all products with optional filtering and pagination
 * Query params supported: q (search name), minPrice, maxPrice, page, limit
 */
async function listProducts(req, res) {
  try {
    let products = await readProductsFile()

    // Filtering: simple text search on name (case-insensitive)
    const { q, minPrice, maxPrice } = req.query
    if (q) {
      const qLower = q.toLowerCase()
      products = products.filter(p => (p.name || '').toLowerCase().includes(qLower))
    }
    if (minPrice !== undefined) {
      const min = Number(minPrice)
      if (!Number.isNaN(min)) products = products.filter(p => Number(p.price) >= min)
    }
    if (maxPrice !== undefined) {
      const max = Number(maxPrice)
      if (!Number.isNaN(max)) products = products.filter(p => Number(p.price) <= max)
    }

    // Pagination
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10))
    const start = (page - 1) * limit
    const end = start + limit
    const paged = products.slice(start, end)

    res.json({ total: products.length, page, limit, data: paged })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Create a new product
 */
async function createProduct(req, res) {
  try {
    const products = await readProductsFile()
    // Assign an id: use numeric increasing id
    const maxId = products.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0)
    const id = String(maxId + 1)
    const newProduct = Object.assign({ id }, req.body)
    products.push(newProduct)
    await writeProductsFile(products)
    res.status(201).json(newProduct)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Get a single product by id
 */
async function getProduct(req, res) {
  try {
    const products = await readProductsFile()
    const product = products.find(p => String(p.id) === String(req.params.id))
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Update a product by id (full replace)
 */
async function updateProduct(req, res) {
  try {
    const products = await readProductsFile()
    const idx = products.findIndex(p => String(p.id) === String(req.params.id))
    if (idx === -1) return res.status(404).json({ error: 'Product not found' })
    const updated = Object.assign({}, products[idx], req.body, { id: String(req.params.id) })
    products[idx] = updated
    await writeProductsFile(products)
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Delete a product by id
 */
async function deleteProduct(req, res) {
  try {
    const products = await readProductsFile()
    const idx = products.findIndex(p => String(p.id) === String(req.params.id))
    if (idx === -1) return res.status(404).json({ error: 'Product not found' })
    const [removed] = products.splice(idx, 1)
    await writeProductsFile(products)
    res.json({ deleted: removed })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
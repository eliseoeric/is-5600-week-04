const fs = require('fs').promises
const path = require('path')
const express = require('express')

// Set the port
const port = process.env.PORT || 3000

// Boot the app
const app = express()

// File path
const productsFile = path.join(__dirname, 'data/full-products.json')

// Register the public directory
app.use(express.static(__dirname + '/public'))

// Parse JSON body
app.use(express.json())

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin
  res.setHeader('Access-Control-Allow-Origin', origin || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

// Register the routes
app.get('/', handleRoot)
app.get('/products', listProducts)
app.get('/products/:id', getProduct)
app.post('/products', createProduct)
app.put('/products/:id', updateProduct)
app.delete('/products/:id', deleteProduct)

// 404 middleware
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

// error middleware
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

/**
 * Handle the root route
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
}

/**
 * List all products
 * Supports:
 * /products
 * /products?limit=5&offset=0
 * /products?tag=electronics
 */
async function listProducts(req, res, next) {
  try {
    const { offset = 0, limit = 25, tag } = req.query
    const data = await fs.readFile(productsFile, 'utf8')
    let products = JSON.parse(data)

    if (tag) {
      products = products.filter(product => {
        return (
          product.tags &&
          product.tags.some(t => t.title && t.title.toLowerCase() === tag.toLowerCase())
        )
      })
    }

    products = products.slice(Number(offset), Number(offset) + Number(limit))
    res.json(products)
  } catch (err) {
    next(err)
  }
}

/**
 * Get single product by id
 */
async function getProduct(req, res, next) {
  try {
    const { id } = req.params
    const data = await fs.readFile(productsFile, 'utf8')
    const products = JSON.parse(data)

    const product = products.find(p => p.id === id)

    if (!product) {
      return res.status(404).json({ error: 'Not Found' })
    }

    res.json(product)
  } catch (err) {
    next(err)
  }
}

/**
 * Create a product
 * Placeholder only
 */
function createProduct(req, res) {
  console.log('Created product:', req.body)

  res.status(201).json({
    message: 'Product created successfully',
    data: req.body
  })
}

/**
 * Update a product
 * Placeholder only
 */
async function updateProduct(req, res, next) {
  try {
    const { id } = req.params
    const data = await fs.readFile(productsFile, 'utf8')
    const products = JSON.parse(data)

    const product = products.find(p => p.id === id)

    if (!product) {
      return res.status(404).json({ error: 'Not Found' })
    }

    console.log(`Product ${id} was updated`)
    console.log(req.body)

    res.status(200).json({
      message: `Product ${id} updated successfully`,
      data: {
        id,
        ...req.body
      }
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Delete a product
 * Placeholder only
 */
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params
    const data = await fs.readFile(productsFile, 'utf8')
    const products = JSON.parse(data)

    const product = products.find(p => p.id === id)

    if (!product) {
      return res.status(404).json({ error: 'Not Found' })
    }

    console.log(`Product ${id} was deleted`)

    res.status(202).json({
      message: `Product ${id} deleted successfully`
    })
  } catch (err) {
    next(err)
  }
}
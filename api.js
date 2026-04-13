// api.js
const path = require('path')
const Products = require('./products')
const autoCatch = require('lib/auto-catch')

 /**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {
  // Add CORS headers
  
  // Read the products file
  const productsFile = path.join(__dirname, 'data/full-products.json')
  
  try {
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {

  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25 } = req.query

  try {
    // Pass the limit and offset to the Products service
    res.json(await Products.list({
      offset: Number(offset),
      limit: Number(limit)
    }))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {
  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25, tag } = req.query
  // Pass the limit and offset to the Products service
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}

/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct (req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) {
    return next()
  }
  
  return res.json(product)
}

/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct (req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

/**
 * ✅ UPDATE product
 */
async function updateProduct (req, res) {
  const { id } = req.params

  await Products.update(id, req.body)

  console.log(`Product ${id} updated`)
  res.status(200).json({ message: `Product ${id} updated` })
}

/**
 * ✅ DELETE product
 */
async function deleteProduct (req, res) {
  const { id } = req.params

  await Products.remove(id)

  console.log(`Product ${id} deleted`)
  res.status(202).json({ message: `Product ${id} deleted` })
}

module.exports = autoCatch({
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})
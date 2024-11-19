const path = require('path')
const Products=require('./products')
const autoCatch = require('lib/auto-catch')
// For handling file paths

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))  // Using path to resolve the file location
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data', 'full-products.json')  // Correct path handling
  try {
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))  // Send the parsed JSON data
  } catch (err) {
    res.status(500).json({ error: err.message })  // Error handling if file reading fails
  }
}

/**
 * Get a specific product by ID
 * @param {object} req
 * @param {object} res
 */
async function getProduct(req, res) {
  const productId = req.params.id
  const productsFile = path.join(__dirname, 'data', 'full-products.json')  // Correct path handling
  try {
    const data = await fs.readFile(productsFile)
    const products = JSON.parse(data)
    const product = products.find(p => p.id === productId)
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ error: 'Product not found' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })  // Error handling if file reading fails
  }
}

/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct(req, res) {
  const newProduct = req.body
  const productsFile = path.join(__dirname, 'data', 'full-products.json')  // Correct path handling
  try {
    const data = await fs.readFile(productsFile)
    const products = JSON.parse(data)
    products.push(newProduct)
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2))  // Writing the updated products back to the file
    res.status(201).json(newProduct)
  } catch (err) {
    res.status(500).json({ error: err.message })  // Error handling if file reading or writing fails
  }
}

module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  createProduct
}

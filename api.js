// api.js
const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query
  try {
    res.json(await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag
    }))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct(req, res, next) {
  console.log('get product')
  const { id } = req.params
  try {
    const product = await Products.get(id)
    if (!product) {
      return next()
    }
    return res.json(product)
  }
  catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct(req, res) {
  console.log('request body:')
  try {
    //res.json(await Products.create(req.body))
    res.json(req.body)
  }
  catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// async function deleteProduct(req, res) {
//   console.log('delete product')
//   // const { id } = req.params
//   // console.log('id:', id)
//   // try {
//   //   //await Products.delete(id)
//   //   res.json({ success: true })
//   // } catch (err) {
//   //   res.status(500).json({ error: err.message })
//   // }


// }

async function deleteProduct(req, res) {
  const { id } = req.params
  console.log('deleting  id:', id)
  //await Products.delete(id)
  res.status(202).json({ message: `Product ${id} deleted` })
}


async function updateProduct(req, res) {
  const { id } = req.params
  console.log(' updating id:', id)
  try {
    // res.json(await Products
    //   .update(id, req.body))
    res.json({ message: `Product ${id} updated` })
  }
  catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
})
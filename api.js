// api.js
const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')
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

// api.js

// api.js

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {

    // Extract the limit and offset query parameters
    const { offset = 0, limit = 25 } = req.query;
    process.stdout.write('lol1');
  
    try {
      // Pass the limit and offset to the Products service
      res.json(await Products.list({
        offset,
        limit,
      }))
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
  module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct
  });
//   /**
//  * Get a single product
  
// async function getProduct (req, res, next) {
//   // Add CORS headers
//   res.setHeader('Access-Control-Allow-Origin', '*')

//   const { id } = req.params

  // try {
  //   const product = await Products.get(id)
  //   if (!product) {
  //     // next() is a callback that will pass the request to the next available route in the stack
  //     return next()
  //   }

  //   return res.json(product)
  // } catch (err) {
  //   res.status(500).json({ error: err.message })
  // }
// async function listProducts (req, res) 
// {
//   // Extract the limit and offset query parameters
//   const { offset = 0, limit = 25, tag } = req.query
//   // Pass the limit and offset to the Products service
//   res.json(await Products.list({
//     offset: Number(offset),
//     limit: Number(limit),
//     tag
//   }))

// }


/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) 
{
  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25, tag } = req.query
  // Pass the limit and offset to the Products service
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))

}

async function getProduct (req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) {
    return next()
  }
  
  return res.json(product)
}
async function createProduct (req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

async function deleteProduct(req, res) {
  const productId = req.params.id;
  const result = await Products.deleteProduct(productId);
  res.status(202).json(result);
}

async function updateProduct(req, res) {
  const productId = req.params.id;
  const updatedData = req.body;
  const result = await Products.updateProduct(productId);
  res.status(200).json(result);
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct 
})
const path = require('path')
const products = require('./products')
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
async function listProducts (req, res) {

  const { offset = 0, limit = 25 , tag } = req.query
  
  // Read the products file
  
  try {
    res.json(await products.list( {offset: Number(offset),
                                    limit: Number(limit),
                                  tag,}))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


async function getProduct (req, res, next) {

  const { id } = req.params 

try {
const product = await products.get(id)
if (!product) {
  return next()
}

return res.json(product)
}

catch (err)
{
  res.status(500).json({ error: err.message})
}}


async function createProduct (req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

/**
 * Delete a product
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
  // Get the 'id' from the URL parameters
  const { id } = req.params;

  // Call the service function from products.js
  await products.deleteProduct(id);

  // Send a 202 "Accepted" response, as requested by the lab
  res.status(202).json({ message: `Product ${id} marked for deletion.` });
}

/**
 * Update a product
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
  // Get the 'id' from the URL
  const { id } = req.params;

  // Get the new data from the request body
  const data = req.body;

  // Call the service function
  const updatedProduct = await products.updateProduct(id, data);

  // Send a 200 "OK" response with the "updated" product
  res.status(200).json(updatedProduct);
}

module.exports = autoCatch ({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
});
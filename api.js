const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')



function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}


async function getProduct(req, res, next) {

  const { id } = req.params

  const product = await Products.get(id)
  if (!product) {
    return next()
  }
  return res.json(product)

}

async function listProducts(req, res) {

  //extracting the limit and offset query parameters
  console.log(req)
  const { offset = 0, limit = 25, tag } = req.query


  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))


}

async function createProduct(req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  //As Instructions mentioned Iam not adding anything except logging.
  res.status(202).json({ message: `Product with ID ${id} deleted.` });

}

async function editProduct(req, res, next) {
  const { id } = req.params;
  const updatedProduct = req.body;
  res.status(200).json({ message: `Product with ID ${id} Updated`, updatedProduct });

}


module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  editProduct
})
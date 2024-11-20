const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')
 
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}
 
async function getProduct (req, res, next) {
  const { id } = req.params
    const product = await Products.get(id)
    if (!product) {
      return next()
    }
    return res.json(product)
  
}
 
/**
* List all products
* @param {object} req
* @param {object} res
*/
async function listProducts(req, res) {
   const { offset = 0, limit = 25, tag } = req.query
 
    res.json(await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag,
    })) 
}
 
async function createProduct (req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}
 
async function editProduct (req, res, next) {
  //console.log('request body:', req.body)
  res.json(req.body)
}
async function deleteProduct (req, res, next) {
  res.json({success: true})
}
 
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct
})

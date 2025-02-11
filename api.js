const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

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

async function updateProduct(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    console.log(`Product with ID ${id} updated.`, updatedData);
    res.status(200).json({ message: `Product ${id} updated successfully.`, updatedData });
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  console.log(`Product with ID ${id} deleted.`);

  res.status(202).json({ message: `Product ${id} deleted successfully.` });
}

    module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
});
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

const path = require('path');

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
}

async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag,
  }));
}

async function getProduct (req, res, next) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { id } = req.params

  try {
    const product = await Products.get(id)
    if (!product) {
      // next() is a callback that will pass the request to the next available route in the stack
      return next()
    }

    return res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function createProduct(req, res) {
  const newProduct = await Products.create(res.json(req.body));
  console.log('request body:', req.body)
  res.status(201).json(newProduct);
}

async function updateProduct(req, res) {
  const { id } = req.params;
  await Products.update(id, req.body);
  res.status(200).json({ message: `Product ${id} updated successfully` });
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  await Products.remove(id);
  res.status(202).json({ message: `Product ${id} deleted successfully` });
}
module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  });
  
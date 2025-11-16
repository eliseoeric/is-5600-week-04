const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query
  try {
    res.json(await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag,
    }))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function getProduct(req, res, next) {
  const { id } = req.params;
  try {
    const product = await Products.get(id)
    if (!product) return next()
    return res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function createProduct(req, res) {
  res.json(req.body)
}

/********  ⬇️ ADD THESE TWO  *********/

async function updateProduct(req, res, next) {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updated = await Products.update(Number(id), updates);
    if (!updated) return next();
    return res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteProduct(req, res, next) {
  const { id } = req.params;

  try {
    const deleted = await Products.remove(Number(id));
    if (!deleted) return next();
    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/********  ⬆️ ADD THESE TWO  *********/

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})

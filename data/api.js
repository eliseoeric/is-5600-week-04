const path = require('path');
const fs = require('fs').promises;
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '../index.html'));
}
async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'full-products.json');
  try {
    const data = await fs.readFile(productsFile);
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
function getProduct(req, res) { res.json({}); }
function createProduct(req, res) { res.json({}); }
function updateProduct(req, res) { res.json({}); }
function deleteProduct(req, res) { res.json({}); }
module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};


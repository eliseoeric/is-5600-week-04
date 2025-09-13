const path = require('path');
const Products = require('./products');   // ✅ same folder as api.js

// serve index.html
function rootHandler(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
}

// list all with pagination
async function fetchProducts(req, res, next) {
  try {
    const { limit = 5, offset = 0, tag } = req.query;
    const products = await Products.listAll({
      limit: Number(limit),
      offset: Number(offset),
      tag
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
}

// fetch by id
async function fetchProductById(req, res, next) {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

// add new
async function addProduct(req, res) {
  res.status(201).json({ message: 'Product created', product: req.body });
}

// update
async function modifyProduct(req, res) {
  res.json({ message: `Product ${req.params.id} updated`, updates: req.body });
}

// delete
async function removeProduct(req, res) {
  res.status(202).json({ message: `Product ${req.params.id} deleted` });
}

module.exports = {
  rootHandler,
  fetchProducts,
  fetchProductById,
  addProduct,
  modifyProduct,
  removeProduct
};

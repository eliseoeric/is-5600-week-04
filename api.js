const path = require("path");
const Products = require("./products");
const autoCatch = require("./lib/auto-catch");

/**
 * Serve the root HTML file
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
}

/**
 * Get a single product by ID
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function getProduct(req, res, next) {
  const { id } = req.params;
  const product = await Products.get(id);
  if (!product) {
    return next(); // triggers 404 middleware
  }

  return res.json(product);
}

/**
 * List all products with pagination and optional tag filter
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;

  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  });

  res.json(products);
}

/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct(req, res) {
  const product = await Products.create(req.body);
  res.status(201).json(product);
}

/**
 * Update a product by ID
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function updateProduct(req, res, next) {
  const { id } = req.params;
  const updated = await Products.update(id, req.body);

  if (updated?.error) {
    return next(); // triggers 404 if product not found
  }

  res.json(updated);
}

/**
 * Delete a product by ID
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function deleteProduct(req, res, next) {
  const { id } = req.params;
  const result = await Products.remove(id);

  if (result?.error) {
    return next(); // triggers 404 if not found
  }

  res.json(result);
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
});
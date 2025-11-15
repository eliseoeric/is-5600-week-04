// api.js
const path = require("path");
const Products = require("./products");
const autoCatch = require("./lib/auto-catch");

/**
 * Serve the homepage
 */
async function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
}

/**
 * List products with pagination + optional tag filter
 */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;

  const result = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  });

  res.json(result);
}

/**
 * Get a single product
 */
async function getProduct(req, res, next) {
  const product = await Products.get(req.params.id);

  if (!product) return next(); // trigger 404
  res.json(product);
}

/**
 * Create a product (placeholder)
 */
async function createProduct(req, res) {
  console.log("Creating product:", req.body);
  res.status(201).json(req.body);
}

/**
 * Update a product (placeholder)
 */
async function updateProduct(req, res) {
  console.log("Updating product:", req.params.id, req.body);
  res.status(200).json({ message: "Product updated" });
}

/**
 * Delete a product (placeholder)
 */
async function deleteProduct(req, res) {
  console.log("Deleting product:", req.params.id);
  res.status(202).json({ message: "Product deleted" });
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
});

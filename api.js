const path = require("path");
const Products = require("./products");
const autoCatch = require("./lib/auto-catch");

/**
 * Handle the root route, serving the main HTML page
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
}

/**
 * Fetch a product by its ID
 * @param {object} req - Express request object, expected to contain the product ID in params
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function for error handling
 */
async function getProduct(req, res, next) {
  const { id } = req.params;

  const product = await Products.get(id);
  if (!product) {
    return next(); // Pass to next middleware if product is not found
  }
  return res.json(product);
}

/**
 * List all products with optional pagination and filtering by tag
 * @param {object} req - Express request object, expected to contain query parameters (offset, limit, tag)
 * @param {object} res - Express response object
 */
async function listProducts(req, res) {
  // Extract the limit, offset, and tag query parameters with default values for pagination
  const { offset = 0, limit = 25, tag } = req.query;

  res.json(
    await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag,
    }),
  ); // Returns a JSON response of the product list
}

/**
 * Create a new product
 * @param {object} req - Express request object, expected to contain product data in body
 * @param {object} res - Express response object
 */
async function createProduct(req, res) {
  console.log("request body:", req.body);
  res.json(req.body); // Placeholder response, replace with actual product creation logic
}

/**
 * Edit an existing product by ID
 * @param {object} req - Express request object, expected to contain product ID in params and updated data in body
 * @param {object} res - Express response object
 */
async function editProduct(req, res, next) {
  const { id } = req.params;
  const updatedData = req.body;
  console.log(`Product ${id}`, updatedData);
  res.status(200).json({ success: true, message: `${id} updated` }); // Success response after updating product
}

/**
 * Delete a product by ID
 * @param {object} req - Express request object, expected to contain product ID in params
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function for error handling
 */
async function deleteProduct(req, res, next) {
  const { id } = req.params;
  console.log(`Product ${id} deleted`);
  res.status(202).json({ success: true, message: `${id} deleted` }); // Success response after deleting product
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
});

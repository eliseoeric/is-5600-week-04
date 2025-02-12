const path = require("path");
const Products = require("./products");
const autoCatch = require("./lib/auto-catch");

/**
 * Handle requests to the root route ("/")
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
function handleRoot(req, res) {
  // Serve the index.html file when accessing the root route
  res.sendFile(path.join(__dirname, "/index.html"));
}

/**
 * Handle retrieving a product by its ID
 * @param {object} req - The request object (containing the product ID in params)
 * @param {object} res - The response object
 * @param {function} next - The next middleware function
 */
async function getProduct(req, res, next) {
  const { id } = req.params; // Extract the product ID from the request parameters

  // Fetch the product details using the Products service/model
  const product = await Products.get(id);
  if (!product) {
    return next();  // If no product found, pass control to the next middleware (e.g., 404 handler)
  }
  return res.json(product);  // Return the found product as JSON
}

/**
 * List all products with optional filters for pagination and tags
 * @param {object} req - The request object (containing query params for offset, limit, and tag)
 * @param {object} res - The response object
 */
async function listProducts(req, res) {
  // Extract query parameters for pagination and tag filtering
  const { offset = 0, limit = 25, tag } = req.query;

  // Fetch the list of products based on the provided query parameters
  res.json(
    await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag,
    }),
  );  // Return the filtered products as JSON
}

/**
 * Handle the creation of a new product
 * @param {object} req - The request object (containing the product data in the body)
 * @param {object} res - The response object
 */
async function createProduct(req, res) {
  console.log("Request body:", req.body);  // Log the incoming request body (product data)
  res.json(req.body);  // Respond with the product data (this would typically save it in a real app)
}

/**
 * Handle updating a product by its ID
 * @param {object} req - The request object (containing the product ID in params and updated data in body)
 * @param {object} res - The response object
 * @param {function} next - The next middleware function
 */
async function editProduct(req, res, next) {
  const { id } = req.params;  // Extract the product ID from request parameters
  const updatedData = req.body;  // Extract the updated product data from the request body
  console.log(`Product ${id} updated with data:`, updatedData);  // Log the update action
  res.status(200).json({ success: true, message: `Product ${id} updated` });  // Respond with a success message
}

/**
 * Handle deleting a product by its ID
 * @param {object} req - The request object (containing the product ID in params)
 * @param {object} res - The response object
 * @param {function} next - The next middleware function
 */
async function deleteProduct(req, res, next) {
  const { id } = req.params;  // Extract the product ID from request parameters
  console.log(`Product ${id} deleted`);  // Log the deletion action
  res.status(202).json({ success: true, message: `Product ${id} deleted` });  // Respond with a success message
}

// Export all route handlers wrapped with autoCatch for automatic error handling
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
});



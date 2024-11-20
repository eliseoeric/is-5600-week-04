const path = require("path");
const Products = require("./products");
const autoCatch = require("./lib/auto-catch");
/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
}

async function getProduct(req, res, next) {
  const { id } = req.params;
  const product = await Products.get(id);
  if (!product) {
    // next() is a callback that will pass the request to the next available route in the stack
    return next();
  }
  return res.json(product);
}
/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  res.json(
    await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag,
    }),
  );
}

async function createProduct(req, res) {
  console.log("request body:", req.body);
  res.json(req.body);
}

// async function editProduct(req, res, next) {
//   // console.log(req.body);
//   res.json(req.body);
// }

// async function deleteProduct(req, res, next) {
//   res.json({ success: true });
// }

async function deleteProduct(req, res) {
  const { id } = req.params;
  const result = await Products.deleteProduct(id);

  if (result.success) {
    res.status(202).json({ message: "Product successfully deleted" });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
}
async function editProduct(req, res) {
  const { id } = req.params;
  const newProductData = req.body;
  const result = await Products.updateProduct(id, newProductData);

  if (result.success) {
    res.status(200).json({ message: "Product successfully updated" });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
});

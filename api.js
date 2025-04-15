const path = require("path");
const Products = require("./products");
const autoCatch = require("./lib/auto-catch");

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
}

async function getProduct(req, res, next) {
  const { id } = req.params;
  const product = await Products.get(id);
  if (!product) return next();
  res.json(product);
}

async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  res.json(
    await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag,
    })
  );
}

async function createProduct(req, res) {
  const created = await Products.create(req.body);
  res.status(201).json(created);
}

async function updateProduct(req, res, next) {
  const { id } = req.params;
  const updatedData = await Products.updateProduct(id, req.body);
  if (!updatedData) return next();
  res.status(200).json({ success: true, message: `Product ${id} updated`, data: updatedData });
}

async function deleteProduct(req, res, next) {
  const { id } = req.params;
  const deleted = await Products.deleteProduct(id);
  if (!deleted) return next();
  res.status(202).json({ success: true, message: `Product ${id} deleted` });
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
});
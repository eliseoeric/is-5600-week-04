const path = require("path");
const Products = require("./products");
const autoCatch = require("./lib/auto-catch");

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
}

async function getProduct(req, res, next) {
  const { id } = req.params;
  const product = await Products.get(id);

  if (!product) {
    return res.status(404).send({ error: "Product not found" });
  }

  return res.json(product);
}

async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag,
  });

  res.json(products);
}

async function createProduct(req, res) {
  const productData = req.body;
  console.log("Creating product:", productData);
  res.status(201).json(productData); // Assuming the product is created successfully
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const productData = req.body;

  await Products.updateProduct(id, productData);
  console.log(`Product with ID ${id} updated with data:`, productData);
  res.status(200).send({ message: `Product with ID ${id} updated` });
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  await Products.deleteProduct(id);
  console.log(`Product with ID ${id} deleted`);
  res.status(202).send({ message: `Product with ID ${id} deleted` });
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
});

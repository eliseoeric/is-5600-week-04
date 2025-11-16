const path = require("path");
const Products = require("./products");
const autoCatch = require("./lib/auto-catch");

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
}

async function listProducts(reqest, response) {
  const { offset = 0, limit = 25, tag } = reqest.query;
  response.json(
    await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag,
    }),
  );
}

async function getProduct(reqest, response, next) {
  const params = reqest.params;
  const product = await Products.get(params.id);
  if (!product) {
    return next();
  }
  return response.json(product);
}

async function createProduct(reqest, response) {
  console.log("request body:", reqest.body);
  response.json(reqest.body);
}

async function deleteProduct(reqest, response) {
  console.log("request params", reqest.params);
  response
    .status(202)
    .json({ message: `${req.params} item deleted successfully` });
}
async function updateProduct(reqest, response) {
  console.log("request params", reqest.params);
  response
    .status(200)
    .json({ message: `${reqest.params} item updated successfully` });
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
});

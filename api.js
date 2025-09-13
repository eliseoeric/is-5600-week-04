const path = require("path");
const Products = require("./data/products");

function home(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
}

async function getAll(req, res, next) {
  try {
    const { limit = 4, offset = 0, tag } = req.query;
    const result = await Products.list({
      limit: Number(limit),
      offset: Number(offset),
      tag,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
}

async function getOne(req, res, next) {
  try {
    const product = await Products.find(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (e) {
    next(e);
  }
}

async function create(req, res) {
  res.status(201).json({
    status: "success",
    message: "New product created",
    product: req.body,
  });
}

async function update(req, res) {
  res.json({
    status: "success",
    message: `Product ${req.params.id} updated`,
    changes: req.body,
  });
}

async function remove(req, res) {
  res.status(202).json({
    status: "success",
    message: `Product ${req.params.id} deleted`,
  });
}

module.exports = { home, getAll, getOne, create, update, remove };

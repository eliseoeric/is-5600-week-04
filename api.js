"use strict";

const path = require("path");
const Products = require("./products");
const autoCatch = require("./lib/auto-catch");

function handleRoot(req, res) {
  // The supplied index.html is in the repository root.
  res.sendFile(path.join(__dirname, "index.html"));
}

async function listProducts(req, res) {
  const { offset = "0", limit = "25", tag } = req.query;
  const offsetNumber = Number(offset);
  const limitNumber = Number(limit);
  if (typeof offset !== "string" || typeof limit !== "string" ||
      !offset.trim() || !limit.trim() ||
      !Number.isSafeInteger(offsetNumber) || offsetNumber < 0 ||
      !Number.isSafeInteger(limitNumber) || limitNumber < 0 ||
      (tag !== undefined && typeof tag !== "string")) {
    return res.status(400).json({
      error: "limit and offset must be nonnegative integers; tag must be a single string.",
    });
  }

  // The supplied frontend expects an array, rather than a metadata object.
  res.json(await Products.list({ offset: offsetNumber, limit: limitNumber, tag }));
}

async function getProduct(req, res, next) {
  const product = await Products.get(req.params.id);
  if (!product) return next();
  res.json(product);
}

async function createProduct(req, res) {
  res.json(await Products.create(req.body || {}));
}

async function updateProduct(req, res) {
  res.status(200).json(await Products.update(req.params.id, req.body || {}));
}

async function deleteProduct(req, res) {
  res.status(202).json(await Products.remove(req.params.id));
}

// Forward rejected async handlers to the centralized error middleware.
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
});

"use strict";

const fs = require("fs").promises;
const path = require("path");
const productsFile = path.join(__dirname, "data/full-products.json");

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;
  const products = JSON.parse(await fs.readFile(productsFile, "utf8"));
  // Each tag in full-products.json is an object such as { title: "texture" }.
  // Filter first, so offset and limit refer to the matching products.
  const matchingProducts = tag
    ? products.filter((product) => product.tags.some((entry) => entry.title === tag))
    : products;
  return matchingProducts.slice(offset, offset + limit);
}

async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile, "utf8"));
  return products.find((product) => product.id === id) || null;
}

// Part 1 uses placeholder writes, as permitted by the lab README.
// They demonstrate routing/body parsing without changing the starter dataset.
async function create(data) {
  console.log("Create product request (placeholder):", data);
  return data;
}

async function update(id, data) {
  console.log(`Product ${id} updated (placeholder; dataset unchanged).`, data);
  return { ...data, id };
}

async function remove(id) {
  console.log(`Product ${id} deleted (placeholder; dataset unchanged).`);
  return { id, message: "Delete request accepted (placeholder)." };
}

module.exports = { list, get, create, update, remove };

const fs = require('fs')
const path = require('path')
const dataPath = path.join(__dirname, '../data/products.json')
let products = require('../data/products.json')

function saveProducts(updatedProducts) {
  fs.writeFileSync(dataPath, JSON.stringify(updatedProducts, null, 2))
}

function getAll({ limit, offset, tag }) {
  let result = [...products]
  if (tag) result = result.filter(p => p.tags.includes(tag))
  if (offset) result = result.slice(Number(offset))
  if (limit) result = result.slice(0, Number(limit))
  return result
}

function getById(id) {
  return products.find(p => p.id === id)
}

function createProduct(newProduct) {
  const id = Date.now().toString()
  const product = { id, ...newProduct }
  products.push(product)
  saveProducts(products)
  return product
}

function updateProduct(id, updatedFields) {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return null
  products[index] = { ...products[index], ...updatedFields }
  saveProducts(products)
  return products[index]
}

function deleteProduct(id) {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return false
  products.splice(index, 1)
  saveProducts(products)
  return true
}

module.exports = {
  getAll,
  getById,
  createProduct,
  updateProduct,
  deleteProduct
}

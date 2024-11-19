const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)
  
  if (tag) {
    products = products.filter(p => p.tags && p.tags.includes(tag))
  }
  
  return products.slice(offset, offset + limit)
}

async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }
  return null
}

async function delete_(id) {
  console.log(`Product ${id} would be deleted here`)
}

async function update(id, product) {
  console.log(`Product ${id} would be updated with:`, product)
}

module.exports = {
  list,
  get,
  delete: delete_, // since delete is occupied
  update
}
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

async function list({ offset = 0, limit = 25 }) {
  const data = await fs.readFile(productsFile)
  return JSON.parse(data).slice(offset, offset + limit)
}

async function get(id) {
  const data = JSON.parse(await fs.readFile(productsFile))
  return data.find(p => p.id === id) || null
}

async function remove(id) {
  console.log(`Product ${id} deleted`)
}

async function update(id, data) {
  console.log(`Product ${id} updated`, data)
}


module.exports = {
  
  list,
  get,
  remove,
  update
}

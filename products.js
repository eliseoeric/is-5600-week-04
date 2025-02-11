const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

async function list (options = {}) {
  const { offset = 0, limit = 25 } = options
  const data = await fs.readFile(productsFile)

  return JSON.parse(data).slice(offset, offset + limit)
  }
  async function get (id) {
    const products = JSON.parse(await fs.readFile(productsFile))
  
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        return products[i]
      }
    }
    return null;
  }
  
  module.exports = {
    list,
    get
  }
  
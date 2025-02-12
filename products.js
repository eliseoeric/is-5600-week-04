const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data);

  // Filter products by tag if provided
  if (tag) {
    products = products.filter(product => product.tags.find(i => i.title === tag));
  }
  return products.slice(offset, offset + limit)
}

async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))
  // for (let i = 0; i < products.length; i++) {
  //   if (products[i].id === id) {
  //     return products[i]
  //   }
  // }
  // return null;

  //Tried for extra points
  return products.find(product => product.id === id) || null;
}

module.exports = {
  list,
  get
}
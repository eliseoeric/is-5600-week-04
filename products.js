const fs = require('fs').promises
const { get } = require('express/lib/response');
const path = require('path')
const productsFile = path.join(__dirname, 'data/full-products.json')

/**
 * List all products
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
    const {offset = 0,limit = 25, tag} = options;
    const data = await fs.readFile(productsFile)
    return JSON.parse(data)
    .filter(product => {
        if(!tag){
            return product
        }
        return product.tags.find(({title}) => title == tag)
    })
    .slice(offset, offset + limit)
  }
  /**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
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
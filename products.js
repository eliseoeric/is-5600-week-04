const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

async function list (options = {}) {

    const { offset = 0, limit = 25, tag } = options;

    const data = await fs.readFile(productsFile)
  
    return JSON.parse(data)
    .filter(product => {
        if (!tag) {
            return product
        }

        return product.tags.find(( title ) => title == tag)
    }).slice(offset, offset + limit) // Slice the products
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

/**
 * Update a product by ID
 * @param {string} id
 * @param {object} updatedData
 * @returns {Promise<object|null>}
 */
async function update(id, updatedData) {
    const data = JSON.parse(await fs.readFile(productsFile));
  
    const index = data.findIndex(product => product.id === id);
    if (index === -1) return null;
  
    // Update product details
    data[index] = { ...data[index], ...updatedData };
  
    // Save back to file
    await fs.writeFile(productsFile, JSON.stringify(data, null, 2));
  
    return data[index];
  }

/**
 * Delete a product by ID
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function remove(id) {
    let data = JSON.parse(await fs.readFile(productsFile));
  
    const index = data.findIndex(product => product.id === id);
    if (index === -1) return false;
  
    // Remove product
    data.splice(index, 1);
  
    // Save back to file
    await fs.writeFile(productsFile, JSON.stringify(data, null, 2));
  
    return true;
  }

module.exports = {
    list,
    get,
    update,
    remove,
  }
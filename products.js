const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

async function list (options = {}) { 
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  return JSON.parse(data)
  .filter(product => {
    if (!tag) {
      return product 
     }
     return product.tags.find(({title}) => title == tag)
  }) 
  .slice(offset, offset + limit)
}

async function get (id) {
  const products = JSON.parse(await fs.readFile(productsFile))

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }

   // If no product is found, return null
  return null;
}

/**
 * Delete a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function deleteProduct (id) {
  // Per the lab, we just log a message and return a confirmation
  console.log(`Product with id ${id} was marked for deletion.`);

  // Return a simple confirmation object
  return { message: `Product ${id} deleted` };
}

/**
 * Update a single product
 * @param {string} id
 * @param {object} data - The new data for the product
 * @returns {Promise<object>}
 */
async function updateProduct (id, data) {
  // Per the lab, we just log a message
  console.log(`Product with id ${id} was "updated" with:`, data);

  // Return an object that combines the id and new data
  return { id, ...data };
}

 module.exports = { list,
  get,
  deleteProduct,
  updateProduct,
  
  
 }

 /**
 * Delete a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function deleteProduct (id) {
  // Per the lab, we just log a message and return a confirmation
  console.log(`Product with id ${id} was marked for deletion.`);

  // Return a simple confirmation object
  return { message: `Product ${id} deleted` };
}
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')


/**
 * List all products
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
    const { offset = 0, limit = 25, tag } = options;
    const data = await fs.readFile(productsFile)

    return JSON.parse(data)
    .filter(product => {
        if (!tag) {
            return product
        }
        return product.tags.find(( {title}) => title == tag)
    })
    .slice(offset, offset + limit) // Slice the products
}

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function get (id) {
    const products = JSON.parse(await fs.readFile(productsFile))

    // Loop through the products and return the product with the matching id
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        return products[i]
      }
    }

     // If no product is found, return null
    return null;
}

/**
 * Update a product
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object>}
 */
async function update(id, data) {
    const products = JSON.parse(await fs.readFile(productsFile));

    // Find the product to update
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex === -1) {
        throw new Error(`Product with id ${id} not found`);
    }

    // Update the product
    products[productIndex] = { ...products[productIndex], ...data };

    // Write the updated list back to the file
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));

    return products[productIndex];
}

/**
 * Delete a product
 * @param {string} id
 * @returns {Promise<void>}
 */
async function remove(id) {
    const products = JSON.parse(await fs.readFile(productsFile));

    // Filter out the product with the given id
    const updatedProducts = products.filter(product => product.id !== id);

    if (products.length === updatedProducts.length) {
        throw new Error(`Product with id ${id} not found`);
    }

    // Write the updated list back to the file
    await fs.writeFile(productsFile, JSON.stringify(updatedProducts, null, 2));
}



module.exports = {
    list,
    get,
    update,
    remove
}

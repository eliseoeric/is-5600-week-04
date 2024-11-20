const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  deleteProduct,
  update
}


/**
 * List all products
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
    const { offset = 0, limit = 25,tags } = options
    const data = await fs.readFile(productsFile);

 // Parse the product data
 const products = JSON.parse(data);

 // Filter products by tag if provided
 let filteredProducts;
 if (tags) {
   filteredProducts = products.filter((product) => product.tags && product.tags.includes(tags));
 } else {
   filteredProducts = products; // No filtering if no tag is provided
 }

 // Apply pagination (slice the products)
 const paginatedProducts = filteredProducts.slice(offset, offset + limit);

 return paginatedProducts;
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

async function deleteProduct (id) {
  console.log(`Deleted product with ID: ${id}`);
}

async function update (id, updatedData) {
  console.log(`Updated product with ID: ${id}`, updatedData);
}
    

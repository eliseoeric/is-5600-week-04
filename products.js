const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, '/data/full-products.json')

/**
 * List all products
 * @param {object} options - Options for filtering and pagination
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  
  try {
    const data = await fs.readFile(productsFile, 'utf8')
    let products = JSON.parse(data)
    
    // Filter by tag if provided
    if (tag) {
      products = products.filter(product => {
        if (product.tags && Array.isArray(product.tags)) {
          // Check if any tag object has a title matching the search tag
          return product.tags.some(tagObj => 
            tagObj.title && tagObj.title.toLowerCase() === tag.toLowerCase()
          )
        }
        return false
      })
    }
    
    // Apply pagination using slice
    return products.slice(offset, offset + limit)
  } catch (error) {
    console.error('Error reading products file:', error)
    console.error('Make sure the file exists at:', productsFile)
    // Return empty array if file doesn't exist or can't be read
    return []
  }
}

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function get (id) {
  try {
    const data = await fs.readFile(productsFile, 'utf8')
    const products = JSON.parse(data)

    // Loop through the products and return the product with the matching id
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        return products[i]
      }
    }

    // If no product is found, return null
    return null
  } catch (error) {
    console.error('Error reading products file:', error)
    return null
  }
}

/**
 * Delete a product (placeholder)
 * @param {string} id
 * @returns {Promise<void>}
 */
async function deleteProduct (id) {
  // In a real app, this would delete from database
  // For now, we just log it
  console.log(`Deleting product with id: ${id}`)
}

/**
 * Update a product (placeholder)
 * @param {string} id
 * @param {object} updates
 * @returns {Promise<object>}
 */
async function update (id, updates) {
  // In a real app, this would update in database
  // For now, we return the merged product
  const product = await get(id)
  
  if (!product) {
    return null
  }
  
  console.log(`Updating product ${id} with:`, updates)
  
  // Return merged product (original + updates)
  return { ...product, ...updates }
}

module.exports = {
  list,
  get,
  delete: deleteProduct,
  update
}
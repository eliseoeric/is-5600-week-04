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

        return product.tags.find((  {title}  ) => title == tag)
    })

    
    .slice(offset, offset + limit) // Slice the products
}

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

async function deleteProduct(id) {
  try {
      const data = await fs.readFile(productsFile);
      let products = JSON.parse(data);

      const newProducts = products.filter(product => product.id !== id);

      if (newProducts.length === products.length) {
          return { message: `Product with ID ${id} not found.` };
      }

      await fs.writeFile(productsFile, JSON.stringify(newProducts, null, 2));

      return { message: `Product with ID ${id} deleted.` };
  } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product.");
  }
}

async function putProduct(id, newProductData) {
  console.log(`Product with ID ${id} updated with data:`, newProductData);
  
  return { message: `Product with ID ${id} has been updated.` };
}

module.exports = {
  list,
  get,
  deleteProduct,
  putProduct,
};
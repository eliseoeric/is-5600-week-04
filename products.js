const fs = require("fs").promises;
const path = require("path");
const productsFile = path.join(__dirname, "data/full-products.json");

// Function to list products with optional filters like offset, limit, and tag
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;  // Destructure options with default values
  const data = await fs.readFile(productsFile);  // Read the products file asynchronously
  return JSON.parse(data)  // Parse the file content to JSON
    .filter((product) => {
      if (!tag) {
        return product;  // If no tag filter is provided, return all products
      }
      // Filter products that contain the specified tag
      return product.tags.find(({ title }) => title == tag);
    })
    .slice(offset, offset + limit); // Slice the result to apply pagination (offset and limit)
}

// Function to get a single product by its ID
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile)); // Read and parse the products file
  // Loop through products and return the one that matches the provided ID
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i];  // Return the product if the ID matches
    }
  }
  // If no product with the matching ID is found, return null
  return null;
}

// Function to update a product (currently a placeholder)
async function update(id, data) {
  console.log(`Product ${id} would be updated with:`, data);  // Log the update action (currently just logs)
  return true;  // Placeholder response indicating the update would be successful
}

// Function to delete a product (currently a placeholder)
async function deleteProduct(id) {
  console.log(`Product ${id} would be deleted`);  // Log the deletion action (currently just logs)
  return true;  // Placeholder response indicating the deletion would be successful
}

module.exports = {
  list,
  get,
  update,
  deleteProduct,  // Export the delete function
};

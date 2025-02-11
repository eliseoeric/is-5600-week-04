const fs = require("fs").promises;
const path = require("path");

// Path to the JSON file that contains product data
const productsFile = path.join(__dirname, "data/full-products.json");

async function list(options = {}) {
  // Destructure options with default values for offset, limit, and tag
  const { offset = 0, limit = 25, tag } = options;

  // Read the JSON file containing all product data
  const data = await fs.readFile(productsFile);

  // Parse the data and filter products based on the tag (if provided)
  return (
    JSON.parse(data)
      .filter((product) => {
        // If no tag is provided, return all products
        if (!tag) {
          return product;
        }
        // Otherwise, return products that match the tag
        return product.tags.find(({ title }) => title == tag);
      })
      // Apply pagination by slicing the filtered product list
      .slice(offset, offset + limit)
  );
}

async function get(id) {
  // Read and parse the product data
  const products = JSON.parse(await fs.readFile(productsFile));

  // Loop through the products to find the one with the matching id
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]; // Return the product if the id matches
    }
  }

  // If no product with the given id is found, return null
  return null;
}

async function deleteProduct(id) {
  // Log the product id to simulate deleting the product
  console.log(`Product ${id} deleted`);
  return true;
}

async function update(id, data) {
  // Log the product id and data to simulate updating the product
  console.log(`Product - ${id}, data-`, data);
  return true;
}

module.exports = {
  list, // Export the function to list products with pagination and filtering
  get, // Export the function to get a product by its id
  update, // Export the function to update a product by its id
  deleteProduct, // Export the function to delete a product by its id
};

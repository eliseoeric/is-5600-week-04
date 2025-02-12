const express = require("express");
const api = require("./api");
const middleware = require("./middleware");
const bodyParser = require("body-parser");

// Set the port, either from the environment or default to 3000
const port = process.env.PORT || 3000;

// Initialize the express app
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(__dirname + "/public"));

// Enable CORS middleware for cross-origin requests
app.use(middleware.cors);

// Parse incoming JSON request bodies
app.use(bodyParser.json());

// Register API routes
/**
 * Route to list all products with optional filters
 * @route GET /products
 * @param {object} req - The request object containing query parameters
 * @param {object} res - The response object used to send the list of products
 */
app.get('/products', api.listProducts);

/**
 * Route to get a single product by ID
 * @route GET /products/:id
 * @param {string} id - The ID of the product to retrieve
 * @param {object} req - The request object
 * @param {object} res - The response object containing the product data
 */
app.get("/products/:id", api.getProduct);

/**
 * Route to create a new product
 * @route POST /products
 * @param {object} req - The request object containing the product data in the body
 * @param {object} res - The response object to send the created product data
 */
app.post("/products", api.createProduct);

/**
 * Route to delete a product by ID
 * @route DELETE /products/:id
 * @param {string} id - The ID of the product to delete
 * @param {object} req - The request object
 * @param {object} res - The response object confirming the deletion
 */
app.delete("/products/:id", api.deleteProduct);

/**
 * Route to update a product by ID
 * @route PUT /products/:id
 * @param {string} id - The ID of the product to update
 * @param {object} req - The request object containing updated product data in the body
 * @param {object} res - The response object confirming the update
 */
app.put("/products/:id", api.editProduct);

// Route to handle requests to the root URL ("/")
app.get("/", api.handleRoot);

// Register middleware for error handling and 404 Not Found
app.use(middleware.handleError);  // Handle errors that occur during route handling
app.use(middleware.notFound);  // Handle requests to non-existent routes

// Start the server on the specified port
app.listen(port, () => console.log(`Server listening on port ${port}`));

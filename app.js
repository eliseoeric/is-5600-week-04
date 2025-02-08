const express = require("express");
const api = require("./api");
const middleware = require("./middleware");
const bodyParser = require("body-parser");

// Set the port, default to 3000 if environment variable is not set
const port = process.env.PORT || 3000;

// Initialize the Express app
const app = express();

// Serve static files from the "public" directory
app.use(express.static(__dirname + "/public"));

// Enable CORS (Cross-Origin Resource Sharing) using custom middleware
app.use(middleware.cors);

// Parse incoming request bodies in JSON format
app.use(bodyParser.json());

// Register the routes for products resource

// Route to list all products (supports pagination and filtering)
app.get("/products", api.listProducts);

// Route to get a specific product by its ID
app.get("/products/:id", api.getProduct);

// Route to create a new product
app.post("/products", api.createProduct);

// Route to delete a product by its ID
app.delete("/products/:id", api.deleteProduct);

// Route to update a product by its ID
app.put("/products/:id", api.editProduct);

// Route to serve the root HTML page
app.get("/", api.handleRoot);

// Error handling middleware for handling specific errors
app.use(middleware.handleError);

// Middleware to handle 404 Not Found errors
app.use(middleware.notFound);

// Start the server and listen on the specified port
app.listen(port, () => console.log(`Server listening on port ${port}`));

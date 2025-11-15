// app.js
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const api = require("./api");
const middleware = require("./middleware");

// Set the port
const port = process.env.PORT || 3000;

// Boot the app
const app = express();

// Serve static files
app.use(express.static(__dirname + "/public"));

// Parse JSON bodies
app.use(bodyParser.json());

// Global CORS middleware
app.use(middleware.cors);

// ROUTES
app.get("/", api.handleRoot);
app.get("/products", api.listProducts);
app.get("/products/:id", api.getProduct);
app.post("/products", api.createProduct);

// REQUIRED FOR LAB
app.put("/products/:id", api.updateProduct);
app.delete("/products/:id", api.deleteProduct);
// app.get("/test", (req, res) => {
//   res.json({ message: "test route works" });
// });


// 404 Handler
app.use(middleware.notFound);

// Error Handler
app.use(middleware.handleError);

// Start server
app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
);

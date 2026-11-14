"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const api = require("./api");
const middleware = require("./middleware");

const port = process.env.PORT || 3000;
const app = express();

// Middleware runs in registration order, before the route handlers.
app.use(middleware.cors);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", api.handleRoot);
app.get("/products", api.listProducts);
app.get("/products/:id", api.getProduct);
app.post("/products", api.createProduct);
app.put("/products/:id", api.updateProduct);
app.delete("/products/:id", api.deleteProduct);

// Missing routes and errors are handled after all normal routes.
app.use(middleware.notFound);
app.use(middleware.handleError);

if (require.main === module) {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

module.exports = app;

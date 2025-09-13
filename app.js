const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const api = require("./api");
const middleware = require("./middleware");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(middleware.cors);
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", api.home);
app.get("/products", api.getAll);
app.get("/products/:id", api.getOne);
app.post("/products", api.create);
app.put("/products/:id", api.update);
app.delete("/products/:id", api.remove);

// Error middleware
app.use(middleware.notFound);
app.use(middleware.errorHandler);

// Boot server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

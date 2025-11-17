$const express = require("express");
const app = express();

const productsRouter = require("./routes/products");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use(logger);

// ROUTES
app.use("/products", productsRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

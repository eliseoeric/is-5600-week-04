const express = require("express");
const productsRouter = require("./routes/products");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());
app.use(logger);

app.use("/products", productsRouter);

app.use(errorHandler);

app.listen(3000, () => console.log("Server running on port 3000"));

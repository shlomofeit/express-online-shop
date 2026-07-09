import express from "express";
import fs from "fs/promises";
import cartRouter from "./routes/cart.js";
import customersRouter from "./routes/customers.js";
import ordersRouter from "./routes/orders.js";
import productsRouter from "./routes/products.js";
import env from "dotenv";

env.config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

app.use("/cart", cartRouter);

app.use("/account", customersRouter);

app.use("/orders", ordersRouter);

app.use("", productsRouter);

app.get("", (req, res) => {
  res.end("Hi, this is the Express Online Shop API service.");
});

app.get("/helth", async (req, res) => {
  try {
    const dataFilesExists = await fs.access("./data/customers.json");

    res.json({ status: "ok" });
  } catch (error) {
    console.error("DB error: ", error.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.listen(PORT, () => {
  console.log("Express Shop Online is listening on port 3000...");
});

export default app;

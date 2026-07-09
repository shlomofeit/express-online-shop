import express from "express";
import { readDataFile, writeToFile } from "../data/data.js";

const PRODUCTS = "./data/products.json";
const CUSTOMERS = "./data/customers.json";
const router = express.Router();

router.get("", async (req, res) => {
  try {
    const { inStock = "all", maxPrice = "all", search = "all" } = req.query;

    let productsData = await readDataFile(PRODUCTS);

    if (inStock === "true") {
      productsData = productsData.filter((product) => product.stock > 0);
    }
    if (maxPrice !== "all") {
      const maxPriceNum = Number(maxPrice);
      productsData = productsData.filter(
        (product) => product.price <= maxPriceNum,
      );
    }
    if (search !== "all") {
      const upperSearch = search.toUpperCase();
      productsData = productsData.filter((product) =>
        product.name.toUpperCase().includes(upperSearch),
      );
    }

    res.json(productsData);
  } catch (error) {
    throw error;
  }
});

export default router;

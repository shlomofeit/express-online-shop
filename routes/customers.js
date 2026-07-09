import express from "express";
import { readDataFile, writeToFile } from "../data/data.js";

const PRODUCTS = "./data/products.json";
const CUSTOMERS = "./data/customers.json";
const router = express.Router();

router.get("/balance", async (req, res) => {
  try {
    const { customerId } = req.query;
    const data = await readDataFile(CUSTOMERS);
    const customerById = data.find(
      (customer) => customer.customerId === customerId,
    );

    if (!customerById) {
      return res.status(400).end("not found");
    }
    return res.send(customerById.balance);
  } catch (error) {
    throw error;
  }
});

export default router;

import express from "express";
import { readDataFile, writeToFile } from "../data/data.js";

const PRODUCTS = "./data/products.json";
const CUSTOMERS = "./data/customers.json";
const router = express.Router();

router.get("", async (req, res) => {
  try {
    const { customerId } = req.query;
    const data = await readDataFile(CUSTOMERS);
    const customerById = data.find(
      (customer) => customer.customerId === customerId,
    );

    if (!customerById) {
      return res.status(400).end("not found");
    }
    return res.send(customerById.cart);
  } catch (error) {
    throw error;
  }
});

router.post("/items", async (req, res) => {
  try {
    const data = await readDataFile(CUSTOMERS);
    const { customerId, productId, quantity } = req.body;
    const customerById = data.find(
      (customer) => customer.customerId === customerId,
    );

    if (!customerById) {
      return res.status(400).end("not found");
    }

    const productList = await readDataFile(PRODUCTS);

    if (!customerId || !productId || !quantity) {
      return res.status(400).json({ message: "invalid request" });
    }
    if (quantity <= 0) {
      return res.status(400).json({ message: "quantity must be more than 0" });
    }
    const product = productList.find((item) => item.id === productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock <= 0 || product.stock - quantity < 0) {
      return res
        .status(400)
        .json({ message: "Out of stock or quantity too big" });
    }

    customerById.cart.push({
      id: product.id,
      name: product.name,
      quantity: quantity,
    });
    await writeToFile(CUSTOMERS, data);
    return res.json({ message: "seccess" });
  } catch (error) {
    throw error;
  }
});

router.delete("/items/:productId", async (req, res) => {
  try {
    const productId = +req.params.productId;
    const { customerId } = req.body;
    const productList = await readDataFile(PRODUCTS);
    const data = await readDataFile(CUSTOMERS);
    const customerById = data.find(
      (customer) => customer.customerId === customerId,
    );

    if (!customerById) {
      return res.status(400).end("not found");
    }

    const cartItem = customerById.cart.find((item) => item.id === productId);
    if (!cartItem) {
      res.status(404).json({ message: "Product not found" });
    }

    customerById.cart = customerById.cart.filter(
      (item) => item.id !== productId,
    );
    await writeToFile(CUSTOMERS, data);
    return res.json({ message: "seccess" });
  } catch (error) {
    throw error;
  }
});

export default router;

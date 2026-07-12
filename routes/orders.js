import express from "express";
import { readDataFile, writeToFile } from "../data/data.js";

const PRODUCTS = "./data/products.json";
const CUSTOMERS = "./data/customers.json";
const ORDER = "./data/order.json";
const router = express.Router();

router.get("", async (req, res) => {
  try {
    const { customerId } = req.query;
    if (!customerId) {
      return res
        .status(400)
        .json({ success: false, message: "customerId is missing" });
    }

    const customers = await readDataFile(CUSTOMERS);
    const data = await readDataFile(ORDER);

    let customerById = customers.find(
      (customer) => customer.customerId === customerId,
    );

    if (!customerById) {
      customerById = {
        customerId: customerId,
        balance: process.env.STARTING_BALANCE,
        cart: [],
        createdAt: new Date().toISOString(),
      };

      customers.push(customerById);
    }
    await writeToFile(CUSTOMERS, customers);

    const customerOrders = data.filter(
      (order) => order.customerId === customerId,
    );
    console.log(data);

    return res.json(customerOrders);
  } catch (error) {
    throw error;
  }
});

router.post("/checkout", async (req, res) => {
  try {
    let data = await readDataFile(CUSTOMERS);
    const { customerId } = req.body;
    const customerById = data.find(
      (customer) => customer.customerId === customerId,
    );

    if (!customerById) {
      customerById = {
        customerId: customerId,
        balance: process.env.STARTING_BALANCE,
        cart: [],
        createdAt: new Date().toISOString(),
      };

      data.push(customerById);
    }

    const cartList = customerById.cart;

    if (cartList.length === 0) {
      return res.status(400).json({ success: false, message: "cart is emty" });
    }

    const productList = await readDataFile(PRODUCTS);

    for (const item of cartList) {
      const thisItem = productList.find(
        (itemId) => itemId.id === item.productId,
      );
      if (thisItem.stock - item.quantity < 0) {
        return res.status(400).json({
          success: false,
          message: `${thisItem.id} - ${thisItem.name} out of stock`,
        });
      }
    }

    const total = cartList.reduce((sum, item) => {
      const itemPrice = productList.find(
        (productById) => productById.id === item.productId,
      );
      const itemTotal = itemPrice ? itemPrice.price * item.quantity : 0;
      return sum + itemTotal;
    }, 0);
    if (customerById.balance < total) {
      return res.status(400).json({
        success: false,
        message: "There is not enough balance in the account",
      });
    }

    const orders = await readDataFile(ORDER);

    const finalOrder = {
      id: orders.length > 0 ? orders[orders.length - 1].id + 1 : 1,
      customerId: customerId,
      items: cartList,
      total: total,
      createdAt: new Date().toISOString(),
    };

    for (const item of cartList) {
      const productToUpdate = productList.find(
        (product) => product.id === item.productId,
      );
      productToUpdate.stock -= item.quantity;
    }

    orders.push(finalOrder);
    customerById.balance -= total;
    customerById.cart = [];

    await writeToFile(ORDER, orders);
    await writeToFile(CUSTOMERS, data);
    await writeToFile(PRODUCTS, productList);

    return res.json({
      success: true,
      message: "order created successfully",
      data: finalOrder,
    });
  } catch (error) {
    throw error;
  }
});

export default router;

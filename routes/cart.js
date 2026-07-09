import express from "express";

const router = express.Router();

router.get("", (req, res) => {
  res.send();
});

router.post("/items", (req, res) => {
  res.send();
});

router.delete("/items/:productId", (req, res) => {
  res.send();
});

export default router;

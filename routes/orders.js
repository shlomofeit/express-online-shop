import express from "express";

const router = express.Router();

router.get("", (req, res) => {
  res.send();
});

router.post("/checkout", (req, res) => {
  res.send();
});

export default router;

import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Create order
router.post("/", protect, async (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body;
  const order = await Order.create({ user: req.user._id, items, totalAmount, shippingAddress });
  res.status(201).json(order);
});

// Get user orders
router.get("/", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// Get single order
router.get("/:id", protect, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  if (order.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Forbidden" });
  res.json(order);
});

// Update status
router.patch("/:id/status", protect, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  order.status = req.body.status || order.status;
  await order.save();
  res.json(order);
});

// Cancel order
router.patch("/:id/cancel", protect, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  order.status = "cancelled";
  await order.save();
  res.json(order);
});

export default router;

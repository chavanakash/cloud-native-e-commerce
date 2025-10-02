import express from "express";
import Product from "../models/Product.js";
import { protect, requireSeller } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Get single product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
});

// Seller products
router.get("/seller/my-products", protect, requireSeller, async (req, res) => {
  const products = await Product.find({ seller: req.user._id });
  res.json(products);
});

// Create product
router.post("/", protect, requireSeller, upload.single("image"), async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
    seller: req.user._id,
  });
  res.status(201).json(product);
});

// Update product
router.put("/:id", protect, requireSeller, upload.single("image"), async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  if (product.seller.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Forbidden" });

  Object.assign(product, req.body);
  if (req.file) product.imageUrl = `/uploads/${req.file.filename}`;
  await product.save();
  res.json(product);
});

// Delete product
router.delete("/:id", protect, requireSeller, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  if (product.seller.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Forbidden" });

  await product.deleteOne();
  res.json({ message: "Deleted" });
});

export default router;

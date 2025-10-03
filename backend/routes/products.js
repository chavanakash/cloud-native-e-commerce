const express = require('express');
const Product = require('../models/Product');
const { authMiddleware, sellerMiddleware } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// Get all products (public route)
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    const products = await Product.find(query)
      .populate('sellerId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products',
      message: error.message 
    });
  }
});

// Get single product (public route)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'name email');
    
    if (!product) {
      return res.status(404).json({ 
        error: 'Product not found',
        message: 'The requested product does not exist' 
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      error: 'Failed to fetch product',
      message: error.message 
    });
  }
});

// Create product (seller only)
router.post('/', authMiddleware, sellerMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    
    // Validate required fields
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide all required product information'
      });
    }
    
    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      image: req.file ? `/uploads/${req.file.filename}` : null,
      sellerId: req.user.id
    });
    
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      error: 'Failed to create product',
      message: error.message 
    });
  }
});

// Update product (seller only - own products)
router.put('/:id', authMiddleware, sellerMiddleware, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      sellerId: req.user.id 
    });
    
    if (!product) {
      return res.status(404).json({ 
        error: 'Product not found',
        message: 'Product not found or you do not have permission to edit it' 
      });
    }
    
    const { name, description, price, category, stock } = req.body;
    
    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (stock !== undefined) product.stock = parseInt(stock);
    if (req.file) product.image = `/uploads/${req.file.filename}`;
    
    await product.save();
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      error: 'Failed to update product',
      message: error.message 
    });
  }
});

// Delete product (seller only - own products)
router.delete('/:id', authMiddleware, sellerMiddleware, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ 
      _id: req.params.id, 
      sellerId: req.user.id 
    });
    
    if (!product) {
      return res.status(404).json({ 
        error: 'Product not found',
        message: 'Product not found or you do not have permission to delete it' 
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      error: 'Failed to delete product',
      message: error.message 
    });
  }
});

// Get seller's products
router.get('/seller/my-products', authMiddleware, sellerMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products',
      message: error.message 
    });
  }
});

module.exports = router;
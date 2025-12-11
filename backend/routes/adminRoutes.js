const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Contact = require('../models/Contact');
const Order = require('../models/Order');
const orderController = require('../controllers/orderController');

// Middleware to check if user is admin (you can extend this)
const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET all users
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// GET single user details
router.get('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// UPDATE user role
router.put('/users/:id/role', auth, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// DELETE user
router.delete('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// GET all products (admin)
router.get('/products', auth, adminOnly, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// CREATE new product
router.post('/products', auth, adminOnly, async (req, res) => {
  try {
    const { name, description, price, mrp, image, category, sizes, colors, stock, limitedDrop, dropEndDate } = req.body;

    const product = new Product({
      name,
      description,
      price,
      mrp: mrp || price * 1.2,
      image,
      images: [image],
      category,
      sizes: sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: colors || ['Black', 'White', 'Navy'],
      stock: stock || 100,
      limitedDrop: limitedDrop || false,
      dropEndDate: dropEndDate || null,
      rating: 0,
      reviews: []
    });
    
    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// UPDATE product
router.put('/products/:id', auth, adminOnly, async (req, res) => {
  try {
    const { name, description, price, mrp, image, category, sizes, colors, stock, limitedDrop, dropEndDate } = req.body;

    const update = { name, description, price, image, category, sizes, colors, stock };
    if (typeof mrp !== 'undefined') update.mrp = mrp;
    if (typeof limitedDrop !== 'undefined') update.limitedDrop = limitedDrop;
    if (typeof dropEndDate !== 'undefined') update.dropEndDate = dropEndDate;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// DELETE product
router.delete('/products/:id', auth, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// GET dashboard stats
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    res.json({
      totalUsers,
      totalProducts,
      adminUsers,
      regularUsers: totalUsers - adminUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// GET contact submissions (admin)
router.get('/contacts', auth, adminOnly, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
});

// DELETE contact submission (admin)
router.delete('/contacts/:id', auth, adminOnly, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
});

// GET all orders (admin)
router.get('/orders', auth, adminOnly, orderController.getAllOrders);

// UPDATE order status (admin)
router.put('/orders/:id/status', auth, adminOnly, orderController.updateOrderStatus);

// DELETE order (admin)
router.delete('/orders/:id', auth, adminOnly, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
});

// GET all reviews (admin)
const productController = require('../controllers/productController');
router.get('/reviews', auth, adminOnly, productController.getAllReviews);

// DELETE a review (admin)
router.delete('/reviews/:reviewId', auth, adminOnly, productController.deleteReview);

// Admin carousel management
const carouselController = require('../controllers/carouselController');
router.get('/carousel', auth, adminOnly, carouselController.getAll);
router.post('/carousel', auth, adminOnly, carouselController.create);
router.put('/carousel/:id', auth, adminOnly, carouselController.update);
router.delete('/carousel/:id', auth, adminOnly, carouselController.remove);

module.exports = router;


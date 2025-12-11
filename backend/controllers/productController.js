const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');

// Auto-cleanup expired limited drops
const cleanupExpiredLimitedDrops = async () => {
  try {
    const now = new Date();
    await Product.updateMany(
      { limitedDrop: true, dropEndDate: { $lt: now } },
      { limitedDrop: false, dropEndDate: null }
    );
  } catch (error) {
    console.error('Error cleaning up expired limited drops:', error);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    // Cleanup expired limited drops before fetching
    await cleanupExpiredLimitedDrops();
    
    const { category, minPrice, maxPrice, sortBy, page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    let sortOptions = {};
    if (sortBy === 'price-low') {
      sortOptions.price = 1;
    } else if (sortBy === 'price-high') {
      sortOptions.price = -1;
    } else if (sortBy === 'newest') {
      sortOptions.createdAt = -1;
    }

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    // Cleanup expired limited drops
    await cleanupExpiredLimitedDrops();
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Fetch reviews from Review collection
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Format reviews for frontend compatibility
    const formattedReviews = reviews.map((r) => ({
      _id: r._id,
      user: r.user,
      name: r.name,
      email: r.email,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    }));

    res.json({
      ...product.toObject(),
      reviews: formattedReviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: id },
      category: product.category,
    }).limit(4);

    res.json(relatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a review for a product
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!req.userId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    const user = await User.findById(req.userId).select('-password');
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.userId,
    });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Create new review in Review collection
    const review = new Review({
      product: productId,
      user: req.userId,
      name: user ? user.name : 'Anonymous',
      email: user ? user.email : 'anonymous@example.com',
      rating: Number(rating),
      comment: comment && comment.trim() ? comment.trim() : 'No comment provided',
    });

    await review.save();

    // Get all reviews for this product and update product rating
    const allReviews = await Review.find({ product: productId });
    const avgRating = (
      allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length
    ).toFixed(1);

    product.rating = avgRating;
    product.numReviews = allReviews.length;
    await product.save();

    res.status(201).json({ 
      message: 'Review added successfully', 
      review: review,
      product: product 
    });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Admin: get all reviews across products
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: delete a review from a product
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update product rating and review count
    const allReviews = await Review.find({ product: review.product });
    const product = await Product.findById(review.product);
    
    if (product) {
      product.numReviews = allReviews.length;
      product.rating = allReviews.length
        ? (allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length).toFixed(1)
        : 0;
      await product.save();
    }

    res.json({ message: 'Review deleted successfully', reviewId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

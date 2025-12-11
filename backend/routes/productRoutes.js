const express = require('express');
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

const router = express.Router();
const carouselController = require('../controllers/carouselController');

// Public carousel endpoint (must be before '/:id')
router.get('/carousel', carouselController.getPublicCarousel);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/:id/related', productController.getRelatedProducts);
router.post('/', productController.createProduct);
// Create a review for a product (requires auth)
router.post('/:id/reviews', auth, productController.createReview);

module.exports = router;

const express = require('express');
const newsletterController = require('../controllers/newsletterController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// Public route - no auth required
router.post('/subscribe', newsletterController.subscribe);

// Admin only routes
router.get('/', authMiddleware, adminMiddleware, newsletterController.getAllSubscriptions);
router.post('/send', authMiddleware, adminMiddleware, newsletterController.sendNewsletter);
router.delete('/:id', authMiddleware, adminMiddleware, newsletterController.deleteSubscription);

module.exports = router;
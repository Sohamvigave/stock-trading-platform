const router = require('express').Router();
const { getCurrentUser, signup, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected route
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
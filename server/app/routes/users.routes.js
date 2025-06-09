const express = require('express');
const userController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/auth'); // Add authentication middleware

const router = express.Router();

// Get user by id
router.get('/:id', userController.getUser);

// Create a new user (register)
router.post('/register', userController.createUser);

// Login user
router.post('/login', userController.loginUser);

// Refresh access token
router.post('/refresh', userController.refreshToken);

// Logout user - requires valid access token
router.post('/logout', authMiddleware.validateToken, userController.logoutUser);

module.exports = router;
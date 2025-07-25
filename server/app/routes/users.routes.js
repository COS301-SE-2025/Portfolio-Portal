const multer = require('multer');
const memoryStorage = multer.memoryStorage();
const express = require('express');
const userController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Authentication routes
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/refresh', userController.refreshToken);
router.post('/logout', authMiddleware.validateToken, userController.logoutUser);

// Profile routes
router.get('/:id', userController.getUser);
router.put('/:id/profile', authMiddleware.validateToken, userController.updateProfile);

module.exports = router;
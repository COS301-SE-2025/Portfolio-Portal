// routes/users.routes.js
const express = require('express');
const multer = require('multer');
const userController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/auth');
const errorHandler = require('../middleware/errorHandler'); // Import the centralized error handler

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      // Pass error to Multer, which will then be caught by our errorHandler
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Public routes (no authentication required)
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/refresh', userController.refreshToken);

// Public profile routes
router.get('/search', userController.searchUsers);
router.get('/skills', userController.getUsersBySkills);
router.get('/profile/:identifier', userController.getPublicProfile);

// Protected routes (authentication required)
router.use(authMiddleware.validateToken); // All routes below require authentication

// Current user routes
router.get('/me', userController.getCurrentUser);
router.put('/me/profile', userController.updateProfile);
router.get('/me/stats', userController.getProfileStats);
router.get('/me/profile-picture', userController.getProfilePicture);

// Profile picture management
router.post(
  '/me/profile-picture',
  upload.single('profilePicture'), // Field name must match
  userController.uploadProfilePicture
);
router.delete('/me/profile-picture', userController.deleteProfilePicture);

// Logout (requires authentication)
router.post('/logout', userController.logoutUser);

// Admin or specific user routes (with ID parameter)
router.get('/:id', userController.getUser);

// IMPORTANT: This error handling middleware must be placed LAST,
// after all other routes and middleware.
router.use(errorHandler);

module.exports = router;
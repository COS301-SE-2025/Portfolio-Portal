// controllers/users.controller.js
const userService = require('../services/users.service');

// Get user profile by ID
const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { auth_id, ...publicProfile } = user;
    res.json(publicProfile);
  } catch (error) {
    next(error); // Pass error to centralized error handler
  }
};

// Get current user's full profile (including private info)
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Create new user (register)
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, professional } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const user = await userService.createUser({
      email,
      name,
      password,
      professional: professional !== undefined ? professional : true // Default to true if not provided
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// Login user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await userService.loginUser(email, password);
    if (!result) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Refresh access token
const refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const result = await userService.refreshToken(refresh_token);
    if (!result) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Logout user
const logoutUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(400).json({ error: 'Authorization token required' });
    }

    await userService.logoutUser(token);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // From auth middleware
    const updateData = req.body;

    // Ensure user can only update their own profile
    // This check can also be in a middleware or service for robustness
    if (req.params.id && req.params.id !== userId) {
      return res.status(403).json({ error: 'Cannot update another user\'s profile' });
    }

    const updatedProfile = await userService.updateUserProfile(userId, updateData);
    res.status(200).json(updatedProfile);
  } catch (error) {
    next(error);
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res, next) => {
  try {
    // Auth middleware ensures req.user.id exists
    const userId = req.user.id;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!req.file) {
      throw new Error('No file provided');
    }
    if (!token) {
      throw new Error('Authorization token required');
    }

    const profilePictureUrl = await userService.uploadProfilePicture(
      userId,
      req.file,
      token
    );

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      profile_picture_url: profilePictureUrl
    });
  } catch (error) {
    next(error);
  }
};

// Delete profile picture
const deleteProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await userService.deleteProfilePicture(userId);
    res.status(200).json({ message: 'Profile picture deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Search users
const searchUsers = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const users = await userService.searchUsers(q, parseInt(page), parseInt(limit));
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: users.length // Note: This total is for the current page, not overall.
                          // For overall total, you'd need a separate count query in service.
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get users by skills
const getUsersBySkills = async (req, res, next) => {
  try {
    const { skills, limit = 10 } = req.query;

    if (!skills) {
      return res.status(400).json({ error: 'Skills parameter is required' });
    }

    // Parse skills (assuming comma-separated string)
    const skillsArray = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills;

    const users = await userService.getUsersBySkills(skillsArray, parseInt(limit));
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Get profile completion stats
const getProfileStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const stats = await userService.getProfileStats(userId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

const getProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const signedUrl = await userService.getProfilePicture(userId);

    if (!signedUrl) {
      return res.status(404).json({ error: 'Profile picture not found' });
    }

    res.json({ profile_picture_url: signedUrl });
  } catch (error) {
    next(error);
  }
};

// Get public profile by username/email (for profile pages)
const getPublicProfile = async (req, res, next) => {
  try {
    const { identifier } = req.params; // Could be user ID, email, or username

    const user = await userService.getPublicProfile(identifier); // Call new service method

    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Service method should return only public info
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUser,
  getCurrentUser,
  createUser,
  loginUser,
  refreshToken,
  logoutUser,
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  searchUsers,
  getUsersBySkills,
  getProfileStats,
  getPublicProfile,
  getProfilePicture
};
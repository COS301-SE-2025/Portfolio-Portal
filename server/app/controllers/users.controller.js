// controllers/users.controller.js
const userService = require('../services/users.service');

// Centralized error response handler
const handleError = (res, error, defaultMessage = 'Internal server error') => {
  console.error(error);
  
  // Handle specific error types
  if (error.message.includes('already registered') || error.message.includes('User already registered')) {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  if (error.message.includes('Invalid email')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (error.message.includes('User not found')) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: error.message });
  }

  if (error.message.includes('File size too large')) {
    return res.status(413).json({ error: error.message });
  }

  if (error.message.includes('Search query must be')) {
    return res.status(400).json({ error: error.message });
  }
  
  res.status(500).json({ error: defaultMessage });
};

// Get user profile by ID
const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Remove sensitive information
    const { auth_id, ...publicProfile } = user;
    res.json(publicProfile);
  } catch (error) {
    handleError(res, error, 'Failed to get user');
  }
};

// Get current user's full profile (including private info)
const getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    handleError(res, error, 'Failed to get current user');
  }
};

// Create new user (register)
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await userService.createUser({ 
      email, 
      name, 
      password
    });
    res.status(201).json(user);
  } catch (error) {
    handleError(res, error, 'Failed to create user');
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const result = await userService.loginUser(email, password);
    if (!result) return res.status(401).json({ error: 'Invalid credentials' });
    
    res.json(result);
  } catch (error) {
    handleError(res, error, 'Login failed');
  }
};

// Refresh access token
const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) return res.status(400).json({ error: 'Refresh token required' });
    
    const result = await userService.refreshToken(refresh_token);
    if (!result) return res.status(401).json({ error: 'Invalid refresh token' });
    
    res.json(result);
  } catch (error) {
    handleError(res, error, 'Token refresh failed');
  }
};

// Logout user
const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(400).json({ error: 'Authorization token required' });
    
    await userService.logoutUser(token);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    handleError(res, error, 'Logout failed');
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const updateData = req.body;
    
    // Ensure user can only update their own profile
    if (req.params.id && req.params.id !== userId) {
      return res.status(403).json({ error: 'Cannot update another user\'s profile' });
    }
    
    const updatedProfile = await userService.updateUserProfile(userId, updateData);
    res.status(200).json(updatedProfile);
  } catch (error) {
    handleError(res, error, 'Failed to update profile');
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const profilePictureUrl = await userService.uploadProfilePicture(userId, file);
    res.status(200).json({ 
      message: 'Profile picture uploaded successfully',
      profile_picture_url: profilePictureUrl 
    });
  } catch (error) {
    handleError(res, error, 'Failed to upload profile picture');
  }
};

// Delete profile picture
const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    await userService.deleteProfilePicture(userId);
    res.status(200).json({ message: 'Profile picture deleted successfully' });
  } catch (error) {
    handleError(res, error, 'Failed to delete profile picture');
  }
};

// Search users
const searchUsers = async (req, res) => {
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
        total: users.length
      }
    });
  } catch (error) {
    handleError(res, error, 'Search failed');
  }
};

// Get users by skills
const getUsersBySkills = async (req, res) => {
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
    handleError(res, error, 'Failed to get users by skills');
  }
};

// Get profile completion stats
const getProfileStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await userService.getProfileStats(userId);
    res.json(stats);
  } catch (error) {
    handleError(res, error, 'Failed to get profile stats');
  }
};

// Get public profile by username/email (for profile pages)
const getPublicProfile = async (req, res) => {
  try {
    const { identifier } = req.params; // Could be user ID, email, or username
    let user;

    // Try to find by ID first, then by email
    if (identifier.includes('@')) {
      user = await userService.getUserByEmail(identifier);
    } else {
      user = await userService.getUserById(identifier);
    }

    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Return only public information
    const publicProfile = {
      id: user.id,
      name: user.name,
      bio: user.bio,
      profile_picture_url: user.profile_picture_url,
      about_paragraphs: user.about_paragraphs,
      skills: user.skills,
      certifications: user.certifications,
      linkedin: user.linkedin,
      github: user.github,
      created_at: user.created_at
    };

    res.json(publicProfile);
  } catch (error) {
    handleError(res, error, 'Failed to get public profile');
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
  getPublicProfile
};
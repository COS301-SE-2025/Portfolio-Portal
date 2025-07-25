const userService = require('../services/users.service');

// Centralized error response handler
const handleError = (res, error, defaultMessage = 'Internal server error') => {
  console.error(error);
  
  if (error.message.includes('already registered') || error.message.includes('User already registered')) {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  if (error.message.includes('Invalid email')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  res.status(500).json({ error: defaultMessage });
};

// Get user profile by ID
const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    handleError(res, error, 'Failed to get user');
  }
};

// Create new user (register)
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const profilePhoto = req.file;
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
      password, 
      profilePhoto 
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
    const userId = req.params.id;
    const updateData = req.body;
    
    const updatedProfile = await userService.updateUserProfile(userId, updateData);
    res.status(200).json(updatedProfile);
  } catch (error) {
    handleError(res, error, 'Failed to update profile');
  }
};

module.exports = {
  getUser,
  createUser,
  loginUser,
  refreshToken,
  logoutUser,
  updateProfile
};
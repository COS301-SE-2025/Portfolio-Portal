const userService = require('../services/users.service');

// Centralized error response handler
const handleError = (res, error, defaultMessage = 'Internal server error') => {
  console.error(error);
  
  if (error.message.includes('already registered') ){
    return res.status(409).json({ error: 'User already exists' });
  }
  
  if (error.message.includes('Invalid email')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  res.status(500).json({ error: defaultMessage });
};

const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    handleError(res, error, 'Failed to get user');
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Enhanced validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    const user = await userService.createUser({ email, password });
    res.status(201).json(user);
  } catch (error) {
    handleError(res, error, 'Failed to create user');
  }
};

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

module.exports = {
  getUser,
  createUser,
  loginUser,
  refreshToken,
  logoutUser
};
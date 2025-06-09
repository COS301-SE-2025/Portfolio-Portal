const supabase = require('../config/supabase');

const validateToken = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    req.user = data.user;
    next();
  } catch (err) {
    console.error('Token validation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { validateToken };
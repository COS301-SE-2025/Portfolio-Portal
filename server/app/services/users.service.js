const User = require('../models/User');
const supabase = require('../config/supabase');

const getUserById = async (id) => {
  return await User.findById(id);
};

const createUser = async (userData) => {
  const { email, password } = userData;
  return await User.create(email, password);
};

const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error || !data.session) return null;
    
    const userProfile = await User.findById(data.user.id);
    if (!userProfile) return null;

    return {
      user: userProfile,
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at
    };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

const refreshToken = async (refreshToken) => {
  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error || !data.session) return null;

    return {
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

const logoutUser = async (token) => {
  try {
    await supabase.auth.setSession({ access_token: token });
    const { error } = await supabase.auth.signOut();
    return !error;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

module.exports = {
  getUserById,
  createUser,
  loginUser,
  refreshToken,
  logoutUser
};
const supabase = require('../config/supabase');
const User = require('../models/User');

const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Supabase login error:', error.message);
      throw new Error(error.message);
    }
    if (!data.session) {
      console.error('No session returned');
      return null;
    }

    console.log('Auth user ID:', data.user.id);
    const userProfile = await User.findById(data.user.id);
    if (!userProfile) {
      console.error('User profile not found for ID:', data.user.id);
      return null;
    }

    return {
      user: userProfile,
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    };
  } catch (error) {
    console.error('Login error:', error.message);
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

const getUserById = async (id) => {
  return await User.findById(id);
};

const createUser = async (userData) => {
  const { email, name, password } = userData;
  try {
    console.log('Creating user with:', { email, name });
    const user = await User.create(email, password, name);
    console.log('Created user:', user);
    return user;
  } catch (error) {
    console.error('Create user error:', error.message);
    throw error;
  }
};

const updateUserProfile = async (userId, updateData) => {
  return await User.updateProfile(userId, updateData);
};

module.exports = {
  loginUser,
  logoutUser,
  refreshToken,
  getUserById,
  createUser,
  updateUserProfile
};
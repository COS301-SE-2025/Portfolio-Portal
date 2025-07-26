// services/users.service.js
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
  try {
    return await User.findById(id);
  } catch (error) {
    console.error('GetUserById service error:', error.message);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    return await User.findByEmail(email);
  } catch (error) {
    console.error('GetUserByEmail service error:', error.message);
    throw error;
  }
};

const createUser = async (userData) => {
  const { email, name, password } = userData;
  try {
    console.log('Creating user with:', { email, name });
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('User already registered with this email');
    }

    const user = await User.create(email, password, name);
    console.log('Created user:', user);
    return user;
  } catch (error) {
    console.error('Create user error:', error.message);
    throw error;
  }
};

const updateUserProfile = async (userId, updateData) => {
  try {
    // Validate required fields if provided
    if (updateData.email && !/\S+@\S+\.\S+/.test(updateData.email)) {
      throw new Error('Invalid email format');
    }

    // Validate array fields
    if (updateData.about_paragraphs && !Array.isArray(updateData.about_paragraphs)) {
      throw new Error('About paragraphs must be an array');
    }
    if (updateData.certifications && !Array.isArray(updateData.certifications)) {
      throw new Error('Certifications must be an array');
    }
    if (updateData.skills && !Array.isArray(updateData.skills)) {
      throw new Error('Skills must be an array');
    }

    // Validate URL fields
    const urlFields = ['cv_url', 'linkedin', 'github', 'profile_picture_url'];
    urlFields.forEach(field => {
      if (updateData[field] && updateData[field] !== null) {
        try {
          new URL(updateData[field]);
        } catch (e) {
          throw new Error(`Invalid URL format for ${field}`);
        }
      }
    });

    return await User.updateProfile(userId, updateData);
  } catch (error) {
    console.error('UpdateUserProfile service error:', error.message);
    throw error;
  }
};

const uploadProfilePicture = async (userId, file) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed');
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.buffer.length > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB');
    }

    return await User.uploadProfilePicture(
      userId, 
      file.buffer, 
      file.originalname, 
      file.mimetype
    );
  } catch (error) {
    console.error('UploadProfilePicture service error:', error.message);
    throw error;
  }
};

const deleteProfilePicture = async (userId) => {
  try {
    return await User.deleteProfilePicture(userId);
  } catch (error) {
    console.error('DeleteProfilePicture service error:', error.message);
    throw error;
  }
};

const searchUsers = async (query, page = 1, limit = 10) => {
  try {
    if (!query || query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters');
    }

    const offset = (page - 1) * limit;
    return await User.searchUsers(query.trim(), limit, offset);
  } catch (error) {
    console.error('SearchUsers service error:', error.message);
    throw error;
  }
};

const getUsersBySkills = async (skills, limit = 10) => {
  try {
    if (!Array.isArray(skills) || skills.length === 0) {
      throw new Error('Skills must be a non-empty array');
    }

    return await User.getUsersBySkills(skills, limit);
  } catch (error) {
    console.error('GetUsersBySkills service error:', error.message);
    throw error;
  }
};

const getProfileStats = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const stats = {
      profileComplete: 0,
      totalFields: 10,
      completedFields: []
    };

    // Check profile completeness
    const fields = [
      { key: 'name', label: 'Name' },
      { key: 'bio', label: 'Bio' },
      { key: 'profile_picture_url', label: 'Profile Picture' },
      { key: 'about_paragraphs', label: 'About Section' },
      { key: 'skills', label: 'Skills' },
      { key: 'certifications', label: 'Certifications' },
      { key: 'cv_url', label: 'CV/Resume' },
      { key: 'linkedin', label: 'LinkedIn' },
      { key: 'github', label: 'GitHub' },
      { key: 'email', label: 'Email' }
    ];

    fields.forEach(field => {
      const value = user[field.key];
      if (value !== null && value !== undefined && value !== '' && 
          (!Array.isArray(value) || value.length > 0)) {
        stats.completedFields.push(field.label);
        stats.profileComplete++;
      }
    });

    stats.completionPercentage = Math.round((stats.profileComplete / stats.totalFields) * 100);

    return stats;
  } catch (error) {
    console.error('GetProfileStats service error:', error.message);
    throw error;
  }
};

module.exports = {
  loginUser,
  logoutUser,
  refreshToken,
  getUserById,
  getUserByEmail,
  createUser,
  updateUserProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  searchUsers,
  getUsersBySkills,
  getProfileStats
};
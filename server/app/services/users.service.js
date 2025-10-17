// services/users.service.js
const supabase = require('../config/supabase');
const User = require('../models/User');

const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Supabase login error:', error.message);
      throw new Error('Invalid credentials'); 
    }
    if (!data.session) {
      console.error('No session returned after login');
      throw new Error('Login failed: No session data');
    }

    console.log('Auth user ID:', data.user.id);
    const userProfile = await User.findById(data.user.id);
    if (!userProfile) {
      console.error('User profile not found in DB for auth ID:', data.user.id);
      throw new Error('User profile not found');
    }

    return {
      user: userProfile,
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    };
  } catch (error) {
    console.error('Login service error:', error.message);
    throw error; // Re-throw to be caught by the centralised error handler
  }
};

const refreshToken = async (refreshToken) => {
  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error || !data.session) {
      console.error('Supabase refresh token error:', error?.message || 'No session after refresh');
      throw new Error('Invalid refresh token');
    }

    return {
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at
    };
  } catch (error) {
    console.error('Token refresh service error:', error.message);
    throw error;
  }
};

const logoutUser = async (token) => {
  try {
    await supabase.auth.setSession({ access_token: token });
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase logout error:', error.message);
      throw new Error('Logout failed');
    }
    return true;
  } catch (error) {
    console.error('Logout service error:', error.message);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('GetUserById service error:', error.message);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('GetUserByEmail service error:', error.message);
    throw error;
  }
};

//fixed registration error (after demo 4):
const createUser = async (userData) => {
  const { email, name, password, professional } = userData;
  try {
    // Business logic validations
    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new Error('Invalid email format');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('User already registered with this email');
    }

    // Create user in auth & database
    const user = await User.create(email, password, name, professional);
    
    // After creating, log them in automatically to get token
    const loginResult = await loginUser(email, password);
    
    return loginResult; // Return same structure as loginUser (user, token, etc.)
  } catch (error) {
    console.error('Create user service error:', error.message);
    throw error;
  }
};

const updateUserProfile = async (userId, updateData) => {
  try {
    // Validate required fields if provided
    if (updateData.email) {
      throw new Error('Email cannot be updated directly via this route. Please use a dedicated email change process.');
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

    // Validate URL fields (ensure they are valid URLs or null/empty)
    const urlFields = ['cv_url', 'linkedin', 'github']; // profile_picture_url is handled by upload/delete
    urlFields.forEach(field => {
      if (updateData[field] && updateData[field] !== null && updateData[field] !== '') {
        try {
          new URL(updateData[field]);
        } catch (e) {
          throw new Error(`Invalid URL format for ${field}: ${updateData[field]}`);
        }
      }
    });

    const updatedUser = await User.updateProfile(userId, updateData);
    if (!updatedUser) {
      throw new Error('Failed to update user profile or user not found.');
    }
    return updatedUser;
  } catch (error) {
    console.error('UpdateUserProfile service error:', error.message);
    throw error;
  }
};

const uploadProfilePicture = async (userId, file, token) => {
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
    const maxSize = 5 * 1024 * 1024;
    if (file.buffer.length > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB');
    }

    // Call User model to handle the actual upload to Supabase Storage
    return await User.uploadProfilePicture(
      userId,
      file.buffer,
      file.originalname,
      file.mimetype,
      token // Pass token for authenticated storage upload
    );
  } catch (error) {
    console.error('UploadProfilePicture service error:', error.message);
    throw error;
  }
};

const getProfilePicture = async (userId) => {
  try {
    const user = await User.findById(userId); // directly returns the user with signed URL
    if (!user || !user.profile_picture_url) {
      return null; // Or throw error if no picture expected
    }
    return user.profile_picture_url;
  } catch (error) {
    console.error('Get profile picture service error:', error.message);
    throw error;
  }
};

const deleteProfilePicture = async (userId) => {
  try {
    const success = await User.deleteProfilePicture(userId);
    if (!success) {
      throw new Error('Failed to delete profile picture');
    }
    return true;
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
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    if (isNaN(limit) || limit < 1 || limit > 100) { 
      limit = 10;
    }

    const offset = (page - 1) * limit;
    const users = await User.searchUsers(query.trim(), limit, offset);

    // If need total count for paginationlater , add a User.countUsers(query) method
    // and return it along with users.
    return users;
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
    if (isNaN(limit) || limit < 1 || limit > 100) {
      limit = 10;
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

    // Define fields to check for completeness.
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
      // Check for null, undefined, empty string, or empty array
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

const getPublicProfile = async (identifier) => {
  try {
    let user;
    if (identifier.includes('@')) {
      user = await User.findByEmail(identifier);
    } else {
      user = await User.findById(identifier); // Assuming User.findById can also handle non-UUID identifiers if current DB supports it (current: Supabase)
    }

    if (!user) {
      throw new Error('Profile not found');
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
    return publicProfile;
  } catch (error) {
    console.error('GetPublicProfile service error:', error.message);
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
  getProfileStats,
  getProfilePicture,
  getPublicProfile
};
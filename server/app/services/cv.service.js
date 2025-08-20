// services/cvData.service.js
const CVData = require('../models/CVData');

/**
 * Save structured CV data to database
 * @param {string} authId - User's auth ID
 * @param {Object} structuredCV - Parsed CV data from OCR
 * @returns {Object} Saved CV data
 */
const saveCVData = async (authId, structuredCV) => {
  try {
    if (!authId) {
      throw new Error('User authentication ID is required');
    }

    if (!structuredCV || typeof structuredCV !== 'object') {
      throw new Error('Valid structured CV data is required');
    }

    // Validate the structure matches expected format
    const requiredFields = ['personal_info', 'experience', 'education', 'skills', 'certifications', 'languages', 'projects'];
    const missingFields = requiredFields.filter(field => !(field in structuredCV));
    
    if (missingFields.length > 0) {
      console.warn(`Missing fields in CV data: ${missingFields.join(', ')}`);
    }

    // Save to database
    const savedData = await CVData.upsert(authId, structuredCV);
    
    console.log(`CV data saved successfully for user: ${authId}`);
    return savedData;
  } catch (error) {
    console.error('SaveCVData service error:', error.message);
    throw error;
  }
};

/**
 * Get CV data for a user
 * @param {string} authId - User's auth ID
 * @returns {Object|null} CV data or null if not found
 */
const getCVData = async (authId) => {
  try {
    if (!authId) {
      throw new Error('User authentication ID is required');
    }

    return await CVData.findByAuthId(authId);
  } catch (error) {
    console.error('GetCVData service error:', error.message);
    throw error;
  }
};

/**
 * Update CV data for a user
 * @param {string} authId - User's auth ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated CV data
 */
const updateCVData = async (authId, updateData) => {
  try {
    if (!authId) {
      throw new Error('User authentication ID is required');
    }

    if (!updateData || typeof updateData !== 'object') {
      throw new Error('Valid update data is required');
    }

    return await CVData.updateByAuthId(authId, updateData);
  } catch (error) {
    console.error('UpdateCVData service error:', error.message);
    throw error;
  }
};

/**
 * Delete CV data for a user
 * @param {string} authId - User's auth ID
 * @returns {boolean} Success status
 */
const deleteCVData = async (authId) => {
  try {
    if (!authId) {
      throw new Error('User authentication ID is required');
    }

    return await CVData.deleteByAuthId(authId);
  } catch (error) {
    console.error('DeleteCVData service error:', error.message);
    throw error;
  }
};

module.exports = {
  saveCVData,
  getCVData,
  updateCVData,
  deleteCVData
};
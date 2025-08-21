const CVData = require('../models/CVData'); // Assuming CVData is your Mongoose model or ORM class

const saveCVData = async (authId, structuredCV) => {
  try {
    if (!authId) {
      throw new Error('User authentication ID is required');
    }
    if (!structuredCV || typeof structuredCV !== 'object' || Object.keys(structuredCV).length === 0) {
      throw new Error('Valid structured CV data is required');
    }

    // Comprehensive validation for structuredCV.
    // Ensure all top-level expected fields are present, even if empty arrays/objects.
    const requiredFields = ['personal_info', 'summary', 'experience', 'education', 'skills', 'certifications', 'languages', 'projects'];
    requiredFields.forEach(field => {
      if (!(field in structuredCV)) {
        // You can choose to throw an error or just warn. Throwing ensures strict data integrity.
        throw new Error(`Missing required field in structured CV: ${field}`);
      }
    });

    // Deeper validation examples (add more as needed for your schema)
    if (structuredCV.personal_info && typeof structuredCV.personal_info !== 'object') {
      throw new Error('Personal info must be an object');
    }
    if (structuredCV.experience && !Array.isArray(structuredCV.experience)) {
      throw new Error('Experience must be an array');
    }

    // Use upsert to create or update the CV data based on authId
    const savedData = await CVData.upsert(authId, structuredCV);

    console.log(`CV data saved successfully for user: ${authId}`);
    return savedData;
  } catch (error) {
    console.error('SaveCVData service error:', error.message);
    throw error; // Re-throw to be caught by centralized error handler
  }
};

const getCVData = async (authId) => {
  try {
    if (!authId) {
      throw new Error('User authentication ID is required');
    }

    const cvData = await CVData.findByAuthId(authId);
    if (!cvData) {
      throw new Error('CV data not found for this user'); // Throwing a specific error
    }
    return cvData;
  } catch (error) {
    console.error('GetCVData service error:', error.message);
    throw error;
  }
};

const updateCVData = async (authId, updateData) => {
  try {
    if (!authId) {
      throw new Error('User authentication ID is required');
    }
    if (!updateData || typeof updateData !== 'object' || Object.keys(updateData).length === 0) {
      throw new Error('Valid update data is required');
    }

    // Optional: Add specific validation for fields within updateData if needed
    // For example, if updateData.skills exists, ensure it's an array.
    if (updateData.skills && !Array.isArray(updateData.skills)) {
      throw new Error('Skills must be an array in update data');
    }
    // You might also want to ensure that 'auth_id' or 'id' cannot be updated via this route
    if (updateData.auth_id || updateData.id) {
        throw new Error('Auth ID cannot be updated directly');
    }


    const updatedData = await CVData.updateByAuthId(authId, updateData);
    if (!updatedData) {
        throw new Error('Failed to update CV data or CV data not found');
    }
    return updatedData;
  } catch (error) {
    console.error('UpdateCVData service error:', error.message);
    throw error;
  }
};

const deleteCVData = async (authId) => {
  try {
    if (!authId) {
      throw new Error('User authentication ID is required');
    }

    const success = await CVData.deleteByAuthId(authId);
    if (!success) {
        throw new Error('Failed to delete CV data or CV data not found');
    }
    return success;
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
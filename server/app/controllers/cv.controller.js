const cvService = require('../services/cv.service');

/**
 * Controller to save CV data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const saveCV = async (req, res) => {
  try {
    const { id: authId } = req.user; // Changed from authId to id
    const structuredCV = req.body;

    if (!structuredCV) {
      return res.status(400).json({ error: 'Structured CV data is required' });
    }

    const savedData = await cvService.saveCVData(authId, structuredCV);
    res.status(201).json(savedData);
  } catch (error) {
    console.error('Error in saveCV controller:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Controller to get CV data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCV = async (req, res) => {
  try {
    const { id: authId } = req.user; // Changed from authId to id

    const cvData = await cvService.getCVData(authId);
    if (!cvData) {
      return res.status(404).json({ error: 'CV data not found' });
    }

    res.status(200).json(cvData);
  } catch (error) {
    console.error('Error in getCV controller:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Controller to update CV data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateCV = async (req, res) => {
  try {
    const { id: authId } = req.user; // Changed from authId to id
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Update data is required' });
    }

    const updatedData = await Service.updateCVData(authId, updateData);
    res.status(200).json(updatedData);
  } catch (error) {
    console.error('Error in updateCV controller:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Controller to delete CV data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteCV = async (req, res) => {
  try {
    const { id: authId } = req.user; // Changed from authId to id

    const success = await cvService.deleteCVData(authId);
    if (!success) {
      return res.status(404).json({ error: 'CV data not found' });
    }

    res.status(200).json({ message: 'CV data deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCV controller:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  saveCV,
  getCV,
  updateCV,
  deleteCV
};
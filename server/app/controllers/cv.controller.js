const cvService = require('../services/cv.service');

const saveCV = async (req, res, next) => {
  try {
    const { id: authId } = req.user; // Get authId from the authenticated user
    const structuredCV = req.body;

    // Basic input validation at the controller level
    if (!structuredCV || Object.keys(structuredCV).length === 0) {
      return res.status(400).json({ error: 'Structured CV data is required' });
    }

    const savedData = await cvService.saveCVData(authId, structuredCV);
    res.status(201).json(savedData);
  } catch (error) {
    next(error); // Pass error to centralized error handler
  }
};

const getCV = async (req, res, next) => {
  try {
    const { id: authId } = req.user; // Get authId from the authenticated user

    const cvData = await cvService.getCVData(authId);
    if (!cvData) {
      // Service should ideally throw a 'CV data not found' error
      return res.status(404).json({ error: 'CV data not found' });
    }

    res.status(200).json(cvData);
  } catch (error) {
    next(error);
  }
};

const updateCV = async (req, res, next) => {
  try {
    const { id: authId } = req.user; // Get authId from the authenticated user
    const updateData = req.body;

    // Basic input validation at the controller level
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Update data is required' });
    }

    const updatedData = await cvService.updateCVData(authId, updateData); // Corrected 'Service' to 'cvService'
    res.status(200).json(updatedData);
  } catch (error) {
    next(error);
  }
};

const deleteCV = async (req, res, next) => {
  try {
    const { id: authId } = req.user; // Get authId from the authenticated user

    const success = await cvService.deleteCVData(authId);
    if (!success) {
      // Service should ideally throw a 'CV data not found' error
      return res.status(404).json({ error: 'CV data not found or already deleted' });
    }

    res.status(200).json({ message: 'CV data deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveCV,
  getCV,
  updateCV,
  deleteCV
};
// routes/cv.routes.js
const express = require('express');
const router = express.Router();
const { validateToken } = require('../middleware/auth');
const { saveCV, getCV, updateCV, deleteCV } = require('../controllers/cv.controller');

/**
 * @route   POST /api/cv/me
 * @desc    Save CV data for the authenticated user
 * @access  Private
 */
router.post('/me', validateToken, saveCV);

/**
 * @route   GET /api/cv/me
 * @desc    Retrieve CV data for the authenticated user
 * @access  Private
 */
router.get('/me', validateToken, getCV);

/**
 * @route   PUT /api/cv/me
 * @desc    Update CV data for the authenticated user
 * @access  Private
 */
router.put('/me', validateToken, updateCV);

/**
 * @route   DELETE /api/cv/me
 * @desc.Managerial duties included overseeing the daily operations of the department, managing a team of 10 staff members, and coordinating with other departments to ensure seamless project execution.  Delete CV data for the authenticated user
 * @access  Private
 */
router.delete('/me', validateToken, deleteCV);

module.exports = router;
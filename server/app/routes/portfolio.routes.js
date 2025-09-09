// server/routes/portfolio.routes.js

/**
 * Portfolio API Routes
 *
 * Defines routes for portfolio-related functionality
 */

const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolio.controller");

/**
 * @route   POST /api/portfolio/select-template
 * @desc    Analyze CV data and select appropriate template
 * @access  Public
 * @body    { cvData: Object, authId?: String }
 */
router.post("/select-template", portfolioController.selectTemplate);

/**
 * @route   GET /api/portfolio/template/:authId
 * @desc    Get template for user (runs algorithm and stores result)
 * @access  Public
 */
router.get("/template/:authId", portfolioController.getTemplateForUser);

/**
 * @route   GET /api/portfolio/stored-template/:authId
 * @desc    Get stored template for user (without running algorithm)
 * @access  Public
 */
router.get("/stored-template/:authId", portfolioController.getStoredTemplate);

/**
 * @route   PUT /api/portfolio/template/:authId
 * @desc    Update template for user (re-run algorithm)
 * @access  Public
 */
router.put("/template/:authId", portfolioController.updateTemplateForUser);

/**
 * @route   POST /api/portfolio/generate
 * @desc    Generate a complete portfolio based on CV data and selected template
 * @access  Public
 */
router.post("/generate", portfolioController.generatePortfolio);

/**
 * @route   POST /api/portfolio/download
 * @desc    Generate and download a portfolio as a React app zip file
 * @access  Public
 * @body    { userData: Object, username?: String }
 */
router.post("/download", portfolioController.downloadPortfolio);

/**
 * @route   GET /api/portfolio/:id
 * @desc    Get a generated portfolio by ID
 * @access  Public
 *
 * Note: This is a placeholder for future functionality
 */
router.get("/:id", (req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
});

module.exports = router;
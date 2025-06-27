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
 */
router.post("/select-template", portfolioController.selectTemplate);

/**
 * @route   POST /api/portfolio/generate
 * @desc    Generate a complete portfolio based on CV data and selected template
 * @access  Public
 */
router.post("/generate", portfolioController.generatePortfolio);

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

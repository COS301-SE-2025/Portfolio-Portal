// server/routes/github.routes.js

const express = require('express');
const router = express.Router();
const githubController = require('../controllers/github.controller');

/**
 * @route   GET /api/github/auth
 * @desc    Initiate GitHub OAuth flow
 * @access  Public
 * @query   { template?: string, returnUrl?: string }
 */
router.get('/auth', githubController.initiateAuth);

/**
 * @route   GET /api/github/callback
 * @desc    Handle GitHub OAuth callback
 * @access  Public
 * @query   { code: string, state: string, error?: string }
 */
router.get('/callback', githubController.handleCallback);

/**
 * @route   GET /api/github/user
 * @desc    Get authenticated GitHub user information
 * @access  Private (requires session)
 */
router.get('/user', githubController.getUserInfo);

/**
 * @route   POST /api/github/deploy
 * @desc    Deploy portfolio to GitHub Pages
 * @access  Private (requires session)
 * @body    { userData: Object, template: string, repositoryName?: string }
 */
router.post('/deploy', githubController.deployPortfolio);

/**
 * @route   GET /api/github/status/:owner/:repo
 * @desc    Check deployment status
 * @access  Private (requires session)
 */
router.get('/status/:owner/:repo', githubController.checkDeploymentStatus);

/**
 * @route   POST /api/github/disconnect
 * @desc    Disconnect GitHub account
 * @access  Private (requires session)
 */
router.post('/disconnect', githubController.disconnect);

/**
 * @route   GET /api/github/health
 * @desc    Health check for GitHub service
 * @access  Public
 */
router.get('/health', githubController.healthCheck);

module.exports = router;
const express = require('express');
const router = express.Router();
const githubController = require('../controllers/github.controller');

/**
 * @route   GET /api/github/auth
 * @desc    Initiate GitHub OAuth flow
 * @access  Public
 */
router.get('/auth', githubController.initiateOAuth);

/**
 * @route   GET /api/github/callback
 * @desc    Handle GitHub OAuth callback
 * @access  Public
 */
router.get('/callback', githubController.handleOAuthCallback);

/**
 * @route   POST /api/github/deploy
 * @desc    Deploy portfolio to GitHub Pages
 * @access  Public (requires GitHub auth in session)
 * @body    { userData: Object, username?: String, template?: String }
 */
router.post('/deploy', githubController.deployToGitHubPages);

/**
 * @route   GET /api/github/user
 * @desc    Get authenticated GitHub user information
 * @access  Public (requires GitHub auth in session)
 */
router.get('/user', githubController.getGitHubUser);

/**
 * @route   DELETE /api/github/auth
 * @desc    Revoke GitHub authorization
 * @access  Public
 */
router.delete('/auth', githubController.revokeGitHubAuth);

module.exports = router;


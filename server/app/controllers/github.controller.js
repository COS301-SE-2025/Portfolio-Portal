// server/controllers/github.controller.js

const githubService = require('../services/github.service');
const crypto = require('crypto');

/**
 * GitHub OAuth Controller
 * Handles GitHub authentication and deployment functionality
 */

/**
 * Initiate GitHub OAuth flow
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.initiateAuth = async (req, res) => {
  try {
    const { template, returnUrl } = req.query;
    
    // Generate a secure state parameter
    const state = crypto.randomBytes(32).toString('hex');
    
    // Store state and additional data in session
    req.session.githubState = state;
    req.session.template = template;
    req.session.returnUrl = returnUrl || process.env.FRONTEND_URL;
    
    // Save session explicitly and wait for it
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
    
    console.log('=== INITIATE AUTH DEBUG ===');
    console.log('Session ID:', req.sessionID);
    console.log('Generated state:', state);
    console.log('Session data:', {
      githubState: req.session.githubState,
      template: req.session.template,
      returnUrl: req.session.returnUrl
    });
    console.log('Session cookie:', req.headers.cookie);
    console.log('=========================');
    
    // Generate GitHub OAuth URL
    const authUrl = githubService.getAuthUrl(state);
    
    res.json({
      success: true,
      authUrl,
      state,
      debug: {
        sessionId: req.sessionID,
        cookieSent: true
      }
    });
  } catch (error) {
    console.error('Error initiating GitHub auth:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate GitHub authentication',
      error: error.message
    });
  }
};

/**
 * Handle GitHub OAuth callback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.handleCallback = async (req, res) => {
  try {
    const { code, state, error } = req.query;
    
    console.log('=== CALLBACK DEBUG ===');
    console.log('Session ID:', req.sessionID);
    console.log('Received state:', state);
    console.log('Session state:', req.session.githubState);
    console.log('Session data:', req.session);
    console.log('Cookies received:', req.headers.cookie);
    console.log('All headers:', req.headers);
    console.log('=====================');
    
    // Check for OAuth errors
    if (error) {
      console.error('GitHub OAuth error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}?error=oauth_error&description=${encodeURIComponent(error)}`);
    }
    
    // Verify state parameter
    if (!state || state !== req.session.githubState) {
      console.error('=== STATE MISMATCH ===');
      console.error('Expected state:', req.session.githubState);
      console.error('Received state:', state);
      console.error('Session exists:', !!req.session);
      console.error('Session ID:', req.sessionID);
      console.error('======================');
      return res.redirect(`${process.env.FRONTEND_URL}?error=invalid_state&debug=session_mismatch`);
    }
    
    // Exchange code for access token
    const accessToken = await githubService.getAccessToken(code);
    
    // Get user info
    const userInfo = await githubService.getUserInfo(accessToken);
    
    // Store GitHub data in session
    req.session.githubAccessToken = accessToken;
    req.session.githubUser = userInfo;
    
    // Clean up temporary session data
    delete req.session.githubState;
    
    // Redirect back to frontend with success
    const returnUrl = req.session.returnUrl || process.env.FRONTEND_URL;
    const template = req.session.template || 'default';
    
    console.log('=== REDIRECT SUCCESS ===');
    console.log('Redirecting to:', `${returnUrl}?github_auth=success&template=${template}&username=${userInfo.login}`);
    console.log('=======================');
    
    res.redirect(`${returnUrl}?github_auth=success&template=${template}&username=${userInfo.login}`);
  } catch (error) {
    console.error('Error handling GitHub callback:', error);
    res.redirect(`${process.env.FRONTEND_URL}?error=callback_error&description=${encodeURIComponent(error.message)}`);
  }
};

/**
 * Get GitHub user information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserInfo = async (req, res) => {
  try {
    if (!req.session.githubUser || !req.session.githubAccessToken) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated with GitHub'
      });
    }
    
    res.json({
      success: true,
      user: req.session.githubUser,
      authenticated: true
    });
  } catch (error) {
    console.error('Error getting GitHub user info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information',
      error: error.message
    });
  }
};

/**
 * Deploy portfolio to GitHub Pages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deployPortfolio = async (req, res) => {
  try {
    const { userData, template, repositoryName } = req.body;
    
    if (!req.session.githubAccessToken) {
      return res.status(401).json({
        success: false,
        message: 'GitHub authentication required'
      });
    }
    
    if (!userData) {
      return res.status(400).json({
        success: false,
        message: 'User data is required for deployment'
      });
    }
    
    // Generate repository name if not provided
    const repoName = repositoryName || 
      (userData.name ? 
        userData.name.toLowerCase().replace(/\s+/g, '-') + '-portfolio' : 
        'portfolio-website');
    
    console.log(`Deploying portfolio for ${req.session.githubUser.login} with template ${template}`);
    
    // Add GitHub username to user data
    userData.githubUsername = req.session.githubUser.login;
    
    // Deploy portfolio
    const deploymentResult = await githubService.deployPortfolio(
      req.session.githubAccessToken,
      userData,
      template || 'default',
      repoName
    );
    
    res.json({
      success: true,
      ...deploymentResult,
      message: 'Portfolio deployed successfully to GitHub Pages'
    });
  } catch (error) {
    console.error('Error deploying portfolio:', error);
    
    // Handle specific GitHub API errors
    let errorMessage = 'Failed to deploy portfolio';
    let statusCode = 500;
    
    if (error.status === 422) {
      errorMessage = 'Repository name already exists or is invalid';
      statusCode = 422;
    } else if (error.status === 401) {
      errorMessage = 'GitHub authentication expired. Please re-authenticate.';
      statusCode = 401;
    } else if (error.status === 403) {
      errorMessage = 'Insufficient GitHub permissions. Please check your access token.';
      statusCode = 403;
    }
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Check deployment status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.checkDeploymentStatus = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    
    if (!req.session.githubAccessToken) {
      return res.status(401).json({
        success: false,
        message: 'GitHub authentication required'
      });
    }
    
    // This would check the deployment status
    // For now, we'll return a simple response
    res.json({
      success: true,
      status: 'deployed',
      url: `https://${owner}.github.io/${repo}`,
      message: 'Deployment status checked successfully'
    });
  } catch (error) {
    console.error('Error checking deployment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check deployment status',
      error: error.message
    });
  }
};

/**
 * Disconnect GitHub account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.disconnect = async (req, res) => {
  try {
    // Clear GitHub session data
    delete req.session.githubAccessToken;
    delete req.session.githubUser;
    delete req.session.template;
    delete req.session.returnUrl;
    
    res.json({
      success: true,
      message: 'GitHub account disconnected successfully'
    });
  } catch (error) {
    console.error('Error disconnecting GitHub:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect GitHub account',
      error: error.message
    });
  }
};

/**
 * Health check for GitHub service
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.healthCheck = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'GitHub service is healthy',
      timestamp: new Date().toISOString(),
      config: {
        clientId: process.env.GITHUB_CLIENT_ID ? 'configured' : 'missing',
        redirectUri: process.env.GITHUB_REDIRECT_URI || 'not configured'
      }
    });
  } catch (error) {
    console.error('GitHub health check error:', error);
    res.status(500).json({
      success: false,
      message: 'GitHub service health check failed',
      error: error.message
    });
  }
};

module.exports = exports;
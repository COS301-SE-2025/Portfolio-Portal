const githubService = require('../services/github.service');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

// Temporary in-memory store for OAuth states (in production, use Redis or database)
const oauthStates = new Map();

// Clean up expired states every 5 minutes
setInterval(() => {
  const now = Date.now();
  const maxAge = 10 * 60 * 1000; // 10 minutes
  
  for (const [state, data] of oauthStates.entries()) {
    if (now - data.timestamp > maxAge) {
      oauthStates.delete(state);
      console.log('Cleaned up expired OAuth state:', state);
    }
  }
}, 5 * 60 * 1000);

/**
 * GitHub Controller
 * 
 * Handles GitHub OAuth flow and portfolio deployment to GitHub Pages
 */

/**
 * Initiate GitHub OAuth flow
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.initiateOAuth = async (req, res) => {
  try {
    // Generate a random state parameter for security
    const state = crypto.randomBytes(32).toString('hex');
    
    // Store state in both session and in-memory store for redundancy
    req.session.githubOAuthState = state;
    oauthStates.set(state, {
      timestamp: Date.now(),
      sessionID: req.sessionID
    });
    
    console.log('GitHub OAuth initiated with state:', state);
    console.log('Session ID:', req.sessionID);
    console.log('Session state stored:', req.session.githubOAuthState);
    console.log('In-memory state stored:', oauthStates.has(state));
    
    const authUrl = githubService.getAuthorizationUrl(state);
    
    res.json({
      success: true,
      authUrl: authUrl,
      state: state
    });
  } catch (error) {
    console.error('Error initiating OAuth:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate GitHub OAuth',
      error: error.message
    });
  }
};

/**
 * Handle GitHub OAuth callback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.handleOAuthCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    
    console.log('GitHub OAuth Callback received:', { code: code ? 'present' : 'missing', state: state ? 'present' : 'missing' });
    console.log('Session state:', req.session.githubOAuthState);
    console.log('Received state:', state);
    
    if (!code || !state) {
      console.error('Missing parameters:', { code: !!code, state: !!state });
      return res.status(400).json({
        success: false,
        message: 'Missing authorization code or state parameter'
      });
    }

    // Verify state parameter using both session and in-memory store
    const sessionStateValid = req.session.githubOAuthState === state;
    const memoryStateValid = oauthStates.has(state);
    
    console.log('State verification:', {
      sessionStateValid,
      memoryStateValid,
      sessionState: req.session.githubOAuthState,
      receivedState: state,
      hasInMemoryState: oauthStates.has(state)
    });
    
    if (!sessionStateValid && !memoryStateValid) {
      console.error('State verification failed:', { 
        sessionState: req.session.githubOAuthState, 
        receivedState: state,
        hasInMemoryState: oauthStates.has(state)
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid state parameter'
      });
    }
    
    // Clean up the state from in-memory store after successful verification
    if (memoryStateValid) {
      oauthStates.delete(state);
    }

    // Exchange code for access token
    const tokenData = await githubService.exchangeCodeForToken(code, state);
    
    // Store access token in session
    req.session.githubAccessToken = tokenData.accessToken;
    req.session.githubUser = tokenData.user;

    console.log('GitHub OAuth successful for user:', tokenData.user.login);

    // Redirect to frontend with success status
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/github/callback?success=true&user=${encodeURIComponent(JSON.stringify(tokenData.user))}`;
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    
    // Handle specific OAuth errors
    if (error.message.includes('incorrect or expired')) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const redirectUrl = `${frontendUrl}/github/callback?error=EXPIRED_CODE&message=${encodeURIComponent('GitHub authorization code has expired. Please try authorizing again.')}`;
      return res.redirect(redirectUrl);
    }
    
    // Redirect to frontend with error
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/github/callback?error=GENERAL_ERROR&message=${encodeURIComponent('Failed to complete GitHub authorization')}`;
    res.redirect(redirectUrl);
  }
};

/**
 * Deploy portfolio to GitHub Pages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deployToGitHubPages = async (req, res) => {
  try {
    const { userData, username, template = 'default' } = req.body;
    const accessToken = req.session.githubAccessToken;
    const githubUser = req.session.githubUser;

    if (!accessToken || !githubUser) {
      return res.status(401).json({
        success: false,
        message: 'GitHub authorization required. Please authorize your GitHub account first.'
      });
    }

    if (!userData) {
      return res.status(400).json({
        success: false,
        message: 'User data is required'
      });
    }

    // Generate portfolio files (reuse existing logic)
    const portfolioName = username ? `${username}Portfolio` : `Portfolio_${Date.now()}`;
    const tempDir = path.join(__dirname, '../../temp', portfolioName);
    
    // Create temp directory and generate portfolio
    await fs.mkdir(tempDir, { recursive: true });
    
    // Copy template files (reuse existing logic from portfolio controller)
    const templateDir = getTemplateDirectory(template);
    if (!templateDir) {
      return res.status(400).json({
        success: false,
        message: `Template '${template}' not found`
      });
    }

    await copyDirectory(templateDir, tempDir);
    await injectUserData(tempDir, userData);

    // Create repository name
    const repoName = `${username || githubUser.login}-portfolio`;
    
    try {
      // Create repository
      const repo = await githubService.createRepository(
        accessToken,
        repoName,
        `Portfolio website for ${userData.name || githubUser.name}`
      );

      // Deploy to GitHub Pages
      const deploymentResult = await githubService.deployToGitHubPages(
        accessToken,
        githubUser.login,
        repoName,
        tempDir,
        userData
      );

      // Clean up temp directory
      await fs.rm(tempDir, { recursive: true, force: true });

      res.json({
        success: true,
        message: 'Portfolio deployed successfully to GitHub Pages',
        data: {
          portfolioUrl: deploymentResult.url,
          repositoryUrl: deploymentResult.repository,
          repositoryName: repoName
        }
      });

    } catch (deploymentError) {
      // Clean up temp directory on error
      await fs.rm(tempDir, { recursive: true, force: true });
      throw deploymentError;
    }

  } catch (error) {
    console.error('Error deploying to GitHub Pages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deploy portfolio to GitHub Pages',
      error: error.message
    });
  }
};

/**
 * Get GitHub user information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getGitHubUser = async (req, res) => {
  try {
    const githubUser = req.session.githubUser;
    
    if (!githubUser) {
      return res.status(401).json({
        success: false,
        message: 'GitHub authorization required'
      });
    }

    res.json({
      success: true,
      user: githubUser
    });
  } catch (error) {
    console.error('Error getting GitHub user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get GitHub user information',
      error: error.message
    });
  }
};

/**
 * Revoke GitHub authorization
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.revokeGitHubAuth = async (req, res) => {
  try {
    // Clear GitHub session data
    delete req.session.githubAccessToken;
    delete req.session.githubUser;
    delete req.session.githubOAuthState;

    res.json({
      success: true,
      message: 'GitHub authorization revoked successfully'
    });
  } catch (error) {
    console.error('Error revoking GitHub auth:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke GitHub authorization',
      error: error.message
    });
  }
};

// Helper functions (reused from portfolio controller)
function getTemplateDirectory(template) {
  const templatesBaseDir = path.join(__dirname, '../../templates');
  
  const templateMap = {
    'default': path.join(templatesBaseDir, 'react-portfolio'),
    'cave': path.join(templatesBaseDir, 'cave-portfolio'),
    'forest': path.join(templatesBaseDir, 'forest-portfolio'),
    'lab': path.join(templatesBaseDir, 'lab-portfolio'),
    'office': path.join(templatesBaseDir, 'office-portfolio'),
    'space': path.join(templatesBaseDir, 'space-portfolio')
  };
  
  return templateMap[template] || null;
}

async function copyDirectory(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function injectUserData(portfolioPath, userData) {
  const dataFilePath = path.join(portfolioPath, 'src', 'data', 'portfolioData.js');
  
  try {
    const dataContent = `// Portfolio Data
// This file contains the user's portfolio information

export const portfolioData = ${JSON.stringify(userData, null, 2)};

export default portfolioData;
`;

    await fs.writeFile(dataFilePath, dataContent);
  } catch (error) {
    console.error('Error injecting user data:', error);
    throw error;
  }
}

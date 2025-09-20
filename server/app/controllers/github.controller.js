const githubService = require('../services/github.service');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

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
    
    // Store state in session or cache for verification
    req.session.githubOAuthState = state;
    
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
    
    if (!code || !state) {
      return res.status(400).json({
        success: false,
        message: 'Missing authorization code or state parameter'
      });
    }

    // Verify state parameter
    if (req.session.githubOAuthState !== state) {
      return res.status(400).json({
        success: false,
        message: 'Invalid state parameter'
      });
    }

    // Exchange code for access token
    const tokenData = await githubService.exchangeCodeForToken(code, state);
    
    // Store access token in session
    req.session.githubAccessToken = tokenData.accessToken;
    req.session.githubUser = tokenData.user;

    res.json({
      success: true,
      user: tokenData.user,
      message: 'GitHub authorization successful'
    });
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    
    // Handle specific OAuth errors
    if (error.message.includes('incorrect or expired')) {
      return res.status(400).json({
        success: false,
        message: 'GitHub authorization code has expired. Please try authorizing again.',
        error: 'EXPIRED_CODE'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to complete GitHub authorization',
      error: error.message
    });
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

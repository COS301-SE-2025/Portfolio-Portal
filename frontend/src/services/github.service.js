import api from './api.service.js';

/**
 * GitHub Service
 * 
 * Handles GitHub OAuth flow and portfolio deployment to GitHub Pages
 */

/**
 * Initiate GitHub OAuth flow
 * @param {string} template - Template name
 * @param {string} returnUrl - URL to return to after authentication
 * @returns {Promise<Object>} Authorization URL and state
 */
export const initiateGitHubAuth = async (template = 'default', returnUrl = '/templates') => {
  try {
    const params = new URLSearchParams({
      template: template,
      returnUrl: returnUrl
    });
    
    const response = await api.get(`/github/auth?${params.toString()}`);
    return {
      success: true,
      authUrl: response.data.authUrl,
      state: response.data.state
    };
  } catch (error) {
    console.error('Error initiating GitHub auth:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to initiate GitHub authorization'
    };
  }
};

/**
 * Handle GitHub OAuth callback
 * @param {string} code - Authorization code from GitHub
 * @param {string} state - State parameter for verification
 * @returns {Promise<Object>} OAuth result
 */
export const handleGitHubCallback = async (code, state) => {
  try {
    const response = await api.get(`/github/callback?code=${code}&state=${state}`);
    return {
      success: true,
      user: response.data.user,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error handling GitHub callback:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to complete GitHub authorization'
    };
  }
};

/**
 * Deploy portfolio to GitHub Pages
 * @param {Object} userData - User portfolio data
 * @param {string} username - Username for the portfolio
 * @param {string} template - Template name
 * @returns {Promise<Object>} Deployment result
 */
export const deployToGitHubPages = async (userData, username, template = 'default') => {
  try {
    const response = await api.post('/github/deploy', {
      userData,
      username,
      template
    });
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error deploying to GitHub Pages:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to deploy portfolio to GitHub Pages'
    };
  }
};

/**
 * Get authenticated GitHub user information
 * @returns {Promise<Object>} GitHub user data
 */
export const getGitHubUser = async () => {
  try {
    const response = await api.get('/github/user');
    return {
      success: true,
      user: response.data.user
    };
  } catch (error) {
    console.error('Error getting GitHub user:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get GitHub user information'
    };
  }
};

/**
 * Revoke GitHub authorization
 * @returns {Promise<Object>} Revocation result
 */
export const revokeGitHubAuth = async () => {
  try {
    const response = await api.delete('/github/auth');
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error revoking GitHub auth:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to revoke GitHub authorization'
    };
  }
};

/**
 * Check if user is authenticated with GitHub
 * @returns {Promise<boolean>} Authentication status
 */
export const isGitHubAuthenticated = async () => {
  try {
    const result = await getGitHubUser();
    return result.success;
  } catch (error) {
    return false;
  }
};


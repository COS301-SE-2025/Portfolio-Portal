// frontend/src/services/githubService.js

import api from './api.service';

class GitHubService {
  /**
   * Initiate GitHub OAuth authentication
   * @param {string} template - Current template name
   * @param {string} returnUrl - URL to return to after auth
   * @returns {Promise<Object>} Auth URL and state
   */
  async initiateAuth(template, returnUrl) {
    try {
      const response = await api.get('/github/auth', {
        params: { template, returnUrl }
      });
      return response.data;
    } catch (error) {
      console.error('Error initiating GitHub auth:', error);
      throw new Error(error.response?.data?.message || 'Failed to initiate GitHub authentication');
    }
  }

  /**
   * Get authenticated GitHub user information
   * @returns {Promise<Object>} User information
   */
  async getUserInfo() {
    try {
      const response = await api.get('/github/user');
      return response.data;
    } catch (error) {
      console.error('Error getting GitHub user info:', error);
      if (error.response?.status === 401) {
        throw new Error('Not authenticated with GitHub');
      }
      throw new Error(error.response?.data?.message || 'Failed to get user information');
    }
  }

  /**
   * Deploy portfolio to GitHub Pages
   * @param {Object} userData - User portfolio data
   * @param {string} template - Template name
   * @param {string} repositoryName - Repository name
   * @returns {Promise<Object>} Deployment result
   */
  async deployPortfolio(userData, template, repositoryName) {
    try {
      const response = await api.post('/github/deploy', {
        userData,
        template,
        repositoryName
      });
      return response.data;
    } catch (error) {
      console.error('Error deploying portfolio:', error);
      throw new Error(error.response?.data?.message || 'Failed to deploy portfolio');
    }
  }

  /**
   * Check deployment status
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Object>} Deployment status
   */
  async checkDeploymentStatus(owner, repo) {
    try {
      const response = await api.get(`/github/status/${owner}/${repo}`);
      return response.data;
    } catch (error) {
      console.error('Error checking deployment status:', error);
      throw new Error(error.response?.data?.message || 'Failed to check deployment status');
    }
  }

  /**
   * Disconnect GitHub account
   * @returns {Promise<Object>} Disconnect result
   */
  async disconnect() {
    try {
      const response = await api.post('/github/disconnect');
      return response.data;
    } catch (error) {
      console.error('Error disconnecting GitHub:', error);
      throw new Error(error.response?.data?.message || 'Failed to disconnect GitHub account');
    }
  }

  /**
   * Check if user is authenticated with GitHub
   * @returns {Promise<boolean>} Authentication status
   */
  async isAuthenticated() {
    try {
      const userInfo = await this.getUserInfo();
      return userInfo.authenticated === true;
    } catch (error) {
      return false;
    }
  }
}

export default new GitHubService();
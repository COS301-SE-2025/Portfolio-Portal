const { Octokit } = require('@octokit/rest');
const simpleGit = require('simple-git');
const fs = require('fs').promises;
const path = require('path');

/**
 * GitHub Service
 * 
 * Handles GitHub OAuth, repository creation, and GitHub Pages deployment
 */
class GitHubService {
  constructor() {
    this.clientId = process.env.GITHUB_CLIENT_ID;
    this.clientSecret = process.env.GITHUB_CLIENT_SECRET;
    this.redirectUri = process.env.GITHUB_REDIRECT_URI || `${process.env.FRONTEND_URL}/github/callback`;
  }

  /**
   * Generate GitHub OAuth authorization URL
   * @param {string} state - Random state parameter for security
   * @returns {string} Authorization URL
   */
  getAuthorizationUrl(state) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'repo,user:email',
      state: state,
      allow_signup: 'true'
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   * @param {string} code - Authorization code from GitHub
   * @param {string} state - State parameter for verification
   * @returns {Promise<Object>} Access token and user info
   */
  async exchangeCodeForToken(code, state) {
    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          state: state
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
      }

      // Get user information
      const octokit = new Octokit({
        auth: data.access_token
      });

      const { data: user } = await octokit.rest.users.getAuthenticated();

      return {
        accessToken: data.access_token,
        user: {
          id: user.id,
          login: user.login,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url
        }
      };
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  /**
   * Create a new repository for the portfolio
   * @param {string} accessToken - GitHub access token
   * @param {string} repoName - Repository name
   * @param {string} description - Repository description
   * @returns {Promise<Object>} Repository information
   */
  async createRepository(accessToken, repoName, description = 'Portfolio website') {
    try {
      const octokit = new Octokit({
        auth: accessToken
      });

      const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
        name: repoName,
        description: description,
        private: false,
        auto_init: false,
        gitignore_template: 'Node',
        license_template: 'mit'
      });

      return repo;
    } catch (error) {
      console.error('Error creating repository:', error);
      throw error;
    }
  }

  /**
   * Deploy portfolio to GitHub Pages
   * @param {string} accessToken - GitHub access token
   * @param {string} repoOwner - Repository owner
   * @param {string} repoName - Repository name
   * @param {string} portfolioPath - Path to the portfolio files
   * @param {Object} userData - User data for the portfolio
   * @returns {Promise<Object>} Deployment result
   */
  async deployToGitHubPages(accessToken, repoOwner, repoName, portfolioPath, userData) {
    try {
      const octokit = new Octokit({
        auth: accessToken
      });

      // Clone the repository
      const tempRepoPath = path.join(__dirname, '../../temp', `repo-${Date.now()}`);
      const git = simpleGit();

      await fs.mkdir(tempRepoPath, { recursive: true });
      await git.clone(`https://github.com/${repoOwner}/${repoName}.git`, tempRepoPath);

      // Copy portfolio files to repository
      await this.copyPortfolioFiles(portfolioPath, tempRepoPath);

      // Update package.json for GitHub Pages
      await this.updatePackageJsonForPages(tempRepoPath, repoName);

      // Create .github/workflows directory and deployment workflow
      await this.createGitHubWorkflow(tempRepoPath, repoName);

      // Commit and push changes
      const repoGit = simpleGit(tempRepoPath);
      await repoGit.add('.');
      await repoGit.commit('Initial portfolio deployment');
      await repoGit.push('origin', 'main');

      // Enable GitHub Pages
      await this.enableGitHubPages(octokit, repoOwner, repoName);

      // Clean up temp directory
      await fs.rm(tempRepoPath, { recursive: true, force: true });

      return {
        success: true,
        url: `https://${repoOwner}.github.io/${repoName}`,
        repository: `https://github.com/${repoOwner}/${repoName}`
      };
    } catch (error) {
      console.error('Error deploying to GitHub Pages:', error);
      throw error;
    }
  }

  /**
   * Copy portfolio files to repository directory
   * @param {string} sourcePath - Source portfolio path
   * @param {string} destPath - Destination repository path
   */
  async copyPortfolioFiles(sourcePath, destPath) {
    const files = await fs.readdir(sourcePath, { withFileTypes: true });
    
    for (const file of files) {
      const sourceFile = path.join(sourcePath, file.name);
      const destFile = path.join(destPath, file.name);
      
      if (file.isDirectory()) {
        await fs.mkdir(destFile, { recursive: true });
        await this.copyPortfolioFiles(sourceFile, destFile);
      } else {
        await fs.copyFile(sourceFile, destFile);
      }
    }
  }

  /**
   * Update package.json for GitHub Pages deployment
   * @param {string} repoPath - Repository path
   * @param {string} repoName - Repository name
   */
  async updatePackageJsonForPages(repoPath, repoName) {
    const packageJsonPath = path.join(repoPath, 'package.json');
    
    try {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
      
      // Add homepage for GitHub Pages
      packageJson.homepage = `https://${process.env.GITHUB_USERNAME || 'yourusername'}.github.io/${repoName}`;
      
      // Add deploy script
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }
      packageJson.scripts.deploy = 'gh-pages -d dist';
      
      // Add gh-pages dependency
      if (!packageJson.devDependencies) {
        packageJson.devDependencies = {};
      }
      packageJson.devDependencies['gh-pages'] = '^6.1.1';
      
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    } catch (error) {
      console.error('Error updating package.json:', error);
      throw error;
    }
  }

  /**
   * Create GitHub Actions workflow for automatic deployment
   * @param {string} repoPath - Repository path
   * @param {string} repoName - Repository name
   */
  async createGitHubWorkflow(repoPath, repoName) {
    const workflowDir = path.join(repoPath, '.github', 'workflows');
    await fs.mkdir(workflowDir, { recursive: true });
    
    const workflowContent = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
`;

    const workflowPath = path.join(workflowDir, 'deploy.yml');
    await fs.writeFile(workflowPath, workflowContent);
  }

  /**
   * Enable GitHub Pages for the repository
   * @param {Object} octokit - GitHub API client
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   */
  async enableGitHubPages(octokit, owner, repo) {
    try {
      await octokit.rest.repos.update({
        owner: owner,
        repo: repo,
        has_pages: true,
        pages: {
          source: {
            branch: 'gh-pages',
            path: '/'
          }
        }
      });
    } catch (error) {
      console.error('Error enabling GitHub Pages:', error);
      // Don't throw error as this might fail if Pages is already enabled
    }
  }

  /**
   * Get repository information
   * @param {string} accessToken - GitHub access token
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Object>} Repository information
   */
  async getRepository(accessToken, owner, repo) {
    try {
      const octokit = new Octokit({
        auth: accessToken
      });

      const { data } = await octokit.rest.repos.get({
        owner: owner,
        repo: repo
      });

      return data;
    } catch (error) {
      console.error('Error getting repository:', error);
      throw error;
    }
  }
}

module.exports = new GitHubService();


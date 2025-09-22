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
    this.redirectUri = process.env.GITHUB_REDIRECT_URI || `${process.env.BACKEND_URL}/api/github/callback`;
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
   * Deploy portfolio to GitHub Pages using a simpler approach
   * @param {string} accessToken - GitHub access token
   * @param {string} repoOwner - Repository owner
   * @param {string} repoName - Repository name
   * @param {string} portfolioPath - Path to the portfolio files
   * @param {Object} userData - User data for the portfolio
   * @param {Object} githubUser - GitHub user object
   * @returns {Promise<Object>} Deployment result
   */
  async deployToGitHubPages(accessToken, repoOwner, repoName, portfolioPath, userData, githubUser) {
    const tempRepoPath = path.join(__dirname, '../../temp', `repo-${Date.now()}`);
    
    try {
      const octokit = new Octokit({
        auth: accessToken
      });

      console.log('Starting GitHub Pages deployment...');
      
      // Create temp directory
      await fs.mkdir(tempRepoPath, { recursive: true });

      // Clone the repository
      const git = simpleGit();
      const cloneUrl = `https://${accessToken}@github.com/${repoOwner}/${repoName}.git`;
      console.log('Cloning repository...');
      await git.clone(cloneUrl, tempRepoPath);

      // Copy portfolio files to repository
      console.log('Copying portfolio files...');
      await this.copyPortfolioFiles(portfolioPath, tempRepoPath);

      // Fix package.json for GitHub Pages
      await this.fixPackageJson(tempRepoPath, repoName, githubUser);

      // Build the application locally
      console.log('Building application...');
      await this.buildApplication(tempRepoPath);

      // Create a simple static deployment instead of using GitHub Actions
      console.log('Creating static deployment files...');
      await this.createStaticDeployment(tempRepoPath, userData, githubUser);

      // Clean up temp directory
      await fs.rm(tempRepoPath, { recursive: true, force: true });

      return {
        success: true,
        url: `https://${repoOwner}.github.io/${repoName}`,
        repository: `https://github.com/${repoOwner}/${repoName}`
      };
    } catch (error) {
      console.error('Error deploying to GitHub Pages:', error);
      
      // Clean up temp directory on error
      try {
        await fs.rm(tempRepoPath, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Error cleaning up temp directory:', cleanupError);
      }
      
      throw error;
    }
  }

  /**
   * Copy portfolio files to repository directory
   * @param {string} sourcePath - Source portfolio path
   * @param {string} destPath - Destination repository path
   */
  async copyPortfolioFiles(sourcePath, destPath) {
    console.log(`Copying files from ${sourcePath} to ${destPath}`);
    
    const files = await fs.readdir(sourcePath, { withFileTypes: true });
    
    for (const file of files) {
      const sourceFile = path.join(sourcePath, file.name);
      const destFile = path.join(destPath, file.name);
      
      // Skip hidden files and directories (like .git)
      if (file.name.startsWith('.')) {
        continue;
      }
      
      if (file.isDirectory()) {
        await fs.mkdir(destFile, { recursive: true });
        await this.copyPortfolioFiles(sourceFile, destFile);
      } else {
        await fs.copyFile(sourceFile, destFile);
      }
    }
  }

  /**
   * Fix package.json with proper dependencies and configuration
   * @param {string} repoPath - Repository path
   * @param {string} repoName - Repository name
   * @param {Object} githubUser - GitHub user object
   */
  async fixPackageJson(repoPath, repoName, githubUser) {
    const packageJsonPath = path.join(repoPath, 'package.json');
    
    try {
      console.log('Fixing package.json...');
      
      let packageJson = {};
      
      // Try to read existing package.json
      try {
        const existingContent = await fs.readFile(packageJsonPath, 'utf8');
        packageJson = JSON.parse(existingContent);
      } catch (error) {
        console.log('No existing package.json found, creating new one');
      }

      // Create a complete, working package.json
      const fixedPackageJson = {
        name: repoName,
        version: "0.1.0",
        private: true,
        homepage: `https://${githubUser.login}.github.io/${repoName}`,
        dependencies: {
          "@testing-library/jest-dom": "^5.16.4",
          "@testing-library/react": "^13.3.0",
          "@testing-library/user-event": "^13.5.0",
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "react-scripts": "5.0.1",
          "web-vitals": "^2.1.4",
          ...packageJson.dependencies
        },
        scripts: {
          "start": "react-scripts start",
          "build": "react-scripts build",
          "test": "react-scripts test",
          "eject": "react-scripts eject"
        },
        eslintConfig: {
          extends: [
            "react-app",
            "react-app/jest"
          ]
        },
        browserslist: {
          production: [
            ">0.2%",
            "not dead",
            "not op_mini all"
          ],
          development: [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
          ]
        }
      };

      await fs.writeFile(packageJsonPath, JSON.stringify(fixedPackageJson, null, 2));
      console.log('Package.json fixed successfully');
    } catch (error) {
      console.error('Error fixing package.json:', error);
      throw error;
    }
  }

  /**
   * Build the React application with better error handling
   * @param {string} repoPath - Repository path
   */
  async buildApplication(repoPath) {
    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);

    try {
      console.log('Installing dependencies...');
      
      // Remove existing node_modules and package-lock to ensure clean install
      try {
        await execAsync('rm -rf node_modules package-lock.json', { cwd: repoPath });
      } catch (error) {
        console.log('No existing node_modules to clean');
      }

      // Install dependencies with specific flags for better compatibility
      const installCmd = 'npm install --legacy-peer-deps --no-audit --no-fund';
      console.log(`Running: ${installCmd}`);
      
      const installResult = await execAsync(installCmd, {
        cwd: repoPath,
        timeout: 300000, // 5 minutes
        maxBuffer: 1024 * 1024 * 10, // 10MB
        env: {
          ...process.env,
          NODE_ENV: 'production'
        }
      });

      console.log('Dependencies installed successfully');
      if (installResult.stderr) {
        console.log('Install warnings:', installResult.stderr);
      }

      // Build the application
      console.log('Building React application...');
      
      const buildResult = await execAsync('npm run build', {
        cwd: repoPath,
        timeout: 300000, // 5 minutes
        maxBuffer: 1024 * 1024 * 20, // 20MB
        env: {
          ...process.env,
          NODE_ENV: 'production',
          CI: 'false', // Treat warnings as warnings, not errors
          GENERATE_SOURCEMAP: 'false' // Don't generate source maps
        }
      });

      console.log('Application built successfully');
      
      // Verify build directory exists and has content
      const buildDir = path.join(repoPath, 'build');
      const buildExists = await fs.access(buildDir).then(() => true).catch(() => false);
      
      if (!buildExists) {
        throw new Error('Build directory was not created');
      }

      const buildContents = await fs.readdir(buildDir);
      if (buildContents.length === 0) {
        throw new Error('Build directory is empty');
      }

      console.log('Build verification passed');
      
    } catch (error) {
      console.error('Build failed:', error);
      
      // Log more detailed error information
      if (error.stdout) console.log('Build stdout:', error.stdout);
      if (error.stderr) console.log('Build stderr:', error.stderr);
      
      // Provide more helpful error messages
      let errorMessage = 'Build process failed';
      
      if (error.message.includes('react-scripts')) {
        errorMessage = 'React Scripts build failed. Please check your template configuration.';
      } else if (error.message.includes('ENOENT')) {
        errorMessage = 'Build command not found. Please ensure npm is installed.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Build process timed out. Try again or check your template size.';
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Create static deployment by committing build files directly
   * @param {string} repoPath - Repository path
   * @param {Object} userData - User data
   * @param {Object} githubUser - GitHub user object
   */
  async createStaticDeployment(repoPath, userData, githubUser) {
    try {
      const git = simpleGit(repoPath);

      // Configure git
      await git.addConfig('user.name', githubUser.name || 'Portfolio Portal');
      await git.addConfig('user.email', githubUser.email || 'noreply@portfolioportal.com');

      // Create GitHub Pages deployment using gh-pages branch
      console.log('Creating gh-pages branch...');
      
      // Create an orphan gh-pages branch
      await git.checkoutBranch('gh-pages', 'HEAD');
      
      // Remove all files except build directory
      const files = await fs.readdir(repoPath, { withFileTypes: true });
      for (const file of files) {
        if (file.name !== 'build' && file.name !== '.git') {
          const filePath = path.join(repoPath, file.name);
          if (file.isDirectory()) {
            await fs.rm(filePath, { recursive: true, force: true });
          } else {
            await fs.unlink(filePath);
          }
        }
      }

      // Move build contents to root
      const buildPath = path.join(repoPath, 'build');
      const buildFiles = await fs.readdir(buildPath);
      
      for (const file of buildFiles) {
        const srcPath = path.join(buildPath, file);
        const destPath = path.join(repoPath, file);
        await fs.rename(srcPath, destPath);
      }

      // Remove empty build directory
      await fs.rmdir(buildPath);

      // Add all files
      await git.add('.');
      
      // Commit
      await git.commit(`Deploy portfolio for ${userData.name || githubUser.name}`);
      
      // Push to gh-pages branch
      await git.push('origin', 'gh-pages', ['--force']);

      console.log('Static deployment created successfully');
      
    } catch (error) {
      console.error('Error creating static deployment:', error);
      throw error;
    }
  }

  /**
   * Enable GitHub Pages for the repository
   * @param {Object} octokit - GitHub API client
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   */
  async enableGitHubPages(octokit, owner, repo) {
    try {
      // Enable GitHub Pages with gh-pages branch as source
      await octokit.rest.repos.createPagesSite({
        owner: owner,
        repo: repo,
        source: {
          branch: 'gh-pages',
          path: '/'
        }
      });
      
      console.log('GitHub Pages enabled successfully');
    } catch (error) {
      if (error.status === 409) {
        console.log('GitHub Pages already enabled');
      } else {
        console.error('Error enabling GitHub Pages:', error);
        // Don't throw error as deployment may still work
      }
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
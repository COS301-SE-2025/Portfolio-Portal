import React, { useState, useEffect } from 'react';
import { 
  initiateGitHubAuth, 
  deployToGitHubPages, 
  getGitHubUser, 
  revokeGitHubAuth,
  isGitHubAuthenticated 
} from '../services/github.service.js';

/**
 * GitHub Deployment Component
 * 
 * Handles GitHub OAuth flow and portfolio deployment to GitHub Pages
 */
const GitHubDeploy = ({ 
  userData, 
  username, 
  template = 'default',
  className = "",
  variant = "default" 
}) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [githubUser, setGithubUser] = useState(null);
  const [deploymentResult, setDeploymentResult] = useState(null);
  const [error, setError] = useState(null);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    try {
      const authenticated = await isGitHubAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const userResult = await getGitHubUser();
        if (userResult.success) {
          setGithubUser(userResult.user);
        }
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
    }
  };

  const handleGitHubAuth = async () => {
    try {
      setError(null);
      
      // Get current page path for return URL
      const returnUrl = window.location.pathname;
      
      const result = await initiateGitHubAuth(template, returnUrl);
      
      if (result.success) {
        // Store state in localStorage for verification
        localStorage.setItem('github_oauth_state', result.state);
        
        // Redirect to GitHub OAuth
        window.location.href = result.authUrl;
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error initiating GitHub auth:', error);
      setError('Failed to initiate GitHub authorization');
    }
  };

  const handleDeploy = async () => {
    if (!isAuthenticated) {
      setError('Please authorize your GitHub account first');
      return;
    }

    setIsDeploying(true);
    setError(null);
    setDeploymentResult(null);

    try {
      console.log('Starting GitHub deployment...');
      const result = await deployToGitHubPages(userData, username, template);
      
      if (result.success) {
        console.log('Deployment successful:', result.data);
        setDeploymentResult(result.data);
      } else {
        console.error('Deployment failed:', result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error('Error deploying to GitHub Pages:', error);
      setError('Failed to deploy portfolio to GitHub Pages. This process can take several minutes - please try again if it fails.');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleRevokeAuth = async () => {
    try {
      const result = await revokeGitHubAuth();
      
      if (result.success) {
        setIsAuthenticated(false);
        setGithubUser(null);
        setDeploymentResult(null);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error revoking GitHub auth:', error);
      setError('Failed to revoke GitHub authorization');
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    switch (variant) {
      case 'success':
        return `${baseStyles} bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 focus:ring-green-500`;
      case 'primary':
        return `${baseStyles} bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 focus:ring-blue-500`;
      case 'secondary':
        return `${baseStyles} bg-gradient-to-r from-gray-600 to-gray-400 hover:from-gray-700 hover:to-gray-500 focus:ring-gray-500`;
      default:
        return `${baseStyles} bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 focus:ring-purple-500`;
    }
  };

  return (
    <div className={`github-deploy ${className}`}>
      {/* GitHub Authentication Status */}
      {isAuthenticated && githubUser && (
        <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={githubUser.avatar_url} 
                alt={githubUser.name || githubUser.login}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Connected as {githubUser.name || githubUser.login}
                </p>
                <p className="text-xs text-green-600">@{githubUser.login}</p>
              </div>
            </div>
            <button
              onClick={handleRevokeAuth}
              className="text-xs text-green-600 hover:text-green-800 underline"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {/* Deployment Result */}
      {deploymentResult && (
        <div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Deployment Successful!</h4>
          <div className="space-y-2">
            <p className="text-sm text-blue-700">
              <strong>Portfolio URL:</strong>{' '}
              <a 
                href={deploymentResult.portfolioUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {deploymentResult.portfolioUrl}
              </a>
            </p>
            <p className="text-sm text-blue-700">
              <strong>Repository:</strong>{' '}
              <a 
                href={deploymentResult.repositoryUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {deploymentResult.repositoryUrl}
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {!isAuthenticated ? (
          <button
            onClick={handleGitHubAuth}
            className={`${getButtonStyles()} w-full`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>Authorize GitHub</span>
            </div>
          </button>
        ) : (
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className={`${getButtonStyles()} w-full`}
          >
            {isDeploying ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Deploying to GitHub Pages...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>Deploy to GitHub Pages</span>
              </div>
            )}
          </button>
        )}
      </div>

      {/* Info Text */}
      <div className="mt-4 text-sm text-gray-600">
        {!isAuthenticated ? (
          <p>
            Authorize your GitHub account to automatically deploy your portfolio to GitHub Pages.
            Your portfolio will be available at <code>username.github.io/portfolio-name</code>
          </p>
        ) : (
          <p>
            Your portfolio will be deployed to GitHub Pages and available publicly.
            <strong> The deployment process can take 3-5 minutes to complete</strong> - please be patient and don't close this page.
          </p>
        )}
      </div>
    </div>
  );
};

export default GitHubDeploy;


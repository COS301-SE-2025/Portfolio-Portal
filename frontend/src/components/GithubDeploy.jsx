import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, CheckCircle, AlertCircle, Loader2, Copy, Info } from 'lucide-react';
import githubService from '../services/githubService';
const GitHubDeploy = ({ userData, template, onDeploySuccess }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [githubUser, setGithubUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState(null);
  const [error, setError] = useState(null);
  const [repositoryName, setRepositoryName] = useState('');

  useEffect(() => {
    checkAuthStatus();
    // Generate default repository name
    if (userData?.name) {
      setRepositoryName(userData.name.toLowerCase().replace(/\s+/g, '-') + '-portfolio');
    }
  }, [userData]);

  // Handle URL parameters for OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('github_auth');
    const error = urlParams.get('error');

    if (authSuccess === 'success') {
      checkAuthStatus();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      setError(`Authentication failed: ${error}`);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userInfo = await githubService.getUserInfo();
      setIsAuthenticated(userInfo.authenticated);
      setGithubUser(userInfo.user);
      setError(null);
    } catch (error) {
      setIsAuthenticated(false);
      setGithubUser(null);
    }
  };

  const handleAuthenticate = async () => {
    try {
      setIsAuthenticating(true);
      setError(null);

      const currentUrl = window.location.origin + window.location.pathname;
      const authData = await githubService.initiateAuth(template, currentUrl);
      
      // Redirect to GitHub OAuth
      window.location.href = authData.authUrl;
    } catch (error) {
      setError(error.message);
      setIsAuthenticating(false);
    }
  };

  const handleDeploy = async () => {
    if (!repositoryName.trim()) {
      setError('Repository name is required');
      return;
    }

    try {
      setIsDeploying(true);
      setError(null);

      const result = await githubService.deployPortfolio(
        userData,
        template,
        repositoryName.trim()
      );

      setDeploymentResult(result);
      
      if (onDeploySuccess) {
        onDeploySuccess(result);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await githubService.disconnect();
      setIsAuthenticated(false);
      setGithubUser(null);
      setDeploymentResult(null);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // maybe add a toast notification here later?
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (deploymentResult && deploymentResult.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Portfolio Deployed Successfully!
            </h3>
            <p className="text-green-700 mb-4">
              Your portfolio has been deployed to GitHub Pages and will be available shortly.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-green-800">Repository:</span>
                <a
                  href={deploymentResult.repository.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <span>{deploymentResult.repository.full_name}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-green-800">Live Site:</span>
                <a
                  href={deploymentResult.pagesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <span>{deploymentResult.pagesUrl}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-green-100 border border-green-200 rounded p-3 mb-4">
              <p className="text-sm text-green-800">
                <strong>Note:</strong> GitHub Pages deployment may take a few minutes to go live. 
                If the site isn't immediately available, please wait 5-10 minutes and try again.
              </p>
            </div>

            {/* Manual Workflow Instructions */}
            {deploymentResult.manualWorkflowInstructions && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-orange-800 mb-2">
                      Additional Setup Required
                    </h4>
                    <p className="text-sm text-orange-700 mb-3">
                      {deploymentResult.manualWorkflowInstructions.message}
                    </p>
                    
                    <div className="mb-3">
                      <h5 className="font-medium text-orange-800 text-sm mb-2">Steps to complete setup:</h5>
                      <ol className="text-sm text-orange-700 space-y-1 list-decimal list-inside">
                        {deploymentResult.manualWorkflowInstructions.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="bg-orange-100 border border-orange-200 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-orange-800 text-sm">Workflow YAML Content:</h5>
                        <button
                          onClick={() => copyToClipboard(deploymentResult.manualWorkflowInstructions.workflowContent)}
                          className="flex items-center space-x-1 text-xs text-orange-600 hover:text-orange-800"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <pre className="text-xs text-orange-800 bg-white p-2 rounded border overflow-x-auto max-h-40">
                        {deploymentResult.manualWorkflowInstructions.workflowContent}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={() => setDeploymentResult(null)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Deploy Another Portfolio
              </button>
              
              <button
                onClick={handleDisconnect}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Disconnect GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Github className="w-8 h-8 text-gray-800" />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Deploy to GitHub Pages</h3>
          <p className="text-gray-600">Deploy your portfolio as a live website</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!isAuthenticated ? (
        <div className="space-y-4">
          <p className="text-gray-700">
            Connect your GitHub account to deploy your portfolio as a live website on GitHub Pages.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">What happens when you deploy:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Creates a new repository in your GitHub account</li>
              <li>• Uploads your portfolio files with your personal data</li>
              <li>• Sets up GitHub Actions for automatic deployment</li>
              <li>• Enables GitHub Pages for your repository</li>
              <li>• Your portfolio will be live at username.github.io/repository-name</li>
            </ul>
          </div>
          
          <button
            onClick={handleAuthenticate}
            disabled={isAuthenticating}
            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAuthenticating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Github className="w-5 h-5" />
            )}
            <span>
              {isAuthenticating ? 'Connecting...' : 'Connect with GitHub'}
            </span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-green-800">
                  Connected as {githubUser?.login}
                </p>
                <p className="text-sm text-green-600">Ready to deploy your portfolio</p>
              </div>
            </div>
            
            <button
              onClick={handleDisconnect}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Disconnect
            </button>
          </div>

          <div>
            <label htmlFor="repository-name" className="block text-sm font-medium text-gray-700 mb-2">
              Repository Name
            </label>
            <input
              type="text"
              id="repository-name"
              value={repositoryName}
              onChange={(e) => setRepositoryName(e.target.value)}
              placeholder="my-portfolio"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your portfolio will be available at: {githubUser?.login}.github.io/{repositoryName}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Deployment Details:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Template: <strong>{template || 'default'}</strong></li>
              <li>• Repository will be created as <strong>public</strong></li>
              <li>• GitHub Actions will handle automatic deployment</li>
              <li>• Changes to the main branch will trigger redeployment</li>
            </ul>
          </div>

          <button
            onClick={handleDeploy}
            disabled={isDeploying || !repositoryName.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeploying ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ExternalLink className="w-5 h-5" />
            )}
            <span>
              {isDeploying ? 'Deploying...' : 'Deploy to GitHub Pages'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default GitHubDeploy;
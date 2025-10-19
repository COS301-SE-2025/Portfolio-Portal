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

  const themes = {
    default: {
      containerBg: 'bg-white',
      containerBorder: 'border-gray-200',
      headerText: 'text-gray-800',
      subText: 'text-gray-600',
      buttonBg: 'bg-gray-800 hover:bg-gray-900',
      buttonText: 'text-white',
      successContainerBg: 'bg-green-50',
      successContainerBorder: 'border-green-200',
      successIcon: 'text-green-600',
      successHeader: 'text-green-800',
      successText: 'text-green-700',
      successNoteBg: 'bg-green-100',
      successNoteBorder: 'border-green-200',
      successNoteText: 'text-green-800',
      successButtonBg: 'bg-green-600 hover:bg-green-700',
      successButtonText: 'text-white',
      disconnectButtonBg: 'bg-gray-600 hover:bg-gray-700',
      disconnectButtonText: 'text-white',
      errorBg: 'bg-red-50',
      errorBorder: 'border-red-200',
      errorIcon: 'text-red-600',
      errorHeader: 'text-red-800',
      errorText: 'text-red-700',
      connectedBg: 'bg-green-50',
      connectedBorder: 'border-green-200',
      connectedIcon: 'text-green-600',
      connectedText: 'text-green-800',
      connectedSubText: 'text-green-600',
      disconnectText: 'text-gray-600 hover:text-gray-800',
      labelText: 'text-gray-700',
      inputBg: 'bg-white',
      inputBorder: 'border-gray-300 focus:ring-blue-500',
      inputText: 'text-gray-900',
      repoNoteText: 'text-gray-500',
      deployButtonBg: 'bg-blue-600 hover:bg-blue-700',
      deployButtonText: 'text-white',
      manualBg: 'bg-blue-50',
      manualBorder: 'border-blue-200',
      manualIcon: 'text-blue-600',
      manualHeader: 'text-blue-800',
      manualText: 'text-blue-700',
      manualCodeBg: 'bg-blue-100',
      manualCodeBorder: 'border-blue-200',
      manualCodeText: 'text-blue-800',
      manualCopy: 'text-blue-600 hover:text-blue-800',
      manualPreBg: 'bg-white',
      manualPreText: 'text-blue-800',
      backdropBlur: '',
    },
    space: {
      containerBg: 'bg-gray-800/70',
      containerBorder: 'border-gray-700',
      headerText: 'text-white',
      subText: 'text-gray-300',
      buttonBg: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
      buttonText: 'text-white',
      successContainerBg: 'bg-gray-900/50',
      successContainerBorder: 'border-blue-900/50',
      successIcon: 'text-blue-400',
      successHeader: 'text-blue-300',
      successText: 'text-blue-200',
      successNoteBg: 'bg-blue-900/70',
      successNoteBorder: 'border-blue-800/50',
      successNoteText: 'text-blue-200',
      successButtonBg: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
      successButtonText: 'text-white',
      disconnectButtonBg: 'bg-gray-600 hover:bg-gray-700',
      disconnectButtonText: 'text-white',
      errorBg: 'bg-red-900/50',
      errorBorder: 'border-red-800/50',
      errorIcon: 'text-red-400',
      errorHeader: 'text-red-300',
      errorText: 'text-red-200',
      connectedBg: 'bg-gray-900/50',
      connectedBorder: 'border-blue-900/50',
      connectedIcon: 'text-blue-400',
      connectedText: 'text-blue-300',
      connectedSubText: 'text-blue-200',
      disconnectText: 'text-gray-400 hover:text-gray-200',
      labelText: 'text-gray-300',
      inputBg: 'bg-gray-900/70',
      inputBorder: 'border-gray-600 focus:ring-purple-500',
      inputText: 'text-white',
      repoNoteText: 'text-gray-400',
      deployButtonBg: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
      deployButtonText: 'text-white',
      manualBg: 'bg-blue-900/50',
      manualBorder: 'border-blue-800/50',
      manualIcon: 'text-blue-400',
      manualHeader: 'text-blue-300',
      manualText: 'text-blue-200',
      manualCodeBg: 'bg-blue-900/70',
      manualCodeBorder: 'border-blue-800/50',
      manualCodeText: 'text-blue-200',
      manualCopy: 'text-blue-400 hover:text-blue-200',
      manualPreBg: 'bg-gray-900',
      manualPreText: 'text-blue-200',
      backdropBlur: 'backdrop-blur-sm',
    },
    cave: {
      containerBg: 'bg-stone-900/50',
      containerBorder: 'border-stone-500/20',
      headerText: 'text-orange-200',
      subText: 'text-stone-300',
      buttonBg: 'bg-stone-600 hover:bg-stone-700',
      buttonText: 'text-white',
      successContainerBg: 'bg-stone-800/50',
      successContainerBorder: 'border-stone-600/30',
      successIcon: 'text-orange-400',
      successHeader: 'text-orange-200',
      successText: 'text-orange-100',
      successNoteBg: 'bg-stone-700/50',
      successNoteBorder: 'border-stone-600/30',
      successNoteText: 'text-orange-100',
      successButtonBg: 'bg-stone-600 hover:bg-stone-700',
      successButtonText: 'text-white',
      disconnectButtonBg: 'bg-stone-500 hover:bg-stone-600',
      disconnectButtonText: 'text-white',
      errorBg: 'bg-red-900/50',
      errorBorder: 'border-red-700/30',
      errorIcon: 'text-red-400',
      errorHeader: 'text-red-200',
      errorText: 'text-red-100',
      connectedBg: 'bg-stone-800/50',
      connectedBorder: 'border-stone-600/30',
      connectedIcon: 'text-orange-400',
      connectedText: 'text-orange-200',
      connectedSubText: 'text-orange-100',
      disconnectText: 'text-stone-400 hover:text-stone-200',
      labelText: 'text-stone-300',
      inputBg: 'bg-stone-800/70',
      inputBorder: 'border-stone-600/30 focus:ring-orange-500',
      inputText: 'text-white',
      repoNoteText: 'text-stone-400',
      deployButtonBg: 'bg-stone-600 hover:bg-stone-700',
      deployButtonText: 'text-white',
      manualBg: 'bg-stone-800/50',
      manualBorder: 'border-stone-600/30',
      manualIcon: 'text-orange-400',
      manualHeader: 'text-orange-200',
      manualText: 'text-orange-100',
      manualCodeBg: 'bg-stone-700/50',
      manualCodeBorder: 'border-stone-600/30',
      manualCodeText: 'text-orange-100',
      manualCopy: 'text-orange-400 hover:text-orange-200',
      manualPreBg: 'bg-stone-800',
      manualPreText: 'text-orange-100',
      backdropBlur: 'backdrop-blur-sm',
    },
    office: {
      containerBg: 'bg-gray-900/70',
      containerBorder: 'border-blue-400/20',
      headerText: 'text-white',
      subText: 'text-gray-300',
      buttonBg: 'bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600',
      buttonText: 'text-white',
      successContainerBg: 'bg-gray-900/70',
      successContainerBorder: 'border-blue-400/20',
      successIcon: 'text-blue-400',
      successHeader: 'text-white',
      successText: 'text-gray-300',
      successNoteBg: 'bg-blue-900/70',
      successNoteBorder: 'border-blue-800/50',
      successNoteText: 'text-blue-200',
      successButtonBg: 'bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600',
      successButtonText: 'text-white',
      disconnectButtonBg: 'bg-gray-600 hover:bg-gray-700',
      disconnectButtonText: 'text-white',
      errorBg: 'bg-red-900/50',
      errorBorder: 'border-red-800/50',
      errorIcon: 'text-red-400',
      errorHeader: 'text-red-300',
      errorText: 'text-red-200',
      connectedBg: 'bg-gray-900/70',
      connectedBorder: 'border-blue-400/20',
      connectedIcon: 'text-blue-400',
      connectedText: 'text-white',
      connectedSubText: 'text-gray-300',
      disconnectText: 'text-gray-400 hover:text-gray-200',
      labelText: 'text-white',
      inputBg: 'bg-gray-800',
      inputBorder: 'border-blue-400/30 focus:ring-purple-500',
      inputText: 'text-white',
      repoNoteText: 'text-gray-400',
      deployButtonBg: 'bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600',
      deployButtonText: 'text-white',
      manualBg: 'bg-blue-900/50',
      manualBorder: 'border-blue-800/50',
      manualIcon: 'text-blue-400',
      manualHeader: 'text-blue-300',
      manualText: 'text-blue-200',
      manualCodeBg: 'bg-blue-900/70',
      manualCodeBorder: 'border-blue-800/50',
      manualCodeText: 'text-blue-200',
      manualCopy: 'text-blue-400 hover:text-blue-200',
      manualPreBg: 'bg-gray-900',
      manualPreText: 'text-blue-200',
      backdropBlur: 'backdrop-blur-sm',
    },
    labpro: {
      containerBg: 'bg-gray-900/70',
      containerBorder: 'border-emerald-400/20',
      headerText: 'text-emerald-50',
      subText: 'text-gray-300',
      buttonBg: 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500',
      buttonText: 'text-gray-900',
      successContainerBg: 'bg-gray-900/70',
      successContainerBorder: 'border-emerald-400/20',
      successIcon: 'text-emerald-400',
      successHeader: 'text-emerald-50',
      successText: 'text-emerald-200',
      successNoteBg: 'bg-emerald-900/70',
      successNoteBorder: 'border-emerald-800/50',
      successNoteText: 'text-emerald-200',
      successButtonBg: 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500',
      successButtonText: 'text-gray-900',
      disconnectButtonBg: 'bg-gray-600 hover:bg-gray-700',
      disconnectButtonText: 'text-white',
      errorBg: 'bg-red-900/50',
      errorBorder: 'border-red-800/50',
      errorIcon: 'text-red-400',
      errorHeader: 'text-red-300',
      errorText: 'text-red-200',
      connectedBg: 'bg-gray-900/70',
      connectedBorder: 'border-emerald-400/20',
      connectedIcon: 'text-emerald-400',
      connectedText: 'text-emerald-50',
      connectedSubText: 'text-emerald-200',
      disconnectText: 'text-gray-400 hover:text-gray-200',
      labelText: 'text-gray-300',
      inputBg: 'bg-gray-800/70',
      inputBorder: 'border-emerald-400/30 focus:ring-emerald-500',
      inputText: 'text-white',
      repoNoteText: 'text-gray-400',
      deployButtonBg: 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500',
      deployButtonText: 'text-gray-900',
      manualBg: 'bg-emerald-900/50',
      manualBorder: 'border-emerald-800/50',
      manualIcon: 'text-emerald-400',
      manualHeader: 'text-emerald-300',
      manualText: 'text-emerald-200',
      manualCodeBg: 'bg-emerald-900/70',
      manualCodeBorder: 'border-emerald-800/50',
      manualCodeText: 'text-emerald-200',
      manualCopy: 'text-emerald-400 hover:text-emerald-200',
      manualPreBg: 'bg-gray-900',
      manualPreText: 'text-emerald-200',
      backdropBlur: 'backdrop-blur-sm',
    },
    forest: {
      containerBg: 'bg-[#0e0e2c]/70',
      containerBorder: 'border-green-400/20',
      headerText: 'text-green-400',
      subText: 'text-white',
      buttonBg: 'bg-green-400 hover:bg-green-500',
      buttonText: 'text-[#0e0e2c]',
      successContainerBg: 'bg-[#0e0e2c]/70',
      successContainerBorder: 'border-green-400/20',
      successIcon: 'text-green-400',
      successHeader: 'text-green-400',
      successText: 'text-white',
      successNoteBg: 'bg-green-900/70',
      successNoteBorder: 'border-green-800/50',
      successNoteText: 'text-green-200',
      successButtonBg: 'bg-green-400 hover:bg-green-500',
      successButtonText: 'text-[#0e0e2c]',
      disconnectButtonBg: 'bg-gray-600 hover:bg-gray-700',
      disconnectButtonText: 'text-white',
      errorBg: 'bg-red-900/50',
      errorBorder: 'border-red-800/50',
      errorIcon: 'text-red-400',
      errorHeader: 'text-red-300',
      errorText: 'text-red-200',
      connectedBg: 'bg-[#0e0e2c]/70',
      connectedBorder: 'border-green-400/20',
      connectedIcon: 'text-green-400',
      connectedText: 'text-green-400',
      connectedSubText: 'text-white',
      disconnectText: 'text-gray-400 hover:text-gray-200',
      labelText: 'text-white',
      inputBg: 'bg-[#0e0e2c]',
      inputBorder: 'border-green-400/30 focus:ring-green-400',
      inputText: 'text-white',
      repoNoteText: 'text-gray-400',
      deployButtonBg: 'bg-green-400 hover:bg-green-500',
      deployButtonText: 'text-[#0e0e2c]',
      manualBg: 'bg-green-900/50',
      manualBorder: 'border-green-800/50',
      manualIcon: 'text-green-400',
      manualHeader: 'text-green-300',
      manualText: 'text-green-200',
      manualCodeBg: 'bg-green-900/70',
      manualCodeBorder: 'border-green-800/50',
      manualCodeText: 'text-green-200',
      manualCopy: 'text-green-400 hover:text-green-200',
      manualPreBg: 'bg-[#0e0e2c]',
      manualPreText: 'text-green-200',
      backdropBlur: 'backdrop-blur-sm',
    }
  };

  const currentTheme = themes[template] || themes.default;

  // Handle OAuth callback and initial auth check - RUNS ONCE ON MOUNT
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('github_auth');
    const err = urlParams.get('error');

    if (authSuccess === 'success') {
      // Clean URL first to prevent re-triggering
      window.history.replaceState({}, document.title, window.location.pathname);
      // Then check auth status
      checkAuthStatus();
    } else if (err) {
      setError(`Authentication failed: ${err}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // No OAuth callback, just check normal auth status
      checkAuthStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Set repository name when userData changes
  useEffect(() => {
    if (userData?.name) {
      setRepositoryName(userData.name.toLowerCase().replace(/\s+/g, '-') + '-portfolio');
    }
  }, [userData]);

  const checkAuthStatus = async () => {
    try {
      const userInfo = await githubService.getUserInfo();
      setIsAuthenticated(userInfo.authenticated);
      setGithubUser(userInfo.user);
      setError(null);
    } catch (error) {
      setIsAuthenticated(false);
      setGithubUser(null);
      // Only show error if it's not a simple "not authenticated" case
      if (error.message !== 'Not authenticated with GitHub') {
        console.error('Auth check failed:', error);
        setError(error.message);
      }
    }
  };

  const handleAuthenticate = async () => {
    try {
      setIsAuthenticating(true);
      setError(null);
      const currentUrl = window.location.origin + window.location.pathname;
      const authData = await githubService.initiateAuth(template, currentUrl);
      
      // Full page redirect to GitHub OAuth
      window.location.href = authData.authUrl;
    } catch (error) {
      setError(error.message);
      setIsAuthenticating(false);
    }
  };

  const handleDeploy = async () => {
    if (!repositoryName.trim()) {
      setError('Repository name required');
      return;
    }
    try {
      setIsDeploying(true);
      setError(null);
      const result = await githubService.deployPortfolio(userData, template, repositoryName.trim());
      setDeploymentResult(result);
      onDeploySuccess?.(result);
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
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (deploymentResult && deploymentResult.success) {
    return (
      <div className={`${currentTheme.successContainerBg} ${currentTheme.successContainerBorder} border rounded-lg p-6 ${currentTheme.backdropBlur}`}>
        <div className="flex items-start space-x-3">
          <CheckCircle className={`w-6 h-6 ${currentTheme.successIcon} mt-0.5`} />
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${currentTheme.successHeader} mb-2`}>Deployed Successfully!</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${currentTheme.successHeader}`}>Repository:</span>
                <a href={deploymentResult.repository.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                  <span>{deploymentResult.repository.full_name}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${currentTheme.successHeader}`}>Live Site:</span>
                <a href={deploymentResult.pagesUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                  <span>{deploymentResult.pagesUrl}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className={`${currentTheme.successNoteBg} ${currentTheme.successNoteBorder} border rounded p-3 mb-4`}>
              <p className={`text-sm ${currentTheme.successNoteText}`}>May take a few minutes to go live.</p>
            </div>
            {deploymentResult.manualWorkflowInstructions && (
              <div className={`${currentTheme.manualBg} ${currentTheme.manualBorder} border rounded-lg p-4 mb-4`}>
                <div className="flex items-start space-x-2">
                  <Info className={`w-5 h-5 ${currentTheme.manualIcon} mt-0.5`} />
                  <div className="flex-1">
                    <h4 className={`font-medium ${currentTheme.manualHeader} mb-2`}>Additional Setup</h4>
                    <p className={`text-sm ${currentTheme.manualText} mb-3`}>{deploymentResult.manualWorkflowInstructions.message}</p>
                    <ol className={`text-sm ${currentTheme.manualText} space-y-1 list-decimal list-inside mb-3`}>
                      {deploymentResult.manualWorkflowInstructions.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                    <div className={`${currentTheme.manualCodeBg} ${currentTheme.manualCodeBorder} border rounded p-3`}>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className={`font-medium ${currentTheme.manualCodeText} text-sm`}>YAML:</h5>
                        <button 
                          onClick={() => copyToClipboard(deploymentResult.manualWorkflowInstructions.workflowContent)} 
                          className={`flex items-center space-x-1 text-xs ${currentTheme.manualCopy}`}
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <pre className={`text-xs ${currentTheme.manualCodeText} ${currentTheme.manualPreBg} p-2 rounded border overflow-x-auto max-h-40`}>
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
                className={`${currentTheme.successButtonBg} ${currentTheme.successButtonText} px-4 py-2 rounded-lg transition-colors duration-300`}
              >
                Deploy Another
              </button>
              <button 
                onClick={handleDisconnect} 
                className={`${currentTheme.disconnectButtonBg} ${currentTheme.disconnectButtonText} px-4 py-2 rounded-lg transition-colors duration-300`}
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${currentTheme.containerBg} ${currentTheme.containerBorder} border rounded-lg p-6 ${currentTheme.backdropBlur}`}>
      <div className="flex items-center space-x-3 mb-4">
        <Github className={`w-8 h-8 ${currentTheme.headerText}`} />
        <div>
          <h3 className={`text-xl font-semibold ${currentTheme.headerText}`}>Deploy to GitHub Pages</h3>
        </div>
      </div>
      
      {error && (
        <div className={`${currentTheme.errorBg} ${currentTheme.errorBorder} border rounded-lg p-4 mb-4`}>
          <div className="flex items-start space-x-2">
            <AlertCircle className={`w-5 h-5 ${currentTheme.errorIcon} mt-0.5`} />
            <p className={`text-sm ${currentTheme.errorText}`}>{error}</p>
          </div>
        </div>
      )}
      
      {!isAuthenticated ? (
        <button
          onClick={handleAuthenticate}
          disabled={isAuthenticating}
          className={`${currentTheme.buttonBg} ${currentTheme.buttonText} w-full px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300 disabled:opacity-50`}
        >
          {isAuthenticating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Github className="w-5 h-5" />
          )}
          <span>{isAuthenticating ? 'Connecting...' : 'Connect GitHub'}</span>
        </button>
      ) : (
        <div className="space-y-4">
          <div className={`flex items-center justify-between ${currentTheme.connectedBg} ${currentTheme.connectedBorder} border rounded-lg p-4`}>
            <div className="flex items-center space-x-3">
              <CheckCircle className={`w-6 h-6 ${currentTheme.connectedIcon}`} />
              <p className={`font-medium ${currentTheme.connectedText}`}>
                Connected as {githubUser?.login}
              </p>
            </div>
            <button 
              onClick={handleDisconnect} 
              className={`text-sm underline ${currentTheme.disconnectText}`}
            >
              Disconnect
            </button>
          </div>
          
          <div>
            <label 
              htmlFor="repo-name" 
              className={`block text-sm font-medium ${currentTheme.labelText} mb-2`}
            >
              Repository Name
            </label>
            <input
              id="repo-name"
              type="text"
              value={repositoryName}
              onChange={(e) => setRepositoryName(e.target.value)}
              className={`w-full px-3 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.inputText}`}
              placeholder="my-portfolio"
            />
            <p className={`text-xs mt-1 ${currentTheme.repoNoteText}`}>
              {githubUser?.login}.github.io/{repositoryName}
            </p>
          </div>
          
          <button
            onClick={handleDeploy}
            disabled={isDeploying || !repositoryName.trim()}
            className={`w-full ${currentTheme.deployButtonBg} ${currentTheme.deployButtonText} px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isDeploying ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ExternalLink className="w-5 h-5" />
            )}
            <span>{isDeploying ? 'Deploying...' : 'Deploy'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default GitHubDeploy;
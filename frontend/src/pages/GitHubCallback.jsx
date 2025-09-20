import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleGitHubCallback } from '../services/github.service.js';

/**
 * GitHub OAuth Callback Page
 * 
 * Handles the redirect from GitHub OAuth and processes the authorization code
 */
const GitHubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing GitHub authorization...');

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Check if this is a redirect from the backend (success case)
        const success = searchParams.get('success');
        const userParam = searchParams.get('user');
        
        if (success === 'true' && userParam) {
          setStatus('success');
          setMessage('GitHub authorization successful! Redirecting...');
          
          // Clean up stored state
          localStorage.removeItem('github_oauth_state');
          
          // Redirect to templates page after a short delay
          setTimeout(() => {
            navigate('/templates');
          }, 2000);
          return;
        }

        // Check if this is an error redirect from the backend
        const error = searchParams.get('error');
        const message = searchParams.get('message');
        
        if (error) {
          setStatus('error');
          setMessage(message ? decodeURIComponent(message) : `GitHub authorization failed: ${error}`);
          return;
        }

        // Legacy flow: direct callback from GitHub (should not happen with new setup)
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code || !state) {
          setStatus('error');
          setMessage('Missing authorization code or state parameter');
          return;
        }

        // Verify state parameter
        const storedState = localStorage.getItem('github_oauth_state');
        if (storedState !== state) {
          setStatus('error');
          setMessage('Invalid state parameter');
          return;
        }

        // Process the callback (legacy flow)
        const result = await handleGitHubCallback(code, state);
        
        if (result.success) {
          setStatus('success');
          setMessage('GitHub authorization successful! Redirecting...');
          
          // Clean up stored state
          localStorage.removeItem('github_oauth_state');
          
          // Redirect to templates page after a short delay
          setTimeout(() => {
            navigate('/templates');
          }, 2000);
        } else {
          setStatus('error');
          if (result.error === 'EXPIRED_CODE') {
            setMessage('GitHub authorization code has expired. Please try authorizing again.');
          } else {
            setMessage(result.error || 'Failed to complete GitHub authorization');
          }
        }
      } catch (error) {
        console.error('Error processing GitHub callback:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during authorization');
      }
    };

    processCallback();
  }, [searchParams, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        );
      case 'success':
        return (
          <div className="rounded-full h-12 w-12 bg-green-100 flex items-center justify-center mx-auto">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center mx-auto">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          {getStatusIcon()}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          GitHub Authorization
        </h1>
        
        <p className={`text-lg ${getStatusColor()} mb-6`}>
          {message}
        </p>
        
        {status === 'error' && (
          <div className="space-y-4">
            <button
              onClick={() => navigate('/templates')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Templates
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Authorization Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-sm text-gray-500">
            You will be redirected automatically...
          </div>
        )}
        
        {status === 'processing' && (
          <div className="text-sm text-gray-500">
            Please wait while we complete the authorization...
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubCallback;

# GitHub Pages Integration Setup

This document explains how to set up the GitHub Pages deployment functionality for the Portfolio Portal.

## Prerequisites

1. A GitHub account
2. Node.js and npm installed
3. The Portfolio Portal application running

## GitHub OAuth App Setup

### 1. Create a GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the following details:
   - **Application name**: Portfolio Portal
   - **Homepage URL**: `http://localhost:5173` (for development) or your production URL
   - **Authorization callback URL**: `http://localhost:5173/github/callback` (for development) or your production callback URL
4. Click "Register application"
5. Note down the **Client ID** and **Client Secret**

### 2. Environment Variables

Add the following environment variables to your server's `.env` file:

```env
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_REDIRECT_URI=http://localhost:5173/github/callback
GITHUB_USERNAME=your_github_username_here

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Session Configuration
SESSION_SECRET=your_session_secret_here
```

### 3. Install Dependencies

Run the following command in the server directory to install the new dependencies:

```bash
cd server
npm install
```

## How It Works

### 1. OAuth Flow

1. User clicks "Authorize GitHub" button
2. User is redirected to GitHub for authorization
3. After authorization, GitHub redirects back to `/github/callback`
4. The application exchanges the authorization code for an access token
5. User's GitHub information is stored in the session

### 2. Deployment Process

1. User clicks "Deploy to GitHub Pages"
2. The application:
   - Creates a new repository on the user's GitHub account
   - Copies the portfolio template files to the repository
   - Updates package.json for GitHub Pages deployment
   - Creates a GitHub Actions workflow for automatic deployment
   - Enables GitHub Pages for the repository
   - Pushes the code to the repository

### 3. GitHub Actions Workflow

The integration automatically creates a GitHub Actions workflow that:

- Builds the React application
- Deploys it to GitHub Pages
- Runs on every push to the main branch

## API Endpoints

### Backend Endpoints

- `GET /api/github/auth` - Initiate GitHub OAuth flow
- `GET /api/github/callback` - Handle GitHub OAuth callback
- `POST /api/github/deploy` - Deploy portfolio to GitHub Pages
- `GET /api/github/user` - Get authenticated GitHub user information
- `DELETE /api/github/auth` - Revoke GitHub authorization

### Frontend Routes

- `/github/callback` - GitHub OAuth callback page

## Components

### GitHubDeploy Component

A reusable React component that handles:

- GitHub OAuth flow
- Portfolio deployment to GitHub Pages
- Status display and error handling

Usage:

```jsx
import GitHubDeploy from "../components/GitHubDeploy.jsx";

<GitHubDeploy template="forest" variant="success" className="text-white" />;
```

## Security Considerations

1. **State Parameter**: The OAuth flow uses a random state parameter to prevent CSRF attacks
2. **Session Management**: Access tokens are stored in server-side sessions
3. **HTTPS**: In production, ensure all communication is over HTTPS
4. **Environment Variables**: Keep your GitHub OAuth credentials secure

## Troubleshooting

### Common Issues

1. **"Invalid state parameter"**: This usually means the OAuth flow was interrupted or the session expired
2. **"Repository already exists"**: The user already has a repository with the same name
3. **"GitHub authorization required"**: The user needs to authorize their GitHub account first
4. **404 GitHub page**: The GitHub OAuth app callback URL is not configured correctly
5. **401 Unauthorized**: Session management issues between frontend and backend
6. **500 Internal Server Error**: Missing environment variables or server configuration issues

### Debug Steps

1. Check that all environment variables are set correctly
2. Verify the GitHub OAuth app callback URL matches your application
3. Check the browser console and server logs for error messages
4. Ensure the user has the necessary GitHub permissions
5. Verify CORS configuration allows credentials
6. Check that session middleware is properly configured

### Current Known Issues and Solutions

#### Issue 1: 404 GitHub Page

**Problem**: GitHub OAuth redirects to a 404 page
**Solution**:

- Create a GitHub OAuth app in GitHub Settings → Developer settings → OAuth Apps
- Set the callback URL to: `http://localhost:5173/github/callback` (for development)
- Add the Client ID and Secret to your environment variables

#### Issue 2: 401 Unauthorized on GitHub endpoints

**Problem**: GitHub user endpoint returns 401 even when not authenticated
**Solution**: This is expected behavior - the endpoint correctly returns 401 when no session exists

#### Issue 3: Portfolio download 500 error

**Problem**: Portfolio download fails with internal server error
**Solution**:

- Check server logs for specific error messages
- Ensure all template directories exist
- Verify file permissions for temp directory creation

#### Issue 4: Frontend API configuration

**Problem**: Frontend can't connect to backend API
**Solution**:

- Create `.env` file in frontend directory with: `VITE_API_URL=http://localhost:5050`
- Or the API service will default to `http://localhost:5050` if no environment variable is set

## Production Deployment

For production deployment:

1. Update the GitHub OAuth app settings with your production URLs
2. Set the environment variables for your production environment
3. Ensure your production server supports HTTPS
4. Update the `GITHUB_REDIRECT_URI` to point to your production callback URL

## Features

- ✅ GitHub OAuth authorization
- ✅ Automatic repository creation
- ✅ Portfolio deployment to GitHub Pages
- ✅ GitHub Actions workflow setup
- ✅ Error handling and user feedback
- ✅ Session management
- ✅ Responsive UI components

## Future Enhancements

- Custom domain support
- Multiple deployment options (Vercel, Netlify, etc.)
- Portfolio template customization before deployment
- Deployment status tracking
- Rollback functionality

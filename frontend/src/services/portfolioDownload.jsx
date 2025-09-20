import api from './api.service.js';
import { deployToGitHubPages, isGitHubAuthenticated } from './github.service.js';

/**
 * Portfolio Download Service
 * 
 * Handles the download functionality for portfolio websites
 */

export const downloadPortfolio = async (setIsDownloading, templateName = 'default') => {
  setIsDownloading(true);
  
  try {
    let cvData = null;
    
    // Try to fetch CV data from API, but don't fail if it's not available
    try {
      const cvResponse = await api.get('/cv/me');
      cvData = cvResponse.data;
    } catch (cvError) {
      console.warn('Could not fetch CV data:', cvError.message);
      // Continue with default data
    }

    // Map CV data to required format, with fallbacks
    const userData = {
      name: cvData?.personal_info?.name || 'Portfolio User',
      title: cvData?.personal_info?.description || 'Professional',
      summary: cvData?.summary || 'A passionate professional with expertise in various domains.',
      skills: cvData?.skills || ['JavaScript', 'React', 'Node.js', 'Python', 'Problem Solving'],
      experience: cvData?.experience || [
        {
          title: 'Software Developer',
          company: 'Tech Company',
          startDate: '2022',
          endDate: 'Present',
          description: 'Developed and maintained web applications using modern technologies.'
        }
      ],
      education: cvData?.education || [
        {
          degree: 'Bachelor of Science',
          institution: 'University',
          startDate: '2018',
          endDate: '2022',
          fieldOfStudy: 'Computer Science'
        }
      ],
      projects: cvData?.projects || [
        {
          title: 'Portfolio Website',
          description: 'A modern, responsive portfolio website built with React and Three.js.',
          technologies: ['React', 'Three.js', 'Tailwind CSS']
        }
      ],
      contact: {
        email: cvData?.personal_info?.email || 'contact@example.com',
        phone: cvData?.personal_info?.phone || '+1 (555) 123-4567',
        linkedin: cvData?.personal_info?.linkedin || 'https://linkedin.com/in/yourprofile',
        github: cvData?.personal_info?.github || 'https://github.com/yourusername'  
      }
    };

    const username = userData.name.replace(/\s+/g, '') || 'User';

    // Prepare the data for the API
    const portfolioData = {
      userData,
      username,
      template: templateName
    };

    // Make API call to download portfolio with better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
    
    try {
      const response = await fetch('/api/portfolio/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download failed:', response.status, errorText);
        throw new Error(`Failed to generate portfolio: ${response.status} ${response.statusText}`);
      }

      // Check if response is actually a file
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/zip')) {
        const errorText = await response.text();
        console.error('Unexpected response type:', contentType, errorText);
        throw new Error('Server returned unexpected response format');
      }

      // Create blob and download with progress indication
      console.log('Starting file download...');
      const blob = await response.blob();
      console.log('File downloaded, size:', blob.size, 'bytes');
      
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${username}Portfolio.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Download completed successfully');
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Download timed out. The portfolio file might be too large. Please try again.');
      }
      throw error;
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('Error downloading portfolio:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to download portfolio. Please try again.' 
    };
  } finally {
    setIsDownloading(false);
  }
};

/**
 * Deploy portfolio to GitHub Pages
 * @param {Function} setIsDeploying - State setter for deployment status
 * @param {string} templateName - Template name
 * @returns {Promise<Object>} Deployment result
 */
export const deployPortfolioToGitHub = async (setIsDeploying, templateName = 'default') => {
  setIsDeploying(true);
  
  try {
    // Check if user is authenticated with GitHub
    const authenticated = await isGitHubAuthenticated();
    if (!authenticated) {
      return {
        success: false,
        error: 'GitHub authorization required. Please authorize your GitHub account first.',
        requiresAuth: true
      };
    }

    let cvData = null;
    
    // Try to fetch CV data from API, but don't fail if it's not available
    try {
      const cvResponse = await api.get('/cv/me');
      cvData = cvResponse.data;
    } catch (cvError) {
      console.warn('Could not fetch CV data:', cvError.message);
      // Continue with default data
    }

    // Map CV data to required format, with fallbacks
    const userData = {
      name: cvData?.personal_info?.name || 'Portfolio User',
      title: cvData?.personal_info?.description || 'Professional',
      summary: cvData?.summary || 'A passionate professional with expertise in various domains.',
      skills: cvData?.skills || ['JavaScript', 'React', 'Node.js', 'Python', 'Problem Solving'],
      experience: cvData?.experience || [
        {
          title: 'Software Developer',
          company: 'Tech Company',
          startDate: '2022',
          endDate: 'Present',
          description: 'Developed and maintained web applications using modern technologies.'
        }
      ],
      education: cvData?.education || [
        {
          degree: 'Bachelor of Science',
          institution: 'University',
          startDate: '2018',
          endDate: '2022',
          fieldOfStudy: 'Computer Science'
        }
      ],
      projects: cvData?.projects || [
        {
          title: 'Portfolio Website',
          description: 'A modern, responsive portfolio website built with React and Three.js.',
          technologies: ['React', 'Three.js', 'Tailwind CSS']
        }
      ],
      contact: {
        email: cvData?.personal_info?.email || 'contact@example.com',
        phone: cvData?.personal_info?.phone || '+1 (555) 123-4567',
        linkedin: cvData?.personal_info?.linkedin || 'https://linkedin.com/in/yourprofile',
        github: cvData?.personal_info?.github || 'https://github.com/yourusername'  
      }
    };

    const username = userData.name.replace(/\s+/g, '') || 'User';

    // Deploy to GitHub Pages
    const result = await deployToGitHubPages(userData, username, templateName);
    
    return result;
    
  } catch (error) {
    console.error('Error deploying portfolio to GitHub:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to deploy portfolio to GitHub Pages. Please try again.' 
    };
  } finally {
    setIsDeploying(false);
  }
};

/**
 * Download Button Component
 * Reusable component for the download functionality
 */
export const DownloadButton = ({ isDownloading, onClick, className = "", variant = "default" }) => {
  const baseClasses = "px-8 py-3 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    default: "bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white",
    space: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
    office: "bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white"
  };

  return (
    <button
      onClick={onClick}
      disabled={isDownloading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {isDownloading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating Portfolio...
        </span>
      ) : (
        <span className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Portfolio Website
        </span>
      )}
    </button>
  );
};
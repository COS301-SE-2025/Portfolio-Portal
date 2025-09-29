import React from 'react';

/**
 * Portfolio Download Service
 * 
 * Handles the download functionality for portfolio websites
 */

const API_BASE_URL = 'http://localhost:5050';

export const downloadPortfolio = async (setIsDownloading, templateName = 'default') => {
  setIsDownloading(true);
  
  try {
    // Use placeholder data for server template
    const userData = {
      name: 'Portfolio User',
      title: 'Professional',
      summary: 'A passionate professional with expertise in various domains.',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Problem Solving'],
      experience: [
        {
          title: 'Software Developer',
          company: 'Tech Company',
          startDate: '2022',
          endDate: 'Present',
          description: 'Developed and maintained web applications using modern technologies.'
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science',
          institution: 'University',
          startDate: '2018',
          endDate: '2022',
          fieldOfStudy: 'Computer Science'
        }
      ],
      projects: [
        {
          title: 'Portfolio Website',
          description: 'A modern, responsive portfolio website built with React and Three.js.',
          technologies: ['React', 'Three.js', 'Tailwind CSS']
        }
      ],
      contact: {
        email: 'contact@example.com',
        phone: '+1 (555) 123-4567',
        linkedin: 'https://linkedin.com/in/yourprofile',
        github: 'https://github.com/yourusername'  
      }
    };

    const username = userData.name.replace(/\s+/g, '') || 'User';

    // Prepare the data for the API
    const portfolioData = {
      userData,
      username,
      template: templateName
    };

    // Make API call to download portfolio
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/portfolio/download`, {
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
        throw new Error('Server did not return a valid ZIP file');
      }

      // Get the response as blob
      const blob = await response.blob();
      
      // Create download URL
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${username}Portfolio.zip`);
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      
      return { success: true };
      
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Download timed out. Please try again.');
      }
      throw error;
    }
    
  } catch (error) {
    console.error('Portfolio download error:', error);
    return { success: false, error: error.message || 'Failed to download portfolio' };
  } finally {
    setIsDownloading(false);
  }
};

/**
 * Download Button Component
 */
export const DownloadButton = ({ isDownloading, onClick, className = "", variant = "default" }) => {
  const getButtonStyles = () => {
    const baseStyles = "px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    switch (variant) {
      case 'forest':
        return `${baseStyles} bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 focus:ring-green-500`;
      case 'office':
        return `${baseStyles} bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 focus:ring-blue-500`;
      case 'space':
        return `${baseStyles} bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 focus:ring-purple-500`;
      case 'cave':
        return `${baseStyles} bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500 focus:ring-emerald-500`;
      default:
        return `${baseStyles} bg-gradient-to-r from-gray-600 to-gray-400 hover:from-gray-700 hover:to-gray-500 focus:ring-gray-500`;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={isDownloading}
      className={`${getButtonStyles()} ${className} w-full`}
    >
      {isDownloading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Preparing Download...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download Portfolio</span>
        </div>
      )}
    </button>
  );
};

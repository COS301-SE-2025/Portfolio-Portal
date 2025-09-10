import api from './api.service.js';

/**
 * Portfolio Download Service
 * 
 * Handles the download functionality for portfolio websites
 */

export const downloadPortfolio = async (setIsDownloading, templateName = 'default') => {
  setIsDownloading(true);
  
  try {
    // Fetch CV data from API
    const cvResponse = await api.get('/cv/me');
    const cvData = cvResponse.data;

    // Map CV data to required format
    const userData = {
      name: cvData.personal_info?.name || 'Portfolio User',
      title: cvData.personal_info?.description || 'Professional',
      summary: cvData.summary || '',
      skills: cvData.skills || [],
      experience: cvData.experience || [],
      education: cvData.education || [],
      projects: cvData.projects || [],
      contact: {
        email: cvData.personal_info?.email || '',
        phone: cvData.personal_info?.phone || '',
        linkedin: cvData.personal_info?.linkedin || '',
        github: cvData.personal_info?.github || ''  
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
    const response = await fetch('/api/portfolio/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(portfolioData),
    });

    if (!response.ok) {
      throw new Error('Failed to generate portfolio');
    }

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${username}Portfolio.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
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
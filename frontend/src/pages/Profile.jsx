import React, { useState, useEffect } from 'react';
import { User, FileText, ExternalLink, Calendar, Globe } from 'lucide-react';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken'); // Assuming JWT is stored here
      
      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePortfolioClick = (portfolioUrl) => {
    window.open(portfolioUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-medium mb-2">Error loading profile</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchProfileData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 rounded-full p-3">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profileData?.user?.name}</h1>
              <p className="text-gray-600">{profileData?.user?.email}</p>
              <p className="text-sm text-gray-500">
                Member since {formatDate(profileData?.user?.created_at)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CV Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-6 w-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">CV Status</h2>
            </div>
            
            {profileData?.cv ? (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-800 font-medium">CV Uploaded</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>File:</strong> {profileData.cv.filename}</p>
                  <p><strong>Uploaded:</strong> {formatDate(profileData.cv.uploaded_at)}</p>
                  <p><strong>Size:</strong> {profileData.cv.file_size ? `${(profileData.cv.file_size / 1024).toFixed(1)} KB` : 'N/A'}</p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-800 font-medium">No CV uploaded</span>
                </div>
                <p className="text-yellow-700 text-sm mt-2">
                  Upload your CV to generate a portfolio website
                </p>
              </div>
            )}
          </div>

          {/* Portfolio Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="h-6 w-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Portfolio Website</h2>
            </div>

            {profileData?.portfolio ? (
              <div 
                className="cursor-pointer group"
                onClick={() => handlePortfolioClick(profileData.portfolio.portfolio_url)}
              >
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
                  {/* Preview Thumbnail */}
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-32 flex items-center justify-center">
                    <Globe className="h-12 w-12 text-white opacity-80" />
                  </div>
                  
                  {/* Portfolio Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {profileData.user.name}'s Portfolio
                      </h3>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Generated on {formatDate(profileData.portfolio.created_at)}
                    </p>
                    <div className="bg-blue-50 border border-blue-100 rounded px-3 py-2">
                      <p className="text-xs text-blue-700 font-mono truncate">
                        {profileData.portfolio.portfolio_url}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Click to visit your portfolio website
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-900 font-medium mb-2">No Portfolio Generated</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Your portfolio website will appear here once generated from your CV
                </p>
                {profileData?.cv && (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Generate Portfolio
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-6 w-6 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Account Age</p>
              <p className="font-semibold text-gray-900">
                {Math.floor((new Date() - new Date(profileData?.user?.created_at)) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FileText className="h-6 w-6 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">CV Status</p>
              <p className="font-semibold text-gray-900">
                {profileData?.cv ? 'Uploaded' : 'Pending'}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Globe className="h-6 w-6 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Portfolio</p>
              <p className="font-semibold text-gray-900">
                {profileData?.portfolio ? 'Active' : 'Not Generated'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
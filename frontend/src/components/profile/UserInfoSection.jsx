import { useTheme } from '../../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { User, Mail, Briefcase, FileText, Loader2 } from 'lucide-react';

const UserInfoSection = ({ 
  userId, 
  userData, 
  editData, 
  setEditData, 
  isEditing,
  onDataUpdate 
}) => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize editData when userData changes
  useEffect(() => {
    if (userData && isEditing && !editData.name) {
      setEditData({
        name: userData.name || '',
        email: userData.email || '',
        title: userData.title || '',
        bio: userData.bio || ''
      });
    }
  }, [userData, isEditing, editData.name, setEditData]);

  // Fetch user profile data if not provided
  useEffect(() => {
    if (userId && !userData) {
      fetchUserProfile();
    }
  }, [userId, userData]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/users/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (onDataUpdate) {
          onDataUpdate(data);
        }
      } else if (response.status === 404) {
        // Profile doesn't exist yet, that's okay
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const getDisplayValue = (field) => {
    return userData?.[field] || 'Not specified';
  };

  if (loading) {
    return (
      <div className={`rounded-xl p-6 mb-8 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading profile...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 mb-8 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <User className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Personal Information
        </h3>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <User className="w-4 h-4" />
            Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your name"
              className={`w-full p-3 rounded-lg border transition-colors ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
            />
          ) : (
            <p className={`p-3 min-h-[48px] flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {getDisplayValue('name')}
            </p>
          )}
        </div>

        <div>
          <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Mail className="w-4 h-4" />
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              value={editData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              className={`w-full p-3 rounded-lg border transition-colors ${
                editData.email && !validateEmail(editData.email) 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : ''
              } ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
            />
          ) : (
            <p className={`p-3 min-h-[48px] flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {getDisplayValue('email')}
            </p>
          )}
          {isEditing && editData.email && !validateEmail(editData.email) && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
          )}
        </div>

        <div>
          <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Briefcase className="w-4 h-4" />
            Job Title
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter your job title"
              className={`w-full p-3 rounded-lg border transition-colors ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
            />
          ) : (
            <p className={`p-3 min-h-[48px] flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {getDisplayValue('title')}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <FileText className="w-4 h-4" />
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={editData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              placeholder="Tell us about yourself..."
              className={`w-full p-3 rounded-lg border transition-colors resize-none ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
            />
          ) : (
            <div className={`p-3 min-h-[100px] ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {userData?.bio ? (
                <p className="whitespace-pre-wrap">{userData.bio}</p>
              ) : (
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} italic`}>
                  No bio provided
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoSection;
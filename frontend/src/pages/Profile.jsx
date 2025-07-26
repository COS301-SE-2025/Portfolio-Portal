import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, ExternalLink, Award, Code, FileText, Edit3, Save, X, Github, Linkedin } from 'lucide-react';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileData) {
      fetchProfileStats();
    }
  }, [profileData]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/users/me', {
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
      setEditForm({
        name: data.name || '',
        bio: data.bio || '',
        about_paragraphs: data.about_paragraphs || [''],
        skills: data.skills || [],
        certifications: data.certifications || [],
        linkedin: data.linkedin || '',
        github: data.github || '',
        cv_url: data.cv_url || ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/users/me/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const statsData = await response.json();
        setStats(statsData);
      } else {
        // Stats endpoint not available, calculate basic completion locally
        calculateLocalStats();
      }
    } catch (err) {
      console.log('Stats endpoint not available, calculating locally');
      calculateLocalStats();
    }
  };

  const calculateLocalStats = () => {
    if (!profileData) return;
    
    const fields = [
      'name', 'email', 'bio', 'linkedin', 'github', 'cv_url'
    ];
    
    let completedFields = [];
    let totalFields = fields.length;
    
    // Check basic fields
    fields.forEach(field => {
      if (profileData[field] && profileData[field].trim()) {
        completedFields.push(field.charAt(0).toUpperCase() + field.slice(1));
      }
    });
    
    // Check array fields
    if (profileData.skills && profileData.skills.length > 0) {
      completedFields.push('Skills');
      totalFields++;
    } else {
      totalFields++;
    }
    
    if (profileData.certifications && profileData.certifications.length > 0) {
      completedFields.push('Certifications');
      totalFields++;
    } else {
      totalFields++;
    }
    
    if (profileData.about_paragraphs && profileData.about_paragraphs.length > 0 && profileData.about_paragraphs.some(p => p.trim())) {
      completedFields.push('About');
      totalFields++;
    } else {
      totalFields++;
    }
    
    const completionPercentage = Math.round((completedFields.length / totalFields) * 100);
    
    setStats({
      profileComplete: completedFields.length,
      totalFields: totalFields,
      completionPercentage: completionPercentage,
      completedFields: completedFields
    });
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/users/me/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedData = await response.json();
      setProfileData({ ...profileData, ...updatedData });
      setIsEditing(false);
      // Recalculate stats after update
      setTimeout(() => {
        if (stats) {
          fetchProfileStats();
        }
      }, 100);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const addSkill = () => {
    if (editForm.skills.length < 50) {
      setEditForm({ ...editForm, skills: [...editForm.skills, ''] });
    }
  };

  const removeSkill = (index) => {
    setEditForm({
      ...editForm,
      skills: editForm.skills.filter((_, i) => i !== index)
    });
  };

  const updateSkill = (index, value) => {
    const newSkills = [...editForm.skills];
    newSkills[index] = value;
    setEditForm({ ...editForm, skills: newSkills });
  };

  const addCertification = () => {
    if (editForm.certifications.length < 20) {
      setEditForm({ ...editForm, certifications: [...editForm.certifications, ''] });
    }
  };

  const removeCertification = (index) => {
    setEditForm({
      ...editForm,
      certifications: editForm.certifications.filter((_, i) => i !== index)
    });
  };

  const updateCertification = (index, value) => {
    const newCertifications = [...editForm.certifications];
    newCertifications[index] = value;
    setEditForm({ ...editForm, certifications: newCertifications });
  };

  const addAboutParagraph = () => {
    if (editForm.about_paragraphs.length < 10) {
      setEditForm({ ...editForm, about_paragraphs: [...editForm.about_paragraphs, ''] });
    }
  };

  const removeAboutParagraph = (index) => {
    setEditForm({
      ...editForm,
      about_paragraphs: editForm.about_paragraphs.filter((_, i) => i !== index)
    });
  };

  const updateAboutParagraph = (index, value) => {
    const newParagraphs = [...editForm.about_paragraphs];
    newParagraphs[index] = value;
    setEditForm({ ...editForm, about_paragraphs: newParagraphs });
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-full p-3">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profileData?.name}</h1>
                <div className="flex items-center space-x-2 text-gray-600 mt-1">
                  <Mail className="h-4 w-4" />
                  <span>{profileData?.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {formatDate(profileData?.created_at)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Profile Completion Stats */}
        {stats && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h2>
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${stats.completionPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats.completionPercentage}% Complete
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {stats.profileComplete} of {stats.totalFields} fields completed
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    maxLength={500}
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-xs text-gray-500 mt-1">{editForm.bio.length}/500 characters</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Name:</span>
                  <p className="text-gray-900">{profileData?.name || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Bio:</span>
                  <p className="text-gray-900">{profileData?.bio || 'No bio added yet'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Links</h2>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={editForm.linkedin}
                    onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                  <input
                    type="url"
                    value={editForm.github}
                    onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CV URL</label>
                  <input
                    type="url"
                    value={editForm.cv_url}
                    onChange={(e) => setEditForm({ ...editForm, cv_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/your-cv.pdf"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {profileData?.linkedin && (
                  <a
                    href={profileData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {profileData?.github && (
                  <a
                    href={profileData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-800 hover:text-gray-600"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub Profile</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {profileData?.cv_url && (
                  <a
                    href={profileData.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-green-600 hover:text-green-800"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View CV</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {!profileData?.linkedin && !profileData?.github && !profileData?.cv_url && (
                  <p className="text-gray-500 text-sm">No social links added yet</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
          
          {isEditing ? (
            <div className="space-y-4">
              {editForm.about_paragraphs.map((paragraph, index) => (
                <div key={index} className="flex space-x-2">
                  <textarea
                    value={paragraph}
                    onChange={(e) => updateAboutParagraph(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    maxLength={1000}
                    placeholder={`About paragraph ${index + 1}...`}
                  />
                  <button
                    onClick={() => removeAboutParagraph(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {editForm.about_paragraphs.length < 10 && (
                <button
                  onClick={addAboutParagraph}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add paragraph
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {profileData?.about_paragraphs && profileData.about_paragraphs.length > 0 ? (
                profileData.about_paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No about information added yet</p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Skills */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Code className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                {editForm.skills.map((skill, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={50}
                      placeholder="Enter skill..."
                    />
                    <button
                      onClick={() => removeSkill(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {editForm.skills.length < 50 && (
                  <button
                    onClick={addSkill}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add skill
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profileData?.skills && profileData.skills.length > 0 ? (
                  profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No skills added yet</p>
                )}
              </div>
            )}
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                {editForm.certifications.map((cert, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={cert}
                      onChange={(e) => updateCertification(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={200}
                      placeholder="Enter certification..."
                    />
                    <button
                      onClick={() => removeCertification(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {editForm.certifications.length < 20 && (
                  <button
                    onClick={addCertification}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add certification
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {profileData?.certifications && profileData.certifications.length > 0 ? (
                  profileData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="bg-green-50 border border-green-200 rounded-lg p-3"
                    >
                      <span className="text-green-800 text-sm">{cert}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No certifications added yet</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveProfile}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
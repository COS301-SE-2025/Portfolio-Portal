import React, { useEffect, useState } from 'react';
import { User, Mail, Github, Linkedin, FileText, Award, Code, Calendar, Edit, ExternalLink, X, Camera } from 'lucide-react';
import { profileService } from '../../services/profile.service';
import { useTheme } from '../../contexts/ThemeContext';
import Modal from './Modal';
import ProfileEditForm from './ProfileEditForm';

const ProfileSection = () => {
  const { isDark } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profilePictureError, setProfilePictureError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const imageUrl = localStorage.getItem('imageURL');
    if (imageUrl) setProfileImage(imageUrl);

    const token = localStorage.getItem('token');
    if (!token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await profileService.getProfile(token);
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    if (!token) return setProfilePictureError("User not logged in");

    let tempUrl = null;
    try {
      setUploading(true);
      setProfilePictureError(null);
      
      tempUrl = URL.createObjectURL(file);
      setProfileImage(tempUrl);
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed');
      if (file.size > 5 * 1024 * 1024) throw new Error('File size too large. Maximum size is 5MB');

      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await profileService.uploadProfilePicture(formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data?.profile_picture_url) {
        const newUrl = response.data.profile_picture_url;
        localStorage.setItem('imageURL', newUrl);
        setProfileImage(newUrl);
      } else {
        throw new Error('Failed to get new profile picture URL');
      }
    } catch (err) {
      setProfilePictureError(err.message || 'Failed to upload profile picture');
      const oldUrl = localStorage.getItem('imageURL');
      setProfileImage(oldUrl);
    } finally {
      setUploading(false);
      if (tempUrl) URL.revokeObjectURL(tempUrl);
      e.target.value = null;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-7xl mx-auto p-6">
      <div className={`border rounded-lg p-4 ${isDark ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-200'}`}>
        <p className={`font-medium ${isDark ? 'text-red-300' : 'text-red-600'}`}>Error loading profile</p>
        <p className={`text-sm mt-1 ${isDark ? 'text-red-400' : 'text-red-500'}`}>{error}</p>
      </div>
    </div>
  );
  
  if (!profile) return null;

  const portfolioPlaceholders = [
    {
      title: "Space themed Portfolio",
      image: "https://starwalk.space/gallery/images/what-is-space/1920x1080.jpg?w=300&h=200&fit=crop",
      description: "Full-stack e-commerce solution",
      link: "http://localhost:5173/space"
    },
    {
      title: "Forest themed Portfolio", 
      image: "https://wallpaperonline.co.za/wp-content/uploads/2022/01/Screen-Shot-2020-11-04-at-00.17.25-e1632808578117.jpg?w=300&h=200&fit=crop",
      description: "React-based productivity tool",
      link: "http://localhost:5173/forest"
    },
    {
      title: "Office themed Portfolio",
      image: "https://digital-walls.com/cdn/shop/products/Globe.png?v=1666086840&width=533?w=300&h=200&fit=crop", 
      description: "Interactive analytics platform",
      link: "http://localhost:5173/office"
    }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100'
    }`}>
      <div className="max-w-7xl mx-auto p-6">
        {profilePictureError && (
          <div className={`fixed top-4 right-4 rounded-lg shadow-lg z-50 animate-slideIn ${
            isDark ? 'bg-red-900/80 text-red-200' : 'bg-red-500 text-white'
          } px-6 py-4`}>
            <div className="flex items-center space-x-3">
              <X className="w-5 h-5" />
              <span className="font-medium">{profilePictureError}</span>
              <button 
                className={`rounded-full p-1 transition-colors ${isDark ? 'hover:bg-red-800' : 'hover:bg-red-600'}`} 
                onClick={() => setProfilePictureError(null)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <div className={`rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className="relative">
                <div className={`h-40 relative ${
                  isDark 
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600' 
                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500'
                }`}>
                  <div className="absolute -bottom-20 left-8">
                    <div className="relative group">
                      <div className={`w-40 h-40 rounded-full border-6 border-white shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                        isDark ? 'bg-slate-700' : 'bg-gray-100'
                      }`}>
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <div className={`w-full h-full rounded-full flex items-center justify-center text-3xl font-bold ${
                            isDark 
                              ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white' 
                              : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                          }`}>
                            {profile.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                      </div>
                      <label htmlFor="profile-picture-upload" className={`absolute -bottom-2 -right-2 rounded-full p-3 cursor-pointer hover:scale-110 transition-all duration-200 shadow-lg group-hover:shadow-xl ${
                        isDark 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`} title="Change profile picture">
                        <Camera className="w-5 h-5 text-white" />
                        <input 
                          id="profile-picture-upload" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleProfilePictureUpload} 
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="pt-24 px-8 pb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div className="flex-1">
                      <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {profile.name}
                      </h1>
                      {profile.bio && (
                        <p className={`text-xl mb-3 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {profile.bio}
                        </p>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" /> 
                        <span>Member since {formatDate(profile.created_at)}</span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <button 
                        onClick={() => setIsModalOpen(true)} 
                        className={`inline-flex items-center px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                          isDark 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500' 
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                        }`}
                      >
                        <Edit className="w-5 h-5 mr-2" /> 
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className={`rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300 ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                  isDark 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}>
                  <Mail className="w-4 h-4 text-white" />
                </div>
                Contact Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}`, text: 'Send Email', color: isDark ? 'from-blue-600 to-indigo-600' : 'from-blue-500 to-blue-600' },
                  { icon: Github, label: 'GitHub', value: profile.github, href: profile.github, text: 'View Profile', color: isDark ? 'from-gray-700 to-gray-800' : 'from-gray-700 to-gray-800' },
                  { icon: Linkedin, label: 'LinkedIn', value: profile.linkedin, href: profile.linkedin, text: 'Connect', color: isDark ? 'from-blue-700 to-indigo-700' : 'from-blue-600 to-blue-700' },
                  { icon: FileText, label: 'Resume/CV', value: profile.cv_url, href: profile.cv_url, text: 'Download CV', color: isDark ? 'from-green-600 to-teal-600' : 'from-green-500 to-green-600' }
                ].filter(item => item.value).map(({ icon: Icon, label, value, href, text, color }) => (
                  <div key={label} className="group">
                    <div className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
                      isDark ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-gray-50 hover:bg-gray-100'
                    }`}>
                      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {label}
                        </p>
                        <a 
                          href={href} 
                          target={label !== 'Email' ? '_blank' : undefined} 
                          rel={label !== 'Email' ? 'noopener noreferrer' : undefined} 
                          className={`font-medium transition-colors duration-200 flex items-center group ${
                            isDark ? 'text-gray-200 hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'
                          }`}
                        >
                          {text}
                          <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div className={`rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300 ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                  isDark 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  <User className="w-4 h-4 text-white" />
                </div>
                About Me
              </h2>
              {profile.about_paragraphs && profile.about_paragraphs.length > 0 ? (
                <div className="space-y-4">
                  {profile.about_paragraphs.map((paragraph, index) => (
                    <p key={index} className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isDark ? 'bg-gradient-to-r from-purple-500/30 to-indigo-500/30' : 'bg-gradient-to-r from-purple-100 to-pink-100'
                  }`}>
                    <User className={`w-10 h-10 ${isDark ? 'text-purple-400' : 'text-purple-400'}`} />
                  </div>
                  <p className={`text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Share your story with the world
                  </p>
                  <button 
                    onClick={() => setIsModalOpen(true)} 
                    className={`inline-flex items-center px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      isDark 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    }`}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Add About Information
                  </button>
                </div>
              )}
            </div>

            {/* Skills Section */}
            <div className={`rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300 ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                  isDark 
                    ? 'bg-gradient-to-r from-green-500 to-teal-500' 
                    : 'bg-gradient-to-r from-green-500 to-teal-500'
                }`}>
                  <Code className="w-4 h-4 text-white" />
                </div>
                Skills & Technologies
              </h2>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 transform hover:scale-105 cursor-default ${
                        isDark 
                          ? 'bg-gradient-to-r from-blue-500/30 to-indigo-500/30 text-blue-200 hover:from-blue-500/40 hover:to-indigo-500/40' 
                          : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 hover:from-blue-200 hover:to-purple-200'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isDark ? 'bg-gradient-to-r from-green-500/30 to-teal-500/30' : 'bg-gradient-to-r from-green-100 to-teal-100'
                  }`}>
                    <Code className={`w-10 h-10 ${isDark ? 'text-green-400' : 'text-green-400'}`} />
                  </div>
                  <p className={`text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Showcase your technical expertise
                  </p>
                  <button 
                    onClick={() => setIsModalOpen(true)} 
                    className={`inline-flex items-center px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      isDark 
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600' 
                        : 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600'
                    }`}
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Add Skills
                  </button>
                </div>
              )}
            </div>

            {/* Certifications Section */}
            <div className={`rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300 ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                  isDark 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                }`}>
                  <Award className="w-4 h-4 text-white" />
                </div>
                Certifications & Awards
              </h2>
              {profile.certifications && profile.certifications.length > 0 ? (
                <div className="space-y-4">
                  {profile.certifications.map((cert, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-xl border-l-4 transition-shadow duration-200 hover:shadow-md ${
                        isDark 
                          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500' 
                          : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400'
                      }`}
                    >
                      <div className="flex items-center">
                        <Award className={`w-5 h-5 mr-3 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        <p className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{cert}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isDark ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30' : 'bg-gradient-to-r from-yellow-100 to-orange-100'
                  }`}>
                    <Award className={`w-10 h-10 ${isDark ? 'text-yellow-400' : 'text-yellow-400'}`} />
                  </div>
                  <p className={`text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Display your achievements and certifications
                  </p>
                  <button 
                    onClick={() => setIsModalOpen(true)} 
                    className={`inline-flex items-center px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      isDark 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600' 
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                    }`}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Add Certifications
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Portfolio */}
          <div className="space-y-8">
            <div className={`rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300 ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-2xl font-bold flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                    isDark 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                  }`}>
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  Portfolio Websites
                </h2>
                <span className={`text-sm rounded-full px-3 py-1 ${
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
                }`}>
                  {portfolioPlaceholders.length} Templates
                </span>
              </div>
              <div className="grid gap-6">
                {portfolioPlaceholders.map((project, index) => (
                  <a 
                    key={index} 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group cursor-pointer transform hover:scale-105 transition-all duration-300 block"
                  >
                    <div className={`relative overflow-hidden rounded-xl shadow-lg ${
                      isDark ? 'bg-slate-700/50' : 'bg-gray-100'
                    }`}>
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 transition-all duration-300 group-hover:opacity-100 opacity-0 ${
                        isDark 
                          ? 'bg-gradient-to-t from-black/70 via-transparent to-transparent' 
                          : 'bg-gradient-to-t from-black/60 via-transparent to-transparent'
                      }`}>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between text-white">
                            <div>
                              <h3 className="font-bold text-lg">{project.title}</h3>
                              <p className="text-sm opacity-90">{project.description}</p>
                            </div>
                            <div className={`rounded-full p-2 ${
                              isDark ? 'bg-white/20' : 'bg-white/20'
                            } backdrop-blur-sm`}>
                              <ExternalLink className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 px-2">
                      <h3 className={`font-semibold transition-colors duration-200 ${
                        isDark ? 'text-gray-200 group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'
                      }`}>
                        {project.title}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {project.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProfileEditForm 
          profile={profile} 
          onUpdate={(updatedProfile) => { 
            setProfile(updatedProfile); 
            setIsModalOpen(false); 
          }} 
          onClose={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default ProfileSection;
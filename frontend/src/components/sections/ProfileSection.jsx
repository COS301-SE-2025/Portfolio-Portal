import React, { useEffect, useState } from 'react';
import { User, Mail, Github, Linkedin, FileText, Award, Code, Calendar, Edit, Trash2, ExternalLink, X, Camera, MapPin, Briefcase } from 'lucide-react';
import { profileService } from '../../services/profile.service';
import './ProfileSection.css';

// Modal Component with improved animations
const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    document.body.classList.toggle('modal-open', isOpen);
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform animate-slideUp">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Edit Profile</h3>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Profile Edit Form Component
const ProfileEditForm = ({ profile, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    bio: profile.bio || '',
    about: Array.isArray(profile.about_paragraphs) ? profile.about_paragraphs.join('\n\n') : '',
    skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
    certifications: Array.isArray(profile.certifications) ? profile.certifications.join(', ') : '',
    linkedin: profile.linkedin || '',
    github: profile.github || '',
    cv_url: profile.cv_url || ''
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    const updatedData = {
      ...formData,
      about_paragraphs: formData.about.split('\n\n').map(p => p.trim()).filter(Boolean),
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      certifications: formData.certifications.split(',').map(c => c.trim()).filter(Boolean)
    };

    try {
      const token = localStorage.getItem('token');
      const response = await profileService.updateProfile(token, updatedData);
      if (response.status >= 200 && response.status < 300) {
        onUpdate(response.data);
      } else {
        setErrors(response.data?.details || [response.data?.error || 'Failed to update profile']);
      }
    } catch (err) {
      setErrors([err.response?.data?.error || err.message || 'Failed to update profile']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const inputFields = [
    { id: 'name', label: 'Name', type: 'text' },
    { id: 'bio', label: 'Bio', type: 'textarea', rows: 3 },
    { id: 'about', label: 'About (each paragraph separated by a blank line)', type: 'textarea', rows: 10 },
    { id: 'skills', label: 'Skills (comma-separated)', type: 'text' },
    { id: 'certifications', label: 'Certifications (comma-separated)', type: 'text' },
    { id: 'linkedin', label: 'LinkedIn URL', type: 'text' },
    { id: 'github', label: 'GitHub URL', type: 'text' },
    { id: 'cv_url', label: 'CV URL', type: 'text' }
  ];

  return (
    <div className="space-y-6">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <X className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700 font-semibold">Please fix the following errors:</p>
          </div>
          <ul className="list-disc ml-7 space-y-1">
            {errors.map((error, i) => (
              <li key={i} className="text-red-600 text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="grid gap-6">
        {inputFields.map(({ id, label, type, rows }) => (
          <div key={id} className="space-y-2">
            <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
              {label}
            </label>
            {type === 'textarea' ? (
              <textarea
                id={id}
                value={formData[id]}
                onChange={handleChange(id)}
                rows={rows}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder={`Enter your ${label.toLowerCase()}...`}
              />
            ) : (
              <input
                id={id}
                value={formData[id]}
                onChange={handleChange(id)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder={`Enter your ${label.toLowerCase()}...`}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
        <button 
          type="button" 
          onClick={onClose} 
          className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={isLoading} 
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const ProfileSection = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profilePictureError, setProfilePictureError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const cachedImageUrl = localStorage.getItem('imageURL');
    if (cachedImageUrl) setProfile(prev => ({ ...prev, profile_picture_url: cachedImageUrl }));

    const fetchProfile = async () => {
      try {
        const response = await profileService.getProfile(token);
        const publicImageUrl = response.data.profile_picture_url?.replace('/sign/', '/public/');
        localStorage.setItem('imageURL', publicImageUrl);
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const getInitials = (name) => name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    if (!token) return setProfilePictureError("User not logged in");

    try {
      setUploading(true);
      setProfilePictureError(null);
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed');
      }
      if (file.size > 5 * 1024 * 1024) throw new Error('File size too large. Maximum size is 5MB');

      const response = await profileService.uploadProfilePicture(token, file);
      if (response.status >= 200 && response.status < 300) {
        setProfile({ ...profile, profile_picture_url: response.data.profile_picture_url });
      } else {
        throw new Error(response.data?.error || 'Failed to upload profile picture');
      }
    } catch (err) {
      setProfilePictureError(err.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (error) return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 font-medium">Error loading profile</p>
        <p className="text-red-500 text-sm mt-1">{error}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {profilePictureError && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slideIn">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <X className="w-5 h-5" />
              </div>
              <span className="font-medium">{profilePictureError}</span>
              <button 
                className="ml-4 hover:bg-red-600 rounded-full p-1 transition-colors" 
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
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 h-40 relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute -bottom-20 left-8">
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-full border-6 border-white shadow-2xl bg-gray-100 overflow-hidden transform hover:scale-105 transition-all duration-300">
                        {profile.profile_picture_url ? (
                          <img 
                            src={profile.profile_picture_url || '/default-profile.jpg'} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = '/default-profile.jpg'} 
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                            {getInitials(profile.name)}
                          </div>
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                          </div>
                        )}
                      </div>
                      <label htmlFor="profile-picture-upload" className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-3 cursor-pointer hover:bg-blue-700 hover:scale-110 transition-all duration-200 shadow-lg group-hover:shadow-xl" title="Change profile picture">
                        <Camera className="w-5 h-5" />
                        <input id="profile-picture-upload" type="file" accept="image/*" className="hidden" onChange={handleProfilePictureUpload} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="pt-24 px-8 pb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div className="flex-1">
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                      {profile.bio && (
                        <p className="text-xl text-gray-600 mb-3 leading-relaxed">{profile.bio}</p>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" /> 
                        <span>Member since {formatDate(profile.created_at)}</span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                Contact Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}`, text: 'Send Email', color: 'from-blue-500 to-blue-600' },
                  { icon: Github, label: 'GitHub', value: profile.github, href: profile.github, text: 'View Profile', color: 'from-gray-700 to-gray-800' },
                  { icon: Linkedin, label: 'LinkedIn', value: profile.linkedin, href: profile.linkedin, text: 'Connect', color: 'from-blue-600 to-blue-700' },
                  { icon: FileText, label: 'Resume/CV', value: profile.cv_url, href: profile.cv_url, text: 'Download CV', color: 'from-green-500 to-green-600' }
                ].filter(item => item.value).map(({ icon: Icon, label, value, href, text, color }) => (
                  <div key={label} className="group">
                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                        <a 
                          href={href} 
                          target={label !== 'Email' ? '_blank' : undefined} 
                          rel={label !== 'Email' ? 'noopener noreferrer' : undefined} 
                          className="text-gray-900 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center group"
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
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-white" />
                </div>
                About Me
              </h2>
              {profile.about_paragraphs && profile.about_paragraphs.length > 0 ? (
                <div className="space-y-4">
                  {profile.about_paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed text-lg">{paragraph}</p>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-purple-400" />
                  </div>
                  <p className="text-gray-500 text-lg mb-4">Share your story with the world</p>
                  <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Add About Information
                  </button>
                </div>
              )}
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <Code className="w-4 h-4 text-white" />
                </div>
                Skills & Technologies
              </h2>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold hover:from-blue-200 hover:to-purple-200 transition-all duration-200 transform hover:scale-105 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="w-10 h-10 text-green-400" />
                  </div>
                  <p className="text-gray-500 text-lg mb-4">Showcase your technical expertise</p>
                  <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Add Skills
                  </button>
                </div>
              )}
            </div>

            {/* Certifications Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <Award className="w-4 h-4 text-white" />
                </div>
                Certifications & Awards
              </h2>
              {profile.certifications && profile.certifications.length > 0 ? (
                <div className="space-y-4">
                  {profile.certifications.map((cert, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-400 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center">
                        <Award className="w-5 h-5 text-yellow-600 mr-3" />
                        <p className="font-semibold text-gray-900">{cert}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-10 h-10 text-yellow-400" />
                  </div>
                  <p className="text-gray-500 text-lg mb-4">Display your achievements and certifications</p>
                  <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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
            {/* Portfolio Websites */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  Portfolio Websites
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
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
                    <div className="relative overflow-hidden rounded-xl bg-gray-100 shadow-lg">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between text-white">
                            <div>
                              <h3 className="font-bold text-lg">{project.title}</h3>
                              <p className="text-sm opacity-90">{project.description}</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                              <ExternalLink className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 px-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{project.description}</p>
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
import React, { useEffect, useState } from 'react';
import { User, Mail, Github, Linkedin, FileText, Award, Code, Calendar, Edit, Trash2, ExternalLink } from 'lucide-react';
import { profileService } from '../../services/profile.service';

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    document.body.classList.toggle('modal-open', isOpen);
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <button onClick={onClose} className="float-right text-gray-500 hover:text-gray-700">Close</button>
        {children}
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
    <div className="space-y-4">
      {errors.length > 0 && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <p className="text-red-700">Please fix the following errors:</p>
          <ul className="list-disc ml-5">{errors.map((error, i) => <li key={i}>{error}</li>)}</ul>
        </div>
      )}
      {inputFields.map(({ id, label, type, rows }) => (
        <div key={id}>
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
          {type === 'textarea' ? (
            <textarea
              id={id}
              value={formData[id]}
              onChange={handleChange(id)}
              rows={rows}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          ) : (
            <input
              id={id}
              value={formData[id]}
              onChange={handleChange(id)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          )}
        </div>
      ))}
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
        <button onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">
          {isLoading ? 'Saving...' : 'Save'}
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
      title: "E-commerce Platform",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
      description: "Full-stack e-commerce solution"
    },
    {
      title: "Task Management App", 
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop",
      description: "React-based productivity tool"
    },
    {
      title: "Data Visualization Dashboard",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop", 
      description: "Interactive analytics platform"
    },
    {
      title: "Mobile Banking App",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop",
      description: "Secure financial application"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {profilePictureError && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <span>{profilePictureError}</span>
          <button className="absolute top-0 right-0 px-2 py-1" onClick={() => setProfilePictureError(null)}>×</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
              <div className="absolute -bottom-16 left-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-100 overflow-hidden">
                    {profile.profile_picture_url ? (
                      <img 
                        src={profile.profile_picture_url || '/default-profile.jpg'} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = '/default-profile.jpg'} 
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                        {getInitials(profile.name)}
                      </div>
                    )}
                  </div>
                  <label htmlFor="profile-picture-upload" className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-all duration-200 shadow-md" title="Change profile picture">
                    <Edit className="w-4 h-4" />
                    <input id="profile-picture-upload" type="file" accept="image/*" className="hidden" onChange={handleProfilePictureUpload} />
                  </label>
                </div>
              </div>
            </div>
            <div className="pt-20 px-6 pb-6">
              <div className="flex justify-end mb-4">
                <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Edit className="w-4 h-4 mr-2" /> Edit Profile
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                {profile.bio && <p className="text-lg text-gray-600 mt-2">{profile.bio}</p>}
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Calendar className="w-4 h-4 mr-1" /> Member since {formatDate(profile.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" /> Contact Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}`, text: 'View Profile' },
                { icon: Github, label: 'GitHub', value: profile.github, href: profile.github, text: 'View Profile' },
                { icon: Linkedin, label: 'LinkedIn', value: profile.linkedin, href: profile.linkedin, text: 'View Profile' },
                { icon: FileText, label: 'Resume/CV', value: profile.cv_url, href: profile.cv_url, text: 'Download CV' }
              ].filter(item => item.value).map(({ icon: Icon, label, value, href, text }) => (
                <div key={label} className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${
                    label === 'GitHub' ? 'bg-gray-100' : 
                    label === 'Resume/CV' ? 'bg-green-100' : 
                    'bg-blue-100'
                  } rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{label}</p>
                    <a 
                      href={href} 
                      target={label !== 'Email' ? '_blank' : undefined} 
                      rel={label !== 'Email' ? 'noopener noreferrer' : undefined} 
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {text}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" /> About
            </h2>
            {profile.about_paragraphs && profile.about_paragraphs.length > 0 ? (
              <div className="space-y-3">
                {profile.about_paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed">{paragraph}</p>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No about information added yet.</p>
                <button onClick={() => setIsModalOpen(true)} className="mt-3 text-blue-600 hover:underline text-sm">
                  Add about information
                </button>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Code className="w-5 h-5 mr-2 text-blue-600" /> Skills
            </h2>
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Code className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No skills added yet.</p>
                <button onClick={() => setIsModalOpen(true)} className="mt-3 text-blue-600 hover:underline text-sm">
                  Add skills
                </button>
              </div>
            )}
          </div>

          {/* Certifications Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" /> Certifications
            </h2>
            {profile.certifications && profile.certifications.length > 0 ? (
              <div className="space-y-3">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{cert}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No certifications added yet.</p>
                <button onClick={() => setIsModalOpen(true)} className="mt-3 text-blue-600 hover:underline text-sm">
                  Add certifications
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Portfolio */}
        <div className="space-y-6">
          {/* Portfolio Websites */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your portfolio Websites</h2>
            <div className="grid gap-4">
              {portfolioPlaceholders.map((project, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg bg-gray-100">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium text-gray-900 text-sm">{project.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{project.description}</p>
                  </div>
                </div>
              ))}
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
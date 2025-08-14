import React, { useEffect, useState } from 'react';
import { User, Mail, Github, Linkedin, FileText, Award, Code, Calendar, Edit } from 'lucide-react';
import { profileService } from '../../services/profile.service';

// Custom Hooks
const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      // Use cached image URL if available
      const cachedImageUrl = localStorage.getItem('imageURL');
      if (cachedImageUrl) {
        setProfile(prev => ({ ...prev, profile_picture_url: cachedImageUrl }));
      }

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

  return { profile, setProfile, loading, error };
};

const useProfilePicture = (profile, setProfile) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (file) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("User not logged in");
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPEG, PNG, WebP, and GIF images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Maximum size is 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      const response = await profileService.uploadProfilePicture(token, file);
      
      if (response.status >= 200 && response.status < 300) {
        setProfile({ ...profile, profile_picture_url: response.data.profile_picture_url });
      } else {
        throw new Error(response.data?.error || 'Failed to upload profile picture');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  return { uploading, error, setError, handleUpload };
};

// Utility Functions
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric'
});

const getInitials = (name) => name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();

// Reusable Components
const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    document.body.classList.toggle('modal-open', isOpen);
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <button onClick={onClose} className="float-right text-gray-500 hover:text-gray-700">
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

const ErrorToast = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
      <span className="block sm:inline">{error}</span>
      <button className="absolute top-0 right-0 px-2 py-1" onClick={onClose}>×</button>
    </div>
  );
};

const ProfilePicture = ({ profile, onUpload, uploading }) => (
  <div className="absolute -bottom-16 left-6">
    <div className="relative group">
      <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-100 overflow-hidden">
        {profile.profile_picture_url ? (
          <img
            src={profile.profile_picture_url || '/default-profile.jpg'}
            alt="Profile"
            onError={(e) => { e.target.src = '/default-profile.jpg'; }}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(profile.name)}
          </div>
        )}
      </div>
      <label 
        htmlFor="profile-picture-upload"
        className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-all duration-200 shadow-md"
        title="Change profile picture"
      >
        <Edit className="w-4 h-4" />
        <input
          id="profile-picture-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
        />
      </label>
    </div>
  </div>
);

const ContactItem = ({ icon: Icon, label, value, href, isEmail = false }) => (
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
      <Icon className="w-5 h-5 text-blue-600" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <a 
        href={isEmail ? `mailto:${value}` : href || value} 
        target={isEmail ? undefined : "_blank"}
        rel={isEmail ? undefined : "noopener noreferrer"}
        className="text-blue-600 hover:underline"
      >
        {isEmail ? value : 'View Profile'}
      </a>
    </div>
  </div>
);

const Section = ({ title, icon: Icon, children, isEmpty, onEdit, emptyMessage }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
      <Icon className="w-5 h-5 mr-2 text-blue-600" />
      {title}
    </h2>
    {isEmpty ? (
      <div className="text-center py-8">
        <Icon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">{emptyMessage}</p>
        <button onClick={onEdit} className="mt-3 text-blue-600 hover:underline text-sm">
          Add {title.toLowerCase()}
        </button>
      </div>
    ) : children}
  </div>
);

const ProfileEditForm = ({ profile, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    bio: profile.bio || '',
    about: Array.isArray(profile.about_paragraphs) ? profile.about_paragraphs.join('\n\n') : '',
    skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
    certifications: Array.isArray(profile.certifications) ? profile.certifications.join(', ') : '',
    linkedin: profile.linkedin || '',
    github: profile.github || '',
    cvUrl: profile.cv_url || '',
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    const updatedData = {
      name: formData.name.trim(),
      bio: formData.bio.trim(),
      about_paragraphs: formData.about.split('\n\n').map(p => p.trim()).filter(p => p !== ''),
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
      certifications: formData.certifications.split(',').map(c => c.trim()).filter(c => c !== ''),
      linkedin: formData.linkedin.trim(),
      github: formData.github.trim(),
      cv_url: formData.cvUrl.trim(),
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

  const formFields = [
    { key: 'name', label: 'Name', type: 'input' },
    { key: 'bio', label: 'Bio', type: 'textarea', rows: 3 },
    { key: 'about', label: 'About (each paragraph separated by a blank line)', type: 'textarea', rows: 10 },
    { key: 'skills', label: 'Skills (comma-separated)', type: 'input' },
    { key: 'certifications', label: 'Certifications (comma-separated)', type: 'input' },
    { key: 'linkedin', label: 'LinkedIn URL', type: 'input' },
    { key: 'github', label: 'GitHub URL', type: 'input' },
    { key: 'cvUrl', label: 'CV URL', type: 'input' },
  ];

  return (
    <div className="space-y-4">
      {errors.length > 0 && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <p className="text-red-700">Please fix the following errors:</p>
          <ul className="list-disc ml-5">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {formFields.map(({ key, label, type, rows }) => (
        <div key={key}>
          <label htmlFor={key} className="block text-sm font-medium text-gray-700">{label}</label>
          {type === 'textarea' ? (
            <textarea
              id={key}
              value={formData[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              rows={rows}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          ) : (
            <input
              id={key}
              value={formData[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          )}
        </div>
      ))}
      
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
          Cancel
        </button>
        <button onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

const ProfileSection = () => {
  const { profile, setProfile, loading, error } = useProfile();
  const { uploading, error: pictureError, setError: setPictureError, handleUpload } = useProfilePicture(profile, setProfile);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleUpdateProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">Error loading profile</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const contactItems = [
    { icon: Mail, label: 'Email', value: profile.email, isEmail: true },
    profile.github && { icon: Github, label: 'GitHub', value: profile.github },
    profile.linkedin && { icon: Linkedin, label: 'LinkedIn', value: profile.linkedin },
    profile.cv_url && { icon: FileText, label: 'Resume/CV', value: profile.cv_url },
  ].filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <ErrorToast error={pictureError} onClose={() => setPictureError(null)} />

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
          <ProfilePicture profile={profile} onUpload={handleUpload} uploading={uploading} />
        </div>

        <div className="pt-20 px-6 pb-6">
          <div className="flex justify-end">
            <button 
              onClick={handleEditClick} 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>

          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
            {profile.bio && <p className="text-lg text-gray-600 mt-2">{profile.bio}</p>}
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <Calendar className="w-4 h-4 mr-1" />
              Member since {formatDate(profile.created_at)}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ProfileEditForm profile={profile} onUpdate={handleUpdateProfile} onClose={handleCloseModal} />
      </Modal>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Mail className="w-5 h-5 mr-2 text-blue-600" />
          Contact Information
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {contactItems.map((item, index) => (
            <ContactItem key={index} {...item} />
          ))}
        </div>
      </div>

      {/* About Section */}
      <Section 
        title="About" 
        icon={User} 
        isEmpty={!profile.about_paragraphs} 
        onEdit={handleEditClick}
        emptyMessage="No about information added yet."
      >
        <div className="prose text-gray-700">
          {Array.isArray(profile.about_paragraphs) ? (
            profile.about_paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
            ))
          ) : (
            <p>{profile.about_paragraphs}</p>
          )}
        </div>
      </Section>

      {/* Skills Section */}
      <Section 
        title="Skills" 
        icon={Code} 
        isEmpty={!profile.skills} 
        onEdit={handleEditClick}
        emptyMessage="No skills added yet."
      >
        <div className="flex flex-wrap gap-2">
          {Array.isArray(profile.skills) ? (
            profile.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))
          ) : (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {profile.skills}
            </span>
          )}
        </div>
      </Section>

      {/* Certifications Section */}
      <Section 
        title="Certifications" 
        icon={Award} 
        isEmpty={!profile.certifications} 
        onEdit={handleEditClick}
        emptyMessage="No certifications added yet."
      >
        <div className="space-y-3">
          {Array.isArray(profile.certifications) ? (
            profile.certifications.map((cert, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{cert}</p>
              </div>
            ))
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{profile.certifications}</p>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
};

export default ProfileSection;
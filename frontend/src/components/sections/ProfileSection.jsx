import React, { useEffect, useState } from 'react';
import { User, Mail, Github, Linkedin, FileText, Award, Code, Calendar, Edit } from 'lucide-react';
import { profileService } from '../../services/profile.service';

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    // Cleanup to remove the class when the component unmounts or isOpen changes
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <button onClick={onClose} className="float-right text-gray-500 hover:text-gray-700">
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

// Profile Edit Form Component
const ProfileEditForm = ({ profile, onUpdate, onClose }) => {
  const [name, setName] = useState(profile.name || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [about, setAbout] = useState(Array.isArray(profile.about_paragraphs) ? profile.about_paragraphs.join('\n\n') : '');
  const [skills, setSkills] = useState(Array.isArray(profile.skills) ? profile.skills.join(', ') : '');
  const [certifications, setCertifications] = useState(Array.isArray(profile.certifications) ? profile.certifications.join(', ') : '');
  const [linkedin, setLinkedin] = useState(profile.linkedin || '');
  const [github, setGithub] = useState(profile.github || '');
  const [cvUrl, setCvUrl] = useState(profile.cv_url || '');
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    const updatedData = {
      name: name.trim(),
      bio: bio.trim(),
      about_paragraphs: about.split('\n\n').map(p => p.trim()).filter(p => p !== ''),
      skills: skills.split(',').map(s => s.trim()).filter(s => s !== ''),
      certifications: certifications.split(',').map(c => c.trim()).filter(c => c !== ''),
      linkedin: linkedin.trim(),
      github: github.trim(),
      cv_url: cvUrl.trim(),
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
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="about" className="block text-sm font-medium text-gray-700">About (each paragraph separated by a blank line)</label>
        <textarea
          id="about"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          rows={10}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
        <input
          id="skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">Certifications (comma-separated)</label>
        <input
          id="certifications"
          value={certifications}
          onChange={(e) => setCertifications(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
        <input
          id="linkedin"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="github" className="block text-sm font-medium text-gray-700">GitHub URL</label>
        <input
          id="github"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="cvUrl" className="block text-sm font-medium text-gray-700">CV URL</label>
        <input
          id="cvUrl"
          value={cvUrl}
          onChange={(e) => setCvUrl(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
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
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
        <div className="relative px-6 pb-6">
          {/* Profile Picture */}
          <div className="absolute -top-16 left-6">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
              {profile.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(profile.name)}
                </div>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-end pt-4">
            <button onClick={handleEditClick} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>

          {/* Name and Bio */}
          <div className="mt-6 ml-40">
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
            {profile.bio && (
              <p className="text-lg text-gray-600 mt-2">{profile.bio}</p>
            )}
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <Calendar className="w-4 h-4 mr-1" />
              Member since {formatDate(profile.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Editing Profile */}
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
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">
                {profile.email}
              </a>
            </div>
          </div>

          {profile.github && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Github className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">GitHub</p>
                <a 
                  href={profile.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Profile
                </a>
              </div>
            </div>
          )}

          {profile.linkedin && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Linkedin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">LinkedIn</p>
                <a 
                  href={profile.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Profile
                </a>
              </div>
            </div>
          )}

          {profile.cv_url && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Resume/CV</p>
                <a 
                  href={profile.cv_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Download CV
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* About Section */}
      {profile.about_paragraphs && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            About
          </h2>
          <div className="prose text-gray-700">
            {Array.isArray(profile.about_paragraphs) ? (
              profile.about_paragraphs.map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
              ))
            ) : (
              <p>{profile.about_paragraphs}</p>
            )}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {profile.skills && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Code className="w-5 h-5 mr-2 text-blue-600" />
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(profile.skills) ? (
              profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {profile.skills}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {profile.certifications && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-blue-600" />
            Certifications
          </h2>
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
        </div>
      )}

      {/* Empty State Sections */}
      {!profile.about_paragraphs && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            About
          </h2>
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No about information added yet.</p>
            <button onClick={handleEditClick} className="mt-3 text-blue-600 hover:underline text-sm">
              Add about section
            </button>
          </div>
        </div>
      )}

      {!profile.skills && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Code className="w-5 h-5 mr-2 text-blue-600" />
            Skills
          </h2>
          <div className="text-center py-8">
            <Code className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No skills added yet.</p>
            <button onClick={handleEditClick} className="mt-3 text-blue-600 hover:underline text-sm">
              Add skills
            </button>
          </div>
        </div>
      )}

      {!profile.certifications && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-blue-600" />
            Certifications
          </h2>
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No certifications added yet.</p>
            <button onClick={handleEditClick} className="mt-3 text-blue-600 hover:underline text-sm">
              Add certifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
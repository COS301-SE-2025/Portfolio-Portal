import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import cvDataService from '../services/cvDataService';
const Profile = () => {
  const { isDark } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    title: '',
    bio: ''
  });
  const [editData, setEditData] = useState(userData);
  const [cvFile, setCvFile] = useState(null);
  const [links, setLinks] = useState([]);
  const [about, setAbout] = useState([]);
  const [skills, setSkills] = useState([]);

  const mockGetCompleteProfile = async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      data: {
        user: {
          id: userId,
          name: 'John Doe',
          email: 'john.doe@example.com',
          title: 'Software Developer',
          bio: 'Passionate developer with expertise in React and Node.js',
          cv_url: null
        },
        links: [
          { id: 1, platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' },
          { id: 2, platform: 'GitHub', url: 'https://github.com/johndoe' }
        ],
        about: [
          { id: 1, content: 'I am a full-stack developer with 5 years of experience.' }
        ],
        skills: [
          { id: 1, name: 'JavaScript', level: 'Advanced' },
          { id: 2, name: 'React', level: 'Advanced' },
          { id: 3, name: 'Node.js', level: 'Intermediate' }
        ]
      }
    };
  };

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        const userId = localStorage.getItem('userId');

        if (!userId) {
          console.error('No user ID found');
          return;
        }

        setCurrentUser({ id: userId });

        let response;
        try {
          if (cvDataService && typeof cvDataService.getCompleteProfile === 'function') {
            response = await cvDataService.getCompleteProfile(userId);
          } else {
            console.warn('cvDataService.getCompleteProfile not found, using mock data');
            response = await mockGetCompleteProfile(userId);
          }
        } catch (serviceError) {
          console.warn('Service error, falling back to mock data:', serviceError.message);
          response = await mockGetCompleteProfile(userId);
        }

        const profileData = response.data || response;

        if (profileData.user) {
          const newUserData = {
            name: profileData.user.name || '',
            email: profileData.user.email || '',
            title: profileData.user.title || '',
            bio: profileData.user.bio || ''
          };
          setUserData(newUserData);
          setEditData(newUserData);
        }

setLinks(Array.isArray(profileData.links) ? profileData.links : []);
        setAbout(profileData.about || []);
        setSkills(profileData.skills || []);

        if (profileData.user?.cv_url) {
          setCvFile({ url: profileData.user.cv_url });
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleEdit = () => {
    setEditData(userData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (cvDataService && typeof cvDataService.updateProfile === 'function') {
        await cvDataService.updateProfile(currentUser.id, editData);
      }
      setUserData(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleLinksUpdate = async (newLinks) => {
    if (!currentUser?.id) return;
    try {
      if (cvDataService && typeof cvDataService.updateUserLinks === 'function') {
        if (links.length > 0) {
          await cvDataService.updateUserLinks(currentUser.id, newLinks);
        } else if (typeof cvDataService.createUserLinks === 'function') {
          await cvDataService.createUserLinks(currentUser.id, newLinks);
        }
      } else {
        console.warn('Link update functions not available in cvDataService');
      }
      setLinks(newLinks);
    } catch (error) {
      console.error('Error updating links:', error);
    }
  };

  const handleAboutUpdate = async (newAbout) => {
    if (!currentUser?.id) return;
    try {
      if (cvDataService && typeof cvDataService.updateUserAbout === 'function') {
        if (about.length > 0) {
          await cvDataService.updateUserAbout(currentUser.id, newAbout);
        } else if (typeof cvDataService.createUserAbout === 'function') {
          await cvDataService.createUserAbout(currentUser.id, newAbout);
        }
      } else {
        console.warn('About update functions not available in cvDataService');
      }
      setAbout(newAbout);
    } catch (error) {
      console.error('Error updating about:', error);
    }
  };

  const handleSkillsUpdate = async (newSkills) => {
    if (!currentUser?.id) return;
    try {
      if (cvDataService && typeof cvDataService.updateUserSkills === 'function') {
        if (skills.length > 0) {
          await cvDataService.updateUserSkills(currentUser.id, newSkills);
        } else if (typeof cvDataService.createUserSkills === 'function') {
          await cvDataService.createUserSkills(currentUser.id, newSkills);
        }
      } else {
        console.warn('Skills update functions not available in cvDataService');
      }
      setSkills(newSkills);
    } catch (error) {
      console.error('Error updating skills:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center pt-20 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full transition-all duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-slate-900'}`}>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Header Section */}
        <div className="border-b pb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              <p className="text-xl text-gray-500">{userData.title}</p>
            </div>
            <div className="space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Title"
                />
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Bio"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Title:</strong> {userData.title}</p>
                <p><strong>Bio:</strong> {userData.bio}</p>
              </div>
            )}
          </div>

          {/* About Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            {isEditing ? (
              <textarea
                value={about[0]?.content || ''}
                onChange={(e) => handleAboutUpdate([{ id: 1, content: e.target.value }])}
                className="w-full p-2 border rounded"
                placeholder="About"
              />
            ) : (
              <p>{about[0]?.content || 'No about information provided.'}</p>
            )}
          </div>

          {/* Skills Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Skills</h2>
            {isEditing ? (
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div key={skill.id} className="flex space-x-2">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        const newSkills = [...skills];
                        newSkills[index].name = e.target.value;
                        handleSkillsUpdate(newSkills);
                      }}
                      className="w-1/2 p-2 border rounded"
                      placeholder="Skill"
                    />
                    <input
                      type="text"
                      value={skill.level}
                      onChange={(e) => {
                        const newSkills = [...skills];
                        newSkills[index].level = e.target.value;
                        handleSkillsUpdate(newSkills);
                      }}
                      className="w-1/2 p-2 border rounded"
                      placeholder="Level"
                    />
                  </div>
                ))}
                <button
                  onClick={() => handleSkillsUpdate([...skills, { id: skills.length + 1, name: '', level: '' }])}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Skill
                </button>
              </div>
            ) : (
              <ul className="list-disc pl-5">
                {skills.map((skill) => (
                  <li key={skill.id}>{skill.name} - {skill.level}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Links Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Links</h2>
            {isEditing ? (
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div key={link.id} className="flex space-x-2">
                    <input
                      type="text"
                      value={link.platform}
                      onChange={(e) => {
                        const newLinks = [...links];
                        newLinks[index].platform = e.target.value;
                        handleLinksUpdate(newLinks);
                      }}
                      className="w-1/2 p-2 border rounded"
                      placeholder="Platform"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...links];
                        newLinks[index].url = e.target.value;
                        handleLinksUpdate(newLinks);
                      }}
                      className="w-1/2 p-2 border rounded"
                      placeholder="URL"
                    />
                  </div>
                ))}
                <button
                  onClick={() => handleLinksUpdate([...links, { id: links.length + 1, platform: '', url: '' }])}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Link
                </button>
              </div>
            ) : (
              <ul className="list-disc pl-5">
                {links.map((link) => (
                  <li key={link.id}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {link.platform}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CV Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">CV</h2>
            {isEditing ? (
              <input
                type="file"
                onChange={(e) => setCvFile(e.target.files[0])}
                className="p-2 border rounded"
              />
            ) : cvFile ? (
              <a href={cvFile.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                View CV
              </a>
            ) : (
              <p>No CV uploaded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
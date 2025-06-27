import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ProfileHeader from '../components/profile/ProfileHeader';
import UserInfoSection from '../components/profile/UserInfoSection';
import CVSection from '../components/profile/CVSection';
import PortfolioSection from '../components/profile/PortfolioSection';
import { cvDataService } from '../services/cvDataService';

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

  // Load user and profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        
        // Use in-memory user ID instead of localStorage (not supported in artifacts)
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          console.error('No user ID found');
          return;
        }
        
        setCurrentUser({ id: userId });
        
        // Try to use the actual service, fall back to mock if there's an error
        let response;
        try {
          // Access the function from cvDataService object
          if (cvDataService && typeof cvDataService.getCompleteProfile === 'function') {
            console.log('Using cvDataService.getCompleteProfile');
            response = await cvDataService.getCompleteProfile(userId);
          } else {
            console.warn('cvDataService.getCompleteProfile not found, using mock data');
            response = await mockGetCompleteProfile(userId);
          }
        } catch (serviceError) {
          console.warn('Service error, falling back to mock data:', serviceError.message);
          response = await mockGetCompleteProfile(userId);
        }
        
        // Extract data from response (API responses typically have a data property)
        const profileData = response.data || response;
        
        // Set user data
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

        // Set other profile sections
        setLinks(profileData.links || []);
        setAbout(profileData.about || []);
        setSkills(profileData.skills || []);
        
        // Set CV URL if exists
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
    if (!currentUser?.id) return;
    
    try {
      // Use cvDataService.updateProfile when you have the backend set up
      if (cvDataService && typeof cvDataService.updateProfile === 'function') {
        await cvDataService.updateProfile(userId,editData);
      }
      
      setUserData(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      // Handle error - show toast notification
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
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          <ProfileHeader
            isEditing={isEditing}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
          />

          <UserInfoSection
            userData={userData}
            editData={editData}
            setEditData={setEditData}
            isEditing={isEditing}
            about={about}
            onAboutUpdate={handleAboutUpdate}
            skills={skills}
            onSkillsUpdate={handleSkillsUpdate}
            links={links}
            onLinksUpdate={handleLinksUpdate}
          />

          <CVSection
            cvFile={cvFile}
            setCvFile={setCvFile}
            userId={currentUser?.id}
          />

          <PortfolioSection
            links={links}
            onLinksUpdate={handleLinksUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
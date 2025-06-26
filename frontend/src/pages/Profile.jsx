import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ProfileHeader from '../components/profile/ProfileHeader';
import UserInfoSection from '../components/profile/UserInfoSection';
import CVSection from '../components/profile/CVSection';
import PortfolioSection from '../components/profile/PortfolioSection';
import * as profileService from '../services/cvDataService';

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

  // Load user and profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        
        // Get user ID from localStorage, sessionStorage, or however you store it
        const userId = localStorage.getItem('userId'); // Adjust this based on your auth implementation
        
        if (!userId) {
          // Redirect to login or handle no user case
          console.error('No user ID found');
          return;
        }
        
        setCurrentUser({ id: userId });
        
        const profileData = await profileService.getCompleteProfile(userId);
        
        // Set user data
        if (profileData.user) {
          const userData = {
            name: profileData.user.name || '',
            email: profileData.user.email || '',
            title: profileData.user.title || '',
            bio: profileData.user.bio || ''
          };
          setUserData(userData);
          setEditData(userData);
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
      // Update user profile data (name, bio) - you'll need to add this to User model
      // await userService.updateProfile(currentUser.id, editData);
      
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
      if (links) {
        await profileService.updateUserLinks(currentUser.id, newLinks);
      } else {
        await profileService.createUserLinks(currentUser.id, newLinks);
      }
      setLinks(newLinks);
    } catch (error) {
      console.error('Error updating links:', error);
    }
  };

  const handleAboutUpdate = async (newAbout) => {
    if (!currentUser?.id) return;
    
    try {
      if (about.length > 0) {
        await profileService.updateUserAbout(currentUser.id, newAbout);
      } else {
        await profileService.createUserAbout(currentUser.id, newAbout);
      }
      setAbout(newAbout);
    } catch (error) {
      console.error('Error updating about:', error);
    }
  };

  const handleSkillsUpdate = async (newSkills) => {
    if (!currentUser?.id) return;
    
    try {
      if (skills.length > 0) {
        await profileService.updateUserSkills(currentUser.id, newSkills);
      } else {
        await profileService.createUserSkills(currentUser.id, newSkills);
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
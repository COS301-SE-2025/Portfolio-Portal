import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ProfileHeader from '../components/profile/ProfileHeader';
import UserInfoSection from '../components/profile/UserInfoSection';
import CVSection from '../components/profile/CVSection';
import PortfolioSection from '../components/profile/PortfolioSection';

const Profile = () => {
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    title: 'Full Stack Developer',
    bio: 'Passionate developer with 5+ years of experience in web technologies.'
  });
  const [editData, setEditData] = useState(userData);
  const [cvFile, setCvFile] = useState(null);
  const [portfolios, setPortfolios] = useState([
    { id: 1, name: 'Personal Website', url: 'https://johndoe.dev' },
    { id: 2, name: 'Portfolio Site', url: 'https://portfolio.johndoe.dev' }
  ]);

  const handleEdit = () => {
    setEditData(userData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

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
          />

          <CVSection 
            cvFile={cvFile}
            setCvFile={setCvFile}
          />

          <PortfolioSection 
            portfolios={portfolios}
            setPortfolios={setPortfolios}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
import { useTheme } from '../../contexts/ThemeContext';
import CVSection from '../profile/CVSection';
//import PortfolioSection from '../profile/PortfolioSection';
import ProfileHeader from '../profile/ProfileHeader';
//import UserInfoHeader from '../profile/UserInfoSection';

const ProfilePage = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen w-full transition-all duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-slate-900'}`}>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* Header Section */}
        <div className="border-b pb-6">
          <ProfileHeader />
         
        </div>

        {/* Content Section */}
        <div className="space-y-12">
          <CVSection />
          
                  </div>
        
      </div>
    </div>
  );
};

export default ProfilePage;

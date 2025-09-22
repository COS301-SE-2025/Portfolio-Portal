import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import SocialSection from '../components/sections/SocialSection';
import { useTheme } from '../contexts/ThemeContext';

const Social = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Vertical Left Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-20 flex flex-col items-center py-6 border-r transition-colors duration-300 z-10 ${
        isDark
          ? 'bg-slate-900/95 border-slate-700 backdrop-blur-sm'
          : 'bg-gray-50/95 border-gray-200 backdrop-blur-sm'
      }`}>
        <button
          onClick={handleGoBack}
          className={`p-3 rounded-lg transition-all duration-200 ${
            isDark
              ? 'text-gray-300 hover:text-white hover:bg-slate-800 hover:shadow-lg'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md'
          }`}
          title="Go Back"
        >
          <Home className="w-6 h-6" />
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-20">
        <div className="py-6">
          <SocialSection />
        </div>
      </main>
    </div>
  );
};

export default Social;
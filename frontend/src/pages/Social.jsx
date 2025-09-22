import React from 'react';
import { Home } from 'lucide-react';

// Mock theme context for demo
const useTheme = () => ({ isDark: false });

// Mock SocialSection component
const SocialSection = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Social Section Component</h1>
      <p className="text-gray-600">This would be imported from '../components/sections/SocialSection'</p>
    </div>
  );
};

const Social = () => {
  const { isDark } = useTheme();
  
  const handleGoBack = () => {
    // navigate(-1); - would use React Router's useNavigate hook
    console.log('Going back...');
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
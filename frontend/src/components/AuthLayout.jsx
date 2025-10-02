import { useTheme } from '../contexts/ThemeContext';
import { Sparkles } from 'lucide-react';

const AuthLayout = ({ title, subtitle, children }) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white'
          : 'bg-gradient-to-br from-gray-100 via-white to-gray-100 text-gray-900'
      }`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse ${
            isDark ? 'bg-purple-500' : 'bg-purple-300'
          }`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000 ${
            isDark ? 'bg-blue-500' : 'bg-blue-300'
          }`}
        ></div>
        <div
          className={`absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-3xl animate-pulse opacity-70 ${
            isDark
              ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/5'
              : 'bg-gradient-to-r from-purple-300/20 to-blue-300/10'
          }`}
        ></div>
      </div>

      {/* Starfield Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className={`absolute inset-0 bg-gradient-to-b ${
            isDark ? 'from-gray-900 via-blue-900/20 to-black' : 'from-gray-200 via-blue-100/20 to-gray-100'
          }`}
        ></div>
        {[...Array(100)].map((_, i) => (
          <div
            key={`star-${i}`}
            className={`absolute w-px h-px rounded-full ${isDark ? 'bg-white' : 'bg-gray-400'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
            }}
          />
        ))}
        {[...Array(2)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            className={`absolute w-px h-px rounded-full ${isDark ? 'bg-white' : 'bg-gray-400'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 30}%`,
              animation: `shootingStar ${3 + Math.random() * 4}s infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center">
          <Sparkles className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          <span
            className={`text-2xl font-bold bg-clip-text text-transparent ${
              isDark ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gradient-to-r from-purple-600 to-pink-600'
            }`}
          >
            Portfolio Portal
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 flex items-center justify-center">
        <div
          className={`w-full max-w-md rounded-2xl p-8 transition-all duration-200 ${
            isDark
              ? 'bg-white/5 backdrop-blur-sm border border-white/10'
              : 'bg-white/90 backdrop-blur-sm border border-gray-300 shadow-lg'
          }`}
        >
          <h1 className="text-3xl font-bold text-center mb-2">{title}</h1>
          <p className="text-center text-white-600 dark:text-gray-300 mb-8">{subtitle}</p>
          {children}
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {[...Array(15)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className={`absolute w-1 h-1 rounded-full ${
              isDark ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-600 to-purple-600'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.6 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes shootingStar {
          0% {
            transform: translateX(-100px) translateY(100px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(-100px);
            opacity: 0;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-10px) translateX(-15px);
            opacity: 1;
          }
          75% {
            transform: translateY(-25px) translateX(5px);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
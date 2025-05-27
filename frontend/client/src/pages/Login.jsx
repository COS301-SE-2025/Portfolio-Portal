import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Read theme from localStorage on component mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      } else {
        // If no theme is saved, default to dark and save it
        localStorage.setItem('theme', 'dark');
        setIsDark(true);
      }
    } catch (error) {
      // Fallback if localStorage is not available
      console.warn('localStorage not available, using default theme');
      setIsDark(true);
    }
  }, []);

  // Mock user data - in a real app, this would come from a database
  const mockUsers = [
    { email: 'admin@example.com', password: 'admin123', name: 'Admin User' },
    { email: 'user@example.com', password: 'user123', name: 'Regular User' },
    { email: 'demo@example.com', password: 'demo123', name: 'Demo User' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.warn('Could not save theme to localStorage');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    setTimeout(() => {
      // Check if user exists in mock data
      const user = mockUsers.find(
        u => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        // Store user data in memory (in a real app, you'd use proper auth tokens)
        const userData = {
          email: user.email,
          name: user.name,
          loginTime: new Date().toISOString()
        };
        
        // Store in window object for persistence during session
        window.currentUser = userData;
        
        // Add animation class to the container
        const container = document.getElementById('home-container');
        if (container) {
          container.classList.add('fade-out');
        }
        
        // Navigate after animation completes
        setTimeout(() => {
          navigate('/home'); // or wherever you want to redirect after login
        }, 300);
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = () => {
    // Add animation class to the container
    const container = document.getElementById('home-container');
    if (container) {
      container.classList.add('fade-out');
    }
    
    // Navigate after animation completes
    setTimeout(() => {
      navigate('/register');
    }, 300);
  };

  return (
    <div 
      id="home-container" 
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100'
      }`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full backdrop-blur-sm border transition-all duration-300 group ${
          isDark 
            ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white' 
            : 'bg-gray-200/80 border-gray-300 hover:bg-gray-300/80 text-gray-700'
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-slate-700 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className={`text-5xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome Back!
          </h1>
          <p className={`text-lg ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Log in to transform your CV into<br />
            a living, immersive portfolio.
          </p>
        </div>
        
        {/* Demo credentials info */}
        <div className={`rounded-lg p-4 mb-6 text-sm transition-colors duration-300 ${
          isDark 
            ? 'bg-gray-800 bg-opacity-50 text-gray-300' 
            : 'bg-white/80 border border-gray-200 text-gray-600 shadow-lg'
        }`}>
          <p className={`font-medium mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Demo Credentials:
          </p>
          <p>Email: demo@example.com</p>
          <p>Password: demo123</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-6 py-4 border-2 rounded-full transition-colors focus:outline-none ${
                isDark 
                  ? 'bg-transparent border-gray-600 text-white placeholder-gray-400 focus:border-purple-400' 
                  : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 shadow-sm'
              }`}
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-6 py-4 border-2 rounded-full transition-colors focus:outline-none ${
                isDark 
                  ? 'bg-transparent border-gray-600 text-white placeholder-gray-400 focus:border-purple-400' 
                  : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 shadow-sm'
              }`}
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className={`text-center text-sm py-2 px-4 rounded-full ${
              isDark 
                ? 'text-red-400 bg-red-900 bg-opacity-30' 
                : 'text-red-700 bg-red-100 border border-red-200'
            }`}>
              {error}
            </div>
          )}
          
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 border-2 rounded-full text-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark 
                ? 'bg-transparent border-white text-white hover:bg-white hover:text-gray-900' 
                : 'bg-transparent border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <p className={`text-center ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Don't have an account?{" "}
          <span 
            onClick={handleRegister} 
            className={`font-medium cursor-pointer hover:underline transition-colors ${
              isDark ? 'text-white hover:text-gray-200' : 'text-gray-900 hover:text-gray-700'
            }`}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
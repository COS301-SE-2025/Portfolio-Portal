import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(true); // Default to dark theme

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

  // Mock existing users - in a real app, this would come from a database
  const existingUsers = [
    'admin@example.com',
    'user@example.com',
    'demo@example.com'
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

  const validateForm = () => {
    // Check if all fields are filled
    if (!formData.fullName.trim() || !formData.email || !formData.password || !formData.confirmPassword) {
      return 'Please fill in all fields';
    }

    // Validate full name
    if (formData.fullName.trim().length < 2) {
      return 'Full name must be at least 2 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }

    // Check if email already exists
    if (existingUsers.includes(formData.email.toLowerCase())) {
      return 'An account with this email already exists';
    }

    // Password validation
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    setTimeout(() => {
      try {
        // In a real app, you would send this data to your backend
        const newUser = {
          email: formData.email.toLowerCase(),
          name: formData.fullName.trim(),
          registrationTime: new Date().toISOString()
        };

        // Store user data in memory (simulate successful registration)
        window.currentUser = newUser;
        
        // Add the new user to existing users (for demo purposes)
        existingUsers.push(formData.email.toLowerCase());
        
        // Show success and redirect
        const container = document.getElementById('home-container');
        if (container) {
          container.classList.add('fade-out');
        }
        
        setTimeout(() => {
          navigate('/home'); // or wherever you want to redirect after registration
        }, 300);
      } catch (err) {
        setError('Registration failed. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogin = () => {
    // Add animation class to the container
    const container = document.getElementById('home-container');
    if (container) {
      container.classList.add('fade-out');
    }
    
    // Navigate after animation completes
    setTimeout(() => {
      navigate('/login');
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
            Get Started!
          </h1>
          <p className={`text-lg ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Enter your details below to make an account
          </p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4 mb-6">
          <div className="relative">
            <input
              type="text"
              name="fullName"
              placeholder="Full name"
              value={formData.fullName}
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
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
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
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        
        <p className={`text-center ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Already registered?{" "}
          <span 
            onClick={handleLogin} 
            className={`font-medium cursor-pointer hover:underline transition-colors ${
              isDark ? 'text-white hover:text-gray-200' : 'text-gray-900 hover:text-gray-700'
            }`}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
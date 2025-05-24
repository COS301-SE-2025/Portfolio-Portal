import { useState } from 'react';
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
        container.classList.add('fade-out');
        
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
    container.classList.add('fade-out');
    
    // Navigate after animation completes
    setTimeout(() => {
      navigate('/login');
    }, 300);
  };

  return (
    <div id="home-container" className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Get Started!</h1>
          <p className="text-gray-300 text-lg">
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
              className="w-full px-6 py-4 bg-transparent border-2 border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
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
              className="w-full px-6 py-4 bg-transparent border-2 border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
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
              className="w-full px-6 py-4 bg-transparent border-2 border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
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
              className="w-full px-6 py-4 bg-transparent border-2 border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-center text-sm bg-red-900 bg-opacity-30 py-2 px-4 rounded-full">
              {error}
            </div>
          )}
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-transparent border-2 border-white rounded-full text-white text-lg font-medium hover:bg-white hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        
        <p className="text-center text-gray-300">
          Already registered?{" "}
          <span onClick={handleLogin} className="text-white font-medium cursor-pointer hover:underline">
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
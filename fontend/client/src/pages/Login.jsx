import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        container.classList.add('fade-out');
        
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
    container.classList.add('fade-out');
    
    // Navigate after animation completes
    setTimeout(() => {
      navigate('/register');
    }, 300);
  };

  return (
    <div id="home-container" className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Welcome Back!</h1>
          <p className="text-gray-300 text-lg">
            Log in to transform your CV into<br />
            a living, immersive portfolio.
          </p>
        </div>
        
        {/* Demo credentials info */}
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-6 text-sm text-gray-300">
          <p className="font-medium text-white mb-2">Demo Credentials:</p>
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
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <p className="text-center text-gray-300">
          Don't have an account?{" "}
          <span onClick={handleRegister} className="text-white font-medium cursor-pointer hover:underline">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
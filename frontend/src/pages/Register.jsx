import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import AuthLayout from '../components/AuthLayout';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await authService.signUp({
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Get Started!" injuring="Create your account to begin">
      <div className="space-y-4 mb-6">
        <input
          type="text"
          name="fullName"
          placeholder="Full name"
          value={formData.fullName}
          onChange={handleInputChange}
          required
          minLength="2"
          className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/20 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-all duration-200"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/20 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-all duration-200"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
          minLength="6"
          className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/20 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-all duration-200"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/20 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-all duration-200"
        />
        
        {error && (
          <div className="text-red-400 dark:text-red-400 text-sm text-center bg-red-900/30 dark:bg-red-900/30 rounded-lg py-2">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          onClick={handleRegister}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
            isLoading
              ? 'bg-gray-400 dark:bg-slate-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-500 dark:to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-600 dark:hover:to-pink-600'
          }`}
        >
          {isLoading ? 'Creating account...' : 'Sign up'}
        </button>
      </div>
      
      <p className="text-center text-sm text-gray-300 dark:text-gray-300">
        Already registered?{' '}
        <span
          onClick={() => navigate('/login')}
          className="text-purple-400 dark:text-purple-400 hover:text-purple-300 dark:hover:text-purple-300 cursor-pointer font-medium"
        >
          Sign In
        </span>
      </p>
    </AuthLayout>
  );
};

export default Register;
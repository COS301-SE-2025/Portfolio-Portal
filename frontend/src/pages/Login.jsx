// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import AuthLayout from '../components/AuthLayout';
import cvDataService from '../services/cvDataService';
import { profileService } from '../services/profile.service';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await authService.login(formData);
      console.log(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);

      const profile_picture_url = profileService.getProfilePictureUrl();
      localStorage.setItem('imageURL', (await profile_picture_url).data.profile_picture_url);

      // Try to fetch the user's CV from /api/cv/me and store it in cvDataService
      try {
        const cvRes = await cvDataService.getMyCV();
        if (cvRes?.data) {
          cvDataService.setData(cvRes.data);
        }
      } catch (cvErr) {
        // no CV on server or fetch failed — that's OK, user can upload later
        console.info('No CV found for user or error fetching CV:', cvErr?.response?.status || cvErr.message);
      }

      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back!" subtitle="Log in to access your portfolio">
      <div className="space-y-4 mb-6">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
        />
        
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-100 dark:bg-red-900/30 rounded-lg py-2">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          onClick={handleLogin}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
            isLoading
              ? 'bg-gray-400 dark:bg-slate-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-500 dark:to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-600 dark:hover:to-pink-600'
          }`}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
      
      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Don't have an account?{' '}
        <span
          onClick={() => navigate('/register')}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 cursor-pointer font-medium"
        >
          Sign Up
        </span>
      </p>
    </AuthLayout>
  );
};

export default Login;

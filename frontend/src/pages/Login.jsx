// frontend/src/pages/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { AuthContext } from '../contexts/AuthContext';
import AuthLayout from '../components/AuthLayout';
import cvDataService from '../services/cvDataService';
import { profileService } from '../services/profile.service';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
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
      
      // Use the login function from AuthContext
      login(data.token, data.user.id);

      // Safely try to fetch profile picture
      try {
        const profile_picture_res = await profileService.getProfilePictureUrl();
        if (profile_picture_res?.data?.profile_picture_url) {
          localStorage.setItem('imageURL', profile_picture_res.data.profile_picture_url);
        } else {
          localStorage.removeItem('imageURL');
        }
      } catch (picErr) {
        console.info("No profile picture found or error fetching:", picErr?.response?.status || picErr.message);
        localStorage.removeItem('imageURL');
      }

      // Try to fetch the user's CV from /api/cv/me and store it in cvDataService
      try {
        const cvRes = await cvDataService.getMyCV();
        if (cvRes?.data) {
          cvDataService.setData(cvRes.data);
        }
      } catch (cvErr) {
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
          className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 outline-none"
        />
        
        {error && (
  <div className="text-red-700 dark:text-red-200 text-sm text-center bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-lg py-2.5 px-3 font-medium">
    {error}
  </div>
)}
        
        <button
          type="submit"
          disabled={isLoading}
          onClick={handleLogin}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
            isLoading
              ? 'bg-gray-400 dark:bg-slate-700 text-gray-200 dark:text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 shadow-lg hover:shadow-xl'
          }`}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
      
      <p className="text-center text-sm text-grey-100 dark:text-gray-200 font-medium">
        Don't have an account?{' '}
        <span
          onClick={() => navigate('/register')}
          className="text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 cursor-pointer font-semibold"
        >
          Sign Up
        </span>
      </p>
    </AuthLayout>
  );
};

export default Login;
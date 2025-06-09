import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import AuthLayout from '../components/AuthLayout';

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
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back!" subtitle="Log in to access your portfolio">
      <form onSubmit={handleLogin} className="space-y-4 mb-6">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
        />
        
        {error && (
          <div className="text-red-500 dark:text-red-400 text-sm text-center bg-red-100 dark:bg-red-900/30 rounded-lg py-2">
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isLoading} 
          className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
            isLoading 
              ? 'bg-gray-400 dark:bg-slate-600 cursor-not-allowed' 
              : 'bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600'
          }`}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      
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
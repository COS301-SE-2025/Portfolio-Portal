import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import AuthLayout from '../components/AuthLayout';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    professional: true, // Default to true as per database
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const stepTitles = {
    1: { title: "What's your name?", subtitle: "Enter your name" },
    2: { title: "Add your email", subtitle: "We'll use this for your account" },
    3: { title: "Create a password", subtitle: "Make it strong and secure" },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };


  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          setError('Please enter your name');
          return false;
        }
        break;
      case 2:
        if (!formData.email || !emailRegex.test(formData.email)) {
          setError('Please enter a valid email');
          return false;
        }
        break;
      case 3:
        if (!formData.password) {
          setError('Password is required');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        break;
      default:
        break;
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step === 3) {
        handleRegister();
      } else {
        setStep(step + 1);
      }
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const handleRegister = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        professional: formData.professional, // Send boolean value
      };
      console.log('Sending payload:', payload);
      const { data } = await authService.signUp(payload);
      console.log('Response:', data);
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (err) {
      console.error('Error:', err.response?.data);
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      if (errorMessage.includes('User already exists')) {
        setError('This email is already registered. Try logging in or use a different email.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <input
              type="text"
              name="name"
              placeholder="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              minLength="2"
              autoFocus
              className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            />
            <button
              type="button"
              onClick={nextStep}
              className="w-full py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-500 dark:to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-600 dark:hover:to-pink-600"
            >
              Continue
            </button>
          </>
        );
      case 2:
        return (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoFocus
              className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            />
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 py-3 rounded-lg font-medium transition-all duration-200 bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="w-1/2 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-500 dark:to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-600 dark:hover:to-pink-600"
              >
                Continue
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="6"
              autoFocus
              className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            />
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 py-3 rounded-lg font-medium transition-all duration-200 bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={isLoading}
                className={`w-1/2 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  isLoading
                    ? 'bg-gray-400 dark:bg-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-500 dark:to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-600 dark:hover:to-pink-600'
                }`}
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout 
      title={stepTitles[step].title} 
      subtitle={stepTitles[step].subtitle}
    >
      <div className="space-y-4 mb-6">
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-100 dark:bg-red-900/30 rounded-lg py-2">
            {error}
          </div>
        )}
        {renderStep()}
      </div>
      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2.5 mb-6">
        <div 
          className="bg-purple-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${(step / 3) * 100}%` }}
        ></div>
      </div>
      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Already registered?{' '}
        <span
          onClick={() => navigate('/login')}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 cursor-pointer font-medium"
        >
          Sign In
        </span>
      </p>
    </AuthLayout>
  );
};

export default Register;
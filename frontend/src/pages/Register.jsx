import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import AuthLayout from '../components/AuthLayout';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const stepTitles = {
    1: { title: "What's your name?", subtitle: "Enter your full name" },
    2: { title: "Add your email", subtitle: "We'll use this for your account" },
    3: { title: "Create a password", subtitle: "Make it strong and secure" },
    4: { title: "Profile photo", subtitle: "Upload a photo (optional)" }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePhoto: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, profilePhoto: null }));
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.fullName.trim()) {
          setError('Please enter your full name');
          return false;
        }
        break;
      case 2:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.fullName);
      formPayload.append('email', formData.email);
      formPayload.append('password', formData.password);
      if (formData.profilePhoto) {
        formPayload.append('profilePhoto', formData.profilePhoto);
      }

      const { data } = await authService.signUp(formPayload);
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
              name="fullName"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              minLength="2"
              autoFocus
              className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/20 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-all duration-200"
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
              className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/20 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-all duration-200"
            />
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 py-3 rounded-lg font-medium transition-all duration-200 bg-gray-600 hover:bg-gray-700 text-white"
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
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 py-3 rounded-lg font-medium transition-all duration-200 bg-gray-600 hover:bg-gray-700 text-white"
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
      case 4:
        return (
          <>
            <div className="flex flex-col items-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {previewUrl ? (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-32 h-32 rounded-full object-cover border-2 border-purple-400"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={triggerFileSelect}
                  className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 mb-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              )}
              
              <button
                type="button"
                onClick={triggerFileSelect}
                className="text-purple-400 mb-6"
              >
                {previewUrl ? 'Change photo' : 'Upload photo'}
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 py-3 rounded-lg font-medium transition-all duration-200 bg-gray-600 hover:bg-gray-700 text-white"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleRegister}
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
          <div className="text-red-400 dark:text-red-400 text-sm text-center bg-red-900/30 dark:bg-red-900/30 rounded-lg py-2">
            {error}
          </div>
        )}
        
        {renderStep()}
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
        <div 
          className="bg-purple-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
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
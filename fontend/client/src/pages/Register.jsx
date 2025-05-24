import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

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
        
        <div className="space-y-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Full name"
              className="w-full px-6 py-4 bg-transparent border-2 border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
            />
          </div>
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-6 py-4 bg-transparent border-2 border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-6 py-4 bg-transparent border-2 border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full px-6 py-4 bg-transparent border-2 border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
            />
          </div>
        </div>
        
        <button className="w-full py-4 bg-transparent border-2 border-white rounded-full text-white text-lg font-medium hover:bg-white hover:text-gray-900 transition-colors mb-6">
          Sign up
        </button>
        
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
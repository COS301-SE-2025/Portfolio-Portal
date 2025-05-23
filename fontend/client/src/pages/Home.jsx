import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Add animation class to the container
    const container = document.getElementById('home-container');
    container.classList.add('fade-out');
    
    // Navigate after animation completes
    setTimeout(() => {
      navigate('/upload');
    }, 300);
  };

  return (
    <div id="home-container" className="min-h-screen flex flex-col items-center justify-center p-6 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-4">Portfolio Portal</h1>
        <p className="text-gray-600 text-center">Upload your CV and watch your portfolio come to life
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-1 gap-4">
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            onClick={handleGetStarted}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
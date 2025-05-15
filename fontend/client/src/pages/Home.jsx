const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-4">Portfolio Portal</h1>
        <p className="text-gray-600 text-center">Welcome to your professional showcase</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            View Projects
          </button>
          <button className="bg-white border-2 border-indigo-600 hover:bg-indigo-50 text-indigo-600 font-medium py-3 px-4 rounded-lg transition-colors">
            Contact Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
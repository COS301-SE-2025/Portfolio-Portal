import { userName, jobTitle } from "./index";

const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900">
      <div className="absolute inset-0 top-[120px] max-w-7xl mx-auto px-6 flex flex-row items-start gap-5">
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-blue-400" />
          <div className="w-1 sm:h-80 h-40 bg-gradient-to-b from-blue-400 to-blue-600" />
        </div>

        <div>
          <h1 className="text-white font-black text-5xl sm:text-6xl lg:text-7xl">
            Hi, I'm <span className="text-blue-400">{userName}</span>
          </h1>
          <p className="text-gray-300 mt-4 text-lg sm:text-xl max-w-3xl">
            Professional {jobTitle} creating digital solutions with precision and efficiency.
          </p>
          <div className="mt-8">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-gray-700 hover:from-blue-700 hover:to-gray-800 text-white font-medium rounded transition-all duration-300 transform hover:scale-105">
              View My Work
            </button>
          </div>
        </div>
      </div>

      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-blue-400 flex justify-center items-start p-2">
            <div className="w-3 h-3 rounded-full bg-blue-400 mb-1 animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
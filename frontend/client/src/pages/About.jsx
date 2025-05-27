import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const About = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'
    }`}>
      {/* Add top padding to account for navbar */}
      <div className="pt-20 pb-16 px-8 lg:px-16 xl:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[80vh]">
            {/* Left Column - Content */}
            <div className="space-y-12 lg:pr-8">
              <h1 className={`text-6xl lg:text-8xl xl:text-9xl font-bold leading-none ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                About us
              </h1>
              
              <div className={`space-y-8 text-lg lg:text-xl leading-relaxed max-w-2xl ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <p>
                  Portfolio Portal is a capstone project developed in collaboration 
                  between the University of Pretoria and EPI-USE Africa. As part of the 
                  university's final-year curriculum, this initiative reflects a strong 
                  partnership between academia and industry, aiming to create 
                  meaningful, real-world solutions through innovation and practical 
                  application.
                </p>
                
                <p>
                  With guidance and support from EPI-USE, this project 
                  explores modern web technologies to deliver a tool that allows users 
                  to convert traditional CVs into immersive, digital portfolio 
                  experiences. The collaboration emphasizes not only technical growth 
                  for students, but also a commitment to building solutions that bridge 
                  creativity and functionality in the digital space.
                </p>
              </div>
            </div>

            {/* Right Column - Image Placeholder */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Image Container - Replace this with your image */}
                <div className="w-96 h-96 lg:w-[500px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                  {/* 
                    PLACE YOUR IMAGE HERE:
                    Replace this div with:
                    <img 
                      src="/path/to/your/image.png" 
                      alt="About us illustration" 
                      className="w-full h-full object-cover"
                    />
                  */}
                  <div className={`w-full h-full flex items-center justify-center text-center p-8 ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-slate-800 to-gray-900 text-gray-400' 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500'
                  }`}>
                    <div>
                      <div className="text-4xl mb-4">🖼️</div>
                      <p className="text-lg font-medium">Replace this div with your image</p>
                      <p className="text-sm mt-2">See component comments for details</p>
                    </div>
                  </div>
                </div>
                
                {/* Optional: Decorative background element */}
                <div className="absolute -z-10 top-4 left-4 w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
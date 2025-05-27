import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const About = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900' 
        : 'bg-gradient-to-br from-purple-100 via-blue-100 to-gray-100'
    }`}>
      <div className="container mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <h1 className={`text-5xl lg:text-7xl font-bold leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              About us
            </h1>
            
            <div className={`space-y-6 text-lg leading-relaxed ${
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

          {/* Right Column - Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Background Gradient Blob */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
              
              {/* Main Illustration Container */}
              <div className="relative bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400 rounded-3xl p-8 lg:p-12 shadow-2xl">
                {/* Team Collaboration Illustration */}
                <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                  {/* Conference Table */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-32 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full shadow-lg"></div>
                  
                  {/* Charts/Presentation Screen */}
                  <div className="absolute top-4 left-8 w-24 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-md">
                    <div className="p-2 space-y-1">
                      <div className="text-xs text-white font-bold">70%</div>
                      <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-green-400 rounded"></div>
                        <div className="w-1 h-6 bg-yellow-400 rounded"></div>
                        <div className="w-1 h-5 bg-red-400 rounded"></div>
                        <div className="w-1 h-7 bg-blue-400 rounded"></div>
                        <div className="w-1 h-3 bg-purple-400 rounded"></div>
                      </div>
                    </div>
                  </div>

                  {/* Person 1 - Standing/Presenting */}
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                    {/* Head */}
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-2 shadow-md"></div>
                    {/* Body */}
                    <div className="w-16 h-24 bg-gradient-to-b from-red-500 to-red-700 rounded-t-full shadow-md"></div>
                    {/* Arms - gesturing */}
                    <div className="absolute top-12 -left-2 w-8 h-3 bg-gradient-to-r from-red-500 to-red-700 rounded-full transform -rotate-12"></div>
                    <div className="absolute top-12 -right-2 w-8 h-3 bg-gradient-to-r from-red-500 to-red-700 rounded-full transform rotate-12"></div>
                  </div>

                  {/* Person 2 - Sitting Left */}
                  <div className="absolute bottom-20 left-12">
                    {/* Head */}
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-1 shadow-md"></div>
                    {/* Body */}
                    <div className="w-14 h-16 bg-gradient-to-b from-blue-600 to-blue-800 rounded-t-lg shadow-md"></div>
                  </div>

                  {/* Person 3 - Sitting Right */}
                  <div className="absolute bottom-20 right-12">
                    {/* Head */}
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-1 shadow-md"></div>
                    {/* Body */}
                    <div className="w-14 h-16 bg-gradient-to-b from-green-600 to-green-800 rounded-t-lg shadow-md"></div>
                  </div>

                  {/* Laptops on table */}
                  <div className="absolute bottom-16 left-16 w-8 h-6 bg-gradient-to-b from-gray-300 to-gray-500 rounded-sm shadow-sm transform -rotate-12"></div>
                  <div className="absolute bottom-16 right-16 w-8 h-6 bg-gradient-to-b from-gray-300 to-gray-500 rounded-sm shadow-sm transform rotate-12"></div>

                  {/* Documents/Papers scattered */}
                  <div className="absolute bottom-12 left-20 w-6 h-8 bg-white rounded shadow-sm transform rotate-6"></div>
                  <div className="absolute bottom-14 right-20 w-6 h-8 bg-white rounded shadow-sm transform -rotate-6"></div>
                  
                  {/* Coffee cups */}
                  <div className="absolute bottom-24 left-24 w-4 h-4 bg-gradient-to-b from-amber-200 to-amber-400 rounded-full shadow-sm"></div>
                  <div className="absolute bottom-24 right-24 w-4 h-4 bg-gradient-to-b from-amber-200 to-amber-400 rounded-full shadow-sm"></div>

                  {/* Floating elements for creativity */}
                  <div className="absolute top-8 right-4 w-3 h-3 bg-yellow-400 rounded-full opacity-80 animate-bounce"></div>
                  <div className="absolute top-20 right-12 w-2 h-2 bg-pink-400 rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute bottom-32 left-4 w-2 h-2 bg-cyan-400 rounded-full opacity-70 animate-ping"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
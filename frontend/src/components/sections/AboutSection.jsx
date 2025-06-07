import { forwardRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const AboutSection = forwardRef(({ id, show }, ref) => {
  const { isDark } = useTheme();

  return (
    <div id={id} ref={ref} className="min-h-screen flex items-center justify-center px-6 lg:px-20 py-12">
      {show && (
        <div className={`max-w-6xl w-full animate-fadeIn ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-12 lg:pr-8">
              <h1 className={`text-5xl lg:text-7xl xl:text-8xl font-bold leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                About us
              </h1>
              <div className={`space-y-8 text-base lg:text-lg leading-relaxed max-w-2xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <p>
                  Portfolio Portal is a capstone project developed in collaboration between
                  the University of Pretoria and EPI-USE Africa. As part of the university's
                  final-year curriculum, this initiative reflects a strong partnership
                  between academia and industry, aiming to create meaningful, real-world
                  solutions through innovation and practical application.
                </p>
                <p>
                  With guidance and support from EPI-USE, this project explores modern web
                  technologies to deliver a tool that allows users to convert traditional
                  CVs into immersive, digital portfolio experiences. The collaboration
                  emphasizes not only technical growth for students, but also a commitment to
                  building solutions that bridge creativity and functionality in the digital
                  space.
                </p>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 p-4">
                <img
                  src="/images/about.png"
                  alt="About us illustration"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AboutSection;

const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
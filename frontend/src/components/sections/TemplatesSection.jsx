import { forwardRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import TemplateCard from '../TemplateCard';
import { professionalTemplates, funTemplates } from '../../data/Templates';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const TemplatesSection = forwardRef(({ id, show }, ref) => {
  const { isDark } = useTheme();

  return (
    <div 
      id={id} 
      ref={ref} 
      className={`relative min-h-screen py-12 px-6 lg:px-20 overflow-hidden ${
        isDark 
      ? 'bg-gray-800/50 backdrop-blur-sm' 
      : 'bg-gray-50 backdrop-blur-md' 
      }`}
    >

      {show && (
        <div className={`relative z-10 max-w-6xl mx-auto animate-fadeIn ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <h1 className="text-4xl lg:text-5xl font-bold text-center mb-4 relative">
            <span className="relative inline-block">
              Explore Our
            </span>
            <br />
            <span className={`relative inline-block bg-gradient-to-r bg-clip-text text-transparent ${
              isDark 
                ? 'from-blue-400 via-indigo-300 to-purple-400' 
                : 'from-purple-600 via-blue-600 to-indigo-600'
            } animate-gradient-shift`}>
              Templates
            </span>
          </h1>
          
          <p className={`text-center mb-16 text-xl leading-relaxed relative ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Discover the styles you can use to turn your CV into an{' '}
            <span className={`font-semibold bg-gradient-to-r bg-clip-text text-transparent ${
              isDark 
                ? 'from-white to-blue-200' 
                : 'from-slate-900 to-purple-700'
            }`}>immersive portfolio.</span>
          </p>
          
          {/* Professional Templates Section */}
          <div className="mb-20">
            <h2 className={`text-3xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Professional Templates
            </h2>
            <div className="relative">
              {/* Left Navigation Button */}
              <button 
                className={`swiper-button-prev-professional absolute left-0 top-1/2 -translate-y-1/2 z-10 group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 overflow-hidden ${
                  isDark 
                    ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-500/30 hover:to-indigo-500/30 backdrop-blur-sm border border-blue-400/30 text-white' 
                    : 'bg-gradient-to-r from-purple-100/50 to-blue-100/50 hover:from-purple-200/70 hover:to-blue-200/70 backdrop-blur-sm border border-purple-300/50 text-slate-700 shadow-lg hover:shadow-xl'
                } transform hover:scale-110 hover:-translate-y-1`}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
                
                <svg className="relative z-10 w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Professional Templates Carousel */}
              <Swiper
                modules={[Navigation, Autoplay]}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={3}
                spaceBetween={30}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                navigation={{
                  prevEl: '.swiper-button-prev-professional',
                  nextEl: '.swiper-button-next-professional',
                }}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 20 },
                  640: { slidesPerView: 1, spaceBetween: 20 },
                  768: { slidesPerView: 3, spaceBetween: 30 },
                }}
                className="pb-16 px-16"
              >
                {professionalTemplates.map((template, index) => (
                  <SwiperSlide key={`professional-${template.title}-${index}`} className="py-2">
                    <TemplateCard template={template} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Right Navigation Button */}
              <button 
                className={`swiper-button-next-professional absolute right-0 top-1/2 -translate-y-1/2 z-10 group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 overflow-hidden ${
                  isDark 
                    ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-500/30 hover:to-indigo-500/30 backdrop-blur-sm border border-blue-400/30 text-white' 
                    : 'bg-gradient-to-r from-purple-100/50 to-blue-100/50 hover:from-purple-200/70 hover:to-blue-200/70 backdrop-blur-sm border border-purple-300/50 text-slate-700 shadow-lg hover:shadow-xl'
                } transform hover:scale-110 hover:-translate-y-1`}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
                
                <svg className="relative z-10 w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>

          {/* Fun Templates Section */}
          <div>
            <h2 className={`text-3xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Fun Templates
            </h2>
            <div className="relative">
              {/* Left Navigation Button */}
              <button 
                className={`swiper-button-prev-fun absolute left-0 top-1/2 -translate-y-1/2 z-10 group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 overflow-hidden ${
                  isDark 
                    ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-500/30 hover:to-indigo-500/30 backdrop-blur-sm border border-blue-400/30 text-white' 
                    : 'bg-gradient-to-r from-purple-100/50 to-blue-100/50 hover:from-purple-200/70 hover:to-blue-200/70 backdrop-blur-sm border border-purple-300/50 text-slate-700 shadow-lg hover:shadow-xl'
                } transform hover:scale-110 hover:-translate-y-1`}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
                
                <svg className="relative z-10 w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Fun Templates Carousel */}
              <Swiper
                modules={[Navigation, Autoplay]}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={3}
                spaceBetween={30}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                navigation={{
                  prevEl: '.swiper-button-prev-fun',
                  nextEl: '.swiper-button-next-fun',
                }}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 20 },
                  640: { slidesPerView: 1, spaceBetween: 20 },
                  768: { slidesPerView: 3, spaceBetween: 30 },
                }}
                className="pb-16 px-16"
              >
                {funTemplates.map((template, index) => (
                  <SwiperSlide key={`fun-${template.title}-${index}`} className="py-2">
                    <TemplateCard template={template} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Right Navigation Button */}
              <button 
                className={`swiper-button-next-fun absolute right-0 top-1/2 -translate-y-1/2 z-10 group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 overflow-hidden ${
                  isDark 
                    ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-500/30 hover:to-indigo-500/30 backdrop-blur-sm border border-blue-400/30 text-white' 
                    : 'bg-gradient-to-r from-purple-100/50 to-blue-100/50 hover:from-purple-200/70 hover:to-blue-200/70 backdrop-blur-sm border border-purple-300/50 text-slate-700 shadow-lg hover:shadow-xl'
                } transform hover:scale-110 hover:-translate-y-1`}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
                
                <svg className="relative z-10 w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      )}

      <style jsx>{`
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

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-medium {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(90deg);
          }
        }

        @keyframes float-fast {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.1);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        
        .swiper-slide {
          transition: all 0.3s ease;
        }
        
        .swiper-slide:not(.swiper-slide-active) {
          opacity: 0.3;
          filter: blur(2px);
          transform: scale(0.8);
        }
        
        .swiper-slide-active {
          opacity: 1;
          filter: blur(0);
          transform: scale(1);
          z-index: 10;
        }
        
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: ${isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(99, 102, 241, 0.3)'};
          opacity: 1;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active {
          background: ${isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(99, 102, 241)'};
          transform: scale(1.2);
        }
        
        .swiper-slide-shadow-left,
        .swiper-slide-shadow-right {
          display: none;
        }
      `}</style>
    </div>
  );
});

export default TemplatesSection;
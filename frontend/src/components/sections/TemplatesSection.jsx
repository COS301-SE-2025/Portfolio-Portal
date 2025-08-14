import { forwardRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import TemplateCard from '../TemplateCard';
import templates from '../../data/Templates';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TemplatesSection = forwardRef(({ id, show }, ref) => {
  const { isDark } = useTheme();
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const secondaryText = isDark ? 'text-gray-300' : 'text-slate-600';

  return (
    <div id={id} ref={ref} className="min-h-screen py-12 px-6 lg:px-20">
      {show && (
        <div className={`max-w-6xl mx-auto animate-fadeIn ${textClass}`}>
          <h1 className="text-4xl font-bold text-center mb-4">Explore Our Templates</h1>
          <p className={`text-center mb-16 ${secondaryText}`}>
            Discover the styles you can use to turn your CV into an immersive portfolio.
          </p>
          
          <div className="relative">
            {/* Left Navigation Button */}
            <button 
              className={`swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 border border-white/20 text-white' 
                  : 'bg-white/60 hover:bg-white/80 border border-gray-200/50 text-slate-700 shadow-lg hover:shadow-xl'
              } backdrop-blur-sm hover:scale-110`}
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Carousel */}
            <Swiper
              modules={[Navigation, Pagination]}
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              slidesPerView={3}
              spaceBetween={30}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              pagination={{ 
                clickable: true,
                dynamicBullets: true,
                el: '.swiper-pagination-custom',
              }}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 20 },
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 30 },
              }}
              className="pb-16 px-16"  // Added horizontal padding for arrow space
            >
              {templates.map((template, index) => (
                <SwiperSlide key={`${template.title}-${index}`} className="py-2">
                  <TemplateCard template={template} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Right Navigation Button */}
            <button 
              className={`swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 border border-white/20 text-white' 
                  : 'bg-white/60 hover:bg-white/80 border border-gray-200/50 text-slate-700 shadow-lg hover:shadow-xl'
              } backdrop-blur-sm hover:scale-110`}
            >
              <svg className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Pagination (centered below carousel) */}
          <div className="swiper-pagination-custom flex justify-center mt-8"></div>
        </div>
      )}
      
      <style jsx>{`
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
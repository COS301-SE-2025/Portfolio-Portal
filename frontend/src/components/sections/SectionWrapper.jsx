import { forwardRef } from 'react';

const SectionWrapper = forwardRef(({ id, show, isDark, children }, ref) => {
  return (
    <div 
      id={id} 
      ref={ref} 
      className={`relative min-h-screen flex items-center justify-center px-6 lg:px-20 py-12 overflow-hidden ${
        isDark 
      ? 'bg-gray-800/50 backdrop-blur-sm' 
      : 'bg-gray-50 backdrop-blur-md' 
      }`}
    >
      {show && children}
    </div>
  );
});

export default SectionWrapper;
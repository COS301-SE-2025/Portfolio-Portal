import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const templates = [
  {
    title: 'Office',
    description: 'Corporate and professional with a sleek modern look.',
    image: '/placeholders/office.png',
  },
  {
    title: 'Studio',
    description: 'A clean, minimal space perfect for designers and creatives.',
    image: '/placeholders/studio.png',
  },
  {
    title: 'Gallery',
    description: 'A curated portfolio display, like a personal museum.',
    image: '/placeholders/gallery.png',
  },
  {
    title: 'Space',
    description: 'A futuristic scene that showcases innovation and ambition.',
    image: '/placeholders/space.png',
  },
  {
    title: 'Forest',
    description: 'Serene and natural — ideal for calm, grounded presentation.',
    image: '/placeholders/forest.png',
  },
  {
    title: 'Studio',
    description: 'A clean, minimal space perfect for designers and creatives.',
    image: '/placeholders/studio.png',
  },
];

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const fileInputRef = useRef(null);
  const templatesRef = useRef(null);
  const { theme, toggleTheme, isDark } = useTheme();

  useEffect(() => {
    // Add entrance animation when component mounts
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 100);
    
    // IntersectionObserver for Templates section
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id === 'templates-section') {
          setShowTemplates(true);
        }
      });
    }, observerOptions);

    if (templatesRef.current) observer.observe(templatesRef.current);

    return () => {
      clearTimeout(timer);
      if (templatesRef.current) observer.unobserve(templatesRef.current);
    };
  }, []);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    
    const validFormats = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validFormats.includes(selectedFile.type)) {
      alert('Please upload a PDF or DOCX file');
      return;
    }

    setFile(selectedFile);
    setIsLoading(true);

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setIsLoading(false);

    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={`transition-opacity duration-500 ${
      isDark 
        ? 'bg-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full backdrop-blur-sm border transition-all duration-300 group ${
          isDark 
            ? 'bg-white/10 border-white/20 hover:bg-white/20' 
            : 'bg-white/80 border-gray-200 hover:bg-white shadow-lg hover:shadow-xl'
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-slate-700 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Upload Section */}
      <div className={`min-h-screen flex items-center justify-center p-6 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8">
          {/* Left Content - Upload Area */}
          <div className={`text-center space-y-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <h1 className="text-5xl font-bold">Upload your CV</h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Supported formats: PDF, DOCX. Our system will read your CV and start building your portfolio
            </p>
            
            <div 
              className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                isDark 
                  ? `border-white ${isDragging ? 'bg-indigo-900' : 'bg-transparent'}` 
                  : `border-slate-400 ${isDragging ? 'bg-blue-50 border-blue-400' : 'bg-white/50 hover:bg-white/80'} shadow-lg`
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
              <svg 
                className={`w-12 h-12 mb-4 ${isDark ? 'text-white' : 'text-slate-600'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-8 0V5a2 2 0 012-2h4a2 2 0 012 2v2m-8 0h8"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12v5m-3-3h6"></path>
              </svg>
              <p className="text-xl">Drag & Drop</p>
            </div>

            {!file && !isLoading && (
              <button
  class="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group"
  type="button"
  onClick={triggerFileInput}
>
  <div
    class="bg-purple-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      height="25px"
      width="25px"
      class="rotate-[+90deg]"
    >
      <path
        d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
        fill="#000000"
      ></path>
      <path
        d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
        fill="#000000"
      ></path>
    </svg>
  </div>
  <p class="translate-x-2">Upload CV</p>
</button>

            )}

            {isLoading && (
              <div className="mt-6 flex justify-center">
                <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${
                  isDark ? 'border-white' : 'border-slate-900'
                }`}></div>
              </div>
            )}
            
            {preview && !isLoading && (
              <div className="mt-6 flex flex-col items-center">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Preview
                </h2>
                <div className="w-full h-96 border border-gray-200 rounded bg-white">
                  <iframe 
                    src={preview} 
                    className="w-full h-full rounded"
                    title="PDF Preview"
                  ></iframe>
                </div>
                <div className="mt-6 flex gap-3 w-full">
                  <button 
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    onClick={() => alert('CV uploaded successfully! This is where you would process the file.')}
                  >
                    Submit CV
                  </button>
                  <button 
                    className={`flex-1 border font-medium py-2 px-4 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700' 
                        : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Content - Placeholder */}
          <div className="hidden lg:flex items-center justify-center">
            <div className={`w-96 h-96 bg-gradient-to-br rounded-3xl flex items-center justify-center backdrop-blur-sm border ${
              isDark 
                ? 'from-purple-500/20 to-blue-500/20 border-white/10' 
                : 'from-purple-100/60 to-blue-100/60 border-gray-200/50 shadow-2xl'
            }`}>
              <div className={`text-center ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                <div className={`w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  isDark ? 'bg-purple-500/30' : 'bg-purple-200/50'
                }`}>
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm">Placeholder Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div 
        id="templates-section" 
        ref={templatesRef}
        className="min-h-screen py-12 px-6 lg:px-20"
      >
        {showTemplates && (
          <div className={`max-w-5xl mx-auto animate-fadeIn ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <h1 className="text-4xl font-bold text-center mb-4">Explore Our Templates</h1>
            <p className={`text-center mb-12 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Discover the styles you can use to turn your CV into an immersive portfolio.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {templates.map((template, index) => (
                <div 
                  key={index} 
                  className={`backdrop-blur-md p-6 rounded-3xl border flex flex-col items-center text-center transition hover:scale-105 ${
                    isDark 
                      ? 'bg-white/10 border-white/20' 
                      : 'bg-white/60 border-gray-200/50 shadow-xl hover:shadow-2xl'
                  }`}
                >
                  <div className={`w-64 h-64 bg-gradient-to-br rounded-3xl flex items-center justify-center backdrop-blur-sm border mb-4 ${
                    isDark 
                      ? 'from-purple-500/20 to-blue-500/20 border-white/10' 
                      : 'from-purple-100/60 to-blue-100/60 border-gray-200/50 shadow-lg'
                  }`}>
                    <div className={`text-center ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                      <div className={`w-16 h-16 mx-auto mb-2 rounded-2xl flex items-center justify-center ${
                        isDark ? 'bg-purple-500/30' : 'bg-purple-200/50'
                      }`}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-xs">3D Portfolio Preview</p>
                    </div>
                  </div>
                  <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {template.title}
                  </h2>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                    {template.description}
                  </p>
                  <button className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                    isDark 
                      ? 'bg-white text-indigo-800 hover:bg-gray-100' 
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}>
                    Explore
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;

// Add custom CSS for fade-in animation
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
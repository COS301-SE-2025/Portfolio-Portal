import { useState, useRef, useEffect } from 'react';

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
    <div className="transition-opacity duration-500">
      {/* Upload Section */}
      <div className={`min-h-screen flex items-center justify-center p-6 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8">
          {/* Left Content - Upload Area */}
          <div className="text-center text-white space-y-6">
            <h1 className="text-5xl font-bold">Upload your CV</h1>
            <p className="text-lg text-gray-300">Supported formats: PDF, DOCX. Our system will read your CV and start building your portfolio</p>
            
            <div 
              className={`border-2 border-dashed border-white rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                isDragging ? 'bg-indigo-900' : 'bg-transparent'
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
              <svg className="w-12 h-12 text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-8 0V5a2 2 0 012-2h4a2 2 0 012 2v2m-8 0h8"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12v5m-3-3h6"></path>
              </svg>
              <p className="text-xl">Drag & Drop</p>
            </div>

            {!file && !isLoading && (
              <button 
                className="mt-6 bg-white text-indigo-900 font-medium py-3 px-6 rounded-full hover:bg-gray-200 transition-colors"
                onClick={triggerFileInput}
              >
                Upload CV
              </button>
            )}

            {isLoading && (
              <div className="mt-6 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
            
            {preview && !isLoading && (
              <div className="mt-6 flex flex-col items-center">
                <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>
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
                    className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="w-96 h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <div className="text-white/60 text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-purple-500/30 rounded-2xl flex items-center justify-center">
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
        className="min-h-screen py-12 px-6 lg:px-20 text-white"
      >
        {showTemplates && (
          <div className="max-w-5xl mx-auto animate-fadeIn">
            <h1 className="text-4xl font-bold text-center mb-4">Explore Our Templates</h1>
            <p className="text-center text-gray-300 mb-12">Discover the styles you can use to turn your CV into an immersive portfolio.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {templates.map((template, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex flex-col items-center text-center transition hover:scale-105">
                  <div className="w-64 h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/10 mb-4">
                    <div className="text-white/60 text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-purple-500/30 rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-xs">3D Portfolio Preview</p>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-white">{template.title}</h2>
                  <p className="text-sm text-gray-300 mb-4">{template.description}</p>
                  <button className="px-4 py-2 rounded-full bg-white text-indigo-800 font-semibold text-sm hover:bg-gray-100 transition">Explore</button>
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
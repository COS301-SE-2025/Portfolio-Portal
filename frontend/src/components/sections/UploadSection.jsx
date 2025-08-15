import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import cvDataService from '../../services/cvDataService';
import { forwardRef } from 'react';
import Robot from '../3DModels/Robot'; 
const UploadSection = forwardRef(({ id, show, isDark }, ref) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [error, setError] = useState(null);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const fileInputRef = useRef(null);

  const templates = [
    {
      id: 'space',
      name: 'Space',
      description: 'A futuristic, cosmic-themed portfolio with stellar animations',
      image: '/images/space.png',
      color: 'from-purple-600 to-blue-600',
      preview: 'bg-gradient-to-br from-purple-900 to-blue-900'
    },
    {
      id: 'office',
      name: 'Office',
      description: 'Clean, professional design perfect for corporate environments',
      image: '/images/office.png',
      color: 'from-gray-600 to-slate-600',
      preview: 'bg-gradient-to-br from-gray-100 to-slate-200'
    },
    {
      id: 'forest',
      name: 'Forest',
      description: 'Nature-inspired design with organic elements and earth tones',
      image: '/images/forest.png',
      color: 'from-green-600 to-emerald-600',
      preview: 'bg-gradient-to-br from-green-800 to-emerald-900'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 100);
    return () => clearTimeout(timer);
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
    setError(null);
    setCvData(null);
    setShowTemplateSelection(false);

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

  const handleSubmitCV = async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('cv', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5050/api/ocr/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log('CV Data:', result);

      if (result.success) {
        cvDataService.setData(result.data);
        setCvData(result.data);
        setShowTemplateSelection(true);
        console.log('CV data stored successfully!');
      } else {
        setError('Failed to process CV');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Upload failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTemplateSelect = (templateId) => {
    window.open(`http://localhost:5173/${templateId}`, '_blank');
  };

  return (
    <div 
      id={id} 
      ref={ref} 
      className={`relative min-h-screen flex items-center justify-center p-6 overflow-hidden ${
        isEntering ? 'opacity-0' : 'opacity-100'
      } ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950' 
          : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100'
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating shapes */}
        <div className={`absolute top-20 right-10 w-32 h-32 rounded-full blur-xl animate-float-slow ${
          isDark ? 'bg-blue-500/15' : 'bg-purple-300/30'
        }`}></div>
        <div className={`absolute top-60 left-20 w-24 h-24 rounded-full blur-lg animate-float-medium ${
          isDark ? 'bg-indigo-500/20' : 'bg-blue-300/35'
        }`}></div>
        <div className={`absolute bottom-40 right-40 w-20 h-20 rounded-full blur-lg animate-float-fast ${
          isDark ? 'bg-purple-500/25' : 'bg-indigo-300/40'
        }`}></div>
        
        {/* Geometric shapes */}
        <div className={`absolute top-32 left-10 w-16 h-16 transform rotate-45 animate-spin-slow ${
          isDark ? 'bg-gradient-to-br from-blue-500/15 to-indigo-600/15' : 'bg-gradient-to-br from-purple-300/30 to-blue-400/30'
        }`}></div>
        <div className={`absolute bottom-20 left-1/4 w-12 h-12 transform rotate-12 animate-bounce-slow ${
          isDark ? 'bg-gradient-to-br from-slate-700/20 to-blue-500/20' : 'bg-gradient-to-br from-indigo-300/35 to-purple-400/35'
        }`}></div>
      </div>

      {/* Gradient overlay */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-r from-slate-800/30 via-transparent to-blue-900/20' 
          : 'bg-gradient-to-r from-purple-100/40 via-transparent to-blue-100/40'
      }`}></div>

      {show && (
        <div className={`relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 animate-fadeIn ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <div className="text-center space-y-6 relative">
            {/* Glowing accent */}
            <div className={`absolute -left-4 top-0 w-1 h-32 rounded-full ${
              isDark ? 'bg-gradient-to-b from-blue-400 to-indigo-500' : 'bg-gradient-to-b from-purple-500 to-blue-600'
            } animate-pulse`}></div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight relative">
              <span className="relative inline-block">
                Upload your
                <div className={`absolute -inset-1 rounded-lg blur-lg ${
                  isDark ? 'bg-blue-500/20' : 'bg-purple-300/30'
                } -z-10 animate-pulse`}></div>
              </span>
              <br />
              <span className={`relative inline-block bg-gradient-to-r bg-clip-text text-transparent ${
                isDark 
                  ? 'from-blue-400 via-indigo-300 to-purple-400' 
                  : 'from-purple-600 via-blue-600 to-indigo-600'
              } animate-gradient-shift`}>
                CV
                <div className={`absolute -inset-2 rounded-lg blur-xl ${
                  isDark ? 'bg-gradient-to-r from-blue-500/30 to-indigo-400/20' : 'bg-gradient-to-r from-purple-400/40 to-blue-400/40'
                } -z-10 animate-pulse`}></div>
              </span>
            </h1>
            
            <p className={`text-xl leading-relaxed relative ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Supported formats: PDF, DOCX. Our system will read your CV and start building your{' '}
              <span className={`font-semibold bg-gradient-to-r bg-clip-text text-transparent ${
                isDark 
                  ? 'from-white to-blue-200' 
                  : 'from-slate-900 to-purple-700'
              }`}>portfolio</span>
            </p>
            
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden ${
                isDark 
                  ? `border-blue-400/50 ${isDragging ? 'bg-blue-900/30 border-blue-400' : 'bg-gradient-to-br from-slate-800/30 to-blue-900/20 hover:from-slate-700/40 hover:to-blue-800/30'} backdrop-blur-sm` 
                  : `border-purple-300/60 ${isDragging ? 'bg-purple-100/50 border-purple-400' : 'bg-gradient-to-br from-white/60 to-purple-50/60 hover:from-white/80 hover:to-purple-100/80'} shadow-lg hover:shadow-xl backdrop-blur-sm`
              } transform hover:scale-105`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl"></div>
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
              <svg className={`relative z-10 w-12 h-12 mb-4 transition-colors duration-300 ${
                isDark ? 'text-white group-hover:text-blue-300' : 'text-slate-600 group-hover:text-purple-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-8 0V5a2 2 0 012-2h4a2 2 0 012 2v2m-8 0h8"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12v5m-3-3h6"></path>
              </svg>
              <p className="relative z-10 text-xl font-medium">Drag & Drop</p>
            </div>
            
            {!file && !isLoading && (
              <button
                className={`relative mt-6 font-medium py-4 px-8 rounded-full transition-all duration-300 flex items-center space-x-2 group overflow-hidden mx-auto ${
                  isDark 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg hover:shadow-blue-500/25' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/30'
                } transform hover:scale-105 hover:-translate-y-1`}
                onClick={triggerFileInput}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
                
                <span className="relative z-10">Upload CV</span>
              </button>
            )}
            
            {isLoading && (
              <div className="mt-6 flex justify-center">
                <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${
                  isDark ? 'border-blue-400' : 'border-purple-600'
                }`}></div>
              </div>
            )}
            
            {error && (
              <div className={`mt-4 p-4 rounded-xl border ${
                isDark 
                  ? 'bg-red-900/30 border-red-500/50 text-red-300' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <p className="font-medium">Error:</p>
                <p>{error}</p>
              </div>
            )}
            
            {preview && !isLoading && !showTemplateSelection && (
              <div className="mt-6 flex flex-col items-center space-y-6">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Preview</h2>
                <div className={`w-full h-96 rounded-xl overflow-hidden shadow-lg ${
                  isDark ? 'border border-blue-400/30' : 'border border-gray-200'
                }`}>
                  <iframe src={preview} className="w-full h-full" title="PDF Preview"></iframe>
                </div>
                <div className="flex gap-3 w-full">
                  <button
                    className={`relative flex-1 font-medium py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 group overflow-hidden ${
                      isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isDark 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg hover:shadow-blue-500/25' 
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/30'
                    } transform hover:scale-105`}
                    onClick={handleSubmitCV}
                    disabled={isProcessing}
                  >
                    {!isProcessing && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl"></div>
                    )}
                    
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span className="relative z-10">Process CV</span>
                    )}
                  </button>
                  <button
                    className={`flex-1 border font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      isDark 
                        ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 text-white backdrop-blur-sm' 
                        : 'bg-white/80 border-gray-300 hover:bg-gray-50 text-gray-700 backdrop-blur-sm shadow-lg hover:shadow-xl'
                    }`}
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setCvData(null);
                      setError(null);
                      setShowTemplateSelection(false);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="hidden lg:flex items-center justify-center relative">
            {/* Canvas container with glow */}
            <div className={`absolute inset-0 rounded-xl ${
              isDark ? 'bg-gradient-to-br from-slate-800/30 to-blue-900/20' : 'bg-gradient-to-br from-purple-100/50 to-blue-100/50'
            } backdrop-blur-sm`}></div>
            
            <div className="w-[32rem] h-[32rem] relative">
<Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
  <ambientLight intensity={1.5} />
  <pointLight position={[10, 10, 10]} />
  <Suspense fallback={null}>
    <group position={[0, -0.5, 0]}>
      <Robot scale={1} />
    </group>
    <OrbitControls
      enableZoom={false}
      autoRotate={true}
      target={[0, 0, 0]} 
    />
  </Suspense>
</Canvas>

            </div>
            
            {/* Floating accent elements around canvas */}
            <div className={`absolute -top-4 -right-4 w-8 h-8 rounded-full animate-bounce-slow ${
              isDark ? 'bg-gradient-to-br from-blue-400 to-indigo-500' : 'bg-gradient-to-br from-purple-500 to-blue-600'
            } shadow-lg`}></div>
            <div className={`absolute -bottom-4 -left-4 w-6 h-6 rounded-full animate-float-medium ${
              isDark ? 'bg-gradient-to-br from-indigo-400 to-purple-500' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
            } shadow-lg`}></div>
          </div>
          
          {showTemplateSelection && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className={`max-w-4xl w-full p-8 rounded-2xl border shadow-2xl relative overflow-hidden ${
                isDark ? 'bg-gray-800/90 border-gray-600 backdrop-blur-sm' : 'bg-white/90 border-gray-200 backdrop-blur-sm'
              }`}>
                {/* Modal background effects */}
                <div className={`absolute inset-0 ${
                  isDark 
                    ? 'bg-gradient-to-br from-slate-800/20 to-blue-900/20' 
                    : 'bg-gradient-to-br from-purple-50/50 to-blue-50/50'
                }`}></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      isDark 
                        ? 'bg-gradient-to-br from-green-600 to-emerald-600' 
                        : 'bg-gradient-to-br from-green-500 to-emerald-500'
                    } shadow-lg`}>
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      CV Processed Successfully! 🎉
                    </h3>
                    <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                      Choose your portfolio template to get started
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group ${
                          isDark ? 'border-gray-600 hover:border-gray-400' : 'border-gray-200 hover:border-gray-400'
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <div className={`h-32 ${template.preview} flex items-center justify-center relative overflow-hidden`}>
                          {/* Template preview glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/0 via-white/10 to-gray-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          
                          <img src={template.image} alt={template.name} className="relative z-10" />
                        </div>
                        <div className={`p-4 ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
                          <h4 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {template.name}
                          </h4>
                          <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {template.description}
                          </p>
                          <div className={`mt-3 w-full py-2 px-4 rounded-lg text-center font-medium transition-colors bg-gradient-to-r ${template.color} text-white hover:opacity-90`}>
                            Select Template
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowTemplateSelection(false)}
                      className={`px-6 py-2 rounded-lg font-medium border transition-all duration-300 transform hover:scale-105 ${
                        isDark 
                          ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 text-white backdrop-blur-sm' 
                          : 'bg-white/80 border-gray-300 hover:bg-gray-50 text-gray-700 backdrop-blur-sm shadow-lg hover:shadow-xl'
                      }`}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced floating particles */}
      <div className={`absolute top-20 right-20 w-4 h-4 rounded-full animate-pulse ${isDark ? 'bg-blue-400 opacity-60' : 'bg-purple-500 opacity-70'} shadow-lg`}></div>
      <div className={`absolute top-40 right-32 w-6 h-6 rounded-full animate-pulse delay-1000 ${isDark ? 'bg-indigo-400 opacity-40' : 'bg-blue-500 opacity-60'} shadow-lg`}></div>
      <div className={`absolute top-32 right-16 w-3 h-3 rounded-full animate-pulse delay-500 ${isDark ? 'bg-slate-300 opacity-50' : 'bg-green-500 opacity-70'} shadow-lg`}></div>
      <div className={`absolute bottom-32 left-16 w-5 h-5 rounded-full animate-pulse delay-700 ${isDark ? 'bg-purple-500 opacity-45' : 'bg-indigo-500 opacity-65'} shadow-lg`}></div>
    </div>
  );
});

export default UploadSection;

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
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
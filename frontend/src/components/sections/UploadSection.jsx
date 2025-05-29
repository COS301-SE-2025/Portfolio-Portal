import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Plane from '../3DModels/Plane';
import cvDataService from '../../services/cvDataService';
import { forwardRef } from 'react';

const UploadSection = forwardRef(({ id, show, isDark }, ref) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [error, setError] = useState(null);
  const [showCvData, setShowCvData] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let countdownTimer;
    if (isRedirecting && redirectCountdown > 0) {
      countdownTimer = setTimeout(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isRedirecting && redirectCountdown === 0) {
      window.location.href = '/space';
    }
    return () => {
      if (countdownTimer) clearTimeout(countdownTimer);
    };
  }, [isRedirecting, redirectCountdown]);

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
    setShowCvData(false);
    setIsRedirecting(false);
    setRedirectCountdown(3);

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
      const response = await fetch('http://localhost:5050/api/ocr/upload', {
        method: 'POST',
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
        setShowCvData(true);
        console.log('CV data stored successfully!');
        setIsRedirecting(true);
        setRedirectCountdown(3);
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

  const cancelRedirect = () => {
    setIsRedirecting(false);
    setRedirectCountdown(3);
  };

  const redirectNow = () => {
    setRedirectCountdown(0);
  };

  return (
    <div id={id} ref={ref} className={`min-h-screen flex items-center justify-center p-6 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
      {show && (
        <div className={`max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 animate-fadeIn ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold">Upload your CV</h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Supported formats: PDF, DOCX. Our system will read your CV and start building your portfolio
            </p>
            <div
              className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                isDark ? `border-white ${isDragging ? 'bg-indigo-900' : 'bg-transparent'}` : `border-slate-400 ${isDragging ? 'bg-blue-50 border-blue-400' : 'bg-white/50 hover:bg-white/80'} shadow-lg`
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
              <svg className={`w-12 h-12 mb-4 ${isDark ? 'text-white' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-8 0V5a2 2 0 012-2h4a2 2 0 012 2v2m-8 0h8"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12v5m-3-3h6"></path>
              </svg>
              <p className="text-xl">Drag & Drop</p>
            </div>
            {!file && !isLoading && (
              <button
                className={`mt-6 font-medium py-3 px-6 rounded-full transition-colors ${isDark ? 'bg-white text-indigo-900 hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                onClick={triggerFileInput}
              >
                Upload CV
              </button>
            )}
            {isLoading && (
              <div className="mt-6 flex justify-center">
                <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${isDark ? 'border-white' : 'border-slate-900'}`}></div>
              </div>
            )}
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="font-medium">Error:</p>
                <p>{error}</p>
              </div>
            )}
            {preview && !isLoading && !isRedirecting && (
              <div className="mt-6 flex flex-col items-center">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Preview</h2>
                <div className="w-full h-96 border border-gray-200 rounded bg-white">
                  <iframe src={preview} className="w-full h-full rounded" title="PDF Preview"></iframe>
                </div>
                <div className="mt-6 flex gap-3 w-full">
                  <button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    onClick={handleSubmitCV}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      'Process CV'
                    )}
                  </button>
                  <button
                    className={`flex-1 border font-medium py-2 px-4 rounded-lg transition-colors ${isDark ? 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'}`}
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setCvData(null);
                      setShowCvData(false);
                      setError(null);
                      setIsRedirecting(false);
                      setRedirectCountdown(3);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
            {cvData && !isRedirecting && (
              <div className="mt-6">
                <button
                  className={`font-medium py-2 px-4 rounded-lg transition-colors ${isDark ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                  onClick={() => setShowCvData(!showCvData)}
                >
                  {showCvData ? 'Hide' : 'Show'} Extracted Data
                </button>
              </div>
            )}
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-[32rem] h-[32rem]">
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} />
                <Suspense fallback={null}>
                  <Plane />
                  <OrbitControls enableZoom={false} autoRotate={false} />
                </Suspense>
              </Canvas>
            </div>
          </div>
          {isRedirecting && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className={`max-w-md w-full p-8 rounded-2xl border shadow-2xl ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    CV Processed Successfully! 🎉
                  </h3>
                  <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                    Your portfolio is ready! Redirecting to your Space template in
                  </p>
                  <div className="w-20 h-20 mx-auto mb-6 relative">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="none" className={isDark ? 'text-slate-600' : 'text-gray-200'} />
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 35}`}
                        strokeDashoffset={`${2 * Math.PI * 35 * (redirectCountdown / 3)}`}
                        className="text-green-500 transition-all duration-1000 ease-linear"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {redirectCountdown}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={redirectNow}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Go Now
                    </button>
                    <button
                      onClick={cancelRedirect}
                      className={`flex-1 border font-medium py-2 px-4 rounded-lg transition-colors ${isDark ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-white' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'}`}
                    >
                      Stay Here
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showCvData && cvData && (
            <div className={`py-12 px-6 lg:px-20 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="max-w-4xl mx-auto">
                <h2 className={`text-3xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Extracted CV Data
                </h2>
                <div className="space-y-6">
                  <div className={`p-6 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Name:</p>
                        <p className={isDark ? 'text-white' : 'text-slate-900'}>{cvData.name}</p>
                      </div>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Email:</p>
                        <p className={isDark ? 'text-white' : 'text-slate-900'}>{cvData.email}</p>
                      </div>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Phone:</p>
                        <p className={isDark ? 'text-white' : 'text-slate-900'}>{cvData.phone}</p>
                      </div>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Links:</p>
                        {cvData.links?.linkedIn && <p className={isDark ? 'text-blue-400' : 'text-blue-600'}>{cvData.links.linkedIn}</p>}
                        {cvData.links?.github && <p className={isDark ? 'text-blue-400' : 'text-blue-600'}>{cvData.links.github}</p>}
                      </div>
                    </div>
                  </div>
                  {cvData.skills && cvData.skills.length > 0 && (
                    <div className={`p-6 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                      <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {cvData.skills.map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {cvData.experience && cvData.experience.length > 0 && (
                    <div className={`p-6 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                      <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Experience</h3>
                      <div className="space-y-4">
                        {cvData.experience.map((exp, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <h4 className={`font-medium text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{exp.title}</h4>
                            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{exp.company}</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{exp.startDate} - {exp.endDate}</p>
                            {exp.extra && exp.extra.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {exp.extra.map((item, idx) => (
                                  <li key={idx} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {item.replace('¢', '•')}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {cvData.education && cvData.education.length > 0 && (
                    <div className={`p-6 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                      <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Education</h3>
                      <div className="space-y-4">
                        {cvData.education.map((edu, index) => (
                          <div key={index} className="border-l-4 border-green-500 pl-4">
                            <h4 className={`font-medium text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{edu.degree}</h4>
                            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{edu.institution}</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Completed: {edu.endDate}</p>
                            {edu.extra && edu.extra.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {edu.extra.map((item, idx) => (
                                  <li key={idx} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    • {item}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
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

  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
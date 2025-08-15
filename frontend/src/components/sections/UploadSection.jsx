//frontend/stc/components/sections/UploadSection.jsx
import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Plane from "../3DModels/Plane";
import cvDataService from "../../services/cvDataService";
import { forwardRef } from "react";

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
  const fileInputRef = useRef(null);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    const validFormats = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validFormats.includes(selectedFile.type)) {
      alert("Please upload a PDF or DOCX file");
      return;
    }

    setFile(selectedFile);
    setIsLoading(true);
    setError(null);
    setCvData(null);
    setShowCvData(false);


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
      setError("No file selected");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append("cv", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5050/api/ocr/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log("CV rocessing Result:", result);
      if (result.success) {
        cvDataService.setData(result.data);

        // immediately redirect to the selected template
        const template = result.template || "space"; // default to space if none selected
        console.log("Redirecting to template:", template);
        window.location.href = `/${template}`;

      } else {
        setError("Failed to process CV");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(`Upload failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id={id}
      ref={ref}
      className={`min-h-screen flex items-center justify-center p-6 ${
        isEntering ? "opacity-0" : "opacity-100"
      }`}
    >
      {show && (
        <div
          className={`max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 animate-fadeIn ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold">Upload your CV</h1>
            <p
              className={`text-lg ${
                isDark ? "text-gray-300" : "text-slate-600"
              }`}
            >
              Supported formats: PDF, DOCX. Our system will read your CV and
              start building your portfolio

            </p>
            
            <div
              className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                isDark
                  ? `border-white ${
                      isDragging ? "bg-indigo-900" : "bg-transparent"
                    }`
                  : `border-slate-400 ${
                      isDragging
                        ? "bg-blue-50 border-blue-400"
                        : "bg-white/50 hover:bg-white/80"
                    } shadow-lg`
              }`}

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
              <svg
                className={`w-12 h-12 mb-4 ${
                  isDark ? "text-white" : "text-slate-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-8 0V5a2 2 0 012-2h4a2 2 0 012 2v2m-8 0h8"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12v5m-3-3h6"
                ></path>

              </svg>
              <p className="relative z-10 text-xl font-medium">Drag & Drop</p>
            </div>
            
            {!file && !isLoading && (
              <button
                className={`mt-6 font-medium py-3 px-6 rounded-full transition-colors ${
                  isDark
                    ? "bg-white text-indigo-900 hover:bg-gray-200"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}

                onClick={triggerFileInput}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
                
                <span className="relative z-10">Upload CV</span>
              </button>
            )}
            
            {isLoading && (
              <div className="mt-6 flex justify-center">
                <div
                  className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${
                    isDark ? "border-white" : "border-slate-900"
                  }`}
                ></div>
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
            {preview && !isLoading && (
              <div className="mt-6 flex flex-col items-center">
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Preview
                </h2>
                <div className="w-full h-96 border border-gray-200 rounded bg-white">
                  <iframe
                    src={preview}
                    className="w-full h-full rounded"
                    title="PDF Preview"
                  ></iframe>

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
                      "Process CV"
                    )}
                  </button>
                  <button
                    className={`flex-1 border font-medium py-2 px-4 rounded-lg transition-colors ${
                      isDark
                        ? "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
                        : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"

                    }`}
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setCvData(null);
                      setError(null);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
            {cvData && (
              <div className="mt-6">
                <button
                  className={`font-medium py-2 px-4 rounded-lg transition-colors ${
                    isDark
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  onClick={() => setShowCvData(!showCvData)}
                >
                  {showCvData ? "Hide" : "Show"} Extracted Data
                </button>
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
                  <Plane />
                  <OrbitControls enableZoom={false} autoRotate={false} />
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

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

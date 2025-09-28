//frontend/src/component/sections/UploadSection.jsx:
import { useState, useRef, forwardRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import api from '../../services/api.service';
import cvDataService from "../../services/cvDataService";
import Robot from "../3DModels/Robot";
import SectionWrapper from "./SectionWrapper";

const UploadSection = forwardRef(({ id, show, isDark }, ref) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [useAIFormatting, setUseAIFormatting] = useState(true);
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

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setIsLoading(false);
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
    if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const handleSubmitCV = async () => {
    if (!file) {
      setError("No file selected");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("useAI", useAIFormatting.toString());

    try {
      // Use api.service instead of direct fetch
      const response = await api.post('/ocr/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = response.data; // axios returns data in response.data

      console.log("CV processing Result:", result);
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
      setError(`Upload failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SectionWrapper id={id} show={show} ref={ref} isDark={isDark}>
      <div
        className={`relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fadeIn ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        <div className="text-center space-y-6 relative">
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight relative">
            <span className="relative inline-block">Upload your</span>
            <br />
            <span
              className={`relative inline-block bg-gradient-to-r bg-clip-text text-transparent ${
                isDark
                  ? "from-blue-400 via-indigo-300 to-purple-400"
                  : "from-purple-600 via-blue-600 to-indigo-600"
              } animate-gradient-shift`}
            >
              CV
            </span>
          </h1>

          <p
            className={`text-xl leading-relaxed relative ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Supported formats: PDF, DOCX. Our system will read your CV and start
            building your{" "}
            <span
              className={`font-semibold bg-gradient-to-r bg-clip-text text-transparent ${
                isDark
                  ? "from-white to-blue-200"
                  : "from-slate-900 to-purple-700"
              }`}
            >
              portfolio
            </span>
          </p>

          {/* AI Formatting Toggle */}
          <div className={`flex items-center justify-center space-x-3 p-4 rounded-xl ${
            isDark 
              ? "bg-slate-800/30 border border-blue-400/20" 
              : "bg-white/60 border border-purple-200/60 shadow-sm"
          } backdrop-blur-sm`}>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="aiFormatting"
                checked={useAIFormatting}
                onChange={(e) => setUseAIFormatting(e.target.checked)}
                className={`relative w-5 h-5 rounded cursor-pointer transition-all duration-200 ${
                  useAIFormatting
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 border-0"
                    : isDark
                    ? "bg-slate-700 border-2 border-slate-600"
                    : "bg-white border-2 border-gray-300"
                } focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
              />
              <label
                htmlFor="aiFormatting"
                className={`cursor-pointer select-none ${
                  isDark ? "text-slate-200" : "text-slate-700"
                }`}
              >
                <span className="font-medium">Use AI Formatting</span>
                <div className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {useAIFormatting 
                    ? "AI will organize and structure your CV data intelligently" 
                    : "Basic text extraction without AI processing"
                  }
                </div>
              </label>
            </div>
          </div>

          <div
            className={`relative border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden ${
              isDark
                ? `border-blue-400/50 ${
                    isDragging
                      ? "bg-blue-900/30 border-blue-400"
                      : "bg-gradient-to-br from-slate-800/30 to-blue-900/20 hover:from-slate-700/40 hover:to-blue-800/30"
                  } backdrop-blur-sm`
                : `border-purple-300/60 ${
                    isDragging
                      ? "bg-purple-100/50 border-purple-400"
                      : "bg-gradient-to-br from-white/60 to-purple-50/60 hover:from-white/80 hover:to-purple-100/80"
                  } shadow-lg hover:shadow-xl backdrop-blur-sm`
            } transform hover:scale-105`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl"></div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
            <svg
              className={`relative z-10 w-12 h-12 mb-4 transition-colors duration-300 ${
                isDark
                  ? "text-white group-hover:text-blue-300"
                  : "text-slate-600 group-hover:text-purple-600"
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

          {/* Upload CV BUTTON: */}
          {!file && !isLoading && (
            <button
              className={`relative mt-6 font-medium py-4 px-8 rounded-full transition-all duration-300 flex items-center space-x-2 group overflow-hidden mx-auto 
      bg-gradient-to-br from-purple-500 to-blue-500 text-white 
      shadow-lg hover:scale-105 hover:-translate-y-1`}
              onClick={triggerFileInput}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
              <span className="relative z-10">Upload CV</span>
            </button>
          )}

          {isLoading && (
            <div className="mt-6 flex justify-center">
              <div
                className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${
                  isDark ? "border-blue-400" : "border-purple-600"
                }`}
              ></div>
            </div>
          )}

          {error && (
            <div
              className={`mt-4 p-4 rounded-xl border ${
                isDark
                  ? "bg-red-900/30 border-red-500/50 text-red-300"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {preview && !isLoading && (
            <div className="mt-6 flex flex-col items-center space-y-6">
              <h2
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Preview
              </h2>
              <div
                className={`w-full h-96 rounded-xl overflow-hidden shadow-lg ${
                  isDark
                    ? "border border-blue-400/30"
                    : "border border-gray-200"
                }`}
              >
                <iframe
                  src={preview}
                  className="w-full h-full"
                  title="PDF Preview"
                ></iframe>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  className={`relative flex-1 font-medium py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 group overflow-hidden ${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : isDark
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg hover:shadow-blue-500/25"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/30"
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
                      <span>Processing{useAIFormatting ? " with AI" : ""}...</span>
                    </>
                  ) : (
                    <span className="relative z-10">
                      Process CV{useAIFormatting ? " with AI" : ""}
                    </span>
                  )}
                </button>
                <button
                  className={`flex-1 border font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    isDark
                      ? "bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 text-white backdrop-blur-sm"
                      : "bg-white/80 border-gray-300 hover:bg-gray-50 text-gray-700 backdrop-blur-sm shadow-lg hover:shadow-xl"
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

        <div className="hidden lg:flex items-center justify-center relative">
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
        </div>
      </div>
    </SectionWrapper>
  );
});

export default UploadSection;
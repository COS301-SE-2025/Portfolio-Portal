import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add entrance animation when component mounts
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

    // Create a URL for the file to preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setIsLoading(false);

    // Clean up the URL when component unmounts
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
    <div className={`min-h-screen flex items-center justify-center p-6 transition-opacity duration-500 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8">
        {/* Left Content - Upload Area */}
        <div className="text-center text-white space-y-6">
          <h1 className="text-5xl font-bold">Upload your CV</h1>
          <p className="text-lg text-gray-300">Supported formats: PDF, DOCX. Our system will read your CV and start building your portfolio</p>
          
          {/* Upload Area */}
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

          {/* Upload CV Button */}
          {!file && !isLoading && (
            <button 
              className="mt-6 bg-white text-indigo-900 font-medium py-3 px-6 rounded-full hover:bg-gray-200 transition-colors"
              onClick={triggerFileInput}
            >
              Upload CV
            </button>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
          
          {/* Preview Section */}
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

          {/* Go Back Button */}
          <button 
            className="mt-6 text-white hover:text-gray-300 font-medium flex items-center mx-auto"
            onClick={() => navigate('/')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Home
          </button>
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
  );
};

export default Upload;
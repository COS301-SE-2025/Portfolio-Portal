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
    
    if (selectedFile.type !== 'application/pdf') {
      alert('Please upload a PDF file');
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
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6 transition-opacity duration-500 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-auto p-6">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Upload Your CV</h1>
        
        {/* Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            isDragging ? 'border-indigo-500 bg-indigo-50 drag-active' : 'border-gray-300 bg-white'
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
            accept="application/pdf" 
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
          
          <svg className="w-10 h-10 text-indigo-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          
          <p className="text-md text-center text-gray-700">
            {file ? file.name : 'Drag and drop your CV here, or click to browse'}
          </p>
          <p className="text-xs text-gray-500 mt-2">Only PDF files are supported</p>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
        
        {/* Preview Section */}
        {preview && !isLoading && (
          <div className="mt-6 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Preview</h2>
            <div className="w-full h-80 border border-gray-200 rounded">
              <iframe 
                src={preview} 
                className="w-full h-full rounded"
                title="PDF Preview"
              ></iframe>
            </div>
            <div className="mt-4 flex gap-3 w-full">
              <button 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                onClick={() => alert('CV uploaded successfully! This is where you would process the file.')}
              >
                Submit CV
              </button>
              <button 
                className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
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
          className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium flex items-center mx-auto text-sm"
          onClick={() => navigate('/')}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Upload;
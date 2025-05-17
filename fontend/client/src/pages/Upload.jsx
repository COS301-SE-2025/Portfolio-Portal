import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FileDropzone from '../components/FileUpload/FileDropzone';
import LoadingSpinner from '../components/FileUpload/LoadingSpinner';
import PDFPreviewer from '../components/FileUpload/PDFPreviewer';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setIsLoading(false);

    return () => URL.revokeObjectURL(objectUrl);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6 transition-opacity duration-500 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-auto p-6">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Upload Your CV</h1>

        <FileDropzone
          file={file}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          handleFileChange={handleFileChange}
        />

        {isLoading && <LoadingSpinner />}

        {preview && !isLoading && (
          <PDFPreviewer
            preview={preview}
            setFile={setFile}
            setPreview={setPreview}
          />
        )}

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
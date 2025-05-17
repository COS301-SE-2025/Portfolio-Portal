import { useRef } from 'react';

const FileDropzone = ({ file, isDragging, setIsDragging, handleFileChange }) => {
  const fileInputRef = useRef(null);

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
  );
};

export default FileDropzone;
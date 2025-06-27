import { useRef, useState, useEffect } from 'react';
import { FileText, Upload, X, Download, Eye } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const CVSection = ({ cvFiles = [], setCvFiles }) => {
  const { isDark } = useTheme();
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Load files from memory state on component mount
  useEffect(() => {
    if (cvFiles && cvFiles.length > 0) {
      setSelectedFiles(cvFiles);
    }
  }, [cvFiles]);

  const handleCvUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        id: Date.now() + Math.random(), // Simple unique ID
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString()
      }));

      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);
      setCvFiles(updatedFiles);
    }
    
    // Reset file input
    e.target.value = '';
  };

  const handleRemoveFile = (fileId) => {
    const updatedFiles = selectedFiles.filter(fileObj => fileObj.id !== fileId);
    setSelectedFiles(updatedFiles);
    setCvFiles(updatedFiles);
  };

  const handlePreviewFile = (fileObj) => {
    const url = URL.createObjectURL(fileObj.file);
    window.open(url, '_blank');
    // Clean up the URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownloadFile = (fileObj) => {
    const url = URL.createObjectURL(fileObj.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileObj.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) {
      return '📄';
    } else if (fileType.includes('doc')) {
      return '📝';
    }
    return '📎';
  };

  return (
    <div className={`rounded-xl p-6 mb-8 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <FileText className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          CV/Resume Files
        </h2>
        {selectedFiles.length > 0 && (
          <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
            {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {/* File List */}
        {selectedFiles.length > 0 ? (
          <div className="space-y-3">
            {selectedFiles.map((fileObj) => (
              <div 
                key={fileObj.id}
                className={`p-4 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xl">{getFileIcon(fileObj.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {fileObj.name}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatFileSize(fileObj.size)} • Uploaded {new Date(fileObj.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {/* Preview Button */}
                    <button
                      onClick={() => handlePreviewFile(fileObj)}
                      className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-600 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}
                      title="Preview file"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {/* Download Button */}
                    <button
                      onClick={() => handleDownloadFile(fileObj)}
                      className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-600 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFile(fileObj.id)}
                      className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-8 border-2 border-dashed rounded-lg text-center ${isDark ? 'border-slate-600' : 'border-gray-300'}`}>
            <FileText className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className={`mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              No CV files uploaded yet
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Upload your CV/Resume files to get started
            </p>
          </div>
        )}
        
        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          <Upload className="w-4 h-4" />
          {selectedFiles.length > 0 ? 'Add More Files' : 'Upload CV Files'}
        </button>
        
        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleCvUpload}
          className="hidden"
          multiple
        />
        
        {/* Upload Instructions */}
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Supported formats: PDF, DOC, DOCX • Multiple files allowed
        </p>
      </div>
    </div>
  );
};

export default CVSection;
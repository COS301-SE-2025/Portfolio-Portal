import { useRef } from 'react';
import { FileText, Upload, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const CVSection = ({ cvFile, setCvFile }) => {
  const { isDark } = useTheme();
  const fileInputRef = useRef(null);

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
    }
  };

  return (
    <div className={`rounded-xl p-6 mb-8 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <FileText className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          CV/Resume
        </h2>
      </div>
      
      <div className="space-y-4">
        {cvFile ? (
          <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {cvFile.name}
              </span>
              <button
                onClick={() => setCvFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className={`p-8 border-2 border-dashed rounded-lg text-center ${isDark ? 'border-slate-600' : 'border-gray-300'}`}>
            <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No CV uploaded yet
            </p>
          </div>
        )}
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          <Upload className="w-4 h-4" />
          {cvFile ? 'Replace CV' : 'Upload CV'}
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleCvUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default CVSection;
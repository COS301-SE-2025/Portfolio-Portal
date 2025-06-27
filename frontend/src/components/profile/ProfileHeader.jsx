
import { User, Edit2, Save, X, Loader2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ProfileHeader = ({ 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  loading = false,
  userName = null,
  userTitle = null 
}) => {
  const { isDark } = useTheme();

  return (
    <div className={`rounded-xl p-6 mb-8 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${isDark ? 'bg-slate-700' : 'bg-blue-100'}`}>
            <User className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {userName || 'Profile'}
            </h1>
            {userTitle && (
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                {userTitle}
              </p>
            )}
          </div>
        </div>
        {!isEditing ? (
          <button
            onClick={onEdit}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-700'
            } ${isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Edit2 className="w-4 h-4" />
            )}
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onSave}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                loading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-green-700'
              } bg-green-600 text-white`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>
            <button
              onClick={onCancel}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                loading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-red-700'
              } bg-red-600 text-white`}
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
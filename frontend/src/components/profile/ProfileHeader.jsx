import { User, Edit2, Save, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ProfileHeader = ({ isEditing, onEdit, onSave, onCancel }) => {
  const { isDark } = useTheme();

  return (
    <div className={`rounded-xl p-6 mb-8 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${isDark ? 'bg-slate-700' : 'bg-blue-100'}`}>
            <User className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Profile
          </h1>
        </div>
        {!isEditing ? (
          <button
            onClick={onEdit}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
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
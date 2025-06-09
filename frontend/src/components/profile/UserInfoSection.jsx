import { useTheme } from '../../contexts/ThemeContext';

const UserInfoSection = ({ userData, editData, setEditData, isEditing }) => {
  const { isDark } = useTheme();

  return (
    <div className={`rounded-xl p-6 mb-8 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({...editData, name: e.target.value})}
              className={`w-full p-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          ) : (
            <p className={`p-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{userData.name}</p>
          )}
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({...editData, email: e.target.value})}
              className={`w-full p-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          ) : (
            <p className={`p-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{userData.email}</p>
          )}
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Title
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              className={`w-full p-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          ) : (
            <p className={`p-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{userData.title}</p>
          )}
        </div>
        
        <div className="md:col-span-2">
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={editData.bio}
              onChange={(e) => setEditData({...editData, bio: e.target.value})}
              rows={3}
              className={`w-full p-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          ) : (
            <p className={`p-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{userData.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoSection;
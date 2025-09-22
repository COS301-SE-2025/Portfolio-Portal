import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  UserPlus, 
  UserCheck, 
  Eye, 
  Search, 
  Filter,
  ExternalLink,
  Calendar,
  Users,
  Star,
  MessageCircle,
  Share2,
  TrendingUp
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// Mock data for users and their portfolios
const mockUsers = [
  {
    id: 1,
    name: "Alex Chen",
    bio: "Full-stack developer passionate about clean code",
    email: "alex.chen@example.com",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    selected_template: "space",
    template_title: "Cosmic Portfolio",
    template_image: "/images/space.png",
    followers: 245,
    following: 180,
    likes: 89,
    isFollowing: false,
    isLiked: false,
    created_at: "2024-01-15",
    github: "https://github.com/alexchen",
    linkedin: "https://linkedin.com/in/alexchen"
  },
  {
    id: 2,
    name: "Sarah Rodriguez",
    bio: "UI/UX Designer & Frontend Developer",
    email: "sarah.rodriguez@example.com",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    selected_template: "forest",
    template_title: "Nature's Portfolio",
    template_image: "/images/forest.png",
    followers: 320,
    following: 95,
    likes: 156,
    isFollowing: true,
    isLiked: true,
    created_at: "2023-11-22",
    github: "https://github.com/sarahrodriguez",
    linkedin: "https://linkedin.com/in/sarahrodriguez"
  },
  {
    id: 3,
    name: "Marcus Johnson",
    bio: "Backend Engineer specializing in microservices",
    email: "marcus.johnson@example.com",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    selected_template: "office",
    template_title: "Professional Hub",
    template_image: "/images/office.png",
    followers: 189,
    following: 210,
    likes: 67,
    isFollowing: false,
    isLiked: false,
    created_at: "2024-03-08",
    github: "https://github.com/marcusjohnson",
    linkedin: "https://linkedin.com/in/marcusjohnson"
  },
  {
    id: 4,
    name: "Luna Kim",
    bio: "Data Scientist & Machine Learning Engineer",
    email: "luna.kim@example.com",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    selected_template: "lab",
    template_title: "Research Lab",
    template_image: "/images/lab.png",
    followers: 412,
    following: 156,
    likes: 203,
    isFollowing: true,
    isLiked: false,
    created_at: "2023-09-14",
    github: "https://github.com/lunakim",
    linkedin: "https://linkedin.com/in/lunakim"
  },
  {
    id: 5,
    name: "David Thompson",
    bio: "Game Developer & 3D Artist",
    email: "david.thompson@example.com",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    selected_template: "cave",
    template_title: "Underground Studio",
    template_image: "/images/cave.png",
    followers: 278,
    following: 134,
    likes: 145,
    isFollowing: false,
    isLiked: true,
    created_at: "2023-12-05",
    github: "https://github.com/davidthompson",
    linkedin: "https://linkedin.com/in/davidthompson"
  },
  {
    id: 6,
    name: "Emma Wilson",
    bio: "Mobile App Developer & Tech Writer",
    email: "emma.wilson@example.com",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    selected_template: "space",
    template_title: "Stellar Showcase",
    template_image: "/images/space.png",
    followers: 356,
    following: 189,
    likes: 234,
    isFollowing: true,
    isLiked: true,
    created_at: "2024-02-18",
    github: "https://github.com/emmawilson",
    linkedin: "https://linkedin.com/in/emmawilson"
  }
];

const templateThemes = {
  space: { color: "from-purple-600 to-indigo-600", name: "Space" },
  forest: { color: "from-green-600 to-emerald-600", name: "Forest" },
  office: { color: "from-blue-600 to-cyan-600", name: "Office" },
  lab: { color: "from-orange-600 to-red-600", name: "Lab" },
  cave: { color: "from-gray-600 to-slate-600", name: "Cave" }
};

const UserCard = ({ user, onLike, onFollow }) => {
  const { isDark } = useTheme();
  const [isLiked, setIsLiked] = useState(user.isLiked);
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [likes, setLikes] = useState(user.likes);
  const [followers, setFollowers] = useState(user.followers);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    onLike(user.id, !isLiked);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowers(isFollowing ? followers - 1 : followers + 1);
    onFollow(user.id, !isFollowing);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short"
    });

  const themeInfo = templateThemes[user.selected_template] || templateThemes.space;

  return (
    <div className={`rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 ${
      isDark ? "bg-slate-800" : "bg-white"
    }`}>
      {/* Template Preview */}
      <div className="relative group cursor-pointer">
        <div className="relative overflow-hidden h-48">
          <img
            src={user.template_image}
            alt={user.template_title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300`}>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="font-bold text-lg">{user.template_title}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs bg-gradient-to-r ${themeInfo.color} text-white`}>
                    {themeInfo.name}
                  </span>
                </div>
                <div className="rounded-full p-2 bg-white/20 backdrop-blur-sm">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Like Button Overlay */}
        <button
          onClick={handleLike}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isLiked 
              ? "bg-red-500 text-white shadow-lg scale-110" 
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* User Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
              />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>
                {user.name}
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Member since {formatDate(user.created_at)}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleFollow}
            className={`inline-flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
              isFollowing
                ? isDark
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : isDark
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-purple-700 hover:to-blue-700"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-purple-700 hover:to-blue-700"
            }`}
          >
            {isFollowing ? (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Follow
              </>
            )}
          </button>
        </div>

        {user.bio && (
          <p className={`text-sm mb-4 leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {user.bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Heart className={`w-4 h-4 ${isDark ? "text-red-400" : "text-red-500"}`} />
              <span className={isDark ? "text-gray-300" : "text-gray-600"}>{likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-500"}`} />
              <span className={isDark ? "text-gray-300" : "text-gray-600"}>{followers}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-500"}`} />
              <span className={isDark ? "text-gray-300" : "text-gray-600"}>{user.following}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {user.github && (
              <a
                href={user.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
            {user.linkedin && (
              <a
                href={user.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialSection = () => {
  const { isDark } = useTheme();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const handleLike = (userId, liked) => {
    console.log(`User ${userId} ${liked ? 'liked' : 'unliked'}`);
  };

  const handleFollow = (userId, following) => {
    console.log(`User ${userId} ${following ? 'followed' : 'unfollowed'}`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "following") return matchesSearch && user.isFollowing;
    if (selectedFilter === "liked") return matchesSearch && user.isLiked;
    return matchesSearch && user.selected_template === selectedFilter;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case "likes":
        return b.likes - a.likes;
      case "followers":
        return b.followers - a.followers;
      case "latest":
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  const stats = {
    totalUsers: users.length,
    totalLikes: users.reduce((sum, user) => sum + user.likes, 0),
    totalFollows: users.reduce((sum, user) => sum + user.followers, 0),
    activeToday: Math.floor(users.length * 0.3)
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark
        ? "bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"
        : "bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100"
    }`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className={`rounded-2xl shadow-xl p-8 mb-8 ${
          isDark ? "bg-slate-800" : "bg-white"
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                Community
              </h1>
              <p className={`text-xl ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Discover amazing portfolios and connect with talented developers
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Members", value: stats.totalUsers, color: "blue" },
                { icon: Heart, label: "Total Likes", value: stats.totalLikes, color: "red" },
                { icon: TrendingUp, label: "Followers", value: stats.totalFollows, color: "green" },
                { icon: Star, label: "Active Today", value: stats.activeToday, color: "purple" }
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className={`text-center p-4 rounded-xl ${
                  isDark ? "bg-slate-700/50" : "bg-gray-50"
                }`}>
                  <Icon className={`w-6 h-6 mx-auto mb-2 text-${color}-500`} />
                  <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {value}
                  </p>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`rounded-2xl shadow-xl p-6 mb-8 ${
          isDark ? "bg-slate-800" : "bg-white"
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  isDark
                    ? "bg-slate-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isDark
                      ? "bg-slate-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="all">All Users</option>
                  <option value="following">Following</option>
                  <option value="liked">Liked</option>
                  <option value="space">Space Theme</option>
                  <option value="forest">Forest Theme</option>
                  <option value="office">Office Theme</option>
                  <option value="lab">Lab Theme</option>
                  <option value="cave">Cave Theme</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isDark
                      ? "bg-slate-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="latest">Latest</option>
                  <option value="likes">Most Liked</option>
                  <option value="followers">Most Followers</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* User Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onLike={handleLike}
              onFollow={handleFollow}
            />
          ))}
        </div>

        {sortedUsers.length === 0 && (
          <div className={`text-center py-16 rounded-2xl ${
            isDark ? "bg-slate-800" : "bg-white"
          }`}>
            <Users className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? "text-gray-600" : "text-gray-400"
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>
              No users found
            </h3>
            <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialSection;
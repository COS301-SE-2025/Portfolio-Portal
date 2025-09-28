import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  UserPlus, 
  UserCheck, 
  Eye, 
  ExternalLink,
  Calendar,
  Users,
  Star,
  TrendingUp,
  X
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import socialService from '../../services/social.service';
import { authService } from '../../services/cvDataService';
import { profileService } from '../../services/profile.service';

const templateThemes = {
  space: { color: "from-purple-600 to-indigo-600", name: "Space" },
  forest: { color: "from-green-600 to-emerald-600", name: "Forest" },
  office: { color: "from-blue-600 to-cyan-600", name: "Office" },
  lab: { color: "from-orange-600 to-red-600", name: "Lab" },
  cave: { color: "from-gray-600 to-slate-600", name: "Cave" }
};

// Template Preview Modal
const TemplatePreviewModal = ({ user, isOpen, onClose, onLike, onFollow }) => {
  const { isDark } = useTheme();
  const [isLiked, setIsLiked] = useState(user?.isLiked || false);
  const [isFollowing, setIsFollowing] = useState(user?.isFollowing || false);

  useEffect(() => {
    if (user) {
      setIsLiked(user.isLiked);
      setIsFollowing(user.isFollowing);
    }
  }, [user]);

  /*
   * MODAL INTERACTION HANDLERS
   * Handle like/follow actions within the modal by updating local state
   * and calling parent component handlers to sync with backend
   */
  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(user.id, !isLiked);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow(user.id, !isFollowing);
  };

  const handleViewTemplate = () => {
    window.open(user.template_route, '_blank');
  };

  if (!isOpen || !user) return null;

  const themeInfo = templateThemes[user.selected_template] || templateThemes.space;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ${
        isDark ? "bg-slate-900 text-white" : "bg-white text-gray-900"
      }`}>
        {/* Header */}
        <div className={`sticky top-0 border-b p-6 ${
          isDark ? "bg-slate-900 border-gray-700" : "bg-white border-gray-100"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {user.template_title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Template Preview */}
        <div className="relative">
          <div className="relative h-96 overflow-hidden">
            <img
              src={user.template_image}
              alt={user.template_title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{user.template_title}</h2>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm bg-gradient-to-r ${themeInfo.color} text-white`}>
                    {themeInfo.name} Theme
                  </span>
                </div>
                <button
                  onClick={handleViewTemplate}
                  className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-white transition-all duration-200 flex items-center space-x-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>View Live Portfolio</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
            {/* User Details */}
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>{user.likes} likes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{user.followers} followers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Member since {new Date(user.created_at).getFullYear()}</span>
                  </div>
                </div>
              </div>
              
              {user.bio && (
                <p className={`text-lg leading-relaxed mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {user.bio}
                </p>
              )}

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {user.github && (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                  </a>
                )}
                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isDark ? "bg-blue-800 hover:bg-blue-700 text-blue-300" : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 lg:ml-6">
              <button
                onClick={handleLike}
                className={`flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                  isLiked
                    ? "bg-red-500 text-white shadow-lg"
                    : isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Liked" : "Like Portfolio"}
              </button>
              
              <button
                onClick={handleFollow}
                className={`flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
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
                    <UserCheck className="w-5 h-5 mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Follow User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserCard = ({ user, onLike, onFollow, onViewTemplate }) => {
  const { isDark } = useTheme();
  
  /*
   * LOCAL STATE FOR LIKE/FOLLOW INTERACTIONS
   * Each user card maintains its own state for immediate UI feedback
   * before the backend API call completes. This provides responsive UX.
   */
  const [isLiked, setIsLiked] = useState(user.isLiked);
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [likes, setLikes] = useState(user.likes);
  const [followers, setFollowers] = useState(user.followers);

  /*
   * LIKE INTERACTION HANDLER
   * 1. Immediately update local UI state for responsiveness
   * 2. Update like count optimistically (+1 or -1)
   * 3. Call parent handler which triggers backend API call
   * 4. Parent will handle any API errors and revert state if needed
   */
  const handleLike = (e) => {
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes(newLikedState ? likes + 1 : likes - 1);
    onLike(user.id, newLikedState);
  };

  /*
   * FOLLOW INTERACTION HANDLER
   * 1. Immediately update local UI state for responsiveness
   * 2. Update follower count optimistically (+1 or -1)
   * 3. Call parent handler which triggers backend API call
   * 4. Parent will handle any API errors and revert state if needed
   */
  const handleFollow = (e) => {
    e.stopPropagation();
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);
    setFollowers(newFollowingState ? followers + 1 : followers - 1);
    onFollow(user.id, newFollowingState);
  };

  const handleViewTemplate = () => {
    onViewTemplate(user);
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
      <div className="relative group cursor-pointer" onClick={handleViewTemplate}>
        <div className="relative overflow-hidden h-48">
          <img
            src={user.template_image}
            alt={user.template_title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="font-bold text-lg">{user.template_title}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs bg-gradient-to-r ${themeInfo.color} text-white`}>
                    {themeInfo.name}
                  </span>
                </div>
                <div className="rounded-full p-2 bg-white/20 backdrop-blur-sm">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
          
          {/* View Template Overlay */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-xl font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              Preview Portfolio
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
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative">
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-lg truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                {user.name}
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Member since {formatDate(user.created_at)}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleFollow}
            className={`inline-flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 whitespace-nowrap ${
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
          <p className={`text-sm mb-4 leading-relaxed line-clamp-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {user.bio}
          </p>
        )}

        {/* 
         * SOCIAL STATS DISPLAY
         * Shows current like/follower counts from local state
         * These numbers update immediately when user interacts
         */}
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
                onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => e.stopPropagation()}
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
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
   * USER AUTHENTICATION AND DATABASE RECORD MAPPING
   * currentUser: Auth data from localStorage (contains auth_id as .id)
   * currentDbUser: Actual database user record with integer primary key
   * This mapping is crucial for API calls which require the database user.id
   */
  const currentUser = authService.getCurrentUser();
  const [currentDbUser, setCurrentDbUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  /*
   * DATA FETCHING AND USER MATCHING PROCESS
   * 1. Fetch all users who have CV data from backend API
   * 2. Get current user from localStorage and fetch their profile
   * 3. Fetch current user's existing interactions (likes/follows)
   * 4. Transform backend data into component-friendly format with interaction states
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get authentication token
      const token = localStorage.getItem("token");
      
      // Fetch all users with CV data from backend
      const usersResponse = await socialService.getAllUsers();
      const usersData = usersResponse.data;

      // Get current user's profile to find their database ID
      let dbUser = null;
      let interactions = [];
      if (token) {
        try {
          // Fetch current user's profile using the same pattern as ProfileSection
          const currentUserResponse = await profileService.getProfile(token);
          dbUser = currentUserResponse.data;
          setCurrentDbUser(dbUser);
          
          // Fetch current user's existing interactions if user found
          if (dbUser && dbUser.id) {
            const interactionsResponse = await socialService.getUserInteractions(dbUser.id);
            interactions = interactionsResponse.data;
          }
        } catch (err) {
          console.warn('Could not fetch current user profile or interactions:', err);
        }
      }

      /*
       * DATA TRANSFORMATION WITH INTERACTION STATE
       * Transform raw backend data into component format including:
       * - User profile information and social links
       * - Like/follow status based on current user's interactions
       * - Template information for portfolio previews
       * - Social counts (followers_count, likes_received from database)
       */
      const transformedUsers = usersData.map(user => ({
        id: user.id,
        name: user.name || 'Anonymous User',
        bio: user.bio || '',
        email: user.email,
        profileImage: user.profile_picture_path || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`,
        selected_template: user.selected_template || 'space',
        template_title: `${user.name || 'User'}'s Portfolio`,
        template_image: `/images/${user.selected_template || 'space'}.png`,
        template_route: `/${user.selected_template || 'space'}?userId=${user.id}`,
        followers: user.followers_count || 0,
        following: 0, // This would need a separate query if needed
        likes: user.likes_received || 0,
        // Check if current user has interacted with this user
        isFollowing: interactions.some(i => i.target_user_id === user.id && i.interaction_type === 'follow'),
        isLiked: interactions.some(i => i.target_user_id === user.id && i.interaction_type === 'like'),
        created_at: user.created_at,
        github: user.github,
        linkedin: user.linkedin
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching social data:', error);
      setError('Failed to load community data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /*
   * LIKE INTERACTION BACKEND HANDLER
   * 1. Verify user is authenticated (has database record)
   * 2. Call backend API to create/remove like interaction
   * 3. Update local state for immediate UI feedback
   * 4. Sync modal state if it's open for the same user
   * 5. Handle API errors with user feedback
   */
  /*
   * LIKE INTERACTION BACKEND HANDLER
   * Since user is already authenticated to access this page,
   * we proceed directly to API call without additional auth checks
   */
  const handleLike = async (targetUserId, liked) => {
    try {
      const userId = currentDbUser?.id || currentUser?.id;
      
      // Debug logging to identify the issue
      console.log('Like API call data:', {
        userId: userId,
        targetUserId: targetUserId,
        action: liked ? 'like' : 'unlike',
        currentDbUser: currentDbUser,
        currentUser: currentUser
      });

      // Call backend API - authentication handled by API layer
      await socialService.likePortfolio(
        userId, 
        targetUserId, 
        liked ? 'like' : 'unlike'
      );
      
      // Update users list state with new like status and count
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === targetUserId 
            ? { 
                ...user, 
                isLiked: liked, 
                likes: liked ? user.likes + 1 : user.likes - 1 
              }
            : user
        )
      );

      // Sync modal state if it's open for this user
      if (selectedUser && selectedUser.id === targetUserId) {
        setSelectedUser(prev => ({
          ...prev,
          isLiked: liked,
          likes: liked ? prev.likes + 1 : prev.likes - 1
        }));
      }
    } catch (error) {
      console.error('Error updating like:', error);
      console.error('Error response data:', error.response?.data);
      alert('Failed to update like status. Please try again.');
    }
  };

  /*
   * FOLLOW INTERACTION BACKEND HANDLER
   * Since user is already authenticated to access this page,
   * we proceed directly to API call without additional auth checks
   */
  const handleFollow = async (targetUserId, following) => {
    try {
      const userId = currentDbUser?.id || currentUser?.id;
      
      // Debug logging to identify the issue
      console.log('Follow API call data:', {
        userId: userId,
        targetUserId: targetUserId,
        action: following ? 'follow' : 'unfollow',
        currentDbUser: currentDbUser,
        currentUser: currentUser
      });

      // Call backend API - authentication handled by API layer
      await socialService.followUser(
        userId, 
        targetUserId, 
        following ? 'follow' : 'unfollow'
      );
      
      // Update users list state with new follow status and count
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === targetUserId 
            ? { 
                ...user, 
                isFollowing: following, 
                followers: following ? user.followers + 1 : user.followers - 1 
              }
            : user
        )
      );

      // Sync modal state if it's open for this user
      if (selectedUser && selectedUser.id === targetUserId) {
        setSelectedUser(prev => ({
          ...prev,
          isFollowing: following,
          followers: following ? prev.followers + 1 : prev.followers - 1
        }));
      }
    } catch (error) {
      console.error('Error updating follow:', error);
      console.error('Error response data:', error.response?.data);
      alert('Failed to update follow status. Please try again.');
    }
  };

  const handleViewTemplate = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100"
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Loading community...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100"
      }`}>
        <div className="text-center">
          <p className={`text-lg mb-4 ${isDark ? "text-red-400" : "text-red-600"}`}>
            {error}
          </p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /*
   * COMMUNITY STATISTICS CALCULATION
   * Calculate real-time stats from current users data for header display
   * These numbers reflect the actual loaded data and user interactions
   */
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

        {/* User Grid */}
        {users.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl ${isDark ? "bg-slate-800" : "bg-white"}`}>
            <Users className={`w-12 h-12 mx-auto mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              No users found
            </h3>
            <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Be the first to join the community!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onLike={handleLike}
                onFollow={handleFollow}
                onViewTemplate={handleViewTemplate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={closeModal}
        onLike={handleLike}
        onFollow={handleFollow}
      />
    </div>
  );
};

export default SocialSection;
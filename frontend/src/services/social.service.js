import api from './api.service';

class SocialService {
  // Get all users for community page
  getAllUsers = () => api.get('/social/users');

  // Get user's interactions
  getUserInteractions = (userId) => api.get(`/social/interactions/${userId}`);

  // Follow/unfollow user
  followUser = (userId, targetUserId, action) => 
    api.post('/social/follow', { userId, targetUserId, action });

  // Like/unlike portfolio
  likePortfolio = (userId, targetUserId, action) => 
    api.post('/social/like', { userId, targetUserId, action });
}

export default new SocialService();